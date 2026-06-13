'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Mail, Search, Sparkles, X, Loader2, RotateCcw, ChevronsRight } from 'lucide-react';
import { findMatchingRings, type MatchSummary } from '@/app/custom/actions';
import {
    JOURNEY_FACET_ORDER,
    SHOP_EMAIL,
    getFacetMeta,
    getFacetLabel,
    getValueMeta,
} from '@/lib/custom-ring-config';
import { clearCustomState, loadCustomState, patchCustomState } from '@/lib/custom-ring-storage';

interface FacetValueItem {
    id: string;
    name: string;
    count: number;
}

interface JourneyStep {
    facetKey: string;
    label: string;
    prompt: string;
    eyebrow: string;
    intro: string;
    values: FacetValueItem[];
}

interface RingJourneyProps {
    facetValues: Array<{
        count: number;
        facetValue: {
            id: string;
            name: string;
            facet: { id: string; name: string };
        };
    }>;
    onExit: () => void;
}

interface Selection {
    valueId: string;
    valueName: string;
}

const stripContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } },
};

const stripItem = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

function buildSteps(
    facetValues: RingJourneyProps['facetValues'],
): JourneyStep[] {
    const groups: Record<string, FacetValueItem[]> = {};
    for (const { facetValue, count } of facetValues) {
        const key = facetValue.facet.name.toLowerCase();
        if (!groups[key]) groups[key] = [];
        groups[key].push({ id: facetValue.id, name: facetValue.name, count });
    }

    const steps: JourneyStep[] = [];
    for (const facetKey of JOURNEY_FACET_ORDER) {
        const values = groups[facetKey];
        if (!values || values.length === 0) continue;
        const meta = getFacetMeta(facetKey);
        steps.push({
            facetKey,
            label: meta?.label ?? facetKey,
            prompt: meta?.prompt ?? `Choose ${meta?.label ?? facetKey}`,
            eyebrow: meta?.eyebrow ?? 'Step',
            intro: meta?.intro ?? '',
            values,
        });
    }
    return steps;
}

function buildMailto(selections: Record<string, Selection>): string {
    const subject = 'Custom ring brief from the studio builder';
    const lines = ['Hello Ever and Always team,', '', 'I’ve built the following ring vision and would love your help crafting it:', ''];
    for (const facetKey of JOURNEY_FACET_ORDER) {
        const sel = selections[facetKey];
        if (sel) lines.push(`• ${getFacetLabel(facetKey)}: ${sel.valueName}`);
    }
    lines.push('', 'Please get in touch about next steps.', '', 'Thank you.');
    return `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}

function buildSearchUrl(selections: Record<string, Selection>): string {
    const params = new URLSearchParams();
    for (const sel of Object.values(selections)) {
        if (sel) params.append('facets', sel.valueId);
    }
    return `/search?${params.toString()}`;
}

export function RingJourney({ facetValues, onExit }: RingJourneyProps) {
    const shouldReduce = useReducedMotion();
    const steps = useMemo(() => buildSteps(facetValues), [facetValues]);
    const [stepIndex, setStepIndex] = useState(0);
    const [selections, setSelections] = useState<Record<string, Selection>>({});
    const [hovered, setHovered] = useState<string | null>(null);
    const [completed, setCompleted] = useState(false);
    const [matches, setMatches] = useState<MatchSummary | null>(null);
    const [isPending, startTransition] = useTransition();
    const [hydrated, setHydrated] = useState(false);

    // Restore journey state from sessionStorage after mount
    useEffect(() => {
        const stored = loadCustomState();
        if (stored.selections && Object.keys(stored.selections).length > 0) {
            setSelections(stored.selections);
        }
        if (typeof stored.stepIndex === 'number') {
            // Clamp to valid range in case the available steps change
            setStepIndex(Math.min(Math.max(stored.stepIndex, 0), Math.max(steps.length - 1, 0)));
        }
        if (stored.completed) setCompleted(true);
        if (stored.matches) setMatches(stored.matches);
        setHydrated(true);
    }, [steps.length]);

    // Persist on changes
    useEffect(() => {
        if (!hydrated) return;
        patchCustomState({ stepIndex, selections, completed, matches });
    }, [hydrated, stepIndex, selections, completed, matches]);

    if (steps.length === 0) {
        return (
            <section className="py-24 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))]">
                <div className="container mx-auto px-6 text-center max-w-xl">
                    <h2 className="font-luxury-serif text-3xl text-[hsl(var(--foreground))] mb-4">
                        Studio is preparing options
                    </h2>
                    <p className="text-[hsl(var(--foreground)/0.7)] font-luxury-sans mb-8">
                        Our facet library is currently empty. Please reach out and we’ll guide you personally.
                    </p>
                    <button
                        onClick={onExit}
                        className="inline-flex items-center gap-2 border border-[hsl(var(--border))] text-[hsl(var(--foreground))] px-6 py-3 text-xs tracking-[0.2em] uppercase font-light hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary))] transition-all"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                </div>
            </section>
        );
    }

    const step = steps[stepIndex];
    const selectedForStep = selections[step.facetKey];
    const previewValueId = hovered ?? selectedForStep?.valueId ?? step.values[0].id;
    const previewValue = step.values.find(v => v.id === previewValueId) ?? step.values[0];
    const previewMeta = getValueMeta(step.facetKey, previewValue.name);

    const handleSelect = (value: FacetValueItem) => {
        setSelections(prev => ({
            ...prev,
            [step.facetKey]: { valueId: value.id, valueName: value.name },
        }));
    };

    // Run the final match with whatever has been chosen so far
    const finish = (sels: Record<string, Selection>) => {
        const ids = JOURNEY_FACET_ORDER
            .map(k => sels[k]?.valueId)
            .filter((v): v is string => Boolean(v));
        startTransition(async () => {
            const result = await findMatchingRings(ids);
            setMatches(result);
            setCompleted(true);
        });
    };

    // Advance, keeping any selection on this step (selection no longer required)
    const goNext = () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex(stepIndex + 1);
            setHovered(null);
            return;
        }
        finish(selections);
    };

    // Move on without choosing for this step — clears it, then advances
    const goSkip = () => {
        const next = { ...selections };
        delete next[step.facetKey];
        setSelections(next);
        if (stepIndex < steps.length - 1) {
            setStepIndex(stepIndex + 1);
            setHovered(null);
            return;
        }
        finish(next);
    };

    const goPrev = () => {
        if (stepIndex > 0) {
            setStepIndex(stepIndex - 1);
            setHovered(null);
        }
    };

    const reset = () => {
        setSelections({});
        setStepIndex(0);
        setCompleted(false);
        setMatches(null);
        setHovered(null);
        clearCustomState();
    };

    const clearStep = () => {
        const next = { ...selections };
        delete next[step.facetKey];
        setSelections(next);
    };

    const isLast = stepIndex === steps.length - 1;
    const stepValueViewUrl = previewValue
        ? `/search?facets=${encodeURIComponent(previewValue.id)}`
        : '/search';

    if (completed && matches) {
        return (
            <CompletionScreen
                matches={matches}
                selections={selections}
                onReset={reset}
                onExit={onExit}
            />
        );
    }

    return (
        <section className="relative min-h-[86vh] py-8 sm:py-10 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden">

            {/* Side nav — vertically centered */}
            <button
                type="button"
                onClick={goPrev}
                disabled={stepIndex === 0}
                aria-label="Previous step"
                className="group absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <span className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.85)] backdrop-blur text-[hsl(var(--foreground)/0.85)] group-hover:enabled:border-[hsl(var(--secondary))] group-hover:enabled:text-[hsl(var(--secondary))] group-hover:enabled:bg-[hsl(var(--secondary)/0.08)] transition-all duration-300 shadow-(--shadow-card)">
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
                <span className="hidden sm:inline text-[9px] tracking-[0.25em] uppercase font-luxury-sans text-[hsl(var(--foreground)/0.6)] group-hover:enabled:text-[hsl(var(--secondary))] transition-colors">
                    Prev
                </span>
            </button>

            <button
                type="button"
                onClick={goNext}
                disabled={isPending}
                aria-label={isLast ? 'See your ring' : 'Next step'}
                className="group absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <span className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border bg-[hsl(var(--card)/0.85)] backdrop-blur transition-all duration-300 shadow-(--shadow-card) ${isLast
                    ? 'border-[hsl(var(--secondary))] text-[hsl(var(--secondary))] group-hover:enabled:bg-[hsl(var(--secondary))] group-hover:enabled:text-black'
                    : 'border-[hsl(var(--secondary)/0.7)] text-[hsl(var(--secondary))] group-hover:enabled:bg-[hsl(var(--secondary))] group-hover:enabled:text-black group-hover:enabled:border-[hsl(var(--secondary))]'
                    }`}>
                    {isPending ? (
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : isLast ? (
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                </span>
                <span className="hidden sm:inline text-[9px] tracking-[0.25em] uppercase font-luxury-sans text-[hsl(var(--secondary))] transition-colors">
                    {isPending ? 'Searching' : isLast ? 'Finish' : 'Next'}
                </span>
            </button>

            <div className="container mx-auto px-12 sm:px-16 lg:px-24">

                {/* Top bar — exit + progress + reset */}
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <button
                        onClick={onExit}
                        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[hsl(var(--foreground)/0.75)] hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Exit
                    </button>
                    <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase font-luxury-sans text-[hsl(var(--foreground)/0.7)]">
                        <span>Step {stepIndex + 1}</span>
                        <span className="h-px w-8 bg-[hsl(var(--secondary))]" />
                        <span>{steps.length}</span>
                    </div>
                    {Object.keys(selections).length > 0 ? (
                        <button
                            type="button"
                            onClick={reset}
                            className="inline-flex items-center gap-1.5 text-xs tracking-[0.2em] uppercase text-[hsl(var(--foreground)/0.55)] hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset
                        </button>
                    ) : (
                        <div className="w-16" />
                    )}
                </div>

                {/* Progress chips of selections so far */}
                {Object.keys(selections).length > 0 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
                        {steps.map((s, i) => {
                            const sel = selections[s.facetKey];
                            if (!sel) return null;
                            const isCurrent = i === stepIndex;
                            return (
                                <button
                                    key={s.facetKey}
                                    type="button"
                                    onClick={() => setStepIndex(i)}
                                    className={`group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] tracking-[0.2em] uppercase font-luxury-sans transition-all duration-300 cursor-pointer ${isCurrent
                                        ? 'border-[hsl(var(--secondary))] bg-[hsl(var(--secondary)/0.08)]'
                                        : 'border-[hsl(var(--border))] hover:border-[hsl(var(--secondary)/0.6)]'
                                        }`}
                                >
                                    <span className={isCurrent ? 'text-[hsl(var(--secondary)/0.8)]' : 'text-[hsl(var(--foreground)/0.55)]'}>{s.label}</span>
                                    <span className={isCurrent ? 'text-[hsl(var(--secondary)/0.5)]' : 'text-[hsl(var(--foreground)/0.35)]'}>·</span>
                                    <span className={`font-semibold ${isCurrent ? 'text-[hsl(var(--secondary))]' : 'text-[hsl(var(--foreground)/0.85)]'}`}>{sel.valueName}</span>
                                    <Check className="w-3 h-3 text-[hsl(var(--secondary))]" />
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Section heading */}
                <div className="text-center mb-6 sm:mb-8">
                    {/* <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="h-px w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
                        <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.35em] uppercase">
                            {step.eyebrow}
                        </span>
                        <div className="h-px w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
                    </div> */}
                    <h2 className="font-luxury-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[hsl(var(--foreground))] leading-tight">
                        {step.prompt.split(' ').slice(0, -1).join(' ')}{' '}
                        <span className="italic text-[hsl(var(--secondary))]">
                            {step.prompt.split(' ').slice(-1)}
                        </span>
                    </h2>
                    {step.intro && (
                        <p className="mt-2 text-[hsl(var(--foreground)/0.75)] font-luxury-sans text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                            {step.intro}
                        </p>
                    )}
                </div>

                {/* Value selection strip */}
                <motion.div
                    key={step.facetKey + '-strip'}
                    className="flex items-center justify-center gap-3 sm:gap-5 lg:gap-6 mb-6 sm:mb-8 flex-wrap"
                    variants={stripContainer}
                    initial={shouldReduce ? 'show' : 'hidden'}
                    animate="show"
                >
                    {step.values.map((value) => {
                        const isActive = value.id === previewValueId;
                        const isSelected = value.id === selectedForStep?.valueId;
                        const meta = getValueMeta(step.facetKey, value.name);
                        return (
                            <motion.button
                                key={value.id}
                                variants={stripItem}
                                onClick={() => handleSelect(value)}
                                onMouseEnter={() => setHovered(value.id)}
                                onMouseLeave={() => setHovered(null)}
                                className="flex flex-col items-center gap-2.5 group cursor-pointer min-w-[72px] sm:min-w-[88px]"
                            >
                                <div
                                    className={`relative w-14 h-14 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] rounded-full flex items-center justify-center transition-all duration-400 ${isActive
                                        ? 'bg-linear-to-br from-[hsl(var(--secondary)/0.18)] to-[hsl(var(--secondary-rich)/0.08)] shadow-[0_0_0_1.5px_hsl(var(--secondary)/0.7),0_8px_24px_-4px_hsl(var(--secondary)/0.25)] scale-105'
                                        : 'bg-[hsl(var(--muted)/0.5)] shadow-(--shadow-card) hover:shadow-(--shadow-luxury)'
                                        }`}
                                    style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                                >
                                    {meta.image ? (
                                        <Image
                                            src={meta.image}
                                            alt={value.name}
                                            width={56}
                                            height={56}
                                            className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain transition-all duration-400 ${isActive ? 'drop-shadow-lg scale-110' : ''}`}
                                        />
                                    ) : (
                                        <span
                                            className={`font-luxury-serif text-base sm:text-lg lg:text-xl text-center px-1 leading-tight transition-colors duration-300 ${isActive ? 'text-[hsl(var(--secondary))]' : 'text-[hsl(var(--foreground)/0.65)]'
                                                }`}
                                        >
                                            {value.name.length > 8 ? value.name.slice(0, 6) + '…' : value.name}
                                        </span>
                                    )}
                                    {isSelected && (
                                        <div className="absolute inset-0 rounded-full ring-2 ring-[hsl(var(--secondary))] ring-offset-2 ring-offset-[hsl(var(--surface-champagne))] dark:ring-offset-[hsl(var(--surface-alt))]" />
                                    )}
                                    {isSelected && (
                                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[hsl(var(--secondary))] flex items-center justify-center">
                                            <Check className="w-3 h-3 text-black" strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                                <span
                                    className={`font-luxury-sans text-[10px] sm:text-xs tracking-[0.18em] uppercase transition-colors duration-300 max-w-[88px] truncate ${isActive ? 'text-[hsl(var(--secondary))]' : 'text-[hsl(var(--foreground)/0.8)] group-hover:text-[hsl(var(--foreground))]'
                                        }`}
                                    title={value.name}
                                >
                                    {value.name}
                                </span>
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Editorial showcase */}
                <div className="max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step.facetKey + '-' + previewValue.id}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center"
                        >
                            {/* Visual */}

                            <div className="flex justify-center lg:justify-end">
                                <div className="relative w-44 h-44 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-full bg-linear-to-br from-[hsl(var(--surface-luxury))] via-[hsl(var(--card))] to-[hsl(var(--muted)/0.4)] flex items-center justify-center shadow-(--shadow-premium)">
                                    <div className="absolute inset-0 rounded-full ring-1 ring-[hsl(var(--secondary)/0.2)]" />

                                    {previewMeta.image ? (
                                        <Image
                                            src={previewMeta.image}
                                            alt={previewValue.name}
                                            width={220}
                                            height={220}
                                            className="w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 object-contain drop-shadow-2xl"
                                        />
                                    ) : (
                                        <div className="text-center px-6">
                                            <Sparkles className="w-10 h-10 mx-auto text-[hsl(var(--secondary))] mb-3" />
                                            <p className="font-luxury-serif text-3xl sm:text-4xl text-[hsl(var(--foreground))] capitalize leading-tight">
                                                {previewValue.name}
                                            </p>
                                            <p className="mt-2 font-luxury-sans text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--foreground)/0.6)]">
                                                {step.label}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 text-center lg:text-left">
                                <div className="space-y-1">
                                    <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] uppercase">
                                        {step.label}
                                    </span>
                                    <h3 className="font-luxury-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[hsl(var(--foreground))] capitalize leading-tight">
                                        {previewValue.name}
                                    </h3>
                                    <div className="h-px w-12 bg-[hsl(var(--secondary))] mx-auto lg:mx-0 mt-2" />
                                </div>

                                <p className="text-[hsl(var(--foreground)/0.8)] font-luxury-sans text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
                                    {previewMeta.description}
                                </p>

                                {previewMeta.traits && previewMeta.traits.length > 0 && (
                                    <ul className="space-y-1.5">
                                        {previewMeta.traits.map((trait) => (
                                            <li
                                                key={trait}
                                                className="flex items-center gap-3 justify-center lg:justify-start group"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--secondary))] shrink-0 group-hover:scale-150 transition-transform duration-300" />
                                                <span className="font-luxury-sans text-sm text-[hsl(var(--foreground)/0.85)]">
                                                    {trait}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="flex flex-col sm:flex-row gap-2 pt-2 justify-center lg:justify-start">
                                    <Link
                                        href={stepValueViewUrl}
                                        className="inline-flex items-center justify-center gap-2 border border-[hsl(var(--foreground)/0.25)] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] hover:border-[hsl(var(--primary))] px-6 py-3 text-xs tracking-[0.18em] uppercase font-light transition-all duration-400 cursor-pointer rounded-sm"
                                    >
                                        <Search className="w-3.5 h-3.5" />
                                        View {previewValue.name} Rings
                                    </Link>
                                    <button
                                        onClick={() => handleSelect(previewValue)}
                                        className={`inline-flex items-center justify-center gap-2 border px-6 py-3 text-xs tracking-[0.18em] uppercase font-medium transition-all duration-400 cursor-pointer rounded-sm ${selectedForStep?.valueId === previewValue.id
                                            ? 'border-[hsl(var(--secondary))] bg-[hsl(var(--secondary)/0.12)] text-[hsl(var(--secondary))]'
                                            : 'border-[hsl(var(--secondary))] text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))] hover:text-black'
                                            }`}
                                    >
                                        {selectedForStep?.valueId === previewValue.id ? (
                                            <>
                                                <Check className="w-3.5 h-3.5" />
                                                Selected
                                            </>
                                        ) : (
                                            <>
                                                Choose {previewValue.name}
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Inline actions — skip (always available) + clear (when a value is chosen) */}
                <div className="flex items-center justify-center gap-5 mt-5">
                    {selectedForStep && (
                        <button
                            type="button"
                            onClick={clearStep}
                            className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[hsl(var(--foreground)/0.7)] hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer"
                        >
                            <X className="w-3 h-3" />
                            Clear selection
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={goSkip}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[hsl(var(--foreground)/0.6)] hover:text-[hsl(var(--secondary))] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isLast ? 'Skip & See Ring' : 'Skip This Step'}
                        <ChevronsRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </section>
    );
}

interface CompletionScreenProps {
    matches: MatchSummary;
    selections: Record<string, Selection>;
    onReset: () => void;
    onExit: () => void;
}

function CompletionScreen({ matches, selections, onReset, onExit }: CompletionScreenProps) {
    const found = matches.totalItems > 0;
    const searchUrl = buildSearchUrl(selections);
    const mailto = buildMailto(selections);

    const summaryEntries = JOURNEY_FACET_ORDER
        .map(key => ({ key, sel: selections[key] }))
        .filter((e): e is { key: string; sel: Selection } => Boolean(e.sel));

    return (
        <section className="min-h-[86vh] py-10 sm:py-14 bg-[hsl(var(--card))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => { onReset(); onExit(); }}
                        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[hsl(var(--foreground)/0.65)] hover:text-[hsl(var(--foreground))] transition-colors mb-10 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Exit & Clear
                    </button>

                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-5">
                            <div className="h-px w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
                            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.35em] uppercase">
                                {found ? 'A Match Awaits' : 'A Ring To Be Made'}
                            </span>
                            <div className="h-px w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
                        </div>
                        <h2 className="font-luxury-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[hsl(var(--foreground))] leading-tight">
                            {found ? (
                                <>
                                    We Already Have{' '}
                                    <span className="italic text-[hsl(var(--secondary))]">Your Ring</span>
                                </>
                            ) : (
                                <>
                                    Let’s Craft This{' '}
                                    <span className="italic text-[hsl(var(--secondary))]">Together</span>
                                </>
                            )}
                        </h2>
                        <p className="mt-4 text-[hsl(var(--foreground)/0.75)] font-luxury-sans text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                            {found
                                ? `Your selections matched ${matches.totalItems} ring${matches.totalItems === 1 ? '' : 's'} in our atelier. Have a look — or send the brief to our jewellers if you’d still like a one-of-one.`
                                : 'Nothing in our current collection matches every detail — which means it deserves to be made by hand. Send your brief to our master jewellers and we’ll begin.'}
                        </p>
                    </div>

                    {/* Summary card */}
                    <div className="bg-[hsl(var(--card))] rounded-2xl shadow-(--shadow-elegant) p-8 sm:p-10 border border-[hsl(var(--border)/0.5)] mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-luxury-serif text-xl text-[hsl(var(--foreground))]">Your Brief</h3>
                            <button
                                onClick={onReset}
                                className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-[hsl(var(--foreground)/0.6)] hover:text-[hsl(var(--foreground))] transition-colors cursor-pointer"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Start Over
                            </button>
                        </div>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                            {summaryEntries.map(({ key, sel }) => (
                                <div key={key} className="flex items-baseline gap-3 border-b border-[hsl(var(--border)/0.4)] pb-3">
                                    <dt className="font-luxury-sans text-[10px] tracking-[0.25em] uppercase text-[hsl(var(--foreground)/0.6)] shrink-0">
                                        {getFacetLabel(key)}
                                    </dt>
                                    <dd className="ml-auto font-luxury-serif text-[hsl(var(--foreground))] text-base capitalize">
                                        {sel.valueName}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {/* Match preview grid */}
                    {found && matches.sample.length > 0 && (
                        <div className="mb-10">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                                {matches.sample.slice(0, 6).map((item) => (
                                    <Link
                                        key={item.slug}
                                        href={`/products/${item.slug}`}
                                        className="group relative aspect-square overflow-hidden rounded-md bg-[hsl(var(--muted)/0.4)] border border-[hsl(var(--border)/0.5)] transition-all hover:shadow-(--shadow-luxury)"
                                    >
                                        {item.preview ? (
                                            <Image
                                                src={item.preview}
                                                alt={item.name}
                                                fill
                                                sizes="(max-width: 640px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Sparkles className="w-8 h-8 text-[hsl(var(--foreground)/0.35)]" />
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3">
                                            <p className="text-xs font-luxury-sans text-white truncate">{item.name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {found && (
                            <Link
                                href={searchUrl}
                                className="flex-1 inline-flex items-center justify-center gap-2.5 border border-[hsl(var(--secondary))] text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))] hover:text-black py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-400 cursor-pointer"
                                style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
                            >
                                <Search className="w-4 h-4" />
                                View All {matches.totalItems} Match{matches.totalItems === 1 ? '' : 'es'}
                            </Link>
                        )}
                        <a
                            href={mailto}
                            className={`${found ? '' : 'flex-1'} inline-flex items-center justify-center gap-2.5 border ${found ? 'border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground)/0.3)]' : 'border-[hsl(var(--secondary))] text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))] hover:text-black'} px-6 py-3.5 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-400 cursor-pointer`}
                            style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
                        >
                            <Mail className="w-4 h-4" />
                            {found ? 'Have It Made One-Of-One' : 'Send Brief To Our Jewellers'}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
