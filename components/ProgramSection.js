import ProgramCard from "./ProgramCard";

/**
 * Groups programs under a Program Level heading (e.g. "State Programs")
 */
export default function ProgramSection({ level, programs }) {
  if (!programs?.length) return null;
  const heading =
    level === "City"
      ? "Local programs (city-level)"
      : level === "County"
        ? "County programs"
        : level === "State"
          ? "State programs"
          : level === "Federal"
            ? "Federal programs"
            : level === "Nonprofit"
              ? "Nonprofit / CDFI programs"
              : `${level} programs`;
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{heading}</h2>
      <div className="space-y-4">
        {programs.map((p) => (
          <ProgramCard key={p.id} program={p} showLink={true} />
        ))}
      </div>
    </section>
  );
}
