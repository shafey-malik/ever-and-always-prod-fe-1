import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllBlogPostSlugs, getBlogPost } from '@/lib/seo/blog-posts';

/**
 * Journal teaser — surfaces the latest /blog posts on the homepage for depth
 * and internal linking (SEO). Server-rendered. Posts carry no image of their
 * own, so we map each slug to a curated photograph; unmapped posts fall back
 * gracefully to a champagne placeholder.
 */

const POST_IMAGES: Record<string, string> = {
  'how-to-buy-diamond-rings-online': '1605100804763-247f67b3557e',
  'lab-grown-vs-natural-diamonds': '1603561591411-07134e71a2a9',
  'diamond-cut-color-clarity-guide': '1599643477877-530eb83abc8e',
  'engagement-ring-trends-2024': '1515562141207-7a88fb7ce338',
  'ethical-diamond-sourcing': '1606760227091-3dd870d97f1d',
};

const imageFor = (slug: string) =>
  POST_IMAGES[slug]
    ? `https://images.unsplash.com/photo-${POST_IMAGES[slug]}?w=800&h=900&fit=crop`
    : null;

const formatDate = (d: string) => {
  const parsed = new Date(d);
  return Number.isNaN(parsed.getTime())
    ? ''
    : parsed.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export function JournalTeaser() {
  const posts = getAllBlogPostSlugs()
    .map((slug) => getBlogPost(slug))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-28 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -bottom-32 left-1/4 w-[34rem] h-72 bg-[hsl(var(--secondary)/0.05)] blur-3xl rounded-full" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative">
        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 sm:mb-14">
          <div>
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="h-px w-8 sm:w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
              <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase">
                The Journal
              </span>
            </div>
            <h2 className="font-luxury-serif text-[1.75rem] sm:text-5xl font-light text-[hsl(var(--foreground))] leading-[1.1] sm:leading-[1.0] tracking-normal sm:tracking-tight">
              Guidance &amp; {' '}
              <span className="italic font-light text-[hsl(var(--secondary-rich))]">Inspiration</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="group hidden sm:inline-flex items-center gap-2.5 font-luxury-sans text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-300 shrink-0 pb-1"
          >
            All Articles
            <span className="h-px w-8 bg-[hsl(var(--secondary)/0.6)] group-hover:w-12 transition-all duration-500" />
            <ArrowRight className="w-4 h-4 text-[hsl(var(--secondary))]" />
          </Link>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-7">
          {posts.map((post, index) => {
            const img = imageFor(post.slug);
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group relative flex flex-col bg-[hsl(var(--card))] rounded-2xl overflow-hidden border border-[hsl(var(--border))] shadow-(--shadow-card) hover:shadow-(--shadow-elegant) hover:-translate-y-1.5 transition-all duration-500"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
              >
                {/* Gold hairline on hover */}
                <span className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-hover:border-[hsl(var(--secondary)/0.45)] transition-colors duration-500 z-20" />

                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-linear-to-br from-[hsl(var(--surface-champagne))] to-[hsl(var(--muted))]">
                  {img && (
                    <Image
                      src={img}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                      sizes="(min-width: 640px) 33vw, 100vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />
                  {/* Category tag */}
                  <span className="absolute top-4 left-4 rounded-full bg-white/85 backdrop-blur-md border border-white/60 px-3 py-1 font-luxury-sans text-[9px] tracking-[0.2em] uppercase text-[hsl(240,9%,15%)]">
                    {post.category}
                  </span>
                  {/* Index numeral */}
                  <span className="absolute bottom-3 right-4 font-luxury-serif text-3xl font-light text-white/80 leading-none">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <time className="font-luxury-sans text-[10px] tracking-[0.2em] uppercase text-[hsl(var(--muted-foreground))]">
                    {formatDate(post.publishDate)}
                  </time>
                  <h3 className="mt-2.5 font-luxury-serif text-lg sm:text-xl font-medium leading-snug text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300 line-clamp-2">
                    {post.title.split('|')[0].trim()}
                  </h3>
                  <div className="h-px w-9 bg-linear-to-r from-[hsl(var(--secondary)/0.7)] to-transparent my-3 transition-all duration-500 group-hover:w-16" />
                  <p className="font-luxury-sans text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed font-light line-clamp-2">
                    {post.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-2 font-luxury-sans text-[10px] tracking-[0.22em] uppercase text-[hsl(var(--foreground)/0.7)] group-hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300">
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5 text-[hsl(var(--secondary))] transition-transform duration-500 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile "all articles" */}
        <div className="mt-10 flex sm:hidden justify-center">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2.5 font-luxury-sans text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-300"
          >
            All Articles
            <ArrowRight className="w-4 h-4 text-[hsl(var(--secondary))]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
