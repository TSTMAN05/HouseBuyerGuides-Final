import { getBlogPosts } from "@/lib/supabase-queries";
import { buildMetadata } from "@/lib/seo";
import BlogCard from "@/components/BlogCard";

export const revalidate = 86400;

export const metadata = buildMetadata({
  title: "Blog – First-Time Homebuyer Tips & Guides",
  description:
    "Educational articles on down payment assistance, FHA vs conventional loans, closing costs, and how to qualify for first-time buyer programs.",
  path: "/blog",
});

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">
        First-time homebuyer guides & tips
      </h1>
      <p className="mt-2 text-gray-600">
        How down payment assistance works, loan comparisons, and what to expect
        when applying.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      {posts.length === 0 && (
        <p className="mt-10 text-gray-500">
          No blog posts published yet. Add posts in Airtable with Status =
          Published.
        </p>
      )}
    </div>
  );
}
