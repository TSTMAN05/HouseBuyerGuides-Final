import Link from "next/link";

/**
 * @param {Array<{ label: string, href?: string }>} items - Last item is current page (no href)
 */
export default function Breadcrumbs({ items }) {
  if (!items?.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-gray-400">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-gray-900">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
