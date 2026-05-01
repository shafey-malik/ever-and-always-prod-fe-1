import type { Metadata } from 'next';
import { CustomExperience } from '@/components/custom/custom-experience';
import { SITE_NAME } from '@/lib/metadata';
import { query } from '@/lib/vendure/api';
import { SearchProductsQuery } from '@/lib/vendure/queries';

export const metadata: Metadata = {
    title: 'Design Your Custom Ring',
    description: `Build a one-of-one ring at ${SITE_NAME} — describe your vision, build it stone by stone, or book a private consultation.`,
};

async function loadFacetValues() {
    try {
        const result = await query(SearchProductsQuery, {
            input: {
                take: 0,
                skip: 0,
                groupByProduct: true,
                sort: { name: 'ASC' },
            },
        });
        return result.data.search.facetValues;
    } catch (error) {
        console.error('Failed to load facet values for custom builder:', error);
        return [];
    }
}

export default async function CustomJewelryPage() {
    const facetValues = await loadFacetValues();
    return <CustomExperience facetValues={facetValues} />;
}
