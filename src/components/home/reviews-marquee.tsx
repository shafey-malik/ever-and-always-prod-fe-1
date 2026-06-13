'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    location: 'New York, NY',
    rating: 5,
    text: "The most beautiful ring I've ever seen! The team at Ever and Always helped me find exactly what I was looking for. The craftsmanship is absolutely exceptional.",
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'San Francisco, CA',
    rating: 5,
    text: 'Outstanding service from start to finish. They guided me through every step of choosing the perfect engagement ring. My fiancée absolutely loves it!',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    location: 'Miami, FL',
    rating: 5,
    text: 'The custom design process was incredible. They brought my vision to life perfectly. The attention to detail and quality is unmatched.',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'David Thompson',
    location: 'Chicago, IL',
    rating: 5,
    text: 'Exceptional experience. The diamond quality is remarkable and the setting is flawless. Worth every penny for such a special moment.',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 5,
    name: 'Priya Nair',
    location: 'Houston, TX',
    rating: 5,
    text: 'Absolutely stunning. The oval cut they recommended was perfect and the platinum band is exquisite. Every detail exceeded expectations.',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 6,
    name: 'James Holloway',
    location: 'Boston, MA',
    rating: 5,
    text: "I was nervous about buying a ring online but the team made it seamless. The quality surpassed anything I'd seen in physical stores at this price.",
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  },
];

// Duplicate the list so the loop has plenty of slides on ultra-wide screens
const doubled = [...testimonials, ...testimonials];

function ReviewCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="relative h-full bg-[hsl(var(--card))] rounded-2xl p-6 sm:p-7 flex flex-col gap-4 shadow-(--shadow-card) border border-[hsl(var(--border)/0.5)] overflow-hidden">
      {/* Gold corner accent */}
      <span className="pointer-events-none absolute top-0 left-0 w-8 h-px bg-[hsl(var(--secondary)/0.7)]" />
      <span className="pointer-events-none absolute top-0 left-0 w-px h-8 bg-[hsl(var(--secondary)/0.7)]" />
      <span className="pointer-events-none absolute bottom-0 right-0 w-8 h-px bg-[hsl(var(--secondary)/0.7)]" />
      <span className="pointer-events-none absolute bottom-0 right-0 w-px h-8 bg-[hsl(var(--secondary)/0.7)]" />

      {/* Stars */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[hsl(var(--secondary))] text-[hsl(var(--secondary))]" />
          ))}
        </div>
        <Quote className="w-7 h-7 text-[hsl(var(--secondary)/0.25)]" />
      </div>

      {/* Text */}
      <p className="text-[hsl(var(--foreground)/0.78)] font-luxury-serif text-[15px] sm:text-base leading-relaxed italic flex-1 font-light">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Divider */}
      <div className="h-px bg-linear-to-r from-[hsl(var(--secondary)/0.4)] via-[hsl(var(--border)/0.6)] to-transparent" />

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="relative w-11 h-11 shrink-0">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={44}
            height={44}
            draggable={false}
            className="rounded-full object-cover ring-1 ring-[hsl(var(--secondary)/0.5)] ring-offset-2 ring-offset-[hsl(var(--card))]"
          />
        </div>
        <div className="min-w-0">
          <p className="font-luxury-sans font-semibold text-sm text-[hsl(var(--foreground))] truncate">
            {testimonial.name}
          </p>
          <p className="font-luxury-sans text-[10px] tracking-[0.2em] uppercase text-[hsl(var(--muted-foreground))] truncate">
            {testimonial.location}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ReviewsMarquee() {
  // Drifting marquee that is fully swipeable: drag to fling, hover to pause
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      align: 'start',
      skipSnaps: true,
    },
    [
      AutoScroll({
        speed: 0.9,
        startDelay: 150,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    ]
  );

  // Respect reduced-motion: keep it swipeable but stop the auto drift
  useEffect(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins()?.autoScroll;
    if (!autoScroll) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      autoScroll.stop();
    }
  }, [emblaApi]);

  return (
    <section className="relative py-16 sm:py-28 bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-160 h-80 bg-[hsl(var(--secondary)/0.04)] blur-3xl rounded-full" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 mb-10 sm:mb-16 relative">

        {/* Heading */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
            <div className="h-px w-8 sm:w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase">
              Stories
            </span>
            <div className="h-px w-8 sm:w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
          </div>
          <h2 className="font-luxury-serif text-[1.75rem] sm:text-4xl lg:text-5xl font-light text-[hsl(var(--foreground))] leading-[1.15] sm:leading-[1.05] tracking-normal sm:tracking-tight text-balance max-w-[18rem] sm:max-w-none mx-auto">
            What Our{' '}
            <span className="italic font-light text-[hsl(var(--secondary-rich))]">Clients</span>{' '}
            Say
          </h2>
          <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2.5">
            <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary))]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[hsl(var(--secondary))]" />
            <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary))]" />
          </div>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] font-luxury-sans text-[13px] sm:text-base max-w-[20rem] sm:max-w-md mx-auto leading-relaxed font-light text-balance">
            Every ring tells a story. Drift through a few — or swipe at your own pace.
          </p>
        </div>
      </div>

      {/* Swipeable marquee track — full-bleed, no container padding */}
      <div className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-40 z-10 bg-linear-to-r from-[hsl(var(--background))] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-40 z-10 bg-linear-to-l from-[hsl(var(--background))] to-transparent" />

        <div
          ref={emblaRef}
          className="overflow-hidden cursor-grab active:cursor-grabbing"
        >
          <div className="flex -ml-5 sm:-ml-6 py-2 touch-pan-y select-none">
            {doubled.map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className="min-w-0 shrink-0 grow-0 basis-auto w-80 sm:w-102 pl-5 sm:pl-6"
              >
                <ReviewCard testimonial={t} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Swipe hint — mobile only */}
      <div className="mt-7 flex sm:hidden items-center justify-center gap-2.5 font-luxury-sans text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--muted-foreground))]">
        <span className="w-6 h-px bg-[hsl(var(--secondary)/0.5)]" />
        Swipe to explore
        <span className="w-6 h-px bg-[hsl(var(--secondary)/0.5)]" />
      </div>
    </section>
  );
}
