'use client';

import { useMemo } from 'react';
import { ResultOf, readFragment } from '@/graphql';
import { ProductCard } from './product-card';
import { Pagination } from '@/components/shared/pagination';
import { SortDropdown } from './sort-dropdown';
import { SearchProductsQuery } from '@/lib/vendure/queries';
import { ProductCardFragment } from '@/lib/vendure/fragments';
import { use } from 'react';

interface FilteredProductGridProps {
  productDataPromise: Promise<{
    data: ResultOf<typeof SearchProductsQuery>;
    token?: string;
  }>;
  currentPage: number;
  take: number;
  minPrice?: number;
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

  // Filter products by price range on frontend
  const filteredProducts = useMemo(() => {
    if (!minPrice && !maxPrice) {
      return searchResult.items;
    }

    const min = minPrice || 0;
    const max = maxPrice || Infinity;

    return searchResult.items.filter((productRef) => {
      const product = readFragment(ProductCardFragment, productRef);
      const price = product.priceWithTax;
      let productPrice: number;

      if (price.__typename === 'PriceRange') {
        // Use the minimum price of the range
        productPrice = price.min;
      } else if (price.__typename === 'SinglePrice') {
        productPrice = price.value;
      } else {
        return false;
      }

      // Convert from cents to dollars for comparison
      const priceInDollars = productPrice / 100;
      return priceInDollars >= min && priceInDollars <= max;
    });
  }, [searchResult.items, minPrice, maxPrice]);

  const totalFilteredItems = filteredProducts.length;
  const totalPages = Math.ceil(totalFilteredItems / take);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * take,
    currentPage * take
  );

  if (filteredProducts.length === 0) {
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
          {totalFilteredItems} {totalFilteredItems === 1 ? 'product' : 'products'}
        </p>
        <SortDropdown />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProducts.map((product, i) => (
          <div
            key={'product-grid-item' + i}
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
