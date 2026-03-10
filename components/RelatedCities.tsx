import Link from "next/link";
import { formatCurrency } from "@/lib/utils.js";

interface RelatedCity {
  id: string;
  "City Name": string;
  Slug: string;
  "State Abbreviation": string;
  "State Slug": string;
  Population: number | null;
  "Median Home Price": number | null;
}

interface RelatedCitiesProps {
  cities: RelatedCity[];
  currentStateName: string;
  currentStateSlug: string;
}

export default function RelatedCities({
  cities,
  currentStateName,
  currentStateSlug,
}: RelatedCitiesProps) {
  if (!cities || cities.length === 0) return null;

  const formatPopulation = (value: number | null) => {
    if (value == null) return "—";
    return new Intl.NumberFormat("en-US").format(value);
  };

  return (
    <section aria-labelledby="related-cities-heading" className="mt-8">
      <div className="flex items-baseline justify-between mb-3">
        <h2
          id="related-cities-heading"
          className="text-xl font-semibold text-gray-900"
        >
          Homebuyer Programs in Other {currentStateName} Cities
        </h2>
        <Link
          href={`/${currentStateSlug}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          View all {currentStateName} programs →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <article
            key={city.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-base font-medium text-gray-900 mb-1">
              <Link
                href={`/${city["State Slug"]}/${city.Slug}`}
                className="hover:text-blue-600 hover:underline"
              >
                {city["City Name"]}, {city["State Abbreviation"]}
              </Link>
            </h3>
            <dl className="mt-2 space-y-1 text-sm text-gray-700">
              <div className="flex justify-between">
                <dt className="text-gray-500">Population</dt>
                <dd className="font-medium">
                  {formatPopulation(city.Population)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Median home price</dt>
                <dd className="font-medium">
                  {formatCurrency(city["Median Home Price"])}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

