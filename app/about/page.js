import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About HouseBuyerGuides.com",
  description:
    "HouseBuyerGuides.com helps first-time homebuyers find every assistance program available in their city and state. Built for NC and SC, expanding nationally.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">About HouseBuyerGuides.com</h1>
      <div className="mt-6 space-y-4 text-gray-700">
        <p>
          HouseBuyerGuides.com is a programmatic directory that helps
          first-time homebuyers discover every assistance program available to
          them based on their location. We aggregate city, county, state, and
          federal homebuyer programs into clear, well-organized city-level
          pages—so you don’t have to hunt across dozens of sites.
        </p>
        <p>
          We focus first on North Carolina and South Carolina, with plans to
          expand to more states. Every city guide lists local programs, income
          limits, assistance amounts, and direct links to apply.
        </p>
        <p>
          Program details and funding change often. We do our best to keep
          information current, but always confirm with the program administrator
          before making decisions. This site is for education only and is not
          financial advice.
        </p>
      </div>
    </div>
  );
}
