import type { Metadata } from 'next';
import { Suspense } from 'react';
import { query } from '@/lib/vendure/api';
import { SearchProductsQuery, GetCollectionProductsQuery } from '@/lib/vendure/queries';
import { ProductGrid } from '@/components/commerce/product-grid';
import { FacetFilters } from '@/components/commerce/facet-filters';
import { ProductGridSkeleton } from '@/components/shared/product-grid-skeleton';
import { buildSearchInput, getCurrentPage } from '@/lib/search-helpers';
import { cache } from 'react';
import {
    SITE_NAME,
    truncateDescription,
    buildCanonicalUrl,
    buildOgImages,
    SITE_URL,
} from '@/lib/metadata';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { generateCollectionSchema, JsonLd } from '@/lib/seo/schema';

const getCollectionProducts = cache(async (slug: string, searchParams: { [key: string]: string | string[] | undefined }) => {
    return query(SearchProductsQuery, {
        input: buildSearchInput({
            searchParams,
            collectionSlug: slug
        })
    });
});

const getCollectionMetadata = cache(async (slug: string) => {
    return query(GetCollectionProductsQuery, {
        slug,
        input: { take: 0, collectionSlug: slug, groupByProduct: true },
    });
});

export async function generateMetadata({
    params,
}: PageProps<'/collection/[slug]'>): Promise<Metadata> {
    const { slug } = await params;
    const result = await getCollectionMetadata(slug);
    const collection = result.data.collection;

    if (!collection) {
        return {
            title: 'Collection Not Found',
        };
    }

    const description =
        truncateDescription(collection.description) ||
        `Browse our ${collection.name} collection at ${SITE_NAME}`;

    return {
        title: collection.name,
        description,
        alternates: {
            canonical: buildCanonicalUrl(`/collection/${collection.slug}`),
        },
        openGraph: {
            title: collection.name,
            description,
            type: 'website',
            url: buildCanonicalUrl(`/collection/${collection.slug}`),
            images: buildOgImages(collection.featuredAsset?.preview, collection.name),
        },
        twitter: {
            card: 'summary_large_image',
            title: collection.name,
            description,
            images: collection.featuredAsset?.preview
                ? [collection.featuredAsset.preview]
                : undefined,
        },
    };
}

export default async function CollectionPage({ params, searchParams }: PageProps<'/collection/[slug]'>) {
    const { slug } = await params;
    const searchParamsResolved = await searchParams;
    const page = getCurrentPage(searchParamsResolved);

    const productDataPromise = getCollectionProducts(slug, searchParamsResolved);
    const collectionResult = await getCollectionMetadata(slug);
    const collection = collectionResult.data.collection;

    if (!collection) {
        return null;
    }

    // Generate collection schema
    const collectionSchema = generateCollectionSchema({
        name: collection.name,
        description: collection.description || undefined,
        url: `${SITE_URL}/collection/${collection.slug}`,
        image: collection.featuredAsset?.preview,
    });

    // Build breadcrumbs
    const breadcrumbItems = [
        { name: "Jewelry", href: "/jewelry" },
        { name: collection.name, href: `/collection/${collection.slug}` },
    ];

    return (
        <>
            <JsonLd data={collectionSchema} />
            <div className="container mx-auto px-4 py-8">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar - Order 1 on mobile, 1 on desktop */}
                    <aside className="lg:col-span-1 order-1">
                        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
                            <FacetFilters productDataPromise={productDataPromise} />
                        </Suspense>
                    </aside>

                    {/* Product Grid - Order 2 on mobile, 2 on desktop */}
                    <div className="lg:col-span-3 order-2">
                        <Suspense fallback={<ProductGridSkeleton />}>
                            <ProductGrid productDataPromise={productDataPromise} currentPage={page} take={12} />
                        </Suspense>
                    </div>
                </div>
            </div>
        </>
    );
}