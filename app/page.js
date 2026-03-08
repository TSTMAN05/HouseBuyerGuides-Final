import Link from "next/link";
import { getStates, getSearchCities } from "@/lib/airtable";
import HeroSearch from "@/components/HeroSearch";
import DidYouKnow from "@/components/DidYouKnow";

export const revalidate = 86400;

export default async function HomePage() {
  const [states, searchCities] = await Promise.all([
    getStates(),
    getSearchCities(),
  ]);
  return (
    <>
      <HeroSearch states={states} cities={searchCities} />
      <DidYouKnow />

      <div id="choose-state" className="mx-auto max-w-5xl px-4 py-14 sm:px-6 scroll-mt-6">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Choose your state
        </h2>
        <p className="mt-2 text-gray-600">
          Browse first-time homebuyer programs and down payment assistance by
          state, then pick your city.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {states.map((state) => (
            <Link
              key={state.id}
              href={`/${state.Slug}`}
              className="relative block overflow-hidden rounded-xl border border-gray-200 bg-white p-6 hover:border-gray-300 hover:shadow-md transition-shadow"
            >
              <div
                className="pointer-events-none absolute right-0 top-1/2 h-[120%] w-[70%] -translate-y-1/2 bg-contain bg-no-repeat opacity-[0.14]"
                style={{
                  backgroundImage: `url(/states/${state.Slug}.svg)`,
                  backgroundPosition: "right center",
                }}
                aria-hidden
              />
              <div className="relative z-10">
                <span className="font-semibold text-gray-900 text-lg">
                  {state["State Name"]}
                </span>
                <p className="mt-1 text-sm text-gray-600">
                  First-time homebuyer programs and down payment assistance
                </p>
                <span className="mt-3 inline-block text-sm font-medium text-blue-600">
                  View cities →
                </span>
              </div>
            </Link>
          ))}
        </div>
        {states.length === 0 && (
          <p className="mt-8 text-gray-500">
            No states configured yet. Add data in Airtable to see state links
            here.
          </p>
        )}
      </div>
    </>
  );
}
