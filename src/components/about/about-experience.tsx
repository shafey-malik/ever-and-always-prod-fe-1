'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { resolveImageSrc } from '@/lib/cloudinary';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';
import {
  Heart,
  Shield,
  Sparkles,
  Users,
  Award,
  ArrowRight,
  Calendar,
  Gem,
  ChevronRight,
  Phone,
  Mail,
} from 'lucide-react';

const luxEase = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: luxEase, delay: i * 0.08 },
  }),
};

const stats = [
  { value: 20, suffix: '+', decimals: 0, label: 'Years of Craft' },
  { value: 10000, suffix: '+', decimals: 0, label: 'Love Stories' },
  { value: 100, suffix: '%', decimals: 0, label: 'Conflict-Free' },
  { value: 4.9, suffix: '', decimals: 1, label: 'Average Rating' },
];

const milestones = [
  { year: '2003', title: 'The First Spark', text: 'Master jeweler Michael Chen opens a small workshop, crafting every piece by hand.' },
  { year: '2009', title: 'A Growing Atelier', text: 'Word of our craftsmanship spreads; the bench grows, the standards never waver.' },
  { year: '2017', title: 'Beyond the Bench', text: 'We bring the atelier online — the same hands, now within everyone’s reach.' },
  { year: 'Today', title: 'Your Forever', text: 'A trusted name in fine jewelry, still crafted with the care of day one.' },
];

const differentiators = [
  { icon: Heart, title: 'Customer-First Philosophy', description: 'Every decision starts with you — from personal consultations to lifetime support.' },
  { icon: Shield, title: 'Uncompromising Quality', description: 'Only conflict-free diamonds, set by master craftsmen to exacting standards.' },
  { icon: Sparkles, title: 'Timeless Design', description: 'Classic elegance meets modern sensibility — pieces cherished for generations.' },
  { icon: Award, title: 'Expert Guidance', description: 'Seasoned consultants guide every step, so you choose with confidence.' },
  { icon: Users, title: 'Personal Touch', description: 'Custom or curated, we make your journey as unique as your story.' },
];

const values = [
  { title: 'Integrity', description: 'Transparent pricing, ethical sourcing, and honest advice.' },
  { title: 'Craftsmanship', description: 'Meticulous attention to detail in every piece we create.' },
  { title: 'Innovation', description: 'Time-honored techniques blended with modern design.' },
];

function CountUp({ value, suffix, decimals }: { value: number; suffix: string; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduce = useReducedMotion();
  const fmt = (v: number) => (decimals > 0 ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-US'));

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    if (reduce) {
      node.textContent = fmt(value) + suffix;
      return;
    }
    const controls = animate(0, value, {
      duration: 2,
      ease: luxEase,
      onUpdate: (v) => { node.textContent = fmt(v) + suffix; },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value, suffix, decimals]);

  return <span ref={ref} className="tabular-nums">0{suffix}</span>;
}

function Eyebrow({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={`flex items-center gap-3 mb-4 ${center ? 'justify-center' : ''}`}>
      <span className="h-px w-8 sm:w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
      <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase">
        {children}
      </span>
      {center && <span className="h-px w-8 sm:w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />}
    </div>
  );
}

export function AboutExperience() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">

      {/* ── Hero ── */}
      <section className="relative h-[68vh] min-h-[440px] sm:min-h-[520px] flex items-end overflow-hidden bg-[hsl(220_20%_6%)]">
        <Image src={resolveImageSrc('/hero-diamond-2.jpg') || '/hero-diamond-2.jpg'} alt="The Ever & Always atelier" fill priority className="object-cover animate-slow-zoom" sizes="100vw" />
        <div className="absolute inset-0 bg-linear-to-t from-black/88 via-black/45 to-black/30" />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent" />
        <div className="absolute inset-4 sm:inset-6 border border-[hsl(var(--secondary)/0.25)] rounded-2xl pointer-events-none" />

        <div className="relative container mx-auto px-5 sm:px-8 lg:px-12 pb-12 sm:pb-16">
          <motion.nav
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: luxEase }}
            className="flex items-center gap-2 font-luxury-sans text-[10px] sm:text-[11px] tracking-[0.18em] uppercase text-white/55 mb-5"
          >
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[hsl(var(--secondary))]">Our Maison</span>
          </motion.nav>

          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: luxEase }}
            className="font-luxury-sans text-[hsl(var(--secondary))] text-[11px] sm:text-xs tracking-[0.3em] uppercase mb-4"
          >
            Since 2003
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, duration: 0.8, ease: luxEase }}
            className="font-luxury-serif text-[2.4rem] sm:text-6xl lg:text-7xl font-light text-white leading-[0.98] tracking-tight"
          >
            Crafting Love{' '}
            <span className="italic font-light text-[hsl(43,68%,72%)]">into Forever</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: luxEase }}
            className="mt-5 max-w-xl font-luxury-sans text-[13px] sm:text-base text-white/70 font-light leading-relaxed"
          >
            For over two decades, we have shaped diamonds into the symbols of life’s
            most precious moments — one story, one ring, at a time.
          </motion.p>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="py-16 sm:py-24 lg:py-28 bg-[hsl(var(--background))] overflow-hidden">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease: luxEase }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden shadow-(--shadow-elegant)">
                <Image src={resolveImageSrc('/hero-diamond-3.jpg') || '/hero-diamond-3.jpg'} alt="Hand-crafted at the bench" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
                <div className="absolute inset-3.5 border border-[hsl(var(--secondary)/0.3)] rounded-xl pointer-events-none" />
              </div>
              {/* Floating "Est." badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.7, ease: luxEase }}
                className="absolute -bottom-6 -right-3 sm:right-6 bg-[hsl(var(--card))] border border-[hsl(var(--border))] shadow-(--shadow-elegant) rounded-2xl px-6 py-4 text-center"
              >
                <span className="block font-luxury-serif text-3xl font-light text-[hsl(var(--secondary-rich))] leading-none">2003</span>
                <span className="block font-luxury-sans text-[9px] tracking-[0.25em] uppercase text-[hsl(var(--muted-foreground))] mt-1.5">Established</span>
              </motion.div>
            </motion.div>

            {/* Narrative */}
            <motion.div
              initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
              className="order-1 lg:order-2"
            >
              <motion.div variants={reveal} custom={0}><Eyebrow>Our Journey</Eyebrow></motion.div>
              <motion.h2 variants={reveal} custom={1} className="font-luxury-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[hsl(var(--foreground))] leading-tight mb-6">
                A Story Built on{' '}
                <span className="italic text-[hsl(var(--secondary-rich))]">Passion</span>
              </motion.h2>
              <div className="space-y-5 text-[hsl(var(--muted-foreground))] font-luxury-sans text-[14px] sm:text-base leading-relaxed font-light">
                <motion.p variants={reveal} custom={2}>
                  Ever &amp; Always began with a simple vision: to create jewelry treasured for generations.
                  Founded by master jeweler <span className="text-[hsl(var(--foreground))]">Michael Chen</span>, our journey
                  started in a small workshop where every piece was crafted with meticulous care.
                </motion.p>
                <motion.p variants={reveal} custom={3}>
                  Michael believed jewelry should tell a story — that a ring is never just an accessory, but a
                  symbol of love, commitment, and cherished memory. That belief still guides every stone we set.
                </motion.p>
                <motion.p variants={reveal} custom={4}>
                  Today, grown from that workshop into a trusted name, our values remain unchanged. We are
                  honored to be part of your story.
                </motion.p>
              </div>
              <motion.p variants={reveal} custom={5} className="mt-6 font-luxury-serif italic text-xl text-[hsl(var(--secondary-rich))]">
                Michael Chen
                <span className="block font-luxury-sans not-italic text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--muted-foreground))] mt-1">Founder &amp; Master Jeweler</span>
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Milestones timeline ── */}
      <section className="py-16 sm:py-20 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12 sm:mb-16">
            <Eyebrow center>Milestones</Eyebrow>
            <h2 className="font-luxury-serif text-2xl sm:text-4xl font-light text-[hsl(var(--foreground))] tracking-tight">
              Two Decades of{' '}
              <span className="italic text-[hsl(var(--secondary-rich))]">Devotion</span>
            </h2>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Desktop connector */}
            <motion.div
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 1.3, ease: luxEase, delay: 0.2 }}
              className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-px origin-left bg-linear-to-r from-[hsl(var(--secondary)/0.5)] via-[hsl(var(--secondary)/0.3)] to-[hsl(var(--secondary)/0.5)]"
            />
            {/* Mobile connector */}
            <motion.div
              initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.3, ease: luxEase, delay: 0.15 }}
              className="lg:hidden absolute top-2 bottom-2 left-[1.65rem] w-px origin-top bg-linear-to-b from-[hsl(var(--secondary)/0.5)] via-[hsl(var(--secondary)/0.3)] to-transparent"
            />

            <div className="grid lg:grid-cols-4 gap-10 lg:gap-6">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: luxEase, delay: i * 0.15 }}
                  className="relative flex lg:flex-col items-start gap-5 lg:gap-0 lg:text-center group"
                >
                  {/* Node */}
                  <div className="relative shrink-0 lg:mx-auto lg:mb-6 w-14 h-14 flex items-center justify-center">
                    <span className="absolute inset-0 rotate-45 rounded-md border border-[hsl(var(--secondary)/0.5)] bg-[hsl(var(--card))] shadow-(--shadow-card) transition-all duration-500 group-hover:rotate-[55deg] group-hover:border-[hsl(var(--secondary))]" />
                    <Gem className="relative w-5 h-5 text-[hsl(var(--secondary-rich))]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 lg:flex-none">
                    <span className="font-luxury-serif text-2xl font-light text-[hsl(var(--secondary-rich))] leading-none">{m.year}</span>
                    <h3 className="mt-2 font-luxury-serif text-lg font-medium text-[hsl(var(--foreground))]">{m.title}</h3>
                    <p className="mt-2 font-luxury-sans text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed font-light lg:max-w-[14rem] lg:mx-auto">{m.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats band ── */}
      <section className="py-14 sm:py-20 bg-[hsl(var(--background))]">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 max-w-5xl mx-auto">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7, ease: luxEase, delay: i * 0.12 }}
                className="text-center"
              >
                <div className="font-luxury-serif font-light text-4xl sm:text-5xl lg:text-[3.4rem] text-[hsl(var(--secondary-rich))] leading-none">
                  <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals} />
                </div>
                <div className="mt-3 h-px w-8 mx-auto bg-[hsl(var(--secondary)/0.45)]" />
                <p className="mt-3 font-luxury-sans text-[10px] sm:text-[11px] tracking-[0.25em] uppercase text-[hsl(var(--muted-foreground))]">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-16 sm:py-20 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))]">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              { icon: Heart, title: 'Our Mission', text: 'To create exceptional jewelry that celebrates life’s most meaningful moments — timeless design, uncompromising quality, and deeply personal service.' },
              { icon: Sparkles, title: 'Our Vision', text: 'To be the most trusted name in fine jewelry, known for integrity, craftsmanship, and making every customer’s experience extraordinary.' },
            ].map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.7, ease: luxEase, delay: i * 0.12 }}
                className="group relative bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-8 lg:p-10 shadow-(--shadow-card) hover:shadow-(--shadow-elegant) hover:-translate-y-1 transition-all duration-500 overflow-hidden"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[hsl(var(--secondary))] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))] flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110">
                  <c.icon className="w-7 h-7 text-[hsl(var(--secondary-foreground))]" />
                </div>
                <h3 className="font-luxury-serif text-2xl sm:text-3xl font-light text-[hsl(var(--foreground))] mb-3.5">{c.title}</h3>
                <p className="font-luxury-sans text-[14px] sm:text-[15px] text-[hsl(var(--muted-foreground))] leading-relaxed font-light">{c.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Sets Us Apart ── */}
      <section className="py-16 sm:py-24 bg-[hsl(var(--background))]">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12 sm:mb-16">
            <Eyebrow center>Why Choose Us</Eyebrow>
            <h2 className="font-luxury-serif text-2xl sm:text-4xl lg:text-5xl font-light text-[hsl(var(--foreground))] tracking-tight">
              What Sets Us{' '}
              <span className="italic text-[hsl(var(--secondary-rich))]">Apart</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
            {differentiators.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.6, ease: luxEase, delay: (i % 3) * 0.1 }}
                className="group relative bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-2xl p-7 shadow-(--shadow-card) hover:shadow-(--shadow-elegant) hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
              >
                <span className="pointer-events-none absolute top-0 left-0 w-7 h-px bg-[hsl(var(--secondary)/0.6)] transition-all duration-500 group-hover:w-14" />
                <span className="pointer-events-none absolute top-0 left-0 w-px h-7 bg-[hsl(var(--secondary)/0.6)] transition-all duration-500 group-hover:h-14" />
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))] flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <item.icon className="w-6 h-6 text-[hsl(var(--secondary-foreground))]" />
                </div>
                <h3 className="font-luxury-serif text-xl font-medium text-[hsl(var(--foreground))] mb-2.5 group-hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300">{item.title}</h3>
                <p className="font-luxury-sans text-[13px] text-[hsl(var(--muted-foreground))] leading-relaxed font-light">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-16 sm:py-20 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))]">
        <div className="container mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <Eyebrow center>Our Compass</Eyebrow>
            <h2 className="font-luxury-serif text-2xl sm:text-4xl font-light text-[hsl(var(--foreground))] tracking-tight">
              Core{' '}
              <span className="italic text-[hsl(var(--secondary-rich))]">Values</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 max-w-4xl mx-auto">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.6, ease: luxEase, delay: i * 0.12 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--secondary)/0.4)] flex items-center justify-center mb-5 transition-all duration-500 group-hover:border-[hsl(var(--secondary))] group-hover:scale-105">
                  <span className="w-2.5 h-2.5 rotate-45 bg-[hsl(var(--secondary))] transition-transform duration-500 group-hover:scale-125" />
                </div>
                <h3 className="font-luxury-serif text-xl font-medium text-[hsl(var(--foreground))] mb-2">{value.title}</h3>
                <p className="font-luxury-sans text-[13px] text-[hsl(var(--muted-foreground))] font-light leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-16 sm:py-24 bg-[hsl(var(--background))] overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-56 bg-[hsl(var(--secondary)/0.06)] blur-3xl rounded-full" />
        <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative text-center max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.7, ease: luxEase }}>
            <h2 className="font-luxury-serif text-[1.9rem] sm:text-4xl lg:text-5xl font-light text-[hsl(var(--foreground))] leading-tight text-balance">
              Let’s Create Something{' '}
              <span className="italic text-[hsl(var(--secondary-rich))]">Beautiful</span>
            </h2>
            <p className="mt-4 font-luxury-sans text-[14px] sm:text-lg text-[hsl(var(--muted-foreground))] font-light leading-relaxed max-w-xl mx-auto text-balance">
              Whether it’s the perfect engagement ring, a special gift, or a custom piece — we’re here to bring your vision to life.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/consultation"
                className="group inline-flex items-center justify-center gap-2.5 bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] hover:brightness-110 px-8 py-4 sm:py-3.5 text-[11px] tracking-[0.22em] uppercase font-light rounded-sm transition-all duration-500 cursor-pointer active:scale-[0.98]"
                style={{ transitionTimingFunction: 'cubic-bezier(0.65,0,0.35,1)' }}
              >
                <Calendar className="w-3.5 h-3.5" />
                Book a Consultation
              </Link>
              <Link
                href="/search"
                className="group inline-flex items-center justify-center gap-2 border border-[hsl(var(--foreground)/0.2)] text-[hsl(var(--foreground)/0.85)] hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-rich))] px-8 py-4 sm:py-3.5 text-[11px] tracking-[0.22em] uppercase font-light rounded-sm transition-all duration-500"
              >
                Explore Collections
                <ArrowRight className="w-3.5 h-3.5 text-[hsl(var(--secondary))] transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="mt-12 pt-10 border-t border-[hsl(var(--border))]">
              <p className="font-luxury-sans text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--muted-foreground))] mb-5">Have questions? We’re here to help.</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
                <a href="tel:+15551234567" className="group inline-flex items-center gap-2.5 font-luxury-sans text-sm text-[hsl(var(--foreground))] hover:text-[hsl(var(--secondary-rich))] transition-colors">
                  <span className="w-9 h-9 rounded-full border border-[hsl(var(--secondary)/0.4)] flex items-center justify-center text-[hsl(var(--secondary-rich))] group-hover:border-[hsl(var(--secondary))] transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </span>
                  +1 (555) 123-4567
                </a>
                <a href="mailto:hello@everandalways.com" className="group inline-flex items-center gap-2.5 font-luxury-sans text-sm text-[hsl(var(--foreground))] hover:text-[hsl(var(--secondary-rich))] transition-colors">
                  <span className="w-9 h-9 rounded-full border border-[hsl(var(--secondary)/0.4)] flex items-center justify-center text-[hsl(var(--secondary-rich))] group-hover:border-[hsl(var(--secondary))] transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </span>
                  hello@everandalways.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
