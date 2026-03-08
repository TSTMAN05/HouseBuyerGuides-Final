import { formatCurrency } from "@/lib/utils";

/**
 * Data-driven snapshot for city pages: median home price, closing costs, population.
 * NerdWallet/Zillow-style at-a-glance housing stats.
 */
export default function HousingSnapshot({ city }) {
  const medianPrice = city?.["Median Home Price"];
  const closingCosts = city?.["Estimated Closing Costs"];
  const population = city?.Population;

  const hasAny =
    medianPrice != null ||
    (closingCosts != null && closingCosts !== "") ||
    population != null;

  if (!hasAny) return null;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm" aria-label="Housing snapshot">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
        Housing Snapshot
      </h2>
      <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {medianPrice != null && (
          <div>
            <dt className="text-sm text-gray-500">Median Home Price</dt>
            <dd className="mt-0.5 text-lg font-semibold text-gray-900">
              {typeof medianPrice === "number"
                ? formatCurrency(medianPrice)
                : medianPrice}
            </dd>
          </div>
        )}
        {closingCosts != null && closingCosts !== "" && (
          <div>
            <dt className="text-sm text-gray-500">Estimated Closing Costs</dt>
            <dd className="mt-0.5 text-lg font-semibold text-gray-900">
              {closingCosts}
            </dd>
          </div>
        )}
        {population != null && (
          <div>
            <dt className="text-sm text-gray-500">Population</dt>
            <dd className="mt-0.5 text-lg font-semibold text-gray-900">
              {new Intl.NumberFormat("en-US").format(population)}
            </dd>
          </div>
        )}
      </dl>
    </section>
  );
}
