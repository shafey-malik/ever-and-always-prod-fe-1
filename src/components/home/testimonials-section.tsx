import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    location: 'New York, NY',
    rating: 5,
    text: "The most beautiful ring I've ever seen! The team at Ever and Always helped me find exactly what I was looking for. The craftsmanship is absolutely exceptional.",
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    featured: true,
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'San Francisco, CA',
    rating: 5,
    text: 'Outstanding service from start to finish. They guided me through every step of choosing the perfect engagement ring. My fiancée absolutely loves it!',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    featured: false,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    location: 'Miami, FL',
    rating: 5,
    text: 'The custom design process was incredible. They brought my vision to life perfectly. The attention to detail and quality is unmatched.',
    image:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    featured: false,
  },
  {
    id: 4,
    name: 'David Thompson',
    location: 'Chicago, IL',
    rating: 5,
    text: 'Exceptional experience. The diamond quality is remarkable and the setting is flawless. Worth every penny for such a special moment.',
    image:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    featured: false,
  },
];

const bestsellers = [
  {
    id: 1,
    name: 'Classic Solitaire',
    price: '$12,500',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop',
    description: '1.5ct Round Diamond, Platinum Setting',
  },
  {
    id: 2,
    name: 'Vintage Halo',
    price: '$18,900',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
    description: '2ct Cushion Cut Diamond, Rose Gold Halo',
  },
  {
    id: 3,
    name: 'Modern Emerald',
    price: '$22,750',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=300&fit=crop',
    description: '1.8ct Emerald Cut Diamond, White Gold',
  },
  {
    id: 4,
    name: 'Three Stone Legacy',
    price: '$15,400',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop',
    description: '1ct Center with 0.5ct Side Stones, Platinum',
  },
];

function TestimonialCard({
  testimonial,
  featured = false,
}: {
  testimonial: (typeof testimonials)[0];
  featured?: boolean;
}) {
  return (
    <div
      className={`bg-[hsl(var(--card))] rounded-2xl p-7 sm:p-8 flex flex-col gap-5 shadow-(--shadow-card) hover:shadow-(--shadow-elegant) transition-all duration-500 hover:-translate-y-1 ${
        featured ? 'h-full' : ''
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={i}
            className="w-3.5 h-3.5 fill-[hsl(var(--secondary))] text-[hsl(var(--secondary))]"
          />
        ))}
      </div>

      {/* Quote mark */}
      <Quote className={`text-[hsl(var(--secondary)/0.3)] ${featured ? 'w-8 h-8' : 'w-6 h-6'}`} />

      {/* Text */}
      <p
        className={`text-[hsl(var(--foreground)/0.7)] font-luxury-sans leading-relaxed italic flex-1 ${
          featured ? 'text-base sm:text-lg' : 'text-sm'
        }`}
      >
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Divider */}
      <div className="h-px bg-[hsl(var(--border)/0.6)]" />

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="relative w-10 h-10 flex-shrink-0">
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

export function TestimonialsSection() {
  const featured = testimonials.find((t) => t.featured)!;
  const rest = testimonials.filter((t) => !t.featured);

  return (
    <section className="py-20 sm:py-28 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">

        {/* ── Testimonials ── */}
        <div className="mb-24 sm:mb-32">
          <div className="text-center mb-12 sm:mb-16">
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

          {/* Asymmetric editorial grid: featured left, 2×2 right */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Featured testimonial — spans 2 columns */}
            <div className="lg:col-span-2">
              <TestimonialCard testimonial={featured} featured />
            </div>

            {/* Right: 2×2 stack */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {rest.map((t) => (
                <TestimonialCard key={t.id} testimonial={t} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Bestsellers ── */}
        <div>
          <div className="text-center mb-12 sm:mb-16">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
              <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.35em] uppercase">
                Premium Collection
              </span>
              <div className="h-px w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
            </div>
            <h2 className="font-luxury-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[hsl(var(--foreground))] leading-tight">
              Designer&apos;s Choice Collection
            </h2>
            <p className="mt-4 text-[hsl(var(--muted-foreground))] font-luxury-sans text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Our most sought-after designs, handpicked by our master jewelers for their exceptional craftsmanship.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {bestsellers.map((ring, index) => (
              <div
                key={ring.id}
                className="group bg-[hsl(var(--card))] rounded-2xl overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-elegant) transition-all duration-500 hover:-translate-y-2 cursor-pointer"
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                {/* Image area with numbered watermark */}
                <div className="relative overflow-hidden h-64 bg-linear-to-br from-[hsl(var(--muted)/0.5)] to-[hsl(var(--border)/0.3)]">
                  <Image
                    src={ring.image}
                    alt={ring.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

                  {/* Numbered watermark */}
                  <div className="absolute top-3 left-4 font-luxury-serif text-7xl font-bold text-white/[0.07] leading-none select-none pointer-events-none">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Bestseller badge — reveals on hover */}
                  <div className="absolute top-4 right-4 bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] px-3 py-1 font-luxury-sans font-semibold text-[10px] tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    Bestseller
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-luxury-serif text-xl font-semibold text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--secondary))] transition-colors duration-300">
                      {ring.name}
                    </h3>
                    <div className="h-px w-8 bg-linear-to-r from-[hsl(var(--secondary))] to-transparent mt-2" />
                  </div>

                  <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-xs leading-relaxed">
                    {ring.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-luxury-sans font-bold text-lg text-[hsl(var(--lead-text))]">
                      {ring.price}
                    </span>
                    <span className="text-[10px] text-[hsl(var(--muted-foreground))] font-luxury-sans tracking-wide uppercase">
                      In stock
                    </span>
                  </div>

                  <button className="w-full text-xs tracking-[0.15em] uppercase font-light border border-[hsl(var(--foreground)/0.2)] text-[hsl(var(--foreground)/0.75)] hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary))] py-2.5 transition-all duration-300 cursor-pointer rounded-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="text-center mt-12 sm:mt-16">
            <Link
              href="/search"
              className="inline-flex items-center gap-3 font-luxury-sans text-xs tracking-[0.25em] uppercase text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-300 group"
            >
              <span className="h-px w-8 bg-[hsl(var(--secondary)/0.5)] group-hover:w-12 transition-all duration-300" />
              Browse All Collections
              <span className="h-px w-8 bg-[hsl(var(--secondary)/0.5)] group-hover:w-12 transition-all duration-300" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
