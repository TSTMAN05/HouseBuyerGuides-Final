import { notFound } from "next/navigation";
import Script from "next/script";
import {
  getStateBySlug,
  getCityBySlug,
  getCitiesByStateSlug,
  getProgramsByCity,
  getPublishedCityParams,
} from "@/lib/supabase-queries";
import {
  groupProgramsByLevel,
  getTopProgramsByAssistance,
  getCityPageTitle,
  PROGRAM_LEVEL_ORDER,
} from "@/lib/utils";
import { buildMetadata, buildFAQSchema } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import HousingSnapshot from "@/components/HousingSnapshot";
import ProgramCard from "@/components/ProgramCard";
import ProgramSection from "@/components/ProgramSection";
import ProgramTable from "@/components/ProgramTable";
import HowToApply from "@/components/HowToApply";
import FAQSection from "@/components/FAQSection";
import LastUpdated from "@/components/LastUpdated";
import CityCard from "@/components/CityCard";

export const revalidate = 86400;

export async function generateStaticParams() {
  const params = await getPublishedCityParams();
  return params;
}

export async function generateMetadata({ params }) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = await getStateBySlug(stateSlug);
  const city = await getCityBySlug(stateSlug, citySlug);
  if (!state || !city) return {};
  const title = getCityPageTitle(city["City Name"], state["State Abbreviation"]);
  const description =
    city["Meta Description"] ||
    `Find every down payment assistance program and first-time buyer benefit in ${city["City Name"]}, ${state["State Abbreviation"]}. Compare programs and apply.`;
  return buildMetadata({
    title,
    description,
    path: `/${stateSlug}/${citySlug}`,
  });
}

function parseFAQContent(content) {
  if (content == null) return [];
  if (Array.isArray(content)) {
    return content.filter((q) => q && (q.question != null) && (q.answer != null));
  }
  if (typeof content === "string" && !content.trim()) return [];
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed)
        ? parsed.filter((q) => q?.question && q?.answer)
        : [];
    } catch {
      return [];
    }
  }
  return [];
}

export default async function CityPage({ params }) {
  const { state: stateSlug, city: citySlug } = await params;
  const state = await getStateBySlug(stateSlug);
  const city = await getCityBySlug(stateSlug, citySlug);
  if (!state || !city) notFound();

  const [programs, stateCities] = await Promise.all([
    getProgramsByCity(city),
    getCitiesByStateSlug(stateSlug),
  ]);
  const grouped = groupProgramsByLevel(programs);
  const topPrograms = getTopProgramsByAssistance(programs, 3);
  const nearbyCities = stateCities
    .filter((c) => c.Slug !== citySlug)
    .slice(0, 4);
  const stateName = state["State Name"];
  const cityName = city["City Name"];
  const intro = city["Intro Content"];
  const faqList = parseFAQContent(city["FAQ Content"]);
  const faqSchema = buildFAQSchema(faqList);

  const stateAbbr = state["State Abbreviation"] || "";
  const year = new Date().getFullYear();

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: stateName, href: `/${stateSlug}` },
          { label: `${cityName} programs` },
        ]}
      />

      <header className="py-12 md:py-16">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          First-Time Homebuyer Programs in{" "}
          <span className="text-blue-600">{cityName}</span>, {stateAbbr} ({year})
        </h1>
        {intro && (
          <div className="mt-6 max-w-2xl text-gray-700 leading-relaxed">
            {intro}
          </div>
        )}
      </header>

      <div className="flex flex-col gap-12 pb-16">
        <HousingSnapshot city={city} />

        {topPrograms.length > 0 && (
          <section aria-labelledby="top-programs-heading">
            <h2
              id="top-programs-heading"
              className="text-xl font-semibold text-gray-900 mb-2"
            >
              Top Homebuyer Programs in {cityName}
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Programs with the highest assistance amounts available in this area.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topPrograms.map((p) => (
                <ProgramCard key={p.id} program={p} variant="featured" />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="all-programs-heading">
          <h2
            id="all-programs-heading"
            className="text-xl font-semibold text-gray-900 mb-4"
          >
            All programs by level
          </h2>
          {PROGRAM_LEVEL_ORDER.map((level) => {
            const progs = grouped[level];
            if (!progs?.length) return null;
            return (
              <ProgramSection
                key={level}
                level={level}
                programs={progs}
                variant="compact"
              />
            );
          })}
          {Object.entries(grouped).map(([level]) => {
            if (PROGRAM_LEVEL_ORDER.includes(level)) return null;
            return (
              <ProgramSection
                key={level}
                level={level}
                programs={grouped[level]}
                variant="compact"
              />
            );
          })}
        </section>

        <section aria-labelledby="eligibility-heading">
          <h2
            id="eligibility-heading"
            className="text-xl font-semibold text-gray-900 mb-4"
          >
            Eligibility at a glance
          </h2>
          <ProgramTable programs={programs} />
        </section>

        <HowToApply content={city["How to Apply Content"]} />

        <FAQSection faqList={faqList} />
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          strategy="afterInteractive"
        />
      )}

        {nearbyCities.length > 0 && (
          <section aria-labelledby="nearby-cities-heading">
            <h2
              id="nearby-cities-heading"
              className="text-xl font-semibold text-gray-900 mb-4"
            >
              Nearby cities with homebuyer programs
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {nearbyCities.map((c) => (
                <CityCard key={c.id} city={c} stateSlug={stateSlug} />
              ))}
            </div>
          </section>
        )}

        <LastUpdated date={city["Last Updated"]} />
      </div>
    </div>
  );
}
