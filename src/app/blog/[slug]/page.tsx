import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPost, getAllBlogPostSlugs } from "@/lib/seo/blog-posts";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { generateOrganizationSchema, JsonLd } from "@/lib/seo/schema";
import { buildCanonicalUrl } from "@/lib/metadata";
import { SITE_URL } from "@/lib/metadata";
import Link from "next/link";

export async function generateStaticParams() {
  const slugs = getAllBlogPostSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: buildCanonicalUrl(`/blog/${slug}`),
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author],
      url: buildCanonicalUrl(`/blog/${slug}`),
      ...(post.featuredImage && {
        images: [{ url: post.featuredImage, alt: post.title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      ...(post.featuredImage && {
        images: [post.featuredImage],
      }),
    },
  };
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Generate organization schema
  const organizationSchema = generateOrganizationSchema({
    url: SITE_URL,
  });

  return (
    <>
      <JsonLd data={organizationSchema} />
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Breadcrumbs
          items={[
            { name: "Blog", href: "/blog" },
            { name: post.category, href: `/blog/category/${post.category.toLowerCase().replace(/\s+/g, "-")}` },
            { name: post.title, href: `/blog/${slug}` },
          ]}
        />

        <header className="mb-8">
          <div className="text-sm text-muted-foreground mb-2">
            <span>{post.category}</span> • <time>{post.publishDate}</time> •{" "}
            <span>{post.author}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p className="text-xl text-muted-foreground">{post.description}</p>
        </header>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-semibold mb-4">Related Articles</h2>
            <ul className="space-y-2">
              {post.relatedPosts.map((relatedSlug) => {
                const related = getBlogPost(relatedSlug);
                if (!related) return null;
                return (
                  <li key={relatedSlug}>
                    <Link
                      href={`/blog/${relatedSlug}`}
                      className="text-primary hover:underline"
                    >
                      {related.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </article>
    </>
  );
}
