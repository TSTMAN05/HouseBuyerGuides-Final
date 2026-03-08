import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getStateBySlug,
  getCitiesByStateSlug,
  getStateSlugs,
} from "@/lib/airtable";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import CityCard from "@/components/CityCard";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getStateSlugs();
  return slugs.map((state) => ({ state }));
}

export async function generateMetadata({ params }) {
  const { state: stateSlug } = await params;
  const state = await getStateBySlug(stateSlug);
  if (!state) return {};
  const title = `First-Time Homebuyer Programs in ${state["State Name"]}`;
  const description = `Find down payment assistance and first-time buyer programs across ${state["State Name"]}. Browse city guides and apply.`;
  return buildMetadata({
    title,
    description,
    path: `/${state.Slug}`,
  });
}

export default async function StatePage({ params }) {
  const { state: stateSlug } = await params;
  const state = await getStateBySlug(stateSlug);
  if (!state) notFound();
  const cities = await getCitiesByStateSlug(stateSlug);
  const stateName = state["State Name"];
  const agencyName = state["Housing Agency Name"];
  const agencyUrl = state["Housing Agency URL"];
  const overview = state["Overview Content"];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: stateName },
        ]}
      />
      <h1 className="text-3xl font-bold text-gray-900">
        First-time homebuyer programs in {stateName}
      </h1>
      {overview && (
        <div className="mt-6 prose prose-gray max-w-none text-gray-700">
          {overview}
        </div>
      )}
      {agencyName && (
        <p className="mt-4 text-sm text-gray-600">
          State housing agency:{" "}
          {agencyUrl ? (
            <a
              href={agencyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {agencyName}
            </a>
          ) : (
            agencyName
          )}
        </p>
      )}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          City guides
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <CityCard key={city.id} city={city} stateSlug={stateSlug} />
          ))}
        </div>
        {cities.length === 0 && (
          <p className="text-gray-500">
            No city guides published yet for this state.
          </p>
        )}
      </section>
    </div>
  );
}
