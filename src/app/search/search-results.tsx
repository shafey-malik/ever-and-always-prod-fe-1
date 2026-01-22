import { Suspense } from "react";
import { FacetFilters } from "@/components/commerce/facet-filters";
import { ProductGridSkeleton } from "@/components/shared/product-grid-skeleton";
import { FilteredProductGrid } from "@/components/commerce/filtered-product-grid";
import { buildSearchInput, getCurrentPage } from "@/lib/search-helpers";
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
    const minPrice = searchParamsResolved.minPrice ? Number(searchParamsResolved.minPrice) : undefined;
    const maxPrice = searchParamsResolved.maxPrice ? Number(searchParamsResolved.maxPrice) : undefined;

    const productDataPromise = query(SearchProductsQuery, {
        input: buildSearchInput({ searchParams: searchParamsResolved })
    });


    return (
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
                    <FilteredProductGrid
                        productDataPromise={productDataPromise}
                        currentPage={page}
                        take={12}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />
                </Suspense>
            </div>
        </div>
    )
}