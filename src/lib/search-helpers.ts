// NOTE: this Vendure SearchInput schema does NOT support a server-side price
// filter (no priceRange / priceRangeWithTax field). We work around it by
// fetching a large unpaginated page from the server when a price filter is
// active, then filtering + paginating on the client.

export interface SearchInputParams {
    term?: string;
    collectionSlug?: string;
    take: number;
    skip: number;
    groupByProduct: boolean;
    sort: { name?: 'ASC' | 'DESC'; price?: 'ASC' | 'DESC' };
    facetValueFilters?: Array<{ and: string }>;
}

interface BuildSearchInputOptions {
    searchParams: { [key: string]: string | string[] | undefined };
    collectionSlug?: string;
}

export const PAGE_SIZE = 12;
// Upper bound when client-side price filtering. Should comfortably cover the
// full catalog of an artisan ring store; if the store grows past this, the
// price filter needs proper server-side support added in Vendure.
export const PRICE_FILTER_FETCH_SIZE = 500;

export function hasActivePriceFilter(
    searchParams: { [key: string]: string | string[] | undefined }
): boolean {
    return searchParams.minPrice !== undefined || searchParams.maxPrice !== undefined;
}

export function getPriceRange(
    searchParams: { [key: string]: string | string[] | undefined }
): { min?: number; max?: number } {
    return {
        min: searchParams.minPrice !== undefined ? Number(searchParams.minPrice) : undefined,
        max: searchParams.maxPrice !== undefined ? Number(searchParams.maxPrice) : undefined,
    };
}

export function buildSearchInput({ searchParams, collectionSlug }: BuildSearchInputOptions): SearchInputParams {
    const sort = (searchParams.sort as string) || 'name-asc';
    const searchTerm = searchParams.q as string;

    const facetValueIds = searchParams.facets
        ? Array.isArray(searchParams.facets)
            ? searchParams.facets
            : [searchParams.facets]
        : [];

    const sortMapping: Record<string, { name?: 'ASC' | 'DESC'; price?: 'ASC' | 'DESC' }> = {
        'name-asc': { name: 'ASC' },
        'name-desc': { name: 'DESC' },
        'price-asc': { price: 'ASC' },
        'price-desc': { price: 'DESC' },
    };

    // When price filtering is active we must fetch the entire matching set
    // (within a sane upper bound) so we can filter accurately on the client.
    // Otherwise use normal server-side pagination.
    const priceFilterActive = hasActivePriceFilter(searchParams);
    const page = Number(searchParams.page) || 1;
    const take = priceFilterActive ? PRICE_FILTER_FETCH_SIZE : PAGE_SIZE;
    const skip = priceFilterActive ? 0 : (page - 1) * PAGE_SIZE;

    return {
        ...(searchTerm && { term: searchTerm }),
        ...(collectionSlug && { collectionSlug }),
        take,
        skip,
        groupByProduct: true,
        sort: sortMapping[sort] || sortMapping['name-asc'],
        ...(facetValueIds.length > 0 && {
            facetValueFilters: facetValueIds.map(id => ({ and: id }))
        }),
    };
}

export function getCurrentPage(searchParams: { [key: string]: string | string[] | undefined }): number {
    return Number(searchParams.page) || 1;
}
