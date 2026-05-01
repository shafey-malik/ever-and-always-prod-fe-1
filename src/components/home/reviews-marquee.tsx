'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
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

// Duplicate the list so the marquee loops seamlessly
const doubled = [...testimonials, ...testimonials];

function ReviewCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-80 sm:w-96 bg-[hsl(var(--card))] rounded-2xl p-7 flex flex-col gap-4 shadow-(--shadow-card) mx-3">
      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-[hsl(var(--secondary))] text-[hsl(var(--secondary))]" />
        ))}
      </div>

      {/* Quote icon */}
      <Quote className="w-6 h-6 text-[hsl(var(--secondary)/0.3)]" />

      {/* Text */}
      <p className="text-[hsl(var(--foreground)/0.7)] font-luxury-sans text-sm leading-relaxed italic flex-1">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Divider */}
      <div className="h-px bg-[hsl(var(--border)/0.6)]" />

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10 shrink-0">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            width={40}
            height={40}
            className="rounded-full object-cover ring-1 ring-[hsl(var(--secondary)/0.4)] ring-offset-2 ring-offset-[hsl(var(--card))]"
          />
        </div>
        <div>
          <p className="font-luxury-sans font-semibold text-sm text-[hsl(var(--foreground))]">
            {testimonial.name}
          </p>
          <p className="font-luxury-sans text-xs text-[hsl(var(--muted-foreground))]">
            {testimonial.location}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ReviewsMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  return (
    <section className="py-20 sm:py-28 bg-[hsl(var(--background))] dark:bg-[hsl(var(--background))] overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 mb-12 sm:mb-16">

        {/* Heading */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.35em] uppercase">
              Stories
            </span>
            <div className="h-px w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
          </div>
          <h2 className="font-luxury-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[hsl(var(--foreground))]">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] font-luxury-sans text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Every ring tells a story. Here are some from our happy couples.
          </p>
        </div>
      </div>

      {/* Marquee track — full-bleed, no container padding */}
      <div className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-linear-to-r from-[hsl(var(--background))] to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-40 z-10 bg-linear-to-l from-[hsl(var(--background))] to-transparent" />

        {/* Scrolling track — click to pause/resume */}
        <div
          ref={trackRef}
          onClick={() => setPaused((p) => !p)}
          className={`flex w-max animate-marquee cursor-pointer ${paused ? 'paused' : ''}`}
          style={{ '--marquee-duration': '45s' } as React.CSSProperties}
        >
          {doubled.map((t, i) => (
            <ReviewCard key={`${t.id}-${i}`} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
