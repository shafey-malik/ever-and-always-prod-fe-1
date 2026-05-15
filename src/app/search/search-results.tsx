import { Suspense } from "react";
import { FacetFilters } from "@/components/commerce/facet-filters";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { FilteredProductGrid } from "@/components/commerce/filtered-product-grid";
import { buildSearchInput, getCurrentPage, getPriceRange, PAGE_SIZE } from "@/lib/search-helpers";
import { query } from "@/lib/vendure/api";
import { SearchProductsQuery } from "@/lib/vendure/queries";

interface SearchResultsProps {
    searchParams: Promise<{
        page?: string;
        minPrice?: string;
        maxPrice?: string;
        [key: string]: string | string[] | undefined;
    }>
}

export async function SearchResults({ searchParams }: SearchResultsProps) {
    const searchParamsResolved = await searchParams;
    const page = getCurrentPage(searchParamsResolved);
    const { min: minPrice, max: maxPrice } = getPriceRange(searchParamsResolved);

    const productDataPromise = query(SearchProductsQuery, {
        input: buildSearchInput({ searchParams: searchParamsResolved })
    });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1 order-1">
                <Suspense fallback={<div className="h-64 animate-pulse bg-muted rounded-lg" />}>
                    <FacetFilters
                        productDataPromise={productDataPromise}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />
                </Suspense>
            </aside>

            <div className="lg:col-span-3 order-2">
                <Suspense fallback={<ProductGridSkeleton />}>
                    <FilteredProductGrid
                        productDataPromise={productDataPromise}
                        currentPage={page}
                        take={PAGE_SIZE}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />
                </Suspense>
            </div>
        </div>
    )
}
