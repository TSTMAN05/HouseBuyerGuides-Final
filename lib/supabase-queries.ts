import { getSupabase } from "./supabase";
import { slugify } from "./utils.js";

// --- Supabase schema types (snake_case) ---

export interface StateRow {
  id: string;
  state_name: string | null;
  state_abbreviation: string | null;
  slug: string | null;
  housing_agency_name: string | null;
  housing_agency_url: string | null;
  overview_content: string | null;
}

export interface CityRow {
  id: string;
  city_name: string | null;
  state_id: string | null;
  county: string | null;
  slug: string | null;
  population: number | null;
  median_home_price: number | null;
  estimated_closing_costs: string | null;
  intro_content: string | null;
  how_to_apply_content: string | null;
  faq_content: unknown; // JSONB — may be array or already parsed
  meta_title: string | null;
  meta_description: string | null;
  last_updated: string | null;
  status: string | null;
}

export interface ProgramRow {
  id: string;
  program_name: string | null;
  administering_organization: string | null;
  program_level: string | null;
  assistance_amount: string | null;
  assistance_type: string | null;
  forgiveness_terms: string | null;
  income_limits: string | null;
  purchase_price_limit: number | null;
  credit_score_minimum: number | null;
  first_time_buyer_required: boolean | null;
  first_time_buyer_definition: string | null;
  geographic_restrictions: string | null;
  homebuyer_education_required: boolean | null;
  program_url: string | null;
  funding_status: string | null;
  notes: string | null;
  slug: string | null;
}

export interface BlogPostRow {
  id: string;
  title: string | null;
  slug: string | null;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  category: string | null;
  status: string | null;
  publish_date: string | null;
  last_updated: string | null;
}

export interface RelatedCityLegacy {
  id: string;
  "City Name": string;
  Slug: string;
  "State Abbreviation": string;
  "State Slug": string;
  Population: number | null;
  "Median Home Price": number | null;
}

export interface RelatedPostLegacy {
  id: string;
  Title: string;
  Slug: string;
  Category: string | null;
  "Meta Description": string | null;
}

// --- Legacy shapes (Title Case keys for components) ---

export interface StateLegacy {
  id: string;
  "State Name": string;
  "State Abbreviation": string;
  Slug: string;
  "Housing Agency Name": string;
  "Housing Agency URL": string;
  "Overview Content": string;
}

export interface CityLegacy {
  id: string;
  "City Name": string;
  state_id?: string;
  County: string;
  Slug: string;
  Population: number | null;
  "Median Home Price": number | string | null;
  "Estimated Closing Costs": string;
  "Intro Content": string;
  "How to Apply Content": string;
  "FAQ Content": unknown;
  "Meta Title": string;
  "Meta Description": string;
  "Last Updated": string;
  Status: string;
}

export interface ProgramLegacy {
  id: string;
  "Program Name": string;
  "Administering Organization": string;
  "Program Level": string;
  "Assistance Amount": string;
  "Assistance Type": string;
  "Forgiveness Terms": string;
  "Income Limits": string;
  "Purchase Price Limit": number | null;
  "Credit Score Minimum": number | null;
  "First-Time Buyer Required": boolean | null;
  "First-Time Buyer Definition": string;
  "Geographic Restrictions": string;
  "Homebuyer Education Required": boolean | null;
  "Program URL": string;
  "Funding Status": string;
  Slug: string;
}

export interface BlogPostLegacy {
  id: string;
  Title: string;
  Slug: string;
  Content: string;
  "Meta Title": string;
  "Meta Description": string;
  Category: string;
  Status: string;
  "Publish Date": string;
  "Last Updated": string;
  "Related Cities": string[];
}

// --- Mappers ---

function toState(r: StateRow): StateLegacy {
  return {
    id: r.id,
    "State Name": r.state_name ?? "",
    "State Abbreviation": r.state_abbreviation ?? "",
    Slug: r.slug ?? "",
    "Housing Agency Name": r.housing_agency_name ?? "",
    "Housing Agency URL": r.housing_agency_url ?? "",
    "Overview Content": r.overview_content ?? "",
  };
}

function toCity(r: CityRow): CityLegacy {
  const legacy: CityLegacy & { state_id?: string } = {
    id: r.id,
    "City Name": r.city_name ?? "",
    County: r.county ?? "",
    Slug: r.slug ?? "",
    Population: r.population ?? null,
    "Median Home Price": r.median_home_price ?? null,
    "Estimated Closing Costs": r.estimated_closing_costs ?? "",
    "Intro Content": r.intro_content ?? "",
    "How to Apply Content": r.how_to_apply_content ?? "",
    "FAQ Content": r.faq_content,
    "Meta Title": r.meta_title ?? "",
    "Meta Description": r.meta_description ?? "",
    "Last Updated": r.last_updated ?? "",
    Status: r.status ?? "",
  };
  if (r.state_id) legacy.state_id = r.state_id;
  return legacy;
}

function toProgram(r: ProgramRow): ProgramLegacy {
  return {
    id: r.id,
    "Program Name": r.program_name ?? "",
    "Administering Organization": r.administering_organization ?? "",
    "Program Level": r.program_level ?? "",
    "Assistance Amount": r.assistance_amount ?? "",
    "Assistance Type": r.assistance_type ?? "",
    "Forgiveness Terms": r.forgiveness_terms ?? "",
    "Income Limits": r.income_limits ?? "",
    "Purchase Price Limit": r.purchase_price_limit ?? null,
    "Credit Score Minimum": r.credit_score_minimum ?? null,
    "First-Time Buyer Required": r.first_time_buyer_required ?? null,
    "First-Time Buyer Definition": r.first_time_buyer_definition ?? "",
    "Geographic Restrictions": r.geographic_restrictions ?? "",
    "Homebuyer Education Required": r.homebuyer_education_required ?? null,
    "Program URL": r.program_url ?? "",
    "Funding Status": r.funding_status ?? "",
    Slug: r.slug ?? "",
  };
}

function toBlogPost(r: BlogPostRow): BlogPostLegacy {
  return {
    id: r.id,
    Title: r.title ?? "",
    Slug: r.slug ?? "",
    Content: r.content ?? "",
    "Meta Title": r.meta_title ?? r.title ?? "",
    "Meta Description": r.meta_description ?? "",
    Category: r.category ?? "General",
    Status: r.status ?? "Published",
    "Publish Date": r.publish_date ?? "",
    "Last Updated": r.last_updated ?? r.publish_date ?? "",
    "Related Cities": [],
  };
}

// --- API (same names as airtable.js) ---

export async function getStates(): Promise<StateLegacy[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("states")
    .select("*")
    .order("state_name", { ascending: true });
  if (error) return [];
  return (data as StateRow[]).map(toState);
}

export async function getStateBySlug(slug: string): Promise<StateLegacy | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("states")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return toState(data as StateRow);
}

export async function getCitiesByStateSlug(stateSlug: string): Promise<CityLegacy[]> {
  const state = await getStateBySlug(stateSlug);
  if (!state) return [];
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("status", "Published")
    .eq("state_id", state.id)
    .order("city_name", { ascending: true });
  if (error) return [];
  return (data as CityRow[]).map(toCity);
}

export async function getCityBySlug(
  stateSlug: string,
  citySlug: string
): Promise<CityLegacy | null> {
  const state = await getStateBySlug(stateSlug);
  if (!state) return null;
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", citySlug)
    .eq("state_id", state.id)
    .maybeSingle();
  if (error || !data) return null;
  return toCity(data as CityRow);
}

/** Fetch programs linked to city via program_cities + state/federal programs via program_states; merge and dedupe by id. */
export async function getProgramsByCity(cityRecord: CityLegacy): Promise<ProgramLegacy[]> {
  const cityId = cityRecord.id;
  const stateId = (cityRecord as CityLegacy & { state_id?: string }).state_id;
  if (!cityId) return [];

  const [cityPrograms, statePrograms] = await Promise.all([
    getProgramsForCity(cityId),
    stateId ? getStateLevelPrograms(stateId) : Promise.resolve([]),
  ]);

  const byId = new Map<string, ProgramLegacy>();
  for (const p of cityPrograms) byId.set(p.id, p);
  for (const p of statePrograms) if (!byId.has(p.id)) byId.set(p.id, p);
  return Array.from(byId.values());
}

async function getProgramsForCity(cityId: string): Promise<ProgramLegacy[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data: links } = await supabase
    .from("program_cities")
    .select("program_id")
    .eq("city_id", cityId);
  if (!links?.length) return [];
  const programIds = links.map((l) => l.program_id).filter(Boolean);
  if (!programIds.length) return [];
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .in("id", programIds);
  if (error) return [];
  return (data as ProgramRow[]).map(toProgram);
}

async function getStateLevelPrograms(stateId: string): Promise<ProgramLegacy[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data: links } = await supabase
    .from("program_states")
    .select("program_id")
    .eq("state_id", stateId);
  if (!links?.length) return [];
  const programIds = links.map((l) => l.program_id).filter(Boolean);
  if (!programIds.length) return [];
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .in("id", programIds)
    .in("program_level", ["State", "Federal"]);
  if (error) return [];
  return (data as ProgramRow[]).map(toProgram);
}

export async function getProgramsByIds(recordIds: string[]): Promise<ProgramLegacy[]> {
  if (!recordIds?.length) return [];
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .in("id", recordIds);
  if (error) return [];
  return (data as ProgramRow[]).map(toProgram);
}

export async function getAllProgramSlugs(): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("programs")
    .select("slug")
    .not("slug", "is", null);
  if (error) return [];
  return (data ?? []).map((r: { slug: string | null }) => r.slug).filter(Boolean);
}

export async function getAllPrograms(): Promise<ProgramLegacy[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .not("slug", "eq", "");
  if (error) {
    const { data: fallback } = await supabase.from("programs").select("*");
    return (fallback as ProgramRow[] ?? []).map(toProgram);
  }
  return (data as ProgramRow[]).map(toProgram);
}

export async function getProgramBySlug(slug: string): Promise<ProgramLegacy | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error || !data) return null;
  return toProgram(data as ProgramRow);
}

export async function getPublishedCityParams(): Promise<{ state: string; city: string }[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data: cities, error } = await supabase
    .from("cities")
    .select("slug, state_id")
    .eq("status", "Published");
  if (error || !cities?.length) return [];
  const stateIds = [...new Set(cities.map((c) => c.state_id).filter(Boolean))] as string[];
  const { data: states } = await supabase!.from("states").select("id, slug").in("id", stateIds);
  const stateIdToSlug = Object.fromEntries((states ?? []).map((s) => [s.id, s.slug]));
  const params: { state: string; city: string }[] = [];
  for (const c of cities) {
    const stateSlug = c.state_id ? stateIdToSlug[c.state_id] : null;
    if (stateSlug && c.slug) params.push({ state: stateSlug, city: c.slug });
  }
  return params;
}

export async function getBlogPosts(): Promise<BlogPostLegacy[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "Published")
    .order("publish_date", { ascending: false });
  if (error) return [];
  const posts = (data as BlogPostRow[]).map(toBlogPost);
  posts.sort((a, b) => {
    const aDate = a["Publish Date"] ? new Date(a["Publish Date"]).getTime() : 0;
    const bDate = b["Publish Date"] ? new Date(b["Publish Date"]).getTime() : 0;
    return bDate - aDate;
  });
  return posts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPostLegacy | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "Published")
    .maybeSingle();
  if (error || !data) return null;
  return toBlogPost(data as BlogPostRow);
}

export async function getRelatedCities(
  stateId: string,
  currentCityId: string
): Promise<RelatedCityLegacy[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("cities")
    .select("id, city_name, slug, population, median_home_price, state_id, states!inner(state_abbreviation, slug)")
    .eq("status", "Published")
    .eq("state_id", stateId)
    .neq("id", currentCityId)
    .order("population", { ascending: false })
    .limit(6);
  if (error || !data?.length) return [];

  return (data as any[]).map((row) => {
    const state = row.states || {};
    return {
      id: row.id,
      "City Name": row.city_name ?? "",
      Slug: row.slug ?? "",
      "State Abbreviation": state.state_abbreviation ?? "",
      "State Slug": state.slug ?? "",
      Population: row.population ?? null,
      "Median Home Price": row.median_home_price ?? null,
    };
  });
}

export async function getRelatedBlogPosts(
  cityId: string
): Promise<RelatedPostLegacy[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: linked, error: linkedError } = await supabase
    .from("blog_post_cities")
    .select("blog_post_id, blog_posts!inner(id, title, slug, category, meta_description, status, publish_date)")
    .eq("city_id", cityId);

  const primary: RelatedPostLegacy[] = [];
  const seenIds = new Set<string>();

  if (!linkedError && linked?.length) {
    for (const row of linked as any[]) {
      const post = row.blog_posts;
      if (!post || post.status !== "Published") continue;
      if (seenIds.has(post.id)) continue;
      seenIds.add(post.id);
      primary.push({
        id: post.id,
        Title: post.title ?? "",
        Slug: post.slug ?? "",
        Category: post.category ?? null,
        "Meta Description": post.meta_description ?? null,
      });
    }
  }

  if (primary.length >= 3) {
    return primary.slice(0, 3);
  }

  const remaining = 3 - primary.length;

  const { data: fallback, error: fallbackError } = await supabase
    .from("blog_posts")
    .select("id, title, slug, category, meta_description, status, publish_date")
    .eq("status", "Published")
    .order("publish_date", { ascending: false })
    .limit(10);

  if (!fallbackError && fallback?.length) {
    for (const post of fallback as BlogPostRow[]) {
      if (seenIds.has(post.id)) continue;
      seenIds.add(post.id);
      primary.push({
        id: post.id,
        Title: post.title ?? "",
        Slug: post.slug ?? "",
        Category: post.category ?? null,
        "Meta Description": post.meta_description ?? null,
      });
      if (primary.length >= 3) break;
    }
  }

  return primary.slice(0, 3);
}

export async function getStateSlugs(): Promise<string[]> {
  const states = await getStates();
  return states.map((s) => s.Slug).filter(Boolean);
}

export async function getSearchCities(): Promise<
  { cityName: string; citySlug: string; stateSlug: string; stateName: string }[]
> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data: cities, error } = await supabase
    .from("cities")
    .select("city_name, slug, state_id")
    .eq("status", "Published");
  if (error || !cities?.length) return [];
  const stateIds = [...new Set(cities.map((c) => c.state_id).filter(Boolean))] as string[];
  const { data: states } = await supabase
    .from("states")
    .select("id, slug, state_name")
    .in("id", stateIds);
  const byId = Object.fromEntries((states ?? []).map((s) => [s.id, s]));
  const result: { cityName: string; citySlug: string; stateSlug: string; stateName: string }[] = [];
  for (const c of cities) {
    if (!c.state_id || !c.slug) continue;
    const s = byId[c.state_id];
    if (!s) continue;
    result.push({
      cityName: c.city_name ?? "",
      citySlug: c.slug,
      stateSlug: s.slug ?? "",
      stateName: s.state_name ?? "",
    });
  }
  return result;
}
