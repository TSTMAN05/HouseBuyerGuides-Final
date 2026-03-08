import ReactMarkdown from "react-markdown";

/**
 * Renders "How to Apply" content (markdown from city). Numbered list: bold blue numbers.
 */
export default function HowToApply({ content }) {
  if (!content?.trim()) return null;
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        How to apply
      </h2>
      <div className="prose prose-gray max-w-none text-gray-700 [&_ul]:list-disc [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:pl-6 [&_p]:mb-2 [&_ol_li::marker]:font-bold [&_ol_li::marker]:text-blue-600">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </section>
  );
}
