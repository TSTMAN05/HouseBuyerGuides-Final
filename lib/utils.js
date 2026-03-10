/**
 * Generate URL-safe slug from text (e.g. "My Post Title!" -> "my-post-title").
 */
export function slugify(text) {
  if (text == null || typeof text !== "string") return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Format currency for display (e.g. 275000 -> "$275,000")
 */
export function formatCurrency(value) {
  if (value == null || value === "") return "—";
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(num);
}

/**
 * Ensure title includes current guide year. Case-insensitive.
 * - If title contains "YYYY Guide" or "YYYY guide", replace year with current year.
 * - If title does NOT contain a year + "Guide", append " (YYYY Guide)".
 */
export function withCurrentGuideYear(title) {
  if (!title || typeof title !== "string") return title;
  const year = new Date().getFullYear();
  const hasYearGuide = /\b20\d{2}\s*guide\b/i.test(title);
  if (hasYearGuide) {
    return title.replace(/\b(20\d{2})\s*guide\b/gi, `${year} Guide`);
  }
  const trimmed = title.trim();
  return trimmed ? `${trimmed} (${year} Guide)` : `${year} Guide`;
}

/**
 * City page title format preferred by Google: "First-Time Homebuyer Programs in {City}, {State} ({year})"
 */
export function getCityPageTitle(cityName, stateAbbreviation) {
  const year = new Date().getFullYear();
  return `First-Time Homebuyer Programs in ${cityName || "City"}, ${stateAbbreviation || "State"} (${year})`;
}

/**
 * Format date for display (e.g. "March 2026")
 */
export function formatDate(value) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Programs must always render in this order. */
export const PROGRAM_LEVEL_ORDER = [
  "City",
  "County",
  "State",
  "Federal",
  "Nonprofit",
];

export function groupProgramsByLevel(programs) {
  if (!programs?.length) return {};
  const grouped = {};
  programs.forEach((p) => {
    const level = p["Program Level"] || "Other";
    if (!grouped[level]) grouped[level] = [];
    grouped[level].push(p);
  });
  const ordered = {};
  PROGRAM_LEVEL_ORDER.forEach((level) => {
    if (grouped[level]) ordered[level] = grouped[level];
  });
  Object.keys(grouped).forEach((level) => {
    if (!PROGRAM_LEVEL_ORDER.includes(level)) ordered[level] = grouped[level];
  });
  return ordered;
}

/**
 * Parse Assistance Amount text to a number for sorting (e.g. "Up to $8,000" -> 8000).
 * Returns 0 if unparseable.
 */
export function parseAssistanceAmount(amountText) {
  if (!amountText || typeof amountText !== "string") return 0;
  const match = amountText.match(/\$[\d,]+/);
  if (!match) return 0;
  const num = parseInt(match[0].replace(/[$,]/g, ""), 10);
  return Number.isNaN(num) ? 0 : num;
}

/**
 * Return top n programs by assistance amount (highest first).
 *
 * SEO / UX nuance:
 * - City / County / State programs should be highlighted before generic Federal
 *   mortgage products, since users on a city page are usually looking for
 *   location-specific assistance first.
 * - We therefore:
 *   1) Rank City/County/State programs by parsed assistance amount
 *   2) If there are fewer than n, backfill with remaining programs (including Federal)
 */
export function getTopProgramsByAssistance(programs, n = 3) {
  if (!programs?.length) return [];

  const LOCAL_LEVELS = new Set(["City", "County", "State"]);

  const localPrograms = [];
  const otherPrograms = [];

  programs.forEach((p) => {
    const level = p["Program Level"];
    if (LOCAL_LEVELS.has(level)) {
      localPrograms.push(p);
    } else {
      otherPrograms.push(p);
    }
  });

  const sortByAmountDesc = (list) =>
    list.sort((a, b) => {
      const aVal = parseAssistanceAmount(a["Assistance Amount"]);
      const bVal = parseAssistanceAmount(b["Assistance Amount"]);
      return bVal - aVal;
    });

  sortByAmountDesc(localPrograms);
  sortByAmountDesc(otherPrograms);

  const combined = [...localPrograms, ...otherPrograms];
  return combined.slice(0, n);
}
