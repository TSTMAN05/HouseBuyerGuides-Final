import { formatDate } from "@/lib/utils";

export default function LastUpdated({ date }) {
  const formatted = formatDate(date);
  if (!formatted || formatted === "—") return null;
  return (
    <p className="text-sm text-gray-500 mt-8">
      Last updated: {formatted}
    </p>
  );
}
