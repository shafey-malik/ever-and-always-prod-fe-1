import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPostSlugs, getBlogPost } from "@/lib/seo/blog-posts";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { buildCanonicalUrl } from "@/lib/metadata";
import { SITE_NAME } from "@/lib/metadata";

export const metadata: Metadata = {
  title: `Diamond Jewelry Blog & Buying Guides | ${SITE_NAME}`,
  description:
    "Expert guides on buying diamond jewelry, understanding the 4 Cs, lab-grown vs natural diamonds, engagement ring trends, and more. Learn from Ever and Always.",
  alternates: {
    canonical: buildCanonicalUrl("/blog"),
  },
};

export default async function BlogPage() {
  const slugs = getAllBlogPostSlugs();
  const posts = slugs
    .map((slug) => getBlogPost(slug))
    .filter((post): post is NonNullable<typeof post> => post !== undefined)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />

      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Diamond Jewelry Blog & Buying Guides
        </h1>
        <p className="text-xl text-muted-foreground">
          Expert guides, trends, and tips to help you make informed decisions
          about diamond jewelry.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-sm text-muted-foreground mb-2">
              <span>{post.category}</span> • <time>{post.publishDate}</time>
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              <Link
                href={`/blog/${post.slug}`}
                className="hover:text-primary transition-colors"
              >
                {post.title}
              </Link>
            </h2>
            <p className="text-muted-foreground mb-4">{post.description}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="text-primary hover:underline font-medium"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
