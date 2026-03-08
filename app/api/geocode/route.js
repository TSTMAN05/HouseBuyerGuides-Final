/**
 * Proxies Mapbox Geocoding API so the token stays server-side.
 * GET /api/geocode?q=Charlotte
 */
export async function GET(request) {
  const token = process.env.MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  if (!token) {
    return Response.json(
      { error: "Mapbox token not configured. Add MAPBOX_ACCESS_TOKEN to .env.local" },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return Response.json({ features: [] });
  }

  try {
    const params = new URLSearchParams({
      access_token: token,
      country: "US",
      types: "place,postcode,address",
      limit: "6",
    });
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q)}.json?${params}`;
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      console.error("Mapbox geocoding error:", data.message || res.statusText);
      return Response.json(
        { error: data.message || "Geocoding failed", features: [] },
        { status: res.status }
      );
    }

    const features = Array.isArray(data.features) ? data.features : [];
    return Response.json({ features });
  } catch (err) {
    console.error("Mapbox geocoding request failed:", err);
    return Response.json(
      { error: err.message || "Request failed", features: [] },
      { status: 500 }
    );
  }
}
