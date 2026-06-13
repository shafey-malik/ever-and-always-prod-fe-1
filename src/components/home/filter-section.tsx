'use client';

import { useState } from 'react';
import { Search, X, SlidersHorizontal, ChevronUp } from 'lucide-react';
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

interface FacetValueItem {
  id: string;
  name: string;
  count: number;
}

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

// Primary facets shown by default — order matters
const PRIMARY_FACET_KEYS = [
  'diamond shape',
  'ring size',
  'metal type',
  'carat weight',
];

// Advanced facets revealed on toggle
const ADVANCED_FACET_KEYS = [
  'diamond clarity',
  'diamond color',
  'cut quality',
  'setting style',
  'band width',
  'fluorescence',
  'symmetry',
  'polish',
  'certification',
];

const FACET_LABELS: Record<string, string> = {
  'diamond shape': 'Diamond Shape',
  'diamond color': 'Diamond Color',
  'diamond clarity': 'Diamond Clarity',
  'carat weight': 'Carat Weight',
  'cut quality': 'Cut Quality',
  'setting style': 'Setting Style',
  'metal type': 'Metal Type',
  'ring size': 'Ring Size',
  'band width': 'Band Width',
  fluorescence: 'Fluorescence',
  symmetry: 'Symmetry',
  polish: 'Polish',
  certification: 'Certification',
};

const FACET_PLACEHOLDERS: Record<string, string> = {
  'diamond shape': 'Select shape',
  'diamond color': 'Select color',
  'diamond clarity': 'Select clarity',
  'carat weight': 'Select carat',
  'cut quality': 'Select cut',
  'setting style': 'Select setting',
  'metal type': 'Select metal',
  'ring size': 'Select size',
  'band width': 'Select width',
  fluorescence: 'Select fluorescence',
  symmetry: 'Select symmetry',
  polish: 'Select polish',
  certification: 'Select certification',
};

const ALL_FACET_KEYS = [...PRIMARY_FACET_KEYS, ...ADVANCED_FACET_KEYS];

function buildInitialState(): Record<string, string> {
  return Object.fromEntries(ALL_FACET_KEYS.map((k) => [k, '']));
}

function FacetSelect({
  facetKey,
  values,
  selected,
  onChange,
}: {
  facetKey: string;
  values: FacetValueItem[];
  selected: string;
  onChange: (key: string, value: string) => void;
}) {
  if (values.length === 0) return null;
  return (
    <div className="space-y-2.5">
      <label className="font-luxury-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[hsl(var(--foreground))] block">
        {FACET_LABELS[facetKey] ?? facetKey}
      </label>
      <Select
        value={selected}
        onValueChange={(value) => onChange(facetKey, value)}
      >
        <SelectTrigger className="w-full bg-[hsl(var(--card))] py-5 sm:py-4">
          <SelectValue placeholder={FACET_PLACEHOLDERS[facetKey] ?? 'Select'} />
        </SelectTrigger>
        <SelectContent className="bg-[hsl(var(--card))]">
          {values.map((facet) => (
            <SelectItem key={facet.id} value={facet.id}>
              {facet.name} ({facet.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function FilterSection({ facetValues = [] }: FilterSectionProps) {
  const router = useRouter();
  const [priceRange, setPriceRange] = useState([100, 50000]);
  const [selectedFacets, setSelectedFacets] = useState<Record<string, string>>(buildInitialState);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const facetGroups = facetValues.reduce((groups, { facetValue, count }) => {
    const key = facetValue.facet.name.toLowerCase();
    if (!groups[key]) groups[key] = [];
    groups[key].push({ id: facetValue.id, name: facetValue.name, count });
    return groups;
  }, {} as Record<string, FacetValueItem[]>);

  const handleFilterChange = (facetType: string, facetValueId: string) => {
    setSelectedFacets((prev) => ({
      ...prev,
      [facetType]: facetValueId === prev[facetType] ? '' : facetValueId,
    }));
  };

  const resetFilters = () => {
    setSelectedFacets(buildInitialState());
    setPriceRange([100, 50000]);
    setShowAdvanced(false);
  };

  const navigateToSearch = () => {
    const params = new URLSearchParams();
    Object.values(selectedFacets).forEach((id) => {
      if (id) params.append('facets', id);
    });
    params.append('minPrice', priceRange[0].toString());
    params.append('maxPrice', priceRange[1].toString());
    router.push(`/search?${params.toString()}`);
  };

  const primaryFacets = PRIMARY_FACET_KEYS.map((key) => ({
    key,
    values: facetGroups[key] ?? [],
  })).filter(({ values }) => values.length > 0);

  const advancedFacets = ADVANCED_FACET_KEYS.map((key) => ({
    key,
    values: facetGroups[key] ?? [],
  })).filter(({ values }) => values.length > 0);

  const hasAdvanced = advancedFacets.length > 0;

  const activeAdvancedCount = ADVANCED_FACET_KEYS.filter(
    (k) => selectedFacets[k]
  ).length;

  return (
    <section className="relative py-16 sm:py-28 bg-[hsl(var(--surface-alt))] dark:bg-[hsl(var(--background))] overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-10 right-0 w-[28rem] h-[28rem] rounded-full bg-[hsl(var(--secondary)/0.05)] blur-3xl" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative">
        <div className="text-center mb-10 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
            <div className="h-px w-8 sm:w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase">
              Curate
            </span>
            <div className="h-px w-8 sm:w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
          </div>
          <h2 className="font-luxury-serif text-[1.75rem] sm:text-5xl lg:text-6xl font-light text-[hsl(var(--foreground))] leading-[1.15] sm:leading-[1.05] tracking-normal sm:tracking-tight text-balance max-w-[18rem] sm:max-w-none mx-auto">
            Find Your{' '}
            <span className="italic font-light text-[hsl(var(--secondary-rich))]">Perfect</span>{' '}
            Ring
          </h2>
          <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2.5">
            <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary))]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[hsl(var(--secondary))]" />
            <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary))]" />
          </div>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] font-luxury-sans text-[13px] sm:text-base max-w-[20rem] sm:max-w-lg mx-auto leading-relaxed font-light text-balance">
            Use our advanced filters to discover the diamond ring that matches
            your vision and budget.
          </p>
        </div>

        <Card className="relative bg-[hsl(var(--card))] rounded-2xl shadow-(--shadow-elegant) p-5 sm:p-10 max-w-6xl mx-auto border border-[hsl(var(--border)/0.5)] transition-none">
          {/* Gold corner accents */}
          <span className="pointer-events-none absolute top-0 left-0 w-10 h-px bg-[hsl(var(--secondary)/0.6)]" />
          <span className="pointer-events-none absolute top-0 left-0 w-px h-10 bg-[hsl(var(--secondary)/0.6)]" />
          <span className="pointer-events-none absolute top-0 right-0 w-10 h-px bg-[hsl(var(--secondary)/0.6)]" />
          <span className="pointer-events-none absolute top-0 right-0 w-px h-10 bg-[hsl(var(--secondary)/0.6)]" />
          <span className="pointer-events-none absolute bottom-0 left-0 w-10 h-px bg-[hsl(var(--secondary)/0.6)]" />
          <span className="pointer-events-none absolute bottom-0 left-0 w-px h-10 bg-[hsl(var(--secondary)/0.6)]" />
          <span className="pointer-events-none absolute bottom-0 right-0 w-10 h-px bg-[hsl(var(--secondary)/0.6)]" />
          <span className="pointer-events-none absolute bottom-0 right-0 w-px h-10 bg-[hsl(var(--secondary)/0.6)]" />

          {/* Primary Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
            {primaryFacets.map(({ key, values }) => (
              <FacetSelect
                key={key}
                facetKey={key}
                values={values}
                selected={selectedFacets[key]}
                onChange={handleFilterChange}
              />
            ))}
          </div>

          {/* Advanced Filters */}
          {hasAdvanced && showAdvanced && (
            <div className="mt-7 pt-7 sm:mt-8 sm:pt-8 border-t border-[hsl(var(--border))]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
                {advancedFacets.map(({ key, values }) => (
                  <FacetSelect
                    key={key}
                    facetKey={key}
                    values={values}
                    selected={selectedFacets[key]}
                    onChange={handleFilterChange}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Price Range Slider */}
          <div className="mt-7 pt-7 sm:mt-8 sm:pt-8 border-t border-[hsl(var(--border))]">
            <div className="max-w-2xl mx-auto">
              <div className="space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <label className="font-luxury-sans text-[11px] sm:text-sm font-semibold tracking-[0.18em] uppercase text-[hsl(var(--foreground))]">
                    Price Range
                  </label>
                  <span className="font-luxury-serif font-light text-base sm:text-lg text-[hsl(var(--secondary-rich))]">
                    ${priceRange[0].toLocaleString()} <span className="text-[hsl(var(--muted-foreground))] mx-1">—</span> ${priceRange[1].toLocaleString()}
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
                <div className="flex justify-between text-[10px] sm:text-xs text-[hsl(var(--muted-foreground))] font-luxury-sans tracking-[0.15em] uppercase">
                  <span>$0</span>
                  <span>$100,000+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-7 pt-7 sm:mt-8 sm:pt-8 border-t border-[hsl(var(--border))]">
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              {/* Primary — Search (first on mobile for thumb reach) */}
              <button
                className="order-1 sm:order-2 flex-1 flex items-center justify-center gap-2.5 border border-[hsl(var(--secondary))] bg-[hsl(var(--secondary)/0.08)] sm:bg-transparent text-[hsl(var(--secondary-rich))] sm:text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))] hover:text-black py-4 sm:py-3.5 text-[11px] sm:text-xs tracking-[0.25em] sm:tracking-[0.2em] uppercase font-medium transition-all duration-400 cursor-pointer rounded-sm"
                style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
                onClick={navigateToSearch}
              >
                <Search className="w-4 h-4" />
                Search Rings
              </button>

              {/* Secondary — Advanced Filters */}
              {hasAdvanced && (
                <button
                  type="button"
                  className="order-2 sm:order-1 flex items-center justify-center gap-2.5 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--secondary)/1)] hover:text-[hsl(var(--secondary))] px-6 py-3.5 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-light transition-all duration-300 cursor-pointer whitespace-nowrap rounded-sm"
                  onClick={() => setShowAdvanced((v) => !v)}
                >
                  {showAdvanced ? (
                    <><ChevronUp className="w-4 h-4" />Hide Filters</>
                  ) : (
                    <>
                      <SlidersHorizontal className="w-4 h-4" />
                      More Filters
                      {activeAdvancedCount > 0 && (
                        <span className="bg-[hsl(var(--secondary))] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                          {activeAdvancedCount}
                        </span>
                      )}
                    </>
                  )}
                </button>
              )}

              {/* Tertiary — Reset */}
              <button
                type="button"
                className="order-3 flex items-center justify-center gap-2 border border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--border))] px-5 py-3.5 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-light transition-all duration-300 cursor-pointer rounded-sm"
                onClick={resetFilters}
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
