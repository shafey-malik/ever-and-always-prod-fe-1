import Image from 'next/image';
import Link from 'next/link';

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
  return (
    <section className="relative py-20 sm:py-28 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden">
      {/* Ambient luxury glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[20rem] bg-[hsl(var(--secondary)/0.05)] blur-3xl rounded-full" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative">

        {/* Editorial heading */}
        <div className="text-center mb-14 sm:mb-20">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.35em] uppercase">
              Premium Collection
            </span>
            <div className="h-px w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
          </div>
          <h2 className="font-luxury-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[hsl(var(--foreground))] leading-[0.95] tracking-tight">
            Designer&apos;s
            <span className="italic text-[hsl(var(--secondary-rich))] font-extralight"> Choice </span>
            Collection
          </h2>
          <div className="mt-6 mb-2 flex items-center justify-center gap-3">
            <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary))]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[hsl(var(--secondary))]" />
            <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary))]" />
          </div>
          <p className="mt-5 text-[hsl(var(--muted-foreground))] font-luxury-sans text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-light">
            Our most sought-after designs, handpicked by our master jewelers for
            their exceptional craftsmanship and quiet, enduring beauty.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {bestsellers.map((ring, index) => (
            <article
              key={ring.id}
              className="group relative bg-[hsl(var(--card))] rounded-2xl overflow-hidden shadow-(--shadow-card) hover:shadow-(--shadow-elegant) transition-all duration-700 hover:-translate-y-2"
              style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
            >
              {/* Gold hairline outline on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-hover:border-[hsl(var(--secondary)/0.4)] transition-colors duration-500 z-20" />

              {/* Image area */}
              <div className="relative overflow-hidden h-72 bg-linear-to-br from-[hsl(var(--muted)/0.5)] to-[hsl(var(--border)/0.3)]">
                <Image
                  src={ring.image}
                  alt={ring.name}
                  fill
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 48vw, 100vw"
                />

                {/* Editorial bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/55 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Numbered editorial watermark */}
                <div className="absolute top-4 left-5 font-luxury-serif text-[5.5rem] font-light text-[hsl(var(--secondary)/0.18)] leading-none select-none pointer-events-none tracking-tight">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Wishlist */}
                <button
                  type="button"
                  aria-label="Save to wishlist"
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/85 backdrop-blur-md border border-white/60 flex items-center justify-center text-[hsl(var(--foreground)/0.55)] hover:text-[hsl(var(--secondary))] hover:bg-white opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-400 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>

                {/* Bottom-left chips on hover */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  <span className="bg-white/85 backdrop-blur-md text-[hsl(var(--foreground))] px-2.5 py-1 font-luxury-sans text-[10px] tracking-[0.15em] uppercase rounded-sm border border-white/60">
                    {ring.metal}
                  </span>
                  <span className="bg-white/85 backdrop-blur-md text-[hsl(var(--foreground))] px-2.5 py-1 font-luxury-sans text-[10px] tracking-[0.15em] uppercase rounded-sm border border-white/60">
                    {ring.carat}
                  </span>
                </div>

                {/* Top right bestseller ribbon */}
                <div className="absolute top-4 right-16 flex items-center gap-1.5 bg-[hsl(var(--secondary))] text-[hsl(var(--foreground))] pl-2 pr-3 py-1 font-luxury-sans font-semibold text-[9px] tracking-[0.2em] uppercase rounded-sm shadow-sm">
                  <span className="w-1 h-1 rounded-full bg-[hsl(var(--foreground))]" />
                  Bestseller
                </div>
              </div>

              {/* Card body */}
              <div className="p-6 sm:p-7 space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-luxury-serif text-xl font-medium text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300 leading-tight">
                      {ring.name}
                    </h3>
                    <span className="font-luxury-sans text-[10px] tracking-[0.2em] uppercase text-[hsl(var(--muted-foreground))] mt-1.5 whitespace-nowrap">
                      No.{String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="h-px w-10 bg-linear-to-r from-[hsl(var(--secondary))] to-transparent mt-3 transition-all duration-500 group-hover:w-16" />
                </div>

                <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-xs leading-relaxed font-light">
                  {ring.description}
                </p>

                <div className="flex items-end justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="font-luxury-sans text-[9px] tracking-[0.25em] uppercase text-[hsl(var(--muted-foreground))] mb-0.5">
                      From
                    </span>
                    <span className="font-luxury-serif font-light text-2xl text-[hsl(var(--lead-text))] leading-none">
                      {ring.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[hsl(var(--secondary-rich))]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--secondary))] animate-pulse" />
                    <span className="text-[10px] font-luxury-sans tracking-[0.2em] uppercase">
                      In stock
                    </span>
                  </div>
                </div>

                <Link
                  href={`/product/${ring.id}`}
                  className="mt-2 group/btn relative inline-flex items-center justify-center w-full text-xs tracking-[0.2em] uppercase font-light border border-[hsl(var(--foreground)/0.18)] text-[hsl(var(--foreground)/0.78)] hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-rich))] py-3 transition-all duration-500 cursor-pointer rounded-sm overflow-hidden"
                >
                  <span className="relative z-10">View Details</span>
                  <span className="relative z-10 ml-2 transition-transform duration-500 group-hover/btn:translate-x-1">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-16 sm:mt-20">
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
