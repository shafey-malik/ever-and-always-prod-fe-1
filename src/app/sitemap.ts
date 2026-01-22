import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/metadata";
import { getAllSEOCollectionSlugs } from "@/lib/seo/collections";
import { getAllPricePageSlugs } from "@/lib/seo/price-pages";
import { getAllBlogPostSlugs } from "@/lib/seo/blog-posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Collection pages
  const collectionSlugs = getAllSEOCollectionSlugs();
  const collectionPages: MetadataRoute.Sitemap = collectionSlugs.map((slug) => ({
    url: `${baseUrl}/collections/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Price pages
  const priceSlugs = getAllPricePageSlugs();
  const pricePages: MetadataRoute.Sitemap = priceSlugs.map((slug) => ({
    url: `${baseUrl}/price/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Blog posts
  const blogSlugs = getAllBlogPostSlugs();
  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...collectionPages, ...pricePages, ...blogPages];
}
