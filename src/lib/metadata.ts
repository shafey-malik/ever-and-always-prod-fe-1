import type { Metadata } from 'next';

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'Ever and Always';

/** Canonical production origin. Every canonical, OG URL and sitemap entry hangs off this. */
export const PRODUCTION_SITE_URL = 'https://everandalways.store';

/**
 * Values that have historically been mis-pasted into NEXT_PUBLIC_SITE_URL and
 * which must never reach a canonical tag or sitemap. `localhost:3001` shipped to
 * production and made every page self-canonicalise to a non-existent host; the
 * Vendure `/shop-api` URL is the API origin, not the storefront origin.
 */
function isUnusableSiteUrl(url: string): boolean {
  return (
    /localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]/i.test(url) ||
    /\/shop-api|\/admin-api/i.test(url) ||
    /\.up\.railway\.app/i.test(url)
  );
}

/**
 * Resolve the storefront origin.
 *
 * Order: an explicit, sane NEXT_PUBLIC_SITE_URL -> the hardcoded production
 * origin on a production build -> the per-deploy Vercel URL for previews ->
 * localhost for `next dev`. Production never falls through to a preview or
 * local URL, so a missing/blank env var can no longer poison canonicals.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit && /^https?:\/\//.test(explicit)) {
    if (!isUnusableSiteUrl(explicit)) return explicit.replace(/\/+$/, '');
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        `[metadata] NEXT_PUBLIC_SITE_URL="${explicit}" is not a storefront origin ` +
          `(localhost / API / preview host). Falling back to ${PRODUCTION_SITE_URL}.`,
      );
    }
  }

  // Production always resolves to the real domain, never to a per-deploy host.
  if (process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') {
    return PRODUCTION_SITE_URL;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl.replace(/\/+$/, '')}`;

  return 'http://localhost:3002';
}

export const SITE_URL = resolveSiteUrl();

/** True only on the live production domain — used to gate indexing of preview deploys. */
export const IS_PRODUCTION_SITE = SITE_URL === PRODUCTION_SITE_URL;

/**
 * Truncate text to a maximum length, preserving word boundaries.
 * Strips HTML tags and is ideal for meta descriptions (recommended 150-160 chars).
 */
export function truncateDescription(
  text: string | null | undefined,
  maxLength = 155
): string {
  if (!text) return '';

  // Strip HTML tags if present
  const cleanText = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

  if (cleanText.length <= maxLength) return cleanText;

  // Find the last space before maxLength to avoid cutting words
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  return lastSpaceIndex > 0
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...';
}

/**
 * Build a canonical URL for a given path.
 */
export function buildCanonicalUrl(path: string): string {
  const baseUrl = SITE_URL.replace(/\/+$/, '');
  const cleanPath = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Build Open Graph image array from an image URL.
 */
export function buildOgImages(
  imageUrl: string | null | undefined,
  alt?: string
): NonNullable<Metadata['openGraph']>['images'] {
  if (!imageUrl) return undefined;

  return [
    {
      url: imageUrl,
      alt: alt || 'Product image',
    },
  ];
}

/**
 * Create noindex/nofollow robots config for protected pages.
 */
export function noIndexRobots(): Metadata['robots'] {
  return {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  };
}

/**
 * Indexable but not link-followed-into-oblivion: used for faceted/paginated
 * views that must stay crawlable for discovery but must not compete in the index.
 */
export function noIndexFollowRobots(): Metadata['robots'] {
  return {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  };
}
