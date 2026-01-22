import { query } from "@/lib/vendure/api";
import { SearchProductsQuery } from "@/lib/vendure/queries";
import { FilterSection } from "./filter-section";

export async function FilterSectionWrapper() {
    // Fetch facet values for the filter section
    // Do an empty search to get all available facets
    try {
        const facetResult = await query(SearchProductsQuery, {
            input: {
                take: 0, // We only need facets, not products
                skip: 0,
                groupByProduct: true,
                sort: { name: 'ASC' },
            },
        });

        const facetValues = facetResult.data.search.facetValues;
        return <FilterSection facetValues={facetValues} />;
    } catch (error) {
        // Gracefully handle API errors - return empty filter section
        console.error('Failed to load filter facets:', error);
        return <FilterSection facetValues={[]} />;
    }
}
