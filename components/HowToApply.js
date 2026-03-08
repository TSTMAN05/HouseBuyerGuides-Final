import ReactMarkdown from "react-markdown";

/**
 * Renders "How to Apply" content (markdown from city)
 */
export default function HowToApply({ content }) {
  if (!content?.trim()) return null;
  return (
    <section className="my-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        How to apply
      </h2>
      <div className="prose prose-gray max-w-none text-gray-700 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_p]:mb-2">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </section>
  );
}
