import type { Metadata } from 'next';
import { CustomExperience } from '@/components/custom/custom-experience';
import { SITE_NAME } from '@/lib/metadata';
import { query } from '@/lib/vendure/api';
import { GetAllFacetsQuery } from '@/lib/vendure/queries';

export const metadata: Metadata = {
    title: 'Design Your Custom Ring',
    description: `Build a one-of-one ring at ${SITE_NAME} — describe your vision, build it stone by stone, or book a private consultation.`,
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
    return <CustomExperience facetValues={facetValues} />;
}
