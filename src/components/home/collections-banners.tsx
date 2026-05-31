import Image from 'next/image';
import Link from 'next/link';

const featured = {
  overline: 'The Bridal Edit',
  title: 'Forever Begins Here',
  description:
    'A curated chapter of solitaires, halos and three-stone silhouettes — composed for the most singular moment of a lifetime.',
  href: '/collection/bridal',
  cta: 'Explore Bridal',
  image:
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1400&h=1600&fit=crop',
  badge: 'Spring · 2026',
};

const secondary = [
  {
    overline: 'Anniversary',
    title: 'Eternity Bands',
    description: 'Pavé brilliance for the years that follow.',
    href: '/collection/anniversary',
    cta: 'Discover',
    image:
      'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=900&h=700&fit=crop',
  },
  {
    overline: 'Statement',
    title: 'Rare Carats',
    description: 'Singular stones in heirloom-grade settings.',
    href: '/collection/statement',
    cta: 'View Pieces',
    image:
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=900&h=700&fit=crop',
  },
];

export function CollectionsBanners() {
  return (
    <section className="relative py-20 sm:py-28 bg-[hsl(var(--background))] overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-[hsl(var(--secondary)/0.06)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 w-[32rem] h-[32rem] rounded-full bg-[hsl(var(--secondary)/0.05)] blur-3xl" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative">
        {/* Editorial heading */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
              <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.35em] uppercase">
                Curated Collections
              </span>
            </div>
            <h2 className="font-luxury-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[hsl(var(--foreground))] leading-[0.95] tracking-tight">
              Stories in
              <span className="block italic text-[hsl(var(--secondary-rich))] font-extralight">
                Diamond &amp; Light
              </span>
            </h2>
          </div>
          <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-sm sm:text-base max-w-md leading-relaxed lg:text-right lg:pb-2">
            Edits crafted for the moments that matter — each collection composed
            by our atelier with intention and quiet luxury.
          </p>
        </div>

        {/* Asymmetric editorial grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Featured large banner */}
          <Link
            href={featured.href}
            className="group relative lg:col-span-7 h-[460px] sm:h-[560px] lg:h-[640px] rounded-2xl overflow-hidden block shadow-(--shadow-card) hover:shadow-(--shadow-elegant) transition-shadow duration-500"
            style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
          >
            <Image
              src={featured.image}
              alt={featured.title}
              fill
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
              sizes="(min-width: 1024px) 58vw, 100vw"
            />

            {/* Layered gradients (echoing hero carousel) */}
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/15 pointer-events-none" />
            <div className="absolute inset-0 bg-linear-to-r from-black/55 via-transparent to-transparent pointer-events-none" />

            {/* Gold hairline frame */}
            <div className="absolute inset-4 sm:inset-6 border border-[hsl(var(--secondary)/0.25)] rounded-xl pointer-events-none transition-all duration-700 group-hover:inset-3 sm:group-hover:inset-5 group-hover:border-[hsl(var(--secondary)/0.55)]" />

            {/* Top right metadata */}
            <div className="absolute top-7 right-7 sm:top-9 sm:right-9 flex items-center gap-2.5 font-luxury-sans text-[10px] tracking-[0.3em] uppercase text-white/70">
              <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary))]" />
              {featured.badge}
            </div>

            {/* Bottom editorial content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-14">
              <p className="text-[hsl(var(--secondary))] font-luxury-sans text-[11px] sm:text-xs tracking-[0.35em] uppercase mb-4">
                {featured.overline}
              </p>
              <div className="h-px w-12 bg-[hsl(var(--secondary))] mb-6 opacity-80" />
              <h3 className="font-luxury-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white leading-[0.95] tracking-tight mb-5 max-w-md">
                {featured.title}
              </h3>
              <p className="text-white/70 font-luxury-sans text-sm sm:text-base leading-relaxed max-w-md mb-8 font-light">
                {featured.description}
              </p>
              <span
                className="inline-flex items-center self-start border border-[hsl(var(--secondary)/0.55)] text-[hsl(var(--secondary))] group-hover:bg-[hsl(var(--secondary))] group-hover:text-black group-hover:border-[hsl(var(--secondary))] px-7 sm:px-8 py-3 text-xs tracking-[0.2em] uppercase font-light transition-all duration-500"
                style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
              >
                {featured.cta}
                <span className="ml-3 transition-transform duration-500 group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>

          {/* Two stacked banners */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-5 sm:gap-6">
            {secondary.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative h-[260px] sm:h-[320px] lg:h-[308px] rounded-2xl overflow-hidden block shadow-(--shadow-card) hover:shadow-(--shadow-elegant) transition-shadow duration-500"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  sizes="(min-width: 1024px) 42vw, 100vw"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/35 to-black/10 pointer-events-none" />
                <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-[hsl(var(--secondary)/0.12)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Gold hairline frame */}
                <div className="absolute inset-3 sm:inset-4 border border-[hsl(var(--secondary)/0.2)] rounded-xl pointer-events-none transition-all duration-700 group-hover:border-[hsl(var(--secondary)/0.55)]" />

                <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-8">
                  <p className="text-[hsl(var(--secondary))] font-luxury-sans text-[10px] sm:text-xs tracking-[0.35em] uppercase mb-3">
                    {item.overline}
                  </p>
                  <div className="h-px w-8 bg-[hsl(var(--secondary))] mb-4 opacity-80 transition-all duration-500 group-hover:w-12" />
                  <h3 className="font-luxury-serif text-2xl sm:text-3xl lg:text-[2rem] font-light text-white leading-tight tracking-tight mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/65 font-luxury-sans text-xs sm:text-sm leading-relaxed mb-5 font-light max-w-xs">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center font-luxury-sans text-[11px] tracking-[0.25em] uppercase text-white/75 group-hover:text-[hsl(var(--secondary))] transition-colors duration-300">
                    {item.cta}
                    <span className="ml-2 text-[hsl(var(--secondary))] transition-transform duration-500 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
