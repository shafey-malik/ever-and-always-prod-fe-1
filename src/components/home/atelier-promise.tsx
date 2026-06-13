'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';
import { ShieldCheck, Infinity as InfinityIcon, Truck, RotateCcw } from 'lucide-react';

const luxEase = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: 25, suffix: '+', label: 'Years of Mastery', decimals: 0 },
  { value: 12000, suffix: '+', label: 'Rings Entrusted', decimals: 0 },
  { value: 4.9, suffix: '', label: 'Average Rating', decimals: 1 },
  { value: 100, suffix: '%', label: 'Conflict-Free Stones', decimals: 0 },
];

const pillars = [
  { icon: ShieldCheck, title: 'GIA Certified', text: 'Every stone independently graded' },
  { icon: InfinityIcon, title: 'Lifetime Warranty', text: 'Cared for, for as long as you wear it' },
  { icon: Truck, title: 'Insured Delivery', text: 'Fully covered, signature on arrival' },
  { icon: RotateCcw, title: '30-Day Returns', text: 'Certainty, or your money back' },
];

function CountUp({
  value,
  suffix,
  decimals,
}: {
  value: number;
  suffix: string;
  decimals: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();

  const format = (v: number) =>
    decimals > 0
      ? v.toFixed(decimals)
      : Math.round(v).toLocaleString('en-US');

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;

    if (reduceMotion) {
      node.textContent = format(value) + suffix;
      return;
    }

    const controls = animate(0, value, {
      duration: 2.2,
      ease: luxEase,
      onUpdate: (v) => {
        node.textContent = format(v) + suffix;
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion, value, suffix, decimals]);

  return (
    <span ref={ref} className="tabular-nums">
      0{suffix}
    </span>
  );
}

export function AtelierPromise() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))]">
      {/* Top hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[hsl(var(--secondary)/0.4)] to-transparent" />

      {/* Ambient gold pools */}
      <div className="pointer-events-none absolute -top-20 right-1/4 w-[26rem] h-60 bg-[hsl(var(--secondary)/0.06)] blur-3xl rounded-full" />
      <div className="pointer-events-none absolute -bottom-24 left-1/5 w-[22rem] h-56 bg-[hsl(var(--secondary)/0.05)] blur-3xl rounded-full" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
            <div className="h-px w-8 sm:w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase">
              The Atelier Promise
            </span>
            <div className="h-px w-8 sm:w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
          </div>
          <h2 className="font-luxury-serif text-[1.75rem] sm:text-4xl lg:text-5xl font-light text-[hsl(var(--foreground))] leading-[1.12] tracking-normal sm:tracking-tight text-balance max-w-[19rem] sm:max-w-none mx-auto">
            Numbers We{' '}
            <span className="italic font-light text-[hsl(var(--secondary-rich))]">Stand Behind</span>
          </h2>
        </div>

        {/* Animated counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 sm:gap-y-12 mb-14 sm:mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: luxEase, delay: index * 0.12 }}
              className="text-center"
            >
              <div className="font-luxury-serif font-light text-4xl sm:text-5xl lg:text-[3.4rem] text-[hsl(var(--secondary-rich))] leading-none">
                <CountUp value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </div>
              <div className="mt-3 h-px w-8 mx-auto bg-[hsl(var(--secondary)/0.45)]" />
              <p className="mt-3 font-luxury-sans text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[hsl(var(--muted-foreground))]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, ease: luxEase, delay: 0.1 + index * 0.1 }}
                className="group flex items-center gap-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-(--shadow-card) px-5 py-4 transition-all duration-500 hover:border-[hsl(var(--secondary)/0.5)] hover:shadow-(--shadow-elegant)"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
              >
                <span className="shrink-0 w-10 h-10 rounded-full border border-[hsl(var(--secondary)/0.4)] flex items-center justify-center text-[hsl(var(--secondary-rich))] transition-transform duration-500 group-hover:scale-110">
                  <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-luxury-sans text-[13px] text-[hsl(var(--foreground))] font-medium">
                    {pillar.title}
                  </span>
                  <span className="block font-luxury-sans text-[11px] text-[hsl(var(--muted-foreground))] font-light mt-0.5">
                    {pillar.text}
                  </span>
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[hsl(var(--secondary)/0.4)] to-transparent" />
    </section>
  );
}
