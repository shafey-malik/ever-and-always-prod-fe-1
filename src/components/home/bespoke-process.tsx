'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, PenTool, Gem } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Calendar,
    title: 'Begin with a Conversation',
    caption: 'Consult',
    text: 'A private session with our gemologists — virtual or in atelier. We listen first: the story, the hands, the life this ring will live.',
  },
  {
    number: '02',
    icon: PenTool,
    title: 'Watch It Take Shape',
    caption: 'Design',
    text: 'Hand sketches become precise renders. We curate stones to your eye and budget, and refine every curve until it feels inevitable.',
  },
  {
    number: '03',
    icon: Gem,
    title: 'Forged to Last Forever',
    caption: 'Craft',
    text: 'Master setters bring the design to life in platinum or gold — certified, insured, and finished with a lifetime promise.',
  },
];

const luxEase = [0.22, 1, 0.36, 1] as const;

export function BespokeProcess() {
  return (
    <section className="relative py-20 sm:py-28 bg-[hsl(var(--background))] overflow-hidden">
      {/* Giant outlined watermark */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -top-6 sm:top-2 left-1/2 -translate-x-1/2 font-luxury-serif italic font-light text-[5.5rem] sm:text-[11rem] leading-none whitespace-nowrap text-transparent opacity-60 dark:opacity-30"
        style={{ WebkitTextStroke: '1px hsl(var(--secondary) / 0.22)' }}
      >
        Atelier
      </span>

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-[hsl(var(--secondary)/0.05)] blur-3xl" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative">
        {/* Heading */}
        <div className="text-center mb-14 sm:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
            <div className="h-px w-8 sm:w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase">
              The Bespoke Journey
            </span>
            <div className="h-px w-8 sm:w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
          </div>
          <h2 className="font-luxury-serif text-[1.75rem] sm:text-5xl font-light text-[hsl(var(--foreground))] leading-[1.12] sm:leading-[1.02] tracking-normal sm:tracking-tight text-balance">
            From Vision{' '}
            <span className="italic font-light text-[hsl(var(--secondary-rich))]">to Vow</span>
          </h2>
          <p className="mt-4 sm:mt-5 text-[hsl(var(--muted-foreground))] font-luxury-sans text-[13px] sm:text-base max-w-[21rem] sm:max-w-lg mx-auto leading-relaxed font-light text-balance">
            Three quiet chapters between a first conversation and a ring that
            outlives us all.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop connector — draws itself across, behind the numerals */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.4, ease: luxEase, delay: 0.3 }}
            className="hidden lg:block absolute top-10 left-[16%] right-[16%] h-px origin-left bg-linear-to-r from-[hsl(var(--secondary)/0.5)] via-[hsl(var(--secondary)/0.25)] to-[hsl(var(--secondary)/0.5)]"
          />
          {/* Mobile connector — vertical rail drawing downward */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.4, ease: luxEase, delay: 0.2 }}
            className="lg:hidden absolute top-4 bottom-10 left-[1.85rem] w-px origin-top bg-linear-to-b from-[hsl(var(--secondary)/0.5)] via-[hsl(var(--secondary)/0.25)] to-transparent"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, ease: luxEase, delay: index * 0.18 }}
                  className="relative flex lg:block items-start gap-5 pl-1 lg:pl-0 lg:text-center group"
                >
                  {/* Numbered diamond node */}
                  <div className="relative shrink-0 lg:mx-auto lg:mb-7 w-14 h-14 lg:w-20 lg:h-20">
                    {/* Rotated-square frame */}
                    <div className="absolute inset-0 rotate-45 rounded-md border border-[hsl(var(--secondary)/0.45)] bg-[hsl(var(--card))] shadow-(--shadow-card) transition-all duration-500 group-hover:rotate-[55deg] group-hover:border-[hsl(var(--secondary))]" />
                    <div className="absolute inset-[5px] rotate-45 rounded-sm border border-[hsl(var(--secondary)/0.18)]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-[hsl(var(--secondary-rich))]" strokeWidth={1.5} />
                    </div>
                  </div>

                  <div className="flex-1 lg:flex-none">
                    {/* Big ghost numeral */}
                    <div className="flex items-baseline gap-3 lg:justify-center mb-2.5">
                      <span className="font-luxury-serif text-3xl lg:text-4xl font-light text-[hsl(var(--secondary)/0.55)] leading-none">
                        {step.number}
                      </span>
                      <span className="font-luxury-sans text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--muted-foreground))]">
                        {step.caption}
                      </span>
                    </div>

                    <h3 className="font-luxury-serif text-xl sm:text-2xl font-light text-[hsl(var(--foreground))] leading-snug mb-3">
                      {step.title}
                    </h3>
                    <p className="font-luxury-sans text-[13px] sm:text-sm text-[hsl(var(--muted-foreground))] leading-relaxed font-light max-w-xs lg:mx-auto">
                      {step.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: luxEase, delay: 0.25 }}
          className="mt-14 sm:mt-20 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Link
            href="/consultation"
            className="group inline-flex items-center justify-center w-full sm:w-auto bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] hover:brightness-110 px-8 py-4 sm:py-3.5 text-[11px] sm:text-xs tracking-[0.22em] uppercase font-light transition-all duration-500 rounded-sm cursor-pointer active:scale-[0.98]"
            style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
          >
            Book a Private Consultation
            <span className="ml-3 transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/custom"
            className="group inline-flex items-center justify-center w-full sm:w-auto border border-[hsl(var(--foreground)/0.2)] text-[hsl(var(--foreground)/0.85)] hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-rich))] px-8 py-4 sm:py-3.5 text-[11px] sm:text-xs tracking-[0.22em] uppercase font-light transition-all duration-500 rounded-sm cursor-pointer active:scale-[0.98]"
          >
            Start a Custom Design
            <span className="ml-3 text-[hsl(var(--secondary))] transition-transform duration-500 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
