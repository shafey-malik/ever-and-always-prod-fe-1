import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { query } from "@/lib/vendure/api";
import { SearchProductsQuery } from "@/lib/vendure/queries";
import { FilteredProductGrid } from "@/components/commerce/filtered-product-grid";
import { FacetFilters } from "@/components/commerce/facet-filters";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { buildSearchInput, getCurrentPage } from "@/lib/search-helpers";
import { cache } from "react";
import {
  SITE_NAME,
  buildCanonicalUrl,
} from "@/lib/metadata";
import { getPricePage, getAllPricePageSlugs } from "@/lib/seo/price-pages";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { generateCollectionSchema, JsonLd } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/metadata";

const getPriceFilteredProducts = cache(async (
  searchParams: { [key: string]: string | string[] | undefined }
) => {
  const searchInput = buildSearchInput({
    searchParams,
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
}: PageProps<"/price/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pricePage = getPricePage(slug);

  if (!pricePage) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: pricePage.title,
    description: pricePage.metaDescription,
    keywords: pricePage.keywords,
    alternates: {
      canonical: buildCanonicalUrl(`/price/${slug}`),
    },
    openGraph: {
      title: pricePage.title,
      description: pricePage.metaDescription,
      type: "website",
      url: buildCanonicalUrl(`/price/${slug}`),
    },
    twitter: {
      card: "summary_large_image",
      title: pricePage.title,
      description: pricePage.metaDescription,
    },
  };
}

export default async function PricePage({
  params,
  searchParams,
}: PageProps<"/price/[slug]">) {
  const { slug } = await params;
  const searchParamsResolved = await searchParams;
  const page = getCurrentPage(searchParamsResolved);

  const pricePage = getPricePage(slug);

  if (!pricePage) {
    notFound();
  }

  const productDataPromise = getPriceFilteredProducts(
    searchParamsResolved
  );

  // Generate collection schema
  const collectionSchema = generateCollectionSchema({
    name: pricePage.h1,
    description: pricePage.description,
    url: `${SITE_URL}/price/${slug}`,
  });

  return (
    <>
      <JsonLd data={collectionSchema} />
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={pricePage.breadcrumbs} />

        {/* SEO Content Section */}
        <div className="mb-8 space-y-6">
          <h1 className="text-4xl font-bold">{pricePage.h1}</h1>
          <p className="text-lg text-muted-foreground">
            {pricePage.description}
          </p>
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: pricePage.content }}
          />
        </div>

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
              <FilteredProductGrid
                productDataPromise={productDataPromise}
                currentPage={page}
                take={12}
                maxPrice={pricePage.maxPrice > 0 ? pricePage.maxPrice : undefined}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
