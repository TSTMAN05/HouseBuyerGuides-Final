"use client";

import { useState } from "react";

/**
 * FAQ accordion. faqList = [{ question, answer }]
 * Renders JSON-LD FAQ schema via script tag (caller should add that from buildFAQSchema)
 */
export default function FAQSection({ faqList }) {
  const [openIndex, setOpenIndex] = useState(null);
  if (!faqList?.length) return null;
  return (
    <section className="my-10" aria-label="Frequently asked questions">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Frequently asked questions
      </h2>
      <div className="space-y-2">
        {faqList.map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 flex justify-between items-center"
              aria-expanded={openIndex === i}
            >
              {item.question}
              <span className="text-gray-500 text-lg shrink-0 ml-2">
                {openIndex === i ? "−" : "+"}
              </span>
            </button>
            {openIndex === i && (
              <div className="px-4 py-3 border-t border-gray-100 text-gray-700 text-sm">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
