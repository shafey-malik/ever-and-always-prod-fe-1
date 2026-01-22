'use client';

import { useState, use } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { ResultOf } from '@/graphql';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { SearchProductsQuery } from "@/lib/vendure/queries";

interface FacetFiltersProps {
    productDataPromise: Promise<{
        data: ResultOf<typeof SearchProductsQuery>;
        token?: string;
    }>;
}

export function FacetFilters({ productDataPromise }: FacetFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const result = use(productDataPromise);
    const searchResult = result.data.search;
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Group facet values by facet
    interface FacetGroup {
        id: string;
        name: string;
        values: Array<{ id: string; name: string; count: number }>;
    }

    const facetGroups = searchResult.facetValues.reduce((acc: Record<string, FacetGroup>, item) => {
        const facetName = item.facetValue.facet.name;
        if (!acc[facetName]) {
            acc[facetName] = {
                id: item.facetValue.facet.id,
                name: facetName,
                values: []
            };
        }
        acc[facetName].values.push({
            id: item.facetValue.id,
            name: item.facetValue.name,
            count: item.count
        });
        return acc;
    }, {});

    const selectedFacets = searchParams.getAll('facets');

    const toggleFacet = (facetId: string) => {
        const params = new URLSearchParams(searchParams);
        const current = params.getAll('facets');

        if (current.includes(facetId)) {
            params.delete('facets');
            current.filter(id => id !== facetId).forEach(id => params.append('facets', id));
        } else {
            params.append('facets', facetId);
        }

        // Reset to page 1 when filters change
        params.delete('page');

        router.push(`${pathname}?${params.toString()}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams);
        params.delete('facets');
        params.delete('page');
        router.push(`${pathname}?${params.toString()}`);
    };

    const hasActiveFilters = selectedFacets.length > 0;

    if (Object.keys(facetGroups).length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Mobile: Collapsible Filter Header */}
            <div className="lg:hidden border border-[hsl(var(--border))] rounded-lg">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-4 hover:bg-[hsl(var(--muted))] transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-[hsl(var(--foreground))]" />
                        <h2 className="font-semibold text-lg">Filters</h2>
                        {hasActiveFilters && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-full">
                                {selectedFacets.length}
                            </span>
                        )}
                    </div>
                    {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-[hsl(var(--foreground))]" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-[hsl(var(--foreground))]" />
                    )}
                </button>
                {isOpen && (
                    <div className="p-4 border-t border-[hsl(var(--border))] space-y-6 max-h-[70vh] overflow-y-auto">
                        {hasActiveFilters && (
                            <div className="flex justify-end pb-2">
                                <Button variant="ghost" size="sm" onClick={clearFilters}>
                                    Clear all
                                </Button>
                            </div>
                        )}
                        {Object.entries(facetGroups).map(([facetName, facet]) => (
                            <div key={facet.id} className="space-y-3">
                                <h3 className="font-medium text-sm">{facetName}</h3>
                                <div className="space-y-2">
                                    {facet.values.map((value) => {
                                        const isChecked = selectedFacets.includes(value.id);
                                        return (
                                            <div key={value.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={value.id}
                                                    checked={isChecked}
                                                    onCheckedChange={() => toggleFacet(value.id)}
                                                />
                                                <Label
                                                    htmlFor={value.id}
                                                    className="text-sm font-normal cursor-pointer flex items-center gap-2"
                                                >
                                                    {value.name}
                                                    <span className="text-xs text-muted-foreground">
                                                        ({value.count})
                                                    </span>
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Desktop: Always Visible Filters */}
            <div className="hidden lg:block space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-lg">Filters</h2>
                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Clear all
                        </Button>
                    )}
                </div>

                {Object.entries(facetGroups).map(([facetName, facet]) => (
                    <div key={facet.id} className="space-y-3">
                        <h3 className="font-medium text-sm">{facetName}</h3>
                        <div className="space-y-2">
                            {facet.values.map((value) => {
                                const isChecked = selectedFacets.includes(value.id);
                                return (
                                    <div key={value.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={value.id}
                                            checked={isChecked}
                                            onCheckedChange={() => toggleFacet(value.id)}
                                        />
                                        <Label
                                            htmlFor={value.id}
                                            className="text-sm font-normal cursor-pointer flex items-center gap-2"
                                        >
                                            {value.name}
                                            <span className="text-xs text-muted-foreground">
                                                ({value.count})
                                            </span>
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
