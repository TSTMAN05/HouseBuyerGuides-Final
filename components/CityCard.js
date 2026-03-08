import Link from "next/link";

export default function CityCard({ city, stateSlug }) {
  const citySlug = city?.Slug;
  const name = city?.["City Name"];
  const county = city?.County;
  const intro = city?.["Intro Content"];
  const oneLiner = intro
    ? intro.replace(/\s+/g, " ").slice(0, 120) + (intro.length > 120 ? "…" : "")
    : null;
  if (!citySlug || !stateSlug) return null;
  const href = `/${stateSlug}/${citySlug}`;
  return (
    <Link
      href={href}
      className="flex h-full flex-col border border-gray-200 rounded-lg p-4 bg-white hover:border-gray-300 hover:shadow-sm transition"
    >
      <h3 className="font-semibold text-gray-900">{name}</h3>
      {county && (
        <p className="text-sm text-gray-600 mt-0.5">{county}</p>
      )}
      {oneLiner && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2 flex-1">{oneLiner}</p>
      )}
      <span className="inline-block mt-auto pt-2 text-sm font-medium text-blue-600">
        View programs →
      </span>
    </Link>
  );
}
