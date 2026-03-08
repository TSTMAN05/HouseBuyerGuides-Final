const Airtable = require("airtable");
const { slugify } = require("./utils.js");

const baseId = process.env.AIRTABLE_BASE_ID;
const apiKey = process.env.AIRTABLE_API_KEY;

function getBase() {
  if (!baseId || !apiKey) {
    return null;
  }
  return new Airtable({ apiKey }).base(baseId);
}

function recordToObject(record, fieldNames) {
  const obj = { id: record.id };
  fieldNames.forEach((name) => {
    const v = record.get(name);
    if (v !== undefined) obj[name] = v;
  });
  return obj;
}

const STATES_FIELDS = [
  "State Name",
  "State Abbreviation",
  "Slug",
  "Housing Agency Name",
  "Housing Agency URL",
  "Overview Content",
  "Cities",
  "Programs",
];
const CITIES_FIELDS = [
  "City Name",
  "County",
  "Slug",
  "Population",
  "Median Home Price",
  "Estimated Closing Costs",
  "Intro Content",
  "How to Apply Content",
  "FAQ Content",
  "Meta Title",
  "Meta Description",
  "Last Updated",
  "Status",
  "State",
  "Programs",
];
const PROGRAMS_FIELDS = [
  "Program Name",
  "Administering Organization",
  "Program Level",
  "Assistance Amount",
  "Assistance Type",
  "Forgiveness Terms",
  "Income Limits",
  "Purchase Price Limit",
  "Credit Score Minimum",
  "First-Time Buyer Required",
  "First-Time Buyer Definition",
  "Geographic Restrictions",
  "Homebuyer Education Required",
  "Program URL",
  "Funding Status",
  "Cities",
  "State",
];
/**
 * Map a Blog Posts record to a safe object. Never throws; missing fields get defaults.
 * Does not request specific fields from Airtable—use with .select() (no fields option).
 */
function blogRecordToSafeObject(record) {
  const fields = record.fields || {};
  const title = fields.Title ?? "";
  return {
    id: record.id,
    Title: title,
    Slug: fields.Slug?.trim() ? String(fields.Slug).trim() : slugify(title),
    Content: fields.Content ?? "",
    "Meta Title": fields["Meta Title"] ?? title,
    "Meta Description": fields["Meta Description"] ?? "",
    Category: fields.Category ?? "General",
    Status: fields.Status ?? "Published",
    "Publish Date": fields["Publish Date"] ?? "",
    "Last Updated": fields["Last Updated"] ?? fields["Publish Date"] ?? "",
    "Related Cities": fields["Related Cities"] ?? [],
  };
}

export async function getStates() {
  const base = getBase();
  if (!base) return [];
  const records = await base("States")
    .select({ fields: STATES_FIELDS })
    .all();
  return records.map((r) => recordToObject(r, STATES_FIELDS));
}

export async function getStateBySlug(slug) {
  const base = getBase();
  if (!base) return null;
  const records = await base("States")
    .select({
      filterByFormula: `{Slug} = '${escapeFormulaString(slug)}'`,
      fields: STATES_FIELDS,
      maxRecords: 1,
    })
    .firstPage();
  if (!records.length) return null;
  return recordToObject(records[0], STATES_FIELDS);
}

function escapeFormulaString(s) {
  return String(s || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export async function getCitiesByStateSlug(stateSlug) {
  const state = await getStateBySlug(stateSlug);
  if (!state) return [];
  const stateName = state["State Name"];
  const base = getBase();
  if (!base) return [];
  const records = await base("Cities")
    .select({
      filterByFormula: `AND({Status} = 'Published', {State} = '${escapeFormulaString(stateName)}')`,
      fields: CITIES_FIELDS,
      sort: [{ field: "City Name", direction: "asc" }],
    })
    .all();
  return records.map((r) => recordToObject(r, CITIES_FIELDS));
}

export async function getCityBySlug(stateSlug, citySlug) {
  const state = await getStateBySlug(stateSlug);
  if (!state) return null;
  const stateName = state["State Name"];
  const base = getBase();
  if (!base) return null;
  const records = await base("Cities")
    .select({
      filterByFormula: `AND({Slug} = '${escapeFormulaString(citySlug)}', {State} = '${escapeFormulaString(stateName)}')`,
      fields: CITIES_FIELDS,
      maxRecords: 1,
    })
    .firstPage();
  if (!records.length) return null;
  return recordToObject(records[0], CITIES_FIELDS);
}

export async function getProgramsByIds(recordIds) {
  if (!recordIds?.length) return [];
  const base = getBase();
  if (!base) return [];
  const records = await base("Programs")
    .select({
      filterByFormula: `OR(${recordIds.map((id) => `RECORD_ID() = '${id}'`).join(", ")})`,
      fields: PROGRAMS_FIELDS,
    })
    .all();
  return records.map((r) => recordToObject(r, PROGRAMS_FIELDS));
}

export async function getProgramsByCity(cityRecord) {
  const programIds = cityRecord?.Programs || [];
  if (!programIds.length) return [];
  return getProgramsByIds(programIds);
}

export async function getAllProgramSlugs() {
  const base = getBase();
  if (!base) return [];
  try {
    const records = await base("Programs")
      .select({
        fields: ["Slug"],
        filterByFormula: "AND({Slug} != '')",
      })
      .all();
    return records.map((r) => r.get("Slug")).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getAllPrograms() {
  const base = getBase();
  if (!base) return [];
  try {
    const records = await base("Programs")
      .select({ fields: PROGRAMS_FIELDS, filterByFormula: "{Slug} != ''" })
      .all();
    return records.map((r) => recordToObject(r, PROGRAMS_FIELDS));
  } catch {
    const records = await base("Programs")
      .select({ fields: PROGRAMS_FIELDS })
      .all();
    return records.map((r) => recordToObject(r, PROGRAMS_FIELDS));
  }
}

export async function getProgramBySlug(slug) {
  const base = getBase();
  if (!base) return null;
  try {
    const records = await base("Programs")
      .select({
        filterByFormula: `{Slug} = '${escapeFormulaString(slug)}'`,
        fields: PROGRAMS_FIELDS,
        maxRecords: 1,
      })
      .firstPage();
    if (!records.length) return null;
    return recordToObject(records[0], PROGRAMS_FIELDS);
  } catch {
    return null;
  }
}

export async function getPublishedCityParams() {
  const base = getBase();
  if (!base) return [];
  const cityRecords = await base("Cities")
    .select({
      fields: ["Slug", "State"],
      filterByFormula: "{Status} = 'Published'",
    })
    .all();
  const states = await getStates();
  const stateIdToSlug = Object.fromEntries(states.map((s) => [s.id, s.Slug]));
  const params = [];
  for (const r of cityRecords) {
    const stateIds = r.get("State") || [];
    const stateSlug = stateIds.length ? stateIdToSlug[stateIds[0]] : null;
    if (stateSlug) params.push({ state: stateSlug, city: r.get("Slug") });
  }
  return params;
}

export async function getBlogPosts() {
  const base = getBase();
  if (!base) return [];
  const records = await base("Blog Posts").select().all();
  const posts = records.map((r) => blogRecordToSafeObject(r));
  const published = posts.filter((p) => (p.Status || "").toString() === "Published");
  published.sort((a, b) => {
    const aDate = a["Publish Date"] ? new Date(a["Publish Date"]).getTime() : 0;
    const bDate = b["Publish Date"] ? new Date(b["Publish Date"]).getTime() : 0;
    return bDate - aDate;
  });
  return published;
}

export async function getBlogPostBySlug(slug) {
  const base = getBase();
  if (!base) return null;
  const records = await base("Blog Posts").select().all();
  const posts = records.map((r) => blogRecordToSafeObject(r));
  const published = posts.filter((p) => (p.Status || "").toString() === "Published");
  const post = published.find((p) => (p.Slug || "").toString() === slug);
  return post ?? null;
}

export async function getStateSlugs() {
  const states = await getStates();
  return states.map((s) => s.Slug).filter(Boolean);
}

/**
 * Returns all published cities with name, slug, and state info for search matching.
 */
export async function getSearchCities() {
  const base = getBase();
  if (!base) return [];
  const states = await getStates();
  const stateIdToSlug = Object.fromEntries(states.map((s) => [s.id, s.Slug]));
  const stateIdToName = Object.fromEntries(
    states.map((s) => [s.id, s["State Name"]])
  );
  const cityRecords = await base("Cities")
    .select({
      fields: ["City Name", "Slug", "State"],
      filterByFormula: "{Status} = 'Published'",
    })
    .all();
  const result = [];
  for (const r of cityRecords) {
    const stateIds = r.get("State") || [];
    const stateId = stateIds[0];
    if (!stateId) continue;
    result.push({
      cityName: r.get("City Name"),
      citySlug: r.get("Slug"),
      stateSlug: stateIdToSlug[stateId],
      stateName: stateIdToName[stateId],
    });
  }
  return result;
}
