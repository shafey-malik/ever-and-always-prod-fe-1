'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import { WishlistButton } from '@/components/commerce/wishlist-button';

const bestsellers = [
  {
    id: 1,
    name: 'Classic Solitaire',
    price: '$12,500',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
    description: '1.5ct Round Diamond, Platinum Setting',
    metal: 'Platinum',
    carat: '1.5 ct',
  },
  {
    id: 2,
    name: 'Vintage Halo',
    price: '$18,900',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
    description: '2ct Cushion Cut Diamond, Rose Gold Halo',
    metal: 'Rose Gold',
    carat: '2.0 ct',
  },
  {
    id: 3,
    name: 'Modern Emerald',
    price: '$22,750',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=600&fit=crop',
    description: '1.8ct Emerald Cut Diamond, White Gold',
    metal: 'White Gold',
    carat: '1.8 ct',
  },
  {
    id: 4,
    name: 'Three Stone Legacy',
    price: '$15,400',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop',
    description: '1ct Center with 0.5ct Side Stones, Platinum',
    metal: 'Platinum',
    carat: '2.0 ctw',
  },
];

export function DesignersCollection() {
  // Swipeable cards on mobile/tablet; at lg all four fit, so it reads as the original grid
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  const onReInit = useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList());
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onReInit(emblaApi);
    emblaApi.on('select', onSelect).on('reInit', onReInit);
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onReInit);
    };
  }, [emblaApi, onSelect, onReInit]);

  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  return (
    <section className="relative py-20 sm:py-28 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden">
      {/* Ambient luxury glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[20rem] bg-[hsl(var(--secondary)/0.05)] blur-3xl rounded-full" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative">

        {/* Editorial heading */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
            <div className="h-px w-8 sm:w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase">
              Premium Collection
            </span>
            <div className="h-px w-8 sm:w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
          </div>
          <h2 className="font-luxury-serif text-[1.75rem] sm:text-5xl lg:text-6xl font-light text-[hsl(var(--foreground))] leading-[1.15] sm:leading-[1.02] tracking-normal sm:tracking-tight text-balance max-w-[18rem] sm:max-w-none mx-auto">
            <span className="block sm:inline">Designer&apos;s</span>{' '}
            <span className="italic font-light text-[hsl(var(--secondary-rich))]">Choice</span>{' '}
            <span className="block sm:inline">Collection</span>
          </h2>
          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2.5 sm:gap-3">
            <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary))]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[hsl(var(--secondary))]" />
            <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary))]" />
          </div>
          <p className="mt-4 sm:mt-5 text-[hsl(var(--muted-foreground))] font-luxury-sans text-[13px] sm:text-base max-w-[20rem] sm:max-w-xl mx-auto leading-relaxed font-light text-balance">
            Our most sought-after designs, handpicked by our master jewelers for
            their exceptional craftsmanship and quiet, enduring beauty.
          </p>
        </div>

        {/* Swipeable editorial cards — inner py + outer negative my give clipped shadows room */}
        <div className="-my-8">
        <div ref={emblaRef} className="overflow-hidden lg:overflow-visible cursor-grab active:cursor-grabbing lg:cursor-auto">
          <div className="flex -ml-5 sm:-ml-6 py-8 touch-pan-y select-none">
            {bestsellers.map((ring, index) => (
              <div
                key={ring.id}
                className="min-w-0 shrink-0 grow-0 basis-[80%] sm:basis-[48%] lg:basis-[25%] pl-5 sm:pl-6"
              >
                <Link
                  href={`/product/${ring.id}`}
                  draggable={false}
                  className="group relative block h-[27rem] sm:h-[30rem] lg:h-[32rem] rounded-2xl overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-elegant) hover:-translate-y-2 transition-all duration-700"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                >
                  {/* Full-bleed image */}
                  <Image
                    src={ring.image}
                    alt={ring.name}
                    fill
                    draggable={false}
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 80vw"
                  />

                  {/* Layered gradients for legibility + warmth on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-black/5 pointer-events-none" />
                  <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-[hsl(var(--secondary)/0.14)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                  {/* Gold hairline frame — tightens on hover */}
                  <div className="absolute inset-3.5 border border-[hsl(var(--secondary)/0.28)] rounded-xl pointer-events-none transition-all duration-700 group-hover:inset-2.5 group-hover:border-[hsl(var(--secondary)/0.6)]" />

                  {/* Number watermark */}
                  <span className="absolute top-[4.5rem] left-6 font-luxury-serif text-[5rem] leading-none font-light text-white/10 select-none pointer-events-none tracking-tight">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {/* Top row: bestseller + wishlist */}
                  <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                    <span className="inline-flex items-center gap-1.5 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] pl-2 pr-3 py-1 rounded-sm font-luxury-sans font-semibold text-[9px] tracking-[0.2em] uppercase shadow-sm">
                      <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary-foreground))]" />
                      Bestseller
                    </span>
                    <WishlistButton
                      item={{
                        id: `designer-${ring.id}`,
                        name: ring.name,
                        href: `/product/${ring.id}`,
                        image: ring.image,
                        price: ring.price,
                      }}
                    />
                  </div>

                  {/* Bottom editorial content */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    <p className="font-luxury-sans text-[10px] tracking-[0.28em] uppercase text-[hsl(var(--secondary))] mb-2.5">
                      {ring.metal} · {ring.carat}
                    </p>
                    <h3 className="font-luxury-serif text-2xl sm:text-[1.7rem] font-light text-white leading-tight">
                      {ring.name}
                    </h3>

                    <div className="h-px w-10 bg-[hsl(var(--secondary))] opacity-80 my-4 transition-all duration-500 group-hover:w-16" />

                    <div className="flex items-end justify-between gap-3">
                      <div className="flex flex-col">
                        <span className="font-luxury-sans text-[9px] tracking-[0.25em] uppercase text-white/55 mb-1">
                          From
                        </span>
                        <span className="font-luxury-serif font-light text-2xl text-white leading-none">
                          {ring.price}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-2 border border-[hsl(var(--secondary)/0.5)] text-[hsl(var(--secondary))] group-hover:bg-[hsl(var(--secondary))] group-hover:text-[hsl(var(--secondary-foreground))] group-hover:border-[hsl(var(--secondary))] px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase font-light rounded-sm transition-all duration-500">
                        View
                        <span className="transition-transform duration-500 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
        </div>

        {/* Dots — only useful below lg where cards overflow */}
        {scrollSnaps.length > 1 && (
          <div className="mt-7 flex lg:hidden items-center justify-center gap-2.5">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to design ${index + 1}`}
                onClick={() => scrollTo(index)}
                className="relative p-2 -m-2 cursor-pointer group"
              >
                <span
                  className={`block rounded-full transition-all duration-500 ${index === selectedIndex
                    ? 'w-7 h-1.5 bg-[hsl(var(--secondary))]'
                    : 'w-1.5 h-1.5 bg-[hsl(var(--foreground)/0.2)] group-hover:bg-[hsl(var(--foreground)/0.4)]'
                    }`}
                />
              </button>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-12 sm:mt-20">
          <Link
            href="/search"
            className="inline-flex items-center gap-4 font-luxury-sans text-xs tracking-[0.3em] uppercase text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-300 group"
          >
            <span className="h-px w-10 bg-[hsl(var(--secondary)/0.5)] group-hover:w-16 group-hover:bg-[hsl(var(--secondary))] transition-all duration-500" />
            Browse All Collections
            <span className="h-px w-10 bg-[hsl(var(--secondary)/0.5)] group-hover:w-16 group-hover:bg-[hsl(var(--secondary))] transition-all duration-500" />
          </Link>
        </div>

      </div>
    </section>
  );
}
