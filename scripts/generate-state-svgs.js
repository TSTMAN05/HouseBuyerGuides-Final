/**
 * Generate accurate state outline SVGs from Census-derived GeoJSON.
 * Run: node scripts/generate-state-svgs.js
 *
 * Pipeline: project to viewBox → simplify (in viewBox units) → drop tiny rings → SVG path.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

const GEOJSON_URL =
  "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";
const OUT_DIR = path.join(__dirname, "..", "public", "states");

/** Douglas-Peucker tolerance in viewBox units (consistent across all states). */
const SIMPLIFY_TOLERANCE = 0.5;
/** Drop rings with fewer points than this (removes tiny islands). */
const MIN_RING_POINTS = 6;
/** Drop rings with area smaller than this in viewBox² (removes tiny islands). */
const MIN_RING_AREA = 0.01;

function nameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

/**
 * Perpendicular distance from point to line segment (in same units as coords).
 */
function perpendicularDistance(point, lineStart, lineEnd) {
  const [x, y] = point;
  const [x0, y0] = lineStart;
  const [x1, y1] = lineEnd;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const magSq = dx * dx + dy * dy || 1e-20;
  const u = Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / magSq));
  const px = x0 + u * dx;
  const py = y0 + u * dy;
  return Math.hypot(x - px, y - py);
}

/**
 * Douglas-Peucker line simplification. Reduces point count while keeping shape.
 */
function douglasPeucker(points, tolerance) {
  if (points.length <= 2) return points;
  let maxDist = 0;
  let maxIndex = 0;
  const start = points[0];
  const end = points[points.length - 1];
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], start, end);
    if (d > maxDist) {
      maxDist = d;
      maxIndex = i;
    }
  }
  if (maxDist < tolerance) return [start, end];
  const left = douglasPeucker(points.slice(0, maxIndex + 1), tolerance);
  const right = douglasPeucker(points.slice(maxIndex), tolerance);
  return left.slice(0, -1).concat(right);
}

function getBbox(rings) {
  let minLng = Infinity,
    maxLng = -Infinity,
    minLat = Infinity,
    maxLat = -Infinity;
  for (const ring of rings) {
    for (const [lng, lat] of ring) {
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  }
  return { minLng, maxLng, minLat, maxLat };
}

/** Project one ring from lng/lat to viewBox [x,y] coordinates. */
function projectRing(ring, bbox, viewBoxWidth, viewBoxHeight) {
  const { minLng, maxLng, minLat, maxLat } = bbox;
  const pad = 2;
  const w = maxLng - minLng || 1;
  const h = maxLat - minLat || 1;
  const scaleX = (viewBoxWidth - 2 * pad) / w;
  const scaleY = (viewBoxHeight - 2 * pad) / h;
  const scale = Math.min(scaleX, scaleY);
  const offsetX = pad + (viewBoxWidth - 2 * pad - w * scale) / 2;
  const offsetY = pad + (viewBoxHeight - 2 * pad - h * scale) / 2;
  return ring.map(([lng, lat]) => [
    (lng - minLng) * scale + offsetX,
    (maxLat - lat) * scale + offsetY,
  ]);
}

/** Signed area of a ring in viewBox units² (shoelace). Use abs for area. */
function ringArea(ring) {
  if (ring.length < 3) return 0;
  let area = 0;
  const n = ring.length;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[(i + 1) % n];
    area += x0 * y1 - x1 * y0;
  }
  return Math.abs(area) / 2;
}

/** Filter out tiny rings (small islands) by point count and area. */
function filterSmallRings(rings) {
  return rings.filter(
    (ring) =>
      ring.length >= MIN_RING_POINTS && ringArea(ring) >= MIN_RING_AREA
  );
}

/** Bbox of rings that are already in [x,y] viewBox coordinates. */
function getViewBoxBbox(rings) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const ring of rings) {
    for (const [x, y] of ring) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
  return { minX, maxX, minY, maxY };
}

/**
 * Scale and center rings so the state fills the viewBox (same apparent size for all states).
 * Uses the larger dimension to fit 96 units so every state has consistent visual size.
 */
function normalizeRingsToFillViewBox(rings, size = 100, pad = 2) {
  const { minX, maxX, minY, maxY } = getViewBoxBbox(rings);
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const scale = (size - 2 * pad) / Math.max(w, h);
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const cx = size / 2;
  const cy = size / 2;
  return rings.map((ring) =>
    ring.map(([x, y]) => [(x - midX) * scale + cx, (y - midY) * scale + cy])
  );
}

/** Build SVG path d from rings already in viewBox [x,y] coordinates. */
function viewBoxRingsToPath(rings) {
  const parts = [];
  for (const ring of rings) {
    if (ring.length < 2) continue;
    const [x0, y0] = ring[0];
    parts.push(`M ${x0.toFixed(2)} ${y0.toFixed(2)}`);
    for (let i = 1; i < ring.length; i++) {
      const [x, y] = ring[i];
      parts.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    parts.push("Z");
  }
  return parts.join(" ");
}

function getRings(geometry) {
  if (geometry.type === "Polygon") return geometry.coordinates;
  if (geometry.type === "MultiPolygon")
    return geometry.coordinates.flat();
  return [];
}

async function main() {
  console.log("Fetching US states GeoJSON...");
  const geojson = await fetchJson(GEOJSON_URL);
  const features = geojson.features.filter(
    (f) => f.properties.name && f.geometry
  );
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
  for (const feature of features) {
    const name = feature.properties.name;
    const slug = nameToSlug(name);
    const rings = getRings(feature.geometry);
    if (!rings.length) {
      console.warn(`No rings for ${name}`);
      continue;
    }
    if (!slug) continue;

    const bbox = getBbox(rings);
    const viewBoxSize = 100;
    let viewBoxRings = rings.map((ring) =>
      projectRing(ring, bbox, viewBoxSize, viewBoxSize)
    );
    viewBoxRings = viewBoxRings.map((ring) =>
      douglasPeucker(ring, SIMPLIFY_TOLERANCE)
    );
    viewBoxRings = filterSmallRings(viewBoxRings);
    viewBoxRings = normalizeRingsToFillViewBox(viewBoxRings, viewBoxSize);
    const pathD = viewBoxRingsToPath(viewBoxRings);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" fill="none" stroke="#2563eb" stroke-width="0.3">
  <path d="${pathD}" fill="#2563eb"/>
</svg>`;
    const outPath = path.join(OUT_DIR, `${slug}.svg`);
    fs.writeFileSync(outPath, svg, "utf8");
    console.log(`Wrote ${outPath}`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
