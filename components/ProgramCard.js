import Link from "next/link";

/** Left border color (hex) for compact variant by assistance type. */
function getBorderColor(type) {
  if (!type) return "#9ca3af";
  const t = String(type).toLowerCase();
  if (t.includes("grant")) return "#22c55e";
  if (t.includes("forgivable")) return "#3b82f6";
  if (t.includes("deferred")) return "#f59e0b";
  if (t.includes("repayable")) return "#9ca3af";
  return "#9ca3af";
}

/**
 * Program card: featured (top programs — equal height, hover) or compact (list — left border, horizontal layout).
 */
export default function ProgramCard({ program, variant = "featured", showLink = true }) {
  const slug = program?.Slug;
  const name = program?.["Program Name"];
  const org = program?.["Administering Organization"];
  const amount = program?.["Assistance Amount"];
  const type = program?.["Assistance Type"];
  const fundingStatus = program?.["Funding Status"];

  if (variant === "compact") {
    const borderColor = getBorderColor(type);
    return (
      <div
        className="flex flex-col gap-2 border border-gray-200 border-l-4 rounded bg-white px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
        style={{ borderLeftColor: borderColor }}
      >
        <div className="min-w-0 flex-1">
          {showLink && slug ? (
            <Link
              href={`/programs/${slug}`}
              className="font-medium text-gray-900 hover:text-blue-600 hover:underline"
            >
              {name}
            </Link>
          ) : (
            <span className="font-medium text-gray-900">{name}</span>
          )}
          {org && (
            <p className="text-sm text-gray-600 truncate">{org}</p>
          )}
        </div>
        <div className="flex flex-wrap items-baseline justify-start gap-x-3 gap-y-0 text-sm text-gray-700 sm:justify-end sm:flex-nowrap">
          {amount && (
            <span className="font-medium whitespace-nowrap max-w-xs truncate">
              {amount}
            </span>
          )}
          {type && (
            <span className="whitespace-nowrap max-w-xs truncate">
              {type}
            </span>
          )}
          {fundingStatus && fundingStatus !== "Open" && (
            <span className="text-amber-700 whitespace-nowrap max-w-xs truncate">
              {fundingStatus}
            </span>
          )}
          {showLink && slug && (
            <Link
              href={`/programs/${slug}`}
              className="text-blue-600 hover:underline"
            >
              Details
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-1 flex-col gap-2">
        <div>
          {showLink && slug ? (
            <Link
              href={`/programs/${slug}`}
              className="font-semibold text-gray-900 hover:text-blue-600 hover:underline"
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
        <div className="mt-auto text-sm">
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
          className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Full details →
        </Link>
      )}
    </div>
  );
}
