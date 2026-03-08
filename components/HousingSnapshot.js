import { formatCurrency } from "@/lib/utils";

/**
 * Data-driven snapshot for city pages: median home price, closing costs, population.
 * Three separate stat cards in a row — text only, no icons.
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

  const items = [];
  if (medianPrice != null) {
    items.push({
      label: "Median Home Price",
      value: typeof medianPrice === "number" ? formatCurrency(medianPrice) : medianPrice,
    });
  }
  if (closingCosts != null && closingCosts !== "") {
    items.push({ label: "Estimated Closing Costs", value: closingCosts });
  }
  if (population != null) {
    items.push({
      label: "Population",
      value: new Intl.NumberFormat("en-US").format(population),
    });
  }

  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      aria-label="Housing snapshot"
    >
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
        </div>
      ))}
    </section>
  );
}
