import { notFound } from "next/navigation";
import Script from "next/script";
import {
  getStateBySlug,
  getCityBySlug,
  getCitiesByStateSlug,
  getProgramsByCity,
  getPublishedCityParams,
} from "@/lib/airtable";
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
import Disclaimer from "@/components/Disclaimer";
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
  if (!content?.trim()) return [];
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed)
      ? parsed.filter((q) => q?.question && q?.answer)
      : [];
  } catch {
    return [];
  }
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

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: stateName, href: `/${stateSlug}` },
          { label: `${cityName} programs` },
        ]}
      />

      <h1 className="text-3xl font-bold text-gray-900 mt-2">
        {getCityPageTitle(cityName, state["State Abbreviation"])}
      </h1>

      {intro && (
        <div className="mt-6 prose prose-gray max-w-none text-gray-700">
          {intro}
        </div>
      )}

      <div className="mt-8">
        <HousingSnapshot city={city} />
      </div>

      {topPrograms.length > 0 && (
        <section className="mt-12" aria-labelledby="top-programs-heading">
          <h2
            id="top-programs-heading"
            className="text-xl font-semibold text-gray-900 mb-4"
          >
            Top Homebuyer Programs in {cityName}
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Programs with the highest assistance amounts available in this area.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topPrograms.map((p) => (
              <ProgramCard key={p.id} program={p} showLink={true} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-12" aria-labelledby="all-programs-heading">
        <h2
          id="all-programs-heading"
          className="text-xl font-semibold text-gray-900 mb-6"
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
            />
          );
        })}
      </section>

      <section className="mt-12" aria-labelledby="eligibility-heading">
        <h2
          id="eligibility-heading"
          className="text-xl font-semibold text-gray-900 mb-4"
        >
          Eligibility at a glance
        </h2>
        <ProgramTable programs={programs} />
      </section>

      <div className="mt-12">
        <HowToApply content={city["How to Apply Content"]} />
      </div>

      <div className="mt-12">
        <FAQSection faqList={faqList} />
      </div>
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
          strategy="afterInteractive"
        />
      )}

      {nearbyCities.length > 0 && (
        <section className="mt-12" aria-labelledby="nearby-cities-heading">
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

      <div className="mt-12">
        <LastUpdated date={city["Last Updated"]} />
      </div>
      <div className="mt-6">
        <Disclaimer />
      </div>
    </div>
  );
}
