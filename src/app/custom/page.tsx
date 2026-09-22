import type { Metadata } from 'next';
import { CustomExperience } from '@/components/custom/custom-experience';
import { SITE_NAME, SITE_URL, buildCanonicalUrl } from '@/lib/metadata';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import {
    JsonLd,
    generateCustomDesignServiceSchema,
    generateFAQSchema,
} from '@/lib/seo/schema';
import { query } from '@/lib/vendure/api';
import { GetAllFacetsQuery } from '@/lib/vendure/queries';

const TITLE = `Custom Engagement Rings — Design Your Own Ring | ${SITE_NAME}`;
const DESCRIPTION =
    'Design a custom lab-grown diamond ring: send a sketch or reference photo, build it stone by stone, or book a consultation. No design fee, free CAD preview, 3-4 week delivery.';

/**
 * Custom work is the brand's highest-margin and least-contested search
 * territory, so this page carries its own Service structured data and a visible
 * FAQ rather than relying on the generic storefront markup.
 */
const CUSTOM_FAQS = [
    {
        question: 'How much does a custom engagement ring cost at Ever and Always?',
        answer:
            'A custom ring costs the same as a comparable ring from our collection: there is no design fee and no custom surcharge. Most custom lab-grown diamond engagement rings land between $900 and $3,500 depending on carat weight, metal and setting complexity. You see a firm price before any work begins.',
    },
    {
        question: 'How long does a custom ring take?',
        answer:
            'Roughly three to four weeks from approved design to delivery. That covers CAD modelling, casting, stone setting and finishing. Rush timelines are possible when a date is fixed; tell us the date and we will confirm before you pay.',
    },
    {
        question: 'What do you need from me to start?',
        answer:
            'Anything you have. A photograph of a ring you like, a rough sketch, a Pinterest board, or just a description in your own words. Our designers turn that into a CAD rendering you can review and change, at no cost and with no obligation to order.',
    },
    {
        question: 'Can you recreate or redesign an existing ring?',
        answer:
            'Yes. We regularly rebuild heirloom rings, reset inherited stones into modern settings, and recreate discontinued designs. If you are resetting your own stone, we will assess it first and tell you honestly whether it is worth reusing.',
    },
    {
        question: 'Can I design a matching wedding band for a ring I already own?',
        answer:
            'Yes. Send photographs and the ring size and we will cut a contour band that sits flush against it, even if the engagement ring came from another jeweller.',
    },
];

export const metadata: Metadata = {
    title: { absolute: TITLE },
    description: DESCRIPTION,
    keywords: [
        'custom engagement rings',
        'design your own engagement ring',
        'custom lab grown diamond ring',
        'custom wedding bands',
        'bespoke engagement ring usa',
        'make my own ring online',
        'custom ring designer maryland',
    ],
    alternates: { canonical: buildCanonicalUrl('/custom') },
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        type: 'website',
        url: buildCanonicalUrl('/custom'),
    },
};

/**
 * Load the FULL facet taxonomy (every defined option), not just facet values
 * that happen to have a matching product. A custom ring can be built from any
 * option, so the builder must offer them all. Reshaped to match the structure
 * the builder already consumes ({ count, facetValue: { id, name, facet } }).
 */
async function loadFacetValues() {
    try {
        const result = await query(GetAllFacetsQuery);
        return result.data.facets.items.flatMap((facet) =>
            facet.values.map((value) => ({
                count: 0,
                facetValue: {
                    id: value.id,
                    name: value.name,
                    facet: { id: facet.id, name: facet.name },
                },
            }))
        );
    } catch (error) {
        console.error('Failed to load facets for custom builder:', error);
        return [];
    }
}

export default async function CustomJewelryPage() {
    const facetValues = await loadFacetValues();

    return (
        <>
            <JsonLd data={generateCustomDesignServiceSchema(SITE_URL)} />
            <JsonLd data={generateFAQSchema(CUSTOM_FAQS)} />

            <Breadcrumbs
                items={[
                    { name: 'Jewelry', href: '/jewelry' },
                    { name: 'Custom Ring Design', href: '/custom' },
                ]}
            />

            <CustomExperience facetValues={facetValues} />

            {/* Crawlable, quotable answers. The builder above is interactive and
                largely invisible to text-only crawlers and AI agents, so the
                page needs prose that states what the service actually is. */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">
                <h2 className="text-2xl sm:text-3xl font-luxury-serif font-light">
                    Custom ring design, answered
                </h2>
                <dl className="mt-6 space-y-7">
                    {CUSTOM_FAQS.map((faq) => (
                        <div key={faq.question}>
                            <dt className="font-medium">{faq.question}</dt>
                            <dd className="mt-1.5 text-sm text-muted-foreground font-light leading-relaxed">
                                {faq.answer}
                            </dd>
                        </div>
                    ))}
                </dl>
            </section>
        </>
    );
}
