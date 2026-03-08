import { notFound } from "next/navigation";
import Link from "next/link";
import { getProgramBySlug, getAllProgramSlugs } from "@/lib/supabase-queries";
import { formatCurrency, formatDate, withCurrentGuideYear } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import Disclaimer from "@/components/Disclaimer";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getAllProgramSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) return {};
  const title = withCurrentGuideYear(program["Program Name"]);
  const description =
    `Eligibility, income limits, and how to apply for ${program["Program Name"]}. ` +
    (program["Assistance Amount"]
      ? `Assistance: ${program["Assistance Amount"]}. `
      : "") +
    "Official application links and cities where available.";
  return buildMetadata({
    title,
    description,
    path: `/programs/${slug}`,
  });
}

export default async function ProgramPage({ params }) {
  const { slug } = await params;
  const program = await getProgramBySlug(slug);
  if (!program) notFound();

  const name = program["Program Name"];
  const org = program["Administering Organization"];
  const level = program["Program Level"];
  const amount = program["Assistance Amount"];
  const type = program["Assistance Type"];
  const forgiveness = program["Forgiveness Terms"];
  const incomeLimits = program["Income Limits"];
  const purchaseLimit = program["Purchase Price Limit"];
  const creditMin = program["Credit Score Minimum"];
  const firstTimeRequired = program["First-Time Buyer Required"];
  const firstTimeDef = program["First-Time Buyer Definition"];
  const geo = program["Geographic Restrictions"];
  const educationRequired = program["Homebuyer Education Required"];
  const programUrl = program["Program URL"];
  const fundingStatus = program["Funding Status"];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Programs", href: "/programs" },
          { label: name },
        ]}
      />
      <h1 className="text-3xl font-bold text-gray-900">
        {withCurrentGuideYear(name)}
      </h1>
      {org && (
        <p className="mt-2 text-gray-600">
          Administered by: {org}
          {level && ` · ${level}`}
        </p>
      )}
      {fundingStatus && fundingStatus !== "Open" && (
        <p className="mt-2">
          <span className="inline-block px-2 py-1 rounded bg-amber-100 text-amber-800 text-sm">
            Funding status: {fundingStatus}
          </span>
        </p>
      )}

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          How much assistance
        </h2>
        <p className="text-gray-700">
          {amount || "—"} {type ? `(${type})` : ""}
        </p>
        {forgiveness && (
          <p className="mt-2 text-sm text-gray-600">{forgiveness}</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Eligibility
        </h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          {incomeLimits && (
            <li>
              <strong>Income limits:</strong> {incomeLimits}
            </li>
          )}
          {purchaseLimit != null && (
            <li>
              <strong>Purchase price limit:</strong> {formatCurrency(purchaseLimit)}
            </li>
          )}
          {creditMin != null && (
            <li>
              <strong>Credit score minimum:</strong> {creditMin}
            </li>
          )}
          {firstTimeRequired != null && (
            <li>
              <strong>First-time buyer required:</strong>{" "}
              {firstTimeRequired ? "Yes" : "No"}
              {firstTimeDef && ` — ${firstTimeDef}`}
            </li>
          )}
          {geo && (
            <li>
              <strong>Geographic restrictions:</strong> {geo}
            </li>
          )}
          {educationRequired != null && (
            <li>
              <strong>Homebuyer education required:</strong>{" "}
              {educationRequired ? "Yes" : "No"}
            </li>
          )}
        </ul>
      </section>

      {programUrl && (
        <section className="mt-8">
          <a
            href={programUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Apply or learn more on official site →
          </a>
        </section>
      )}

      <p className="mt-10 text-sm text-gray-500">
        This program may be available in multiple cities. Check individual city
        guides (e.g. Greenville, Charleston) to see it in context with other
        local programs.
      </p>
      <Link href="/programs" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
        ← Back to all programs
      </Link>

      <Disclaimer />
    </div>
  );
}
