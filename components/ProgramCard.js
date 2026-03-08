import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

/**
 * Compact program card for city pages: name, org, amount, type, link to program page
 */
export default function ProgramCard({ program, showLink = true }) {
  const slug = program?.Slug;
  const name = program?.["Program Name"];
  const org = program?.["Administering Organization"];
  const amount = program?.["Assistance Amount"];
  const type = program?.["Assistance Type"];
  const fundingStatus = program?.["Funding Status"];

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {showLink && slug ? (
            <Link
              href={`/programs/${slug}`}
              className="font-semibold text-gray-900 hover:text-blue-700 hover:underline"
            >
              {name}
            </Link>
          ) : (
            <span className="font-semibold text-gray-900">{name}</span>
          )}
          {org && (
            <p className="text-sm text-gray-600 mt-0.5">{org}</p>
          )}
        </div>
        <div className="text-right text-sm">
          {amount && (
            <span className="font-medium text-gray-900">{amount}</span>
          )}
          {type && (
            <span className="text-gray-600 block">{type}</span>
          )}
          {fundingStatus && fundingStatus !== "Open" && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs">
              {fundingStatus}
            </span>
          )}
        </div>
      </div>
      {showLink && slug && (
        <Link
          href={`/programs/${slug}`}
          className="inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Full details →
        </Link>
      )}
    </div>
  );
}
