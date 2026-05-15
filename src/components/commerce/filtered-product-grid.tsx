'use client';

import { useMemo, use } from 'react';
import { ResultOf, readFragment } from '@/graphql';
import { ProductCard } from './product-card';
import { Pagination } from '@/components/shared/pagination';
import { SortDropdown } from './sort-dropdown';
import { SearchProductsQuery } from '@/lib/vendure/queries';
import { ProductCardFragment } from '@/lib/vendure/fragments';

interface FilteredProductGridProps {
  productDataPromise: Promise<{
    data: ResultOf<typeof SearchProductsQuery>;
    token?: string;
  }>;
  currentPage: number;
  take: number;
  /** Min price in major currency units (dollars). Filter applied client-side. */
  minPrice?: number;
  /** Max price in major currency units (dollars). Filter applied client-side. */
  maxPrice?: number;
}

export function FilteredProductGrid({
  productDataPromise,
  currentPage,
  take,
  minPrice,
  maxPrice,
}: FilteredProductGridProps) {
  const result = use(productDataPromise);
  const searchResult = result.data.search;

  const priceFilterActive = minPrice !== undefined || maxPrice !== undefined;

  // When a price filter is active, the server returned a large unpaginated
  // page (see PRICE_FILTER_FETCH_SIZE). Filter and paginate client-side and
  // recompute totalItems so pagination stays correct.
  const { displayItems, totalItems, totalPages } = useMemo(() => {
    if (!priceFilterActive) {
      return {
        displayItems: searchResult.items,
        totalItems: searchResult.totalItems,
        totalPages: Math.ceil(searchResult.totalItems / take),
      };
    }

    const min = minPrice ?? 0;
    const max = maxPrice ?? Number.POSITIVE_INFINITY;

    const filtered = searchResult.items.filter((itemRef) => {
      const product = readFragment(ProductCardFragment, itemRef);
      const price = product.priceWithTax;
      let amountInCents: number;
      if (price.__typename === 'PriceRange') {
        amountInCents = price.min;
      } else if (price.__typename === 'SinglePrice') {
        amountInCents = price.value;
      } else {
        return false;
      }
      // Vendure prices are in minor currency units; convert to dollars.
      const amount = amountInCents / 100;
      return amount >= min && amount <= max;
    });

    const start = (currentPage - 1) * take;
    return {
      displayItems: filtered.slice(start, start + take),
      totalItems: filtered.length,
      totalPages: Math.ceil(filtered.length / take),
    };
  }, [priceFilterActive, searchResult.items, searchResult.totalItems, minPrice, maxPrice, currentPage, take]);

  if (totalItems === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found matching your filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {totalItems} {totalItems === 1 ? 'product' : 'products'}
        </p>
        <SortDropdown />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((product, i) => (
          <div
            key={readFragment(ProductCardFragment, product).productId}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${Math.min(i * 50, 500)}ms`,
              animationFillMode: 'both',
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  );
}
