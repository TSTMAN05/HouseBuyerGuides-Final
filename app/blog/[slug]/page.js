import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/supabase-queries";
import { buildMetadata } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";
import LastUpdated from "@/components/LastUpdated";
import { withCurrentGuideYear } from "@/lib/utils";

export const revalidate = 86400;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.Slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  const displayTitle = withCurrentGuideYear(post["Meta Title"] || post.Title);
  const description = post["Meta Description"] || "";
  return buildMetadata({
    title: displayTitle,
    description,
    path: `/blog/${slug}`,
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const displayTitle = withCurrentGuideYear(post["Meta Title"] || post.Title);
  const content = post.Content;
  const lastUpdatedDate = post["Last Updated"] || post["Publish Date"];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: displayTitle },
        ]}
      />
      <article>
        <h1 className="text-3xl font-bold text-gray-900">{displayTitle}</h1>
        <LastUpdated date={lastUpdatedDate} />
        <div className="mt-8 prose prose-gray max-w-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_p]:mb-4 [&_h2]:mt-8 [&_h2]:text-xl">
          <ReactMarkdown>{content || ""}</ReactMarkdown>
        </div>
      </article>
      <Link href="/blog" className="mt-10 inline-block text-sm text-blue-600 hover:underline">
        ← Back to blog
      </Link>
    </div>
  );
}
