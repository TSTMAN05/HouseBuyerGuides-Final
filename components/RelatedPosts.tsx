import Link from "next/link";

interface RelatedPost {
  id: string;
  Title: string;
  Slug: string;
  Category: string | null;
  "Meta Description": string | null;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) return null;

  const truncate = (text: string, max = 120) => {
    if (text.length <= max) return text;
    return text.slice(0, max).trimEnd() + "…";
  };

  return (
    <section aria-labelledby="related-posts-heading" className="mt-8">
      <h2
        id="related-posts-heading"
        className="text-xl font-semibold text-gray-900 mb-3"
      >
        Guides for First-Time Homebuyers
      </h2>
      <div className="space-y-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="text-base font-medium text-gray-900">
              <Link
                href={`/blog/${post.Slug}`}
                className="hover:text-blue-600 hover:underline"
              >
                {post.Title}
              </Link>
            </h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              {post.Category && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
                  {post.Category}
                </span>
              )}
            </div>
            {post["Meta Description"] && (
              <p className="mt-2 text-sm text-gray-700">
                {truncate(post["Meta Description"])}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

