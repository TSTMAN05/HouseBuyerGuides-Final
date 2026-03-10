import Link from "next/link";
import { PROGRAM_LEVEL_ORDER } from "@/lib/utils";

/**
 * Eligibility quick-reference table: program name, amount, type, income limits, Apply button.
 * Sticky header, alternating row backgrounds, Apply styled as small button.
 */
export default function ProgramTable({ programs }) {
  if (!programs?.length) return null;

  // Ensure table order matches City → County → State → Federal → Nonprofit
  const levelRank = new Map(
    PROGRAM_LEVEL_ORDER.map((level, index) => [level, index])
  );

  const orderedPrograms = [...programs].sort((a, b) => {
    const aLevel = a["Program Level"] || "";
    const bLevel = b["Program Level"] || "";
    const aRank =
      levelRank.has(aLevel) ? levelRank.get(aLevel) : PROGRAM_LEVEL_ORDER.length;
    const bRank =
      levelRank.has(bLevel) ? levelRank.get(bLevel) : PROGRAM_LEVEL_ORDER.length;
    if (aRank !== bRank) return aRank - bRank;
    const aName = a["Program Name"] || "";
    const bName = b["Program Name"] || "";
    return aName.localeCompare(bName);
  });
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white" style={{ minWidth: 0 }}>
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
              Program
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
              Assistance
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
              Type
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200 hidden sm:table-cell">
              Income limits
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200 w-28">
              Apply
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orderedPrograms.map((p, i) => (
            <tr
              key={p.id}
              className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
            >
              <td className="px-4 py-2.5 text-sm">
                {p.Slug ? (
                  <Link
                    href={`/programs/${p.Slug}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {p["Program Name"]}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-900">
                    {p["Program Name"]}
                  </span>
                )}
              </td>
              <td className="px-4 py-2.5 text-sm text-gray-700">
                {p["Assistance Amount"] || "—"}
              </td>
              <td className="px-4 py-2.5 text-sm text-gray-700">
                {p["Assistance Type"] || "—"}
              </td>
              <td className="px-4 py-2.5 text-sm text-gray-600 hidden sm:table-cell max-w-xs truncate">
                {p["Income Limits"]
                  ? String(p["Income Limits"]).slice(0, 60) + (String(p["Income Limits"]).length > 60 ? "…" : "")
                  : "—"}
              </td>
              <td className="px-4 py-2.5 text-sm">
                {p["Program URL"] ? (
                  <a
                    href={p["Program URL"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Apply
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
