'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

interface FilterSectionProps {
  facetValues?: Array<{
    count: number;
    facetValue: {
      id: string;
      name: string;
      facet: {
        id: string;
        name: string;
      };
    };
  }>;
}

export function FilterSection({ facetValues = [] }: FilterSectionProps) {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([1000, 50000]);
  const [selectedFacets, setSelectedFacets] = useState<Record<string, string>>({
    shape: '',
    setting: '',
    metal: '',
    size: '',
    carat: '',
  });

  // Group facets by type
  const facetGroups =
    facetValues?.reduce((groups, { facetValue, count }) => {
      const facetName = facetValue.facet.name.toLowerCase();
      if (!groups[facetName]) groups[facetName] = [];
      groups[facetName].push({ ...facetValue, count });
      return groups;
    }, {} as Record<string, any[]>) || {};

  const handleFilterChange = (facetType: string, facetValueId: string) => {
    setSelectedFacets((prev) => ({
      ...prev,
      [facetType]: facetValueId === prev[facetType] ? '' : facetValueId,
    }));
  };

  const resetFilters = () => {
    setSelectedFacets({
      shape: '',
      setting: '',
      metal: '',
      size: '',
      carat: '',
    });
    setPriceRange([1000, 50000]);
  };

  const navigateToSearch = () => {
    const params = new URLSearchParams();

    // Add selected facet values
    Object.values(selectedFacets).forEach((facetValueId) => {
      if (facetValueId) {
        params.append('facets', facetValueId);
      }
    });

    // Add price range (in cents for Vendure, but we'll filter on frontend)
    params.append('minPrice', priceRange[0].toString());
    params.append('maxPrice', priceRange[1].toString());

    router.push(`/search?${params.toString()}`);
  };

  // Get available facet values
  const shapeFacets = facetGroups['shape'] || [];
  const settingFacets = facetGroups['setting'] || [];
  const metalFacets = facetGroups['metal'] || [];
  const sizeFacets = facetGroups['size'] || [];
  const caratFacets = facetGroups['carat'] || [];

  return (
    <section className="py-20 bg-[hsl(var(--background))]">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="font-luxury-serif text-4xl lg:text-5xl font-bold text-[hsl(var(--foreground))]">
            Find Your Perfect Ring
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-lg max-w-2xl mx-auto">
            Use our advanced filters to discover the diamond ring that matches
            your vision and budget.
          </p>
        </div>

        <Card className="bg-[hsl(var(--card))] rounded-2xl shadow-[var(--shadow-card)] p-8 max-w-6xl mx-auto min-h-[600px] border-0 transition-none" style={{ transform: 'translateY(-5px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Shape Filter - Dynamic */}
            {shapeFacets.length > 0 && (
              <div className="space-y-3">
                <label className="font-luxury-sans text-sm font-semibold text-[hsl(var(--foreground))] block">
                  Diamond Shape
                </label>
                <Select
                  value={selectedFacets.shape}
                  onValueChange={(value) => handleFilterChange('shape', value)}
                >
                  <SelectTrigger className="w-full bg-[hsl(var(--card))]">
                    <SelectValue placeholder="Select shape" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(var(--card))]">
                    {shapeFacets.map((facet) => (
                      <SelectItem key={facet.id} value={facet.id}>
                        {facet.name} ({facet.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Setting Filter - Dynamic */}
            {settingFacets.length > 0 && (
              <div className="space-y-3">
                <label className="font-luxury-sans text-sm font-semibold text-[hsl(var(--foreground))] block">
                  Setting Style
                </label>
                <Select
                  value={selectedFacets.setting}
                  onValueChange={(value) => handleFilterChange('setting', value)}
                >
                  <SelectTrigger className="w-full bg-[hsl(var(--card))]">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(var(--card))]">
                    {settingFacets.map((facet) => (
                      <SelectItem key={facet.id} value={facet.id}>
                        {facet.name} ({facet.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Metal Filter - Dynamic */}
            {metalFacets.length > 0 && (
              <div className="space-y-3">
                <label className="font-luxury-sans text-sm font-semibold text-[hsl(var(--foreground))] block">
                  Ring Material
                </label>
                <Select
                  value={selectedFacets.metal}
                  onValueChange={(value) => handleFilterChange('metal', value)}
                >
                  <SelectTrigger className="w-full bg-[hsl(var(--card))]">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(var(--card))]">
                    {metalFacets.map((facet) => (
                      <SelectItem key={facet.id} value={facet.id}>
                        {facet.name} ({facet.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Size Filter - Dynamic */}
            {sizeFacets.length > 0 && (
              <div className="space-y-3">
                <label className="font-luxury-sans text-sm font-semibold text-[hsl(var(--foreground))] block">
                  Ring Size
                </label>
                <Select
                  value={selectedFacets.size}
                  onValueChange={(value) => handleFilterChange('size', value)}
                >
                  <SelectTrigger className="w-full bg-[hsl(var(--card))]">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(var(--card))]">
                    {sizeFacets.map((facet) => (
                      <SelectItem key={facet.id} value={facet.id}>
                        {facet.name} ({facet.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Carat Filter - Dynamic */}
            {caratFacets.length > 0 && (
              <div className="space-y-3">
                <label className="font-luxury-sans text-sm font-semibold text-[hsl(var(--foreground))] block">
                  Carat
                </label>
                <Select
                  value={selectedFacets.carat}
                  onValueChange={(value) => handleFilterChange('carat', value)}
                >
                  <SelectTrigger className="w-full bg-[hsl(var(--card))]">
                    <SelectValue placeholder="Select Carat" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(var(--card))]">
                    {caratFacets.map((facet) => (
                      <SelectItem key={facet.id} value={facet.id}>
                        {facet.name} ({facet.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Price Range Slider */}
          <div className="mt-8 pt-8 border-t border-[hsl(var(--border))]">
            <div className="max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="font-luxury-sans text-sm font-semibold text-[hsl(var(--foreground))]">
                    Price Range
                  </label>
                  <span className="font-luxury-sans text-sm text-[hsl(var(--muted-foreground))]">
                    ${priceRange[0].toLocaleString()} - $
                    {priceRange[1].toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={100000}
                  min={0}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[hsl(var(--muted-foreground))] font-luxury-sans">
                  <span>$0</span>
                  <span>$100,000+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-[hsl(var(--border))]">
            <button
              className="btn-luxury hover:text-[hsl(var(--primary))] flex-1 flex items-center justify-center cursor-pointer"
              onClick={navigateToSearch}
            >
              <Search className="w-5 h-5 mr-2" />
              Search Rings
            </button>
            <button
              type="button"
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] px-4 py-2 rounded-lg hover:bg-[hsl(var(--muted))] transition-colors flex items-center justify-center cursor-pointer"
              onClick={resetFilters}
            >
              <X className="w-5 h-5 mr-2" />
              Reset
            </button>
          </div>
        </Card>
      </div>
    </section>
  );
}
