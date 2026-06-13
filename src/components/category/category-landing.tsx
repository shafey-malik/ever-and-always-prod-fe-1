'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gem, ArrowRight, ChevronRight, Calendar } from 'lucide-react';
import type { CategoryGroup, CategoryItem, RingCategoryConfig } from '@/lib/ring-categories';

const luxEase = [0.22, 1, 0.36, 1] as const;

const SHAPE_IMAGES: Record<string, string> = {
  round: '/round.png',
  princess: '/princess.png',
  cushion: '/cushion.png',
  oval: '/oval.png',
  emerald: '/emerald.png',
  pear: '/pear.png',
};

function metalSwatch(name: string): string {
  const v = name.toLowerCase();
  if (v.includes('two')) return 'linear-gradient(120deg, #e9edf2 0%, #cdd4de 48%, #e3c16f 52%, #c79b3b 100%)';
  if (v.includes('rose')) return 'linear-gradient(135deg, #fae3d9 0%, #e8b09a 55%, #cd8a70 100%)';
  if (v.includes('yellow')) return 'linear-gradient(135deg, #f9ecc8 0%, #e3c16f 55%, #c79b3b 100%)';
  return 'linear-gradient(135deg, #f6f7f9 0%, #c8ced7 55%, #9aa3b2 100%)'; // white gold / platinum
}

function collectionHref(slug: string) {
  return `/collection/${slug}`;
}

/* ── Card renderers per group kind ── */

function StyleCard({ item }: { item: CategoryItem }) {
  return (
    <Link
      href={collectionHref(item.slug)}
      className="group relative flex flex-col justify-between gap-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:p-6 shadow-(--shadow-card) hover:shadow-(--shadow-elegant) hover:-translate-y-1 transition-all duration-500 overflow-hidden"
      style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      {/* Gold corner accents */}
      <span className="pointer-events-none absolute top-0 left-0 w-7 h-px bg-[hsl(var(--secondary)/0.6)] transition-all duration-500 group-hover:w-12" />
      <span className="pointer-events-none absolute top-0 left-0 w-px h-7 bg-[hsl(var(--secondary)/0.6)] transition-all duration-500 group-hover:h-12" />

      <div>
        <h3 className="font-luxury-serif text-lg sm:text-xl font-medium leading-snug text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300">
          {item.name}
        </h3>
        {item.note && (
          <p className="mt-1.5 font-luxury-sans text-[11px] text-[hsl(var(--muted-foreground))] font-light leading-relaxed">
            {item.note}
          </p>
        )}
      </div>

      <span className="inline-flex items-center gap-2 font-luxury-sans text-[10px] tracking-[0.22em] uppercase text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300">
        Explore
        <ArrowRight className="w-3.5 h-3.5 text-[hsl(var(--secondary))] transition-transform duration-500 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

function ShapeCard({ item }: { item: CategoryItem }) {
  const img = SHAPE_IMAGES[item.name.toLowerCase()];
  return (
    <Link href={collectionHref(item.slug)} className="group flex flex-col items-center gap-3 cursor-pointer">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-white via-slate-50 to-slate-200 ring-1 ring-[hsl(var(--secondary)/0.25)] shadow-md flex items-center justify-center transition-all duration-500 group-hover:ring-[hsl(var(--secondary)/0.7)] group-hover:shadow-lg group-hover:-translate-y-1">
        {/* light glint */}
        <span className="pointer-events-none absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/70 to-transparent animate-glint rounded-full" />
        {img ? (
          <Image src={img} alt={item.name} width={56} height={56} className="w-12 h-12 sm:w-14 sm:h-14 object-contain drop-shadow transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <Gem className="w-9 h-9 text-[hsl(var(--secondary-rich))] transition-transform duration-500 group-hover:scale-110" strokeWidth={1.2} />
        )}
      </div>
      <span className="font-luxury-sans text-xs tracking-[0.1em] text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300">
        {item.name}
      </span>
    </Link>
  );
}

function MetalCard({ item }: { item: CategoryItem }) {
  return (
    <Link href={collectionHref(item.slug)} className="group flex flex-col items-center gap-3 cursor-pointer">
      <span
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-1 ring-[hsl(var(--border))] shadow-md transition-all duration-500 group-hover:ring-2 group-hover:ring-[hsl(var(--secondary)/0.6)] group-hover:-translate-y-1 group-hover:shadow-lg"
        style={{ background: metalSwatch(item.name) }}
      />
      <span className="font-luxury-sans text-[11px] sm:text-xs tracking-[0.08em] text-center text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300 max-w-[7rem] leading-tight">
        {item.name}
      </span>
    </Link>
  );
}

function PriceCard({ item, index }: { item: CategoryItem; index: number }) {
  return (
    <Link
      href={collectionHref(item.slug)}
      className="group relative flex items-center justify-between gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-6 py-5 sm:py-6 shadow-(--shadow-card) hover:shadow-(--shadow-elegant) hover:-translate-y-1 transition-all duration-500 overflow-hidden"
      style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-linear-to-b from-[hsl(var(--secondary))] to-[hsl(var(--secondary)/0.2)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-center gap-4">
        <span className="font-luxury-serif text-2xl font-light text-[hsl(var(--secondary)/0.5)] leading-none w-8">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-luxury-serif text-lg sm:text-xl font-light text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300">
          {item.name}
        </span>
      </div>
      <ArrowRight className="w-4 h-4 text-[hsl(var(--secondary))] transition-transform duration-500 group-hover:translate-x-1 shrink-0" />
    </Link>
  );
}

function GroupGrid({ group }: { group: CategoryGroup }) {
  if (group.kind === 'shape') {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-y-8 gap-x-4 sm:gap-x-6">
        {group.items.map((item) => (
          <ShapeCard key={item.slug} item={item} />
        ))}
      </div>
    );
  }
  if (group.kind === 'metal') {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-y-8 gap-x-4 sm:gap-x-6">
        {group.items.map((item) => (
          <MetalCard key={item.slug} item={item} />
        ))}
      </div>
    );
  }
  if (group.kind === 'price') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {group.items.map((item, i) => (
          <PriceCard key={item.slug} item={item} index={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {group.items.map((item) => (
        <StyleCard key={item.slug} item={item} />
      ))}
    </div>
  );
}

export function CategoryLanding({ config }: { config: RingCategoryConfig }) {
  const [activeId, setActiveId] = useState(config.groups[0]?.id);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Scroll-spy: highlight the sub-nav pill for the section nearest the top
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    const nodes = Object.values(sectionRefs.current).filter(Boolean) as HTMLElement[];
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const scrollToGroup = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative h-[62vh] min-h-[420px] sm:min-h-[480px] flex items-end overflow-hidden bg-[hsl(220_20%_6%)]">
        <Image src={config.heroImage} alt={config.name} fill priority className="object-cover animate-slow-zoom" sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-black/88 via-black/45 to-black/30" />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent" />
        {/* gold frame */}
        <div className="absolute inset-4 sm:inset-6 border border-[hsl(var(--secondary)/0.25)] rounded-2xl pointer-events-none" />

        <div className="relative container mx-auto px-5 sm:px-8 lg:px-12 pb-12 sm:pb-16">
          <motion.nav
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxEase }}
            className="flex items-center gap-2 font-luxury-sans text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-white/55 mb-5"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[hsl(var(--secondary))]">{config.name}</span>
          </motion.nav>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: luxEase }}
            className="font-luxury-sans text-[hsl(var(--secondary))] text-[11px] sm:text-xs tracking-[0.3em] uppercase mb-4"
          >
            {config.overline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.8, ease: luxEase }}
            className="font-luxury-serif text-[2.5rem] sm:text-6xl lg:text-7xl font-light text-white leading-[0.95] tracking-tight"
          >
            {config.titleLead}{' '}
            <span className="italic font-light text-[hsl(43,68%,72%)]">{config.titleAccent}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: luxEase }}
            className="mt-5 max-w-xl font-luxury-sans text-[13px] sm:text-base text-white/70 font-light leading-relaxed"
          >
            {config.subtitle}
          </motion.p>
        </div>
      </section>

      {/* ── Sticky scroll-spy sub-nav ── */}
      <div className="sticky top-14 sm:top-16 z-30 bg-[hsl(var(--background)/0.9)] backdrop-blur-md border-b border-[hsl(var(--border))]">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {config.groups.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => scrollToGroup(g.id)}
                className={`shrink-0 px-4 py-2 rounded-full font-luxury-sans text-[11px] tracking-[0.12em] uppercase whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  activeId === g.id
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] shadow-sm'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Group sections ── */}
      {config.groups.map((group, gi) => (
        <section
          key={group.id}
          id={group.id}
          ref={(el) => { sectionRefs.current[group.id] = el; }}
          className={`scroll-mt-28 py-14 sm:py-20 ${gi % 2 === 1 ? 'bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))]' : 'bg-[hsl(var(--background))]'}`}
        >
          <div className="container mx-auto px-5 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: luxEase }}
              className="mb-9 sm:mb-12"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-luxury-serif text-sm font-light text-[hsl(var(--secondary)/0.7)]">
                  {String(gi + 1).padStart(2, '0')}
                </span>
                <span className="h-px w-8 bg-[hsl(var(--secondary)/0.5)]" />
                <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] uppercase">
                  {config.name}
                </span>
              </div>
              <h2 className="font-luxury-serif text-2xl sm:text-4xl font-light text-[hsl(var(--foreground))] leading-tight tracking-tight">
                {group.label}
              </h2>
              <p className="mt-2.5 font-luxury-serif italic text-[hsl(var(--muted-foreground))] text-sm sm:text-base font-light">
                {group.caption}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: luxEase, delay: 0.1 }}
            >
              <GroupGrid group={group} />
            </motion.div>
          </div>
        </section>
      ))}

      {/* ── Footer CTA ── */}
      <section className="relative py-16 sm:py-24 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-56 bg-[hsl(var(--secondary)/0.06)] blur-3xl rounded-full" />
        <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative text-center max-w-2xl">
          <h2 className="font-luxury-serif text-[1.6rem] sm:text-4xl font-light text-[hsl(var(--foreground))] leading-tight text-balance">
            Not sure where to{' '}
            <span className="italic text-[hsl(var(--secondary-rich))]">begin?</span>
          </h2>
          <p className="mt-4 font-luxury-sans text-[13px] sm:text-base text-[hsl(var(--muted-foreground))] font-light leading-relaxed text-balance">
            Our gemologists will guide you to the perfect piece — unhurried,
            and entirely about you.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/consultation"
              className="group inline-flex items-center justify-center gap-2.5 w-full sm:w-auto bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] hover:brightness-110 px-8 py-4 sm:py-3.5 text-[11px] tracking-[0.22em] uppercase font-light rounded-sm transition-all duration-500 cursor-pointer active:scale-[0.98]"
              style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
            >
              <Calendar className="w-3.5 h-3.5" />
              Book a Consultation
            </Link>
            <Link
              href="/search"
              className="group inline-flex items-center justify-center gap-2 font-luxury-sans text-[11px] tracking-[0.18em] uppercase text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300"
            >
              Browse Everything
              <ArrowRight className="w-3.5 h-3.5 text-[hsl(var(--secondary))]" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
