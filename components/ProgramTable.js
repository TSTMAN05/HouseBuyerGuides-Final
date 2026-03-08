import Link from "next/link";

/**
 * Eligibility quick-reference table: program name, amount, type, income limits, link
 */
export default function ProgramTable({ programs }) {
  if (!programs?.length) return null;
  return (
    <div className="overflow-x-auto my-6 rounded-lg border border-gray-200 bg-white" style={{ minWidth: 0 }}>
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
              Program
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
              Assistance
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
              Type
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b hidden sm:table-cell">
              Income limits
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b w-24">
              Apply
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {programs.map((p) => (
            <tr key={p.id} className="bg-white">
              <td className="px-4 py-3 text-sm">
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
              <td className="px-4 py-3 text-sm text-gray-700">
                {p["Assistance Amount"] || "—"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {p["Assistance Type"] || "—"}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell max-w-xs truncate">
                {p["Income Limits"]
                  ? String(p["Income Limits"]).slice(0, 60) + (String(p["Income Limits"]).length > 60 ? "…" : "")
                  : "—"}
              </td>
              <td className="px-4 py-3 text-sm">
                {p["Program URL"] ? (
                  <a
                    href={p["Program URL"]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
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
