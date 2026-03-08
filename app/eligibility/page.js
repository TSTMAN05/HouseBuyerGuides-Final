import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import EligibilityForm from "@/components/EligibilityForm";

export const metadata = buildMetadata({
  title: "Do I Qualify? | Loan Assistance Eligibility Check",
  description:
    "Quick check to see if you might qualify for first-time homebuyer and down payment assistance programs in North Carolina and South Carolina.",
  path: "/eligibility",
});

export default function EligibilityPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Do I qualify?", href: "/eligibility" },
        ]}
      />
      <h1 className="mt-4 text-3xl font-bold text-gray-900">
        Do I qualify for loan assistance?
      </h1>
      <p className="mt-2 text-gray-600">
        Answer a few questions to see if you might be eligible for first-time
        homebuyer programs and down payment assistance. This is not a guarantee—always
        confirm with a lender or program administrator.
      </p>
      <div className="mt-10">
        <EligibilityForm />
      </div>
    </div>
  );
}
