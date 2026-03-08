import Link from "next/link";
import Disclaimer from "./Disclaimer";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-auto">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Disclaimer />
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900">
            Home
          </Link>
          <Link href="/north-carolina" className="hover:text-gray-900">
            NC Programs
          </Link>
          <Link href="/south-carolina" className="hover:text-gray-900">
            SC Programs
          </Link>
          <Link href="/programs" className="hover:text-gray-900">
            All Programs
          </Link>
          <Link href="/eligibility" className="hover:text-gray-900">
            Do I qualify?
          </Link>
          <Link href="/blog" className="hover:text-gray-900">
            Blog
          </Link>
          <Link href="/about" className="hover:text-gray-900">
            About
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          © {year} HouseBuyerGuides.com. For educational purposes only. Not
          financial advice.
        </p>
      </div>
    </footer>
  );
}
