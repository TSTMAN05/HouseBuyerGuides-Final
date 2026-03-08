import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold text-gray-900 hover:text-gray-700"
          >
            HouseBuyerGuides.com
          </Link>
          <nav className="flex gap-6 text-sm font-medium text-gray-600">
            <Link href="/eligibility" className="hover:text-gray-900">
              Do I qualify?
            </Link>
            <Link href="/programs" className="hover:text-gray-900">
              Programs
            </Link>
            <Link href="/blog" className="hover:text-gray-900">
              Blog
            </Link>
            <Link href="/about" className="hover:text-gray-900">
              About
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
