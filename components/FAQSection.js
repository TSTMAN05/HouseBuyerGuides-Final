"use client";

import { useState } from "react";

/** Normalize FAQ items: accept both parsed objects and string values for safety. */
function normalizeFaqItems(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (item && typeof item === "object" && (item.question != null || item.answer != null)) {
        return {
          question: item.question != null ? String(item.question) : "",
          answer: item.answer != null ? String(item.answer) : "",
        };
      }
      return null;
    })
    .filter((q) => q && (q.question !== "" || q.answer !== ""));
}

/**
 * FAQ accordion. faqList = [{ question, answer }] (or already-parsed JSONB array)
 */
export default function FAQSection({ faqList }) {
  const [openIndex, setOpenIndex] = useState(null);
  const list = normalizeFaqItems(faqList);
  if (!list.length) return null;
  return (
    <section aria-label="Frequently asked questions">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Frequently asked questions
      </h2>
      <div className="space-y-2">
        {list.map((item, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 flex justify-between items-center gap-2"
              aria-expanded={openIndex === i}
            >
              <span>{item.question}</span>
              <span className="text-gray-500 text-lg shrink-0" aria-hidden>
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
