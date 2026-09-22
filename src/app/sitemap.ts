import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";
import { query } from "@/lib/vendure/api";
import {
  GetAllCollectionsQuery,
  GetProductsForSitemapQuery,
} from "@/lib/vendure/queries";
import { getAllPricePageSlugs } from "@/lib/seo/price-pages";
import { getAllBlogPostSlugs } from "@/lib/seo/blog-posts";
import { getAllTaxonomySlugs, getCanonicalCollectionSlug } from "@/lib/seo/taxonomy";

/** Revalidate hourly so new products appear without a redeploy. */
export const revalidate = 3600;

/** Vendure caps list queries at 100 rows; page until the catalogue is exhausted. */
const PAGE_SIZE = 100;
const MAX_PAGES = 50;

/**
 * Every category collection in the catalogue, canonical URLs only.
 *
 * The previous sitemap listed none of these, which meant the ~90 category
 * pages that carry the commercial keywords had no discovery path other than
 * in-page links. Duplicate slugs are collapsed to their canonical target so the
 * sitemap never advertises a URL that canonicalises elsewhere.
 */
async function collectionUrls(): Promise<MetadataRoute.Sitemap> {
  const seen = new Map<string, Date>();

  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const result = await query(GetAllCollectionsQuery, { skip: page * PAGE_SIZE });
      const { items, totalItems } = result.data.collections;
      if (items.length === 0) break;

      for (const item of items) {
        const canonical = getCanonicalCollectionSlug(item.slug);
        const updated = item.updatedAt ? new Date(item.updatedAt as string) : new Date();
        const existing = seen.get(canonical);
        if (!existing || updated > existing) seen.set(canonical, updated);
      }

      if ((page + 1) * PAGE_SIZE >= totalItems) break;
    }
  } catch (error) {
    // A sitemap that is missing products is far better than a build that fails,
    // so fall back to the slugs the storefront knows about statically.
    console.warn("[sitemap] Could not load collections from Vendure:", error);
    for (const slug of getAllTaxonomySlugs()) {
      if (!seen.has(slug)) seen.set(slug, new Date());
    }
  }

  return [...seen.entries()].map(([slug, lastModified]) => ({
    url: `${SITE_URL}/collection/${slug}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
}

async function productUrls(): Promise<MetadataRoute.Sitemap> {
  const slugs = new Set<string>();

  try {
    for (let page = 0; page < MAX_PAGES; page++) {
      const result = await query(GetProductsForSitemapQuery, { skip: page * PAGE_SIZE });
      const { items, totalItems } = result.data.search;
      if (items.length === 0) break;
      for (const item of items) slugs.add(item.slug);
      if ((page + 1) * PAGE_SIZE >= totalItems) break;
    }
  } catch (error) {
    console.warn("[sitemap] Could not load products from Vendure:", error);
  }

  return [...slugs].map((slug) => ({
    url: `${SITE_URL}/product/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Hubs and evergreen pages. Priority reflects commercial intent, not depth.
  const staticPages: MetadataRoute.Sitemap = ([
    { url: SITE_URL, priority: 1.0, changeFrequency: "daily" },
    { url: `${SITE_URL}/engagement-rings`, priority: 0.95, changeFrequency: "weekly" },
    { url: `${SITE_URL}/wedding-rings`, priority: 0.95, changeFrequency: "weekly" },
    { url: `${SITE_URL}/jewelry`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_URL}/custom`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/lab-grown-diamonds`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/consultation`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${SITE_URL}/about-us`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${SITE_URL}/blog`, priority: 0.7, changeFrequency: "weekly" },
  ] as const).map((page) => ({ ...page, lastModified: now }));

  const [collections, products] = await Promise.all([collectionUrls(), productUrls()]);

  // NOTE: `/collections/*` is deliberately absent. Those URLs 301 to the real
  // category pages (see COLLECTION_CONSOLIDATION in next.config.ts), and a
  // sitemap must only advertise URLs that return 200 and self-canonicalise.
  const pricePages: MetadataRoute.Sitemap = getAllPricePageSlugs().map((slug) => ({
    url: `${SITE_URL}/price/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const blogPages: MetadataRoute.Sitemap = getAllBlogPostSlugs().map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...collections,
    ...pricePages,
    ...products,
    ...blogPages,
  ];
}
