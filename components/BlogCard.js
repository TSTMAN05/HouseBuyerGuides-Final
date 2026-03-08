import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function BlogCard({ post }) {
  const slug = post?.Slug;
  const title = post?.Title ?? "";
  const metaDesc = post?.["Meta Description"];
  const publishDate = post?.["Publish Date"];
  const category = post?.Category;
  if (!slug) return null;
  const excerpt = metaDesc
    ? metaDesc.slice(0, 140) + (metaDesc.length > 140 ? "…" : "")
    : "";
  return (
    <article className="border border-gray-200 rounded-lg p-4 bg-white">
      <Link href={`/blog/${slug}`} className="block group">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 group-hover:underline">
          {title}
        </h3>
        <div className="flex gap-2 mt-1 text-sm text-gray-500">
          {publishDate && (
            <time dateTime={publishDate}>{formatDate(publishDate)}</time>
          )}
          {category && <span>{category}</span>}
        </div>
        {excerpt && (
          <p className="text-sm text-gray-600 mt-2">{excerpt}</p>
        )}
        <span className="inline-block mt-2 text-sm font-medium text-blue-600">
          Read more →
        </span>
      </Link>
    </article>
  );
}
