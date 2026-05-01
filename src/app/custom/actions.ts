'use server';

import { readFragment } from '@/graphql';
import { query } from '@/lib/vendure/api';
import { ProductCardFragment } from '@/lib/vendure/fragments';
import { SearchProductsQuery } from '@/lib/vendure/queries';

export interface MatchSummary {
    totalItems: number;
    sample: Array<{
        slug: string;
        name: string;
        preview: string | null;
    }>;
}

export async function findMatchingRings(facetValueIds: string[]): Promise<MatchSummary> {
    if (facetValueIds.length === 0) {
        return { totalItems: 0, sample: [] };
    }

    try {
        const result = await query(SearchProductsQuery, {
            input: {
                take: 6,
                skip: 0,
                groupByProduct: true,
                sort: { name: 'ASC' },
                facetValueFilters: facetValueIds.map(id => ({ and: id })),
            },
        });

        const sample = result.data.search.items.map(itemRef => {
            const item = readFragment(ProductCardFragment, itemRef);
            return {
                slug: item.slug,
                name: item.productName,
                preview: item.productAsset?.preview ?? null,
            };
        });

        return {
            totalItems: result.data.search.totalItems,
            sample,
        };
    } catch (error) {
        console.error('findMatchingRings failed:', error);
        return { totalItems: 0, sample: [] };
    }
}
