'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Gem, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { DescribeToExpert } from './describe-to-expert';
import { RingJourney } from './ring-journey';
import { loadCustomState, patchCustomState } from '@/lib/custom-ring-storage';

interface CustomExperienceProps {
    facetValues: Array<{
        count: number;
        facetValue: {
            id: string;
            name: string;
            facet: { id: string; name: string };
        };
    }>;
}

type Mode = 'choose' | 'describe' | 'build';

/* ── animation variants ── */
const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const, delay },
    }),
};

const lineGrow = {
    hidden: { scaleX: 0, opacity: 0 },
    show: (delay = 0) => ({
        scaleX: 1,
        opacity: 1,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay },
    }),
};

const cardVariants = {
    hidden: { opacity: 0, y: 28, scale: 0.97 },
    show: (delay = 0) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay },
    }),
};

/* ── shared card chrome ── */
const goldLine = (
    <div className="absolute inset-x-0 top-0 h-[1.5px] bg-linear-to-r from-transparent via-[hsl(var(--secondary))] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
);

export function CustomExperience({ facetValues }: CustomExperienceProps) {
    const [mode, setMode] = useState<Mode>('choose');
    const [hydrated, setHydrated] = useState(false);

    // Restore mode from sessionStorage after mount (avoids SSR mismatch)
    useEffect(() => {
        const stored = loadCustomState();
        if (stored.mode && stored.mode !== 'choose') setMode(stored.mode);
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated) patchCustomState({ mode });
    }, [mode, hydrated]);

    if (mode === 'describe') return <DescribeToExpert onBack={() => setMode('choose')} />;
    if (mode === 'build') return <RingJourney facetValues={facetValues} onExit={() => setMode('choose')} />;

    return (
        <section className="relative min-h-[86vh] bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden flex flex-col justify-center py-12 sm:py-14">

            {/* Ambient background blooms */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-[hsl(var(--secondary)/0.07)] blur-[100px]" />
                <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-[hsl(var(--secondary)/0.06)] blur-[90px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full bg-[hsl(var(--secondary)/0.04)] blur-[80px]" />
            </div>

            <div className="relative container mx-auto px-6 sm:px-8 lg:px-12">

                {/* ── Heading ── */}
                <div className="text-center mb-10 sm:mb-12 max-w-3xl mx-auto">

                    {/* eyebrow with growing lines */}
                    <motion.div
                        className="flex items-center justify-center gap-3 mb-4"
                        initial="hidden"
                        animate="show"
                    >
                        <motion.div
                            variants={lineGrow}
                            custom={0.1}
                            className="h-px w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))] origin-right"
                        />
                        <motion.div variants={fadeUp} custom={0.15}>
                            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.4em] uppercase flex items-center gap-2">
                                <Sparkles className="w-3 h-3" />
                                The Atelier
                                <Sparkles className="w-3 h-3" />
                            </span>
                        </motion.div>
                        <motion.div
                            variants={lineGrow}
                            custom={0.1}
                            className="h-px w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))] origin-left"
                        />
                    </motion.div>

                    {/* Title — word by word stagger */}
                    <div className="overflow-hidden">
                        <motion.h1
                            className="font-luxury-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[hsl(var(--foreground))] leading-tight"
                            variants={fadeUp}
                            custom={0.25}
                            initial="hidden"
                            animate="show"
                        >
                            Design Your{' '}
                            <em className="not-italic text-[hsl(var(--secondary))] italic">Forever</em>{' '}
                            Ring
                        </motion.h1>
                    </div>

                    {/* Thin gold divider */}
                    <motion.div
                        variants={lineGrow}
                        custom={0.4}
                        initial="hidden"
                        animate="show"
                        className="h-px w-20 bg-[hsl(var(--secondary)/0.5)] mx-auto mt-4 mb-4 origin-center"
                    />

                    <motion.p
                        variants={fadeUp}
                        custom={0.45}
                        initial="hidden"
                        animate="show"
                        className="text-[hsl(var(--foreground)/0.68)] font-luxury-sans text-sm sm:text-[0.95rem] leading-relaxed max-w-xl mx-auto"
                    >
                        Three doors into the studio — describe your vision, build it stone by stone,
                        or meet with one of our experts in person.
                    </motion.p>
                </div>

                {/* ── Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 max-w-5xl mx-auto">

                    {/* Door One — Describe */}
                    <motion.button
                        variants={cardVariants}
                        custom={0.35}
                        initial="hidden"
                        animate="show"
                        type="button"
                        onClick={() => setMode('describe')}
                        className="group relative text-left bg-[hsl(var(--card))] rounded-xl p-7 lg:p-8 border border-[hsl(var(--border)/0.6)] shadow-(--shadow-card) hover:shadow-(--shadow-elegant) hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden"
                    >
                        {goldLine}
                        {/* Number */}
                        <span className="absolute top-6 right-6 font-luxury-serif text-5xl font-light text-[hsl(var(--foreground)/0.05)] select-none leading-none">1</span>

                        <div className="w-10 h-10 rounded-lg bg-[hsl(var(--secondary)/0.1)] border border-[hsl(var(--secondary)/0.2)] flex items-center justify-center mb-5 group-hover:bg-[hsl(var(--secondary)/0.18)] transition-colors duration-400">
                            <Mail className="w-4.5 h-4.5 text-[hsl(var(--secondary))]" />
                        </div>

                        <p className="font-luxury-sans text-[hsl(var(--secondary))] text-[9px] tracking-[0.35em] uppercase mb-2">
                            Door One
                        </p>
                        <h3 className="font-luxury-serif text-lg lg:text-xl text-[hsl(var(--foreground))] mb-2.5 leading-snug">
                            Describe to an Expert
                        </h3>
                        <p className="font-luxury-sans text-[0.8rem] text-[hsl(var(--foreground)/0.72)] leading-relaxed mb-6">
                            Write your vision in your own words. Our master jewellers will reply personally.
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-medium text-[hsl(var(--foreground)/0.75)] group-hover:text-[hsl(var(--secondary))] transition-colors duration-300">
                            Begin
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                        </span>
                    </motion.button>

                    {/* Door Two — Build (featured) */}
                    <motion.button
                        variants={cardVariants}
                        custom={0.48}
                        initial="hidden"
                        animate="show"
                        type="button"
                        onClick={() => setMode('build')}
                        className="group relative text-left bg-[hsl(var(--card))] rounded-xl p-8 lg:p-9 border border-[hsl(var(--secondary)/0.45)] shadow-(--shadow-elegant) hover:shadow-[0_20px_48px_-8px_hsl(var(--secondary)/0.2)] hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden md:scale-[1.06]"
                    >
                        {/* Shimmer top line — always visible on featured */}
                        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-linear-to-r from-transparent via-[hsl(var(--secondary))] to-transparent" />

                        {/* Badge */}
                        <span className="absolute top-5 right-5 text-[9px] tracking-[0.25em] uppercase text-[hsl(var(--secondary))] bg-[hsl(var(--secondary)/0.12)] border border-[hsl(var(--secondary)/0.3)] px-2.5 py-1 rounded-full font-semibold">
                            Most Loved
                        </span>

                        <div className="w-11 h-11 rounded-lg bg-[hsl(var(--secondary)/0.15)] border border-[hsl(var(--secondary)/0.3)] flex items-center justify-center mb-5 group-hover:bg-[hsl(var(--secondary)/0.25)] transition-colors duration-400">
                            <Gem className="w-5 h-5 text-[hsl(var(--secondary))]" />
                        </div>

                        <p className="font-luxury-sans text-[hsl(var(--secondary))] text-[9px] tracking-[0.35em] uppercase mb-2">
                            Door Two
                        </p>
                        <h3 className="font-luxury-serif text-xl lg:text-2xl text-[hsl(var(--foreground))] mb-2.5 leading-snug">
                            Build Your Own Ring
                        </h3>
                        <p className="font-luxury-sans text-[0.8rem] text-[hsl(var(--foreground)/0.72)] leading-relaxed mb-6">
                            A guided studio journey — choose your shape, metal, and every detail. We'll find it or make it.
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-semibold text-[hsl(var(--secondary))]">
                            Enter the Atelier
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                        </span>
                    </motion.button>

                    {/* Door Three — Consultation */}
                    <motion.div
                        variants={cardVariants}
                        custom={0.61}
                        initial="hidden"
                        animate="show"
                    >
                        <Link
                            href="/consultation"
                            className="group relative flex flex-col text-left bg-[hsl(var(--card))] rounded-xl p-7 lg:p-8 border border-[hsl(var(--border)/0.6)] shadow-(--shadow-card) hover:shadow-(--shadow-elegant) hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden h-full"
                        >
                            {goldLine}
                            <span className="absolute top-6 right-6 font-luxury-serif text-5xl font-light text-[hsl(var(--foreground)/0.05)] select-none leading-none">3</span>

                            <div className="w-10 h-10 rounded-lg bg-[hsl(var(--secondary)/0.1)] border border-[hsl(var(--secondary)/0.2)] flex items-center justify-center mb-5 group-hover:bg-[hsl(var(--secondary)/0.18)] transition-colors duration-400">
                                <Calendar className="w-4.5 h-4.5 text-[hsl(var(--secondary))]" />
                            </div>

                            <p className="font-luxury-sans text-[hsl(var(--secondary))] text-[9px] tracking-[0.35em] uppercase mb-2">
                                Door Three
                            </p>
                            <h3 className="font-luxury-serif text-lg lg:text-xl text-[hsl(var(--foreground))] mb-2.5 leading-snug">
                                Book a Consultation
                            </h3>
                            <p className="font-luxury-sans text-[0.8rem] text-[hsl(var(--foreground)/0.72)] leading-relaxed mb-6">
                                Sit with one of our advisors — in person or virtually — for a private, unhurried conversation.
                            </p>
                            <span className="mt-auto inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase font-medium text-[hsl(var(--foreground)/0.75)] group-hover:text-[hsl(var(--secondary))] transition-colors duration-300">
                                Reserve Your Time
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                            </span>
                        </Link>
                    </motion.div>

                </div>

                {/* Footer note */}
                <motion.p
                    variants={fadeUp}
                    custom={0.75}
                    initial="hidden"
                    animate="show"
                    className="text-center mt-8 font-luxury-sans text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--foreground)/0.4)]"
                >
                    Complimentary · No Obligation · Bespoke to You
                </motion.p>
            </div>
        </section>
    );
}
