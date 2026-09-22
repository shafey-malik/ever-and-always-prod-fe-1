import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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
import {
    generateCollectionSchema,
    generateFAQSchema,
    JsonLd,
} from '@/lib/seo/schema';
import { getTaxonomyEntry, getCanonicalCollectionSlug } from '@/lib/seo/taxonomy';

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

/**
 * The Vendure catalogue stores each collection's `name` and `description` as
 * its own slug ("engagement-solitaire"), so anything derived straight from the
 * API produces a slug as the page title. The storefront taxonomy is therefore
 * authoritative for anything user- or crawler-facing, and the API value is only
 * a fallback for collections the taxonomy has not caught up with yet.
 */
function looksLikeRawSlug(value: string | null | undefined, slug: string): boolean {
    if (!value) return true;
    const stripped = value.replace(/<[^>]*>/g, '').trim().toLowerCase();
    return stripped === slug.toLowerCase() || stripped === '';
}

export async function generateMetadata({
    params,
}: PageProps<'/collection/[slug]'>): Promise<Metadata> {
    const { slug } = await params;
    const entry = getTaxonomyEntry(slug);
    const canonicalSlug = getCanonicalCollectionSlug(slug);
    const canonical = buildCanonicalUrl(`/collection/${canonicalSlug}`);

    if (entry) {
        return {
            title: { absolute: entry.title },
            description: entry.metaDescription,
            keywords: entry.keywords,
            alternates: { canonical },
            openGraph: {
                title: entry.h1,
                description: entry.metaDescription,
                type: 'website',
                url: canonical,
            },
            twitter: {
                card: 'summary_large_image',
                title: entry.h1,
                description: entry.metaDescription,
            },
        };
    }

    const result = await getCollectionMetadata(slug);
    const collection = result.data.collection;

    if (!collection) {
        return { title: 'Collection Not Found' };
    }

    const name = looksLikeRawSlug(collection.name, slug) ? slug.replace(/-/g, ' ') : collection.name;
    const description = looksLikeRawSlug(collection.description, slug)
        ? `Browse our ${name} collection at ${SITE_NAME}. Certified lab-grown diamonds, honest pricing and free US shipping.`
        : truncateDescription(collection.description);

    return {
        title: name,
        description,
        alternates: { canonical },
        openGraph: {
            title: name,
            description,
            type: 'website',
            url: canonical,
            images: buildOgImages(collection.featuredAsset?.preview, name),
        },
        twitter: {
            card: 'summary_large_image',
            title: name,
            description,
            images: collection.featuredAsset?.preview ? [collection.featuredAsset.preview] : undefined,
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
        notFound();
    }

    const entry = getTaxonomyEntry(slug);
    const canonicalSlug = getCanonicalCollectionSlug(slug);

    const heading = entry?.h1
        ?? (looksLikeRawSlug(collection.name, slug) ? slug.replace(/-/g, ' ') : collection.name);

    const collectionSchema = generateCollectionSchema({
        name: heading,
        description: entry?.metaDescription ?? undefined,
        url: `${SITE_URL}/collection/${canonicalSlug}`,
        base: SITE_URL,
        slug: canonicalSlug,
        image: collection.featuredAsset?.preview,
    });

    const breadcrumbItems = entry?.breadcrumbs ?? [
        { name: 'Jewelry', href: '/jewelry' },
        { name: heading, href: `/collection/${canonicalSlug}` },
    ];

    return (
        <>
            <JsonLd data={collectionSchema} />
            {entry && entry.faqs.length > 0 && (
                <JsonLd data={generateFAQSchema(entry.faqs)} />
            )}

            <div className="container mx-auto px-4 py-8">
                <Breadcrumbs items={breadcrumbItems} />

                {/* Intro copy. A category page with only a product grid has
                    nothing for a search or answer engine to quote, which is why
                    every one of these pages carries prose above the grid. */}
                <header className="mb-8 max-w-3xl">
                    <h1 className="text-3xl sm:text-4xl font-luxury-serif font-light capitalize">
                        {heading}
                    </h1>
                    {entry?.intro.map((paragraph, i) => (
                        <p
                            key={i}
                            className={
                                i === 0
                                    ? 'mt-4 text-lg text-muted-foreground font-light'
                                    : 'mt-3 text-sm text-muted-foreground font-light leading-relaxed'
                            }
                        >
                            {paragraph}
                        </p>
                    ))}
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1 order-1">
                        <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
                            <FacetFilters productDataPromise={productDataPromise} />
                        </Suspense>
                    </aside>

                    <div className="lg:col-span-3 order-2">
                        <Suspense fallback={<ProductGridSkeleton />}>
                            <ProductGrid productDataPromise={productDataPromise} currentPage={page} take={12} />
                        </Suspense>
                    </div>
                </div>

                {entry && (
                    <div className="mt-16 space-y-12 max-w-3xl">
                        <section>
                            <h2 className="text-2xl font-luxury-serif font-light">
                                About our {heading.toLowerCase()}
                            </h2>
                            {entry.body.map((paragraph, i) => (
                                <p key={i} className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </section>

                        {/* FAQ answers in plain HTML, mirroring the FAQPage JSON-LD
                            above. Answer engines cite visible text, not markup alone. */}
                        <section>
                            <h2 className="text-2xl font-luxury-serif font-light">
                                {heading}: common questions
                            </h2>
                            <dl className="mt-4 space-y-6">
                                {entry.faqs.map((faq) => (
                                    <div key={faq.question}>
                                        <dt className="font-medium">{faq.question}</dt>
                                        <dd className="mt-1.5 text-sm text-muted-foreground font-light leading-relaxed">
                                            {faq.answer}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </section>

                        {entry.related.length > 0 && (
                            <nav aria-label="Related collections">
                                <h2 className="text-2xl font-luxury-serif font-light">
                                    More in {entry.groupLabel.replace(/^By /, '')}
                                </h2>
                                <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2.5 text-sm">
                                    {entry.related.map((relatedSlug) => {
                                        const related = getTaxonomyEntry(relatedSlug);
                                        if (!related) return null;
                                        return (
                                            <li key={relatedSlug}>
                                                <Link
                                                    href={`/collection/${relatedSlug}`}
                                                    className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                                                >
                                                    {related.h1}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
