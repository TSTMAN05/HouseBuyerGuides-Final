import Link from "next/link";

const cards = [
  {
    title: "Available Programs",
    stat: "2,000+",
    description:
      "From down payment assistance to affordable 1st mortgages, there are over 2,000 homeownership programs available across the country.",
    accent: "blue",
  },
  {
    title: "Repeat Buyers",
    stat: "39%",
    description:
      "You don't have to be a first-time buyer. Over 39% of all programs are for repeat homebuyers who have owned a home in the last 3 years.",
    accent: "blue",
  },
  {
    title: "Down Payment Assistance",
    stat: "75%",
    description:
      "Down payment programs make up 75% of all available programs. They provide down payment and closing cost assistance to new homebuyers.",
    accent: "green",
  },
];

export default function DidYouKnow() {
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Did You Know?
          </h2>
          <Link
            href="/blog"
            className="shrink-0 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Homebuyer Resources
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`relative rounded-xl border border-gray-200 bg-gray-50/80 p-6 overflow-hidden ${
                card.accent === "green"
                  ? "sm:bg-emerald-50/60"
                  : "sm:bg-sky-50/50"
              }`}
            >
              {/* Subtle diagonal wash */}
              <div
                className={`absolute -right-16 -top-16 h-40 w-40 rotate-45 opacity-20 ${
                  card.accent === "green"
                    ? "bg-emerald-300"
                    : "bg-sky-300"
                }`}
                aria-hidden
              />
              <div className="relative">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {card.title}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
                  {card.stat}
                </p>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
