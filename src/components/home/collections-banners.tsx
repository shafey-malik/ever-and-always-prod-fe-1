'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useEmblaCarousel from 'embla-carousel-react';
import type { EmblaCarouselType } from 'embla-carousel';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { resolveImageSrc } from '@/lib/cloudinary';

const collections = [
  {
    overline: 'The Bridal Edit',
    title: 'Forever Begins Here',
    description:
      'A curated chapter of solitaires, halos and three-stone silhouettes — composed for the most singular moment of a lifetime.',
    href: '/collection/bridal',
    cta: 'Explore Bridal',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&h=1500&fit=crop',
    badge: 'Spring · 2026',
  },
  {
    overline: 'Anniversary',
    title: 'Eternity Bands',
    description:
      'Pavé brilliance for the years that follow — an unbroken circle of light for every milestone worth keeping.',
    href: '/collection/anniversary',
    cta: 'Discover',
    image:
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=1200&h=1500&fit=crop',
  },
  {
    overline: 'Statement',
    title: 'Rare Carats',
    description:
      'Singular stones in heirloom-grade settings — for those who collect moments, not things.',
    href: '/collection/statement',
    cta: 'View Pieces',
    image:
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=1200&h=1500&fit=crop',
  },
  {
    overline: 'The Icons',
    title: 'Solitaire Atelier',
    description:
      'One diamond, perfectly held. The purest expression of intention, cut to gather every gram of light.',
    href: '/collection/engagement-solitaire',
    cta: 'Meet the Icons',
    image: '/hero-diamond-1.jpg',
  },
  {
    overline: 'Radiance',
    title: 'The Halo Edit',
    description:
      'A circle of brilliance around a singular centre — settings that turn light into ceremony.',
    href: '/collection/engagement-halo',
    cta: 'Step Into Light',
    image: '/hero-diamond-4.jpg',
  },
];

// Parallax strength — translate (in %) applied to the image layer at one snap distance
const TWEEN_FACTOR_BASE = 0.13;
const TWEEN_CLAMP = 18; // image layer is 140% wide, ±20% buffer

export function CollectionsBanners() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: true,
    skipSnaps: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<(HTMLElement | null)[]>([]);

  const setTweenNodes = useCallback((api: EmblaCarouselType): void => {
    tweenNodes.current = api
      .slideNodes()
      .map((slideNode) => slideNode.querySelector<HTMLElement>('.collection-parallax-layer'));
  }, []);

  const setTweenFactor = useCallback((api: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * api.scrollSnapList().length;
  }, []);

  // Official embla parallax tween, with translate clamped to the image overflow buffer
  const tweenParallax = useCallback((api: EmblaCarouselType, eventName?: string) => {
    const engine = api.internalEngine();
    const scrollProgress = api.scrollProgress();
    const slidesInView = api.slidesInView();
    const isScrollEvent = eventName === 'scroll';

    api.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) diffToTarget = scrollSnap - (1 + scrollProgress);
              if (sign === 1) diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          });
        }

        const translate = Math.max(
          -TWEEN_CLAMP,
          Math.min(TWEEN_CLAMP, diffToTarget * (-1 * tweenFactor.current) * 100)
        );
        const tweenNode = tweenNodes.current[slideIndex];
        if (tweenNode) tweenNode.style.transform = `translateX(${translate}%)`;
      });
    });
  }, []);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);
    onSelect(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('slideFocus', tweenParallax)
      .on('reInit', onSelect)
      .on('select', onSelect);

    return () => {
      emblaApi
        .off('reInit', setTweenNodes)
        .off('reInit', setTweenFactor)
        .off('reInit', tweenParallax)
        .off('scroll', tweenParallax)
        .off('slideFocus', tweenParallax)
        .off('reInit', onSelect)
        .off('select', onSelect);
    };
  }, [emblaApi, setTweenNodes, setTweenFactor, tweenParallax, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  return (
    <section className="relative py-20 sm:py-28 bg-[hsl(var(--background))] overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-[hsl(var(--secondary)/0.06)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 w-[32rem] h-[32rem] rounded-full bg-[hsl(var(--secondary)/0.05)] blur-3xl" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative">
        {/* Editorial heading */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 lg:gap-8 mb-10 sm:mb-14">
          <div className="lg:max-w-2xl">
            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <div className="h-px w-8 sm:w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
              <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase">
                Curated Collections
              </span>
            </div>
            <h2 className="font-luxury-serif text-[1.75rem] sm:text-5xl lg:text-6xl font-light text-[hsl(var(--foreground))] leading-[1.1] sm:leading-[0.95] tracking-normal sm:tracking-tight">
              Stories in
              <span className="block italic font-light text-[hsl(var(--secondary-rich))]">
                Diamond &amp; Light
              </span>
            </h2>
          </div>

          <div className="flex items-end justify-between gap-6 lg:flex-col lg:items-end lg:gap-5">
            <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-[13px] sm:text-base max-w-[19rem] sm:max-w-md leading-relaxed font-light lg:text-right">
              Edits crafted for the moments that matter — drift through each
              chapter, composed by our atelier with intention.
            </p>

            {/* Desktop arrows */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Previous collection"
                className="w-11 h-11 rounded-full border border-[hsl(var(--border))] text-[hsl(var(--foreground)/0.6)] hover:text-[hsl(var(--secondary))] hover:border-[hsl(var(--secondary)/0.6)] hover:bg-[hsl(var(--secondary)/0.06)] flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={scrollNext}
                aria-label="Next collection"
                className="w-11 h-11 rounded-full border border-[hsl(var(--border))] text-[hsl(var(--foreground)/0.6)] hover:text-[hsl(var(--secondary))] hover:border-[hsl(var(--secondary)/0.6)] hover:bg-[hsl(var(--secondary)/0.06)] flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Carousel ── */}
        <div
          ref={emblaRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <div className="flex -ml-4 sm:-ml-6 touch-pan-y select-none">
            {collections.map((item, index) => (
              <div
                key={item.title}
                className="min-w-0 shrink-0 grow-0 basis-[86%] sm:basis-[60%] lg:basis-[44%] pl-4 sm:pl-6"
              >
                <Link
                  href={item.href}
                  draggable={false}
                  className="group relative block h-[440px] sm:h-[540px] lg:h-[580px] rounded-2xl overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-elegant) transition-shadow duration-500"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                >
                  {/* Parallax image layer — wider than the card so the tween never reveals edges */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="collection-parallax-layer absolute inset-y-0 -left-[20%] w-[140%] will-change-transform">
                      <Image
                        src={resolveImageSrc(item.image) || item.image}
                        alt={item.title}
                        fill
                        draggable={false}
                        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                        sizes="(min-width: 1024px) 44vw, (min-width: 640px) 60vw, 86vw"
                      />
                    </div>
                  </div>

                  {/* Layered gradients (echoing hero carousel) */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/15 pointer-events-none" />
                  <div className="absolute inset-0 bg-linear-to-r from-black/45 via-transparent to-transparent pointer-events-none" />

                  {/* Gold hairline frame */}
                  <div className="absolute inset-3.5 sm:inset-5 border border-[hsl(var(--secondary)/0.25)] rounded-xl pointer-events-none transition-all duration-700 group-hover:border-[hsl(var(--secondary)/0.55)]" />

                  {/* Top-left chapter number */}
                  <div className="absolute top-7 left-7 sm:top-9 sm:left-9 flex items-center gap-2 font-luxury-sans text-[10px] tracking-[0.3em] text-white/60">
                    <span className="text-[hsl(var(--secondary))]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="w-5 h-px bg-white/30" />
                    <span>{String(collections.length).padStart(2, '0')}</span>
                  </div>

                  {/* Top-right badge */}
                  {item.badge && (
                    <div className="absolute top-7 right-7 sm:top-9 sm:right-9 flex items-center gap-2.5 font-luxury-sans text-[10px] tracking-[0.3em] uppercase text-white/70">
                      <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary))]" />
                      {item.badge}
                    </div>
                  )}

                  {/* Bottom editorial content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-10">
                    <p className="text-[hsl(var(--secondary))] font-luxury-sans text-[10px] sm:text-xs tracking-[0.35em] uppercase mb-3.5">
                      {item.overline}
                    </p>
                    <div className="h-px w-10 bg-[hsl(var(--secondary))] mb-5 opacity-80 transition-all duration-500 group-hover:w-16" />
                    <h3 className="font-luxury-serif text-[1.9rem] sm:text-4xl lg:text-[2.6rem] font-light text-white leading-[1.02] tracking-tight mb-4 max-w-md">
                      {item.title}
                    </h3>
                    <p className="text-white/65 font-luxury-sans text-[13px] sm:text-sm leading-relaxed max-w-sm mb-7 font-light">
                      {item.description}
                    </p>
                    <span
                      className="inline-flex items-center self-start border border-[hsl(var(--secondary)/0.55)] text-[hsl(var(--secondary))] group-hover:bg-[hsl(var(--secondary))] group-hover:text-black group-hover:border-[hsl(var(--secondary))] px-6 sm:px-7 py-2.5 sm:py-3 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-light transition-all duration-500"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
                    >
                      {item.cta}
                      <span className="ml-3 transition-transform duration-500 group-hover:translate-x-1">→</span>
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ── Dots + counter ── */}
        <div className="mt-7 sm:mt-9 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to collection ${index + 1}`}
                onClick={() => scrollTo(index)}
                className="relative p-2 -m-2 cursor-pointer group"
              >
                <span
                  className={`block rounded-full transition-all duration-500 ${index === selectedIndex
                    ? 'w-7 sm:w-8 h-1.5 bg-[hsl(var(--secondary))]'
                    : 'w-1.5 h-1.5 bg-[hsl(var(--foreground)/0.2)] group-hover:bg-[hsl(var(--foreground)/0.4)]'
                    }`}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 font-luxury-sans text-[10px] sm:text-xs text-[hsl(var(--muted-foreground))] tracking-[0.2em]">
            <span className="text-[hsl(var(--secondary))] font-medium">
              {String(selectedIndex + 1).padStart(2, '0')}
            </span>
            <span className="w-5 sm:w-6 h-px bg-[hsl(var(--border))]" />
            <span>{String(collections.length).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
