import Link from "next/link";
import { getAllPrograms } from "@/lib/airtable";
import { buildMetadata } from "@/lib/seo";
import ProgramCard from "@/components/ProgramCard";

export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "All First-Time Homebuyer Programs",
  description:
    "Browse every down payment assistance and first-time buyer program we track. Filter by state and program level.",
  path: "/programs",
});

export default async function ProgramsIndexPage() {
  const programs = await getAllPrograms();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">
        All first-time homebuyer programs
      </h1>
      <p className="mt-2 text-gray-600">
        Browse programs by name. Click through for full eligibility details and
        cities where each program is available.
      </p>
      <div className="mt-8 space-y-4">
        {programs.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            showLink={true}
          />
        ))}
      </div>
      {programs.length === 0 && (
        <p className="mt-8 text-gray-500">
          No programs with slugs configured yet. Add programs and set Slug in
          Airtable.
        </p>
      )}
    </div>
  );
}
