import ProgramCard from "./ProgramCard";

/**
 * Groups programs under a Program Level heading (e.g. "State Programs")
 */
export default function ProgramSection({ level, programs, variant }) {
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
    <section className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{heading}</h3>
      <div className={variant === "compact" ? "space-y-2" : "space-y-4"}>
        {programs.map((p) => (
          <ProgramCard key={p.id} program={p} showLink={true} variant={variant} />
        ))}
      </div>
    </section>
  );
}
