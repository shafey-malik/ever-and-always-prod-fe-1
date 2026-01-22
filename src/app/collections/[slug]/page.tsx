import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { query } from "@/lib/vendure/api";
import { SearchProductsQuery } from "@/lib/vendure/queries";
import { ProductGrid } from "@/components/commerce/product-grid";
import { FacetFilters } from "@/components/commerce/facet-filters";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { buildSearchInput, getCurrentPage } from "@/lib/search-helpers";
import { cache } from "react";
import {
  SITE_NAME,
  buildCanonicalUrl,
  buildOgImages,
} from "@/lib/metadata";
import { getSEOCollection } from "@/lib/seo/collections";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { generateCollectionSchema, JsonLd } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/metadata";

const getCollectionProducts = cache(async (
  slug: string,
  searchParams: { [key: string]: string | string[] | undefined }
) => {
  // Build search input with collection-specific filters
  const searchInput = buildSearchInput({
    searchParams,
    // You can add collection-specific search terms here
    // For example, if slug is "engagement-rings", add that to search
  });

  return query(SearchProductsQuery, {
    input: searchInput,
  });
});

// Return empty array to make this route dynamic (on-demand generation)
// This avoids build issues with cacheComponents during static generation
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps<"/collections/[slug]">): Promise<Metadata> {
  try {
    const { slug } = await params;
    const seoCollection = getSEOCollection(slug);

    if (!seoCollection) {
      return {
        title: "Collection Not Found",
      };
    }

    return {
      title: seoCollection.title,
      description: seoCollection.metaDescription,
      keywords: seoCollection.keywords,
      alternates: {
        canonical: buildCanonicalUrl(`/collections/${slug}`),
      },
      openGraph: {
        title: seoCollection.title,
        description: seoCollection.metaDescription,
        type: "website",
        url: buildCanonicalUrl(`/collections/${slug}`),
      },
      twitter: {
        card: "summary_large_image",
        title: seoCollection.title,
        description: seoCollection.metaDescription,
      },
    };
  } catch (error) {
    // Fallback metadata if generation fails during build
    return {
      title: "Collection",
    };
  }
}

export default async function SEOCollectionPage({
  params,
  searchParams,
}: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const page = getCurrentPage(searchParamsResolved);

  const seoCollection = getSEOCollection(slug);

  if (!seoCollection) {
    notFound();
  }

  const productDataPromise = getCollectionProducts(slug, searchParamsResolved);

  // Generate collection schema
  const collectionSchema = generateCollectionSchema({
    name: seoCollection.h1,
    description: seoCollection.description,
    url: `${SITE_URL}/collections/${slug}`,
  });

  return (
    <>
      <JsonLd data={collectionSchema} />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={seoCollection.breadcrumbs} />

        {/* SEO Content Section */}
        <div className="mb-8 space-y-6">
          <h1 className="text-4xl font-bold">{seoCollection.h1}</h1>
          {seoCollection.description && (
            <p className="text-lg text-muted-foreground">
              {seoCollection.description}
            </p>
          )}
          {seoCollection.content && (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: seoCollection.content }}
            />
          )}
          {seoCollection.h2 && seoCollection.h2.length > 0 && (
            <div className="space-y-4">
              {seoCollection.h2.map((heading, index) => (
                <h2 key={index} className="text-2xl font-semibold">
                  {heading}
                </h2>
              ))}
            </div>
          )}
        </div>

        {/* Related Collections */}
        {seoCollection.relatedCollections &&
          seoCollection.relatedCollections.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Related Collections
              </h2>
              <div className="flex flex-wrap gap-2">
                {seoCollection.relatedCollections.map((relatedSlug) => {
                  const related = getSEOCollection(relatedSlug);
                  if (!related) return null;
                  return (
                    <a
                      key={relatedSlug}
                      href={`/collections/${relatedSlug}`}
                      className="text-primary hover:underline"
                    >
                      {related.h1}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 order-1">
            <Suspense
              fallback={
                <div className="h-64 animate-pulse bg-muted rounded-lg" />
              }
            >
              <FacetFilters productDataPromise={productDataPromise} />
            </Suspense>
          </aside>

          <div className="lg:col-span-3 order-2">
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid
                productDataPromise={productDataPromise}
                currentPage={page}
                take={12}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
