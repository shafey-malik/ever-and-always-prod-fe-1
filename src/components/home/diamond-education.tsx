'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { ArrowRight } from 'lucide-react';

/**
 * "The 4Cs, Felt" — an interactive education panel.
 *
 * One faceted SVG diamond reflects all four Cs at once (cut → sparkle,
 * colour → warmth, clarity → inclusions, carat → size). Each tab reveals the
 * control + plain-language guidance for one C, so the visitor builds a diamond
 * and an understanding at the same time. Pure front-end, no assets required.
 */

const luxEase = [0.22, 1, 0.36, 1] as const;

const cutGrades = ['Fair', 'Good', 'Very Good', 'Excellent'];
const colorGrades = ['D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const clarityGrades = ['FL', 'IF', 'VVS', 'VS', 'SI', 'I1'];

const colorBand = (i: number) =>
  i <= 2 ? 'Colorless' : i <= 5 ? 'Near Colorless' : 'Faint Warmth';
const clarityLabel = ['Flawless', 'Internally Flawless', 'Very Very Slight', 'Very Slight', 'Slight Inclusions', 'Included'];

// Fixed facet positions (viewBox 120×128) — deterministic for SSR
const sparkPositions = [
  { x: 60, y: 33 },
  { x: 33, y: 47 },
  { x: 87, y: 47 },
  { x: 60, y: 58 },
];
const inclusionPositions = [
  { x: 52, y: 58 }, { x: 70, y: 64 }, { x: 44, y: 68 },
  { x: 63, y: 76 }, { x: 55, y: 86 }, { x: 48, y: 52 },
];

function Diamond({
  cut,
  color,
  clarity,
  carat,
}: {
  cut: number;
  color: number;
  clarity: number;
  carat: number;
}) {
  const scale = 0.62 + carat * 0.16;
  const tint = color * 0.045; // D = clear, K = warm
  const sparkles = cut + 1; // Fair → 1, Excellent → 4
  const sparkOpacity = 0.35 + cut * 0.2;
  const sparkDur = 3.4 - cut * 0.45; // better cut = livelier
  const inclusionCount = [0, 0, 1, 2, 4, 6][clarity];
  const inclusionOpacity = [0, 0, 0.18, 0.3, 0.45, 0.6][clarity];

  return (
    <svg viewBox="0 0 120 128" className="w-full h-full overflow-visible" role="img" aria-label="Interactive diamond preview">
      <defs>
        <linearGradient id="edu-facet" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#eef1f6" />
          <stop offset="100%" stopColor="#cdd5e0" />
        </linearGradient>
        <radialGradient id="edu-glow" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="hsl(43 70% 75%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(43 70% 75%)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g style={{ transform: `scale(${scale})`, transformOrigin: '60px 64px', transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' }}>
        {/* Halo glow behind */}
        <ellipse cx="60" cy="60" rx="58" ry="58" fill="url(#edu-glow)" />

        {/* Gem body */}
        <polygon points="44,26 76,26 104,50 60,108 16,50" fill="url(#edu-facet)" stroke="hsl(220 14% 70%)" strokeWidth="0.8" />

        {/* Colour tint overlay (same silhouette) */}
        <polygon points="44,26 76,26 104,50 60,108 16,50" fill="hsl(48 85% 55%)" style={{ opacity: tint, transition: 'opacity 0.5s ease' }} />

        {/* Facets */}
        <g stroke="hsl(220 16% 72%)" strokeWidth="0.7" fill="none" opacity="0.9">
          <line x1="16" y1="50" x2="104" y2="50" />
          <line x1="44" y1="26" x2="34" y2="50" />
          <line x1="76" y1="26" x2="86" y2="50" />
          <line x1="60" y1="26" x2="60" y2="50" />
          <line x1="34" y1="50" x2="60" y2="108" />
          <line x1="86" y1="50" x2="60" y2="108" />
          <line x1="60" y1="50" x2="60" y2="108" />
          <line x1="16" y1="50" x2="60" y2="108" />
          <line x1="104" y1="50" x2="60" y2="108" />
        </g>

        {/* Inclusions (clarity) */}
        {inclusionPositions.slice(0, inclusionCount).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="1.4" fill="hsl(220 25% 30%)" style={{ opacity: inclusionOpacity, transition: 'opacity 0.4s ease' }} />
        ))}

        {/* Sparkles (cut) */}
        {sparkPositions.slice(0, sparkles).map((p, i) => (
          <path
            key={i}
            d="M0 -5 L1.1 -1.1 L5 0 L1.1 1.1 L0 5 L-1.1 1.1 L-5 0 L-1.1 -1.1 Z"
            transform={`translate(${p.x} ${p.y})`}
            fill="#ffffff"
            className="animate-twinkle"
            style={{ opacity: sparkOpacity, ['--twinkle-duration' as string]: `${sparkDur}s`, animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </g>
    </svg>
  );
}

const tabs = [
  { id: 'cut', label: 'Cut', essence: 'The sparkle' },
  { id: 'color', label: 'Colour', essence: 'The warmth' },
  { id: 'clarity', label: 'Clarity', essence: 'The purity' },
  { id: 'carat', label: 'Carat', essence: 'The presence' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export function DiamondEducation() {
  const [active, setActive] = useState<TabId>('cut');
  const [cut, setCut] = useState(3);
  const [color, setColor] = useState(3);
  const [clarity, setClarity] = useState(3);
  const [carat, setCarat] = useState(1);

  const caratLabel = carat.toFixed(2).replace(/\.?0+$/, '');

  const copy: Record<TabId, { body: string; tip: string }> = {
    cut: {
      body: "Cut is how expertly a diamond is faceted — and it matters most. A precise cut sends light back to your eye as fire and brilliance; a poor one lets it leak away, leaving the stone dull regardless of its other qualities.",
      tip: 'Our advice: never compromise here. Prioritise Excellent or Very Good cut above all else.',
    },
    color: {
      body: "Colour grades how little of it a diamond has — from D (icy colourless) toward K (a faint warmth). The differences are subtle, and once set in a band, most are invisible to the naked eye.",
      tip: 'Sweet spot: G–H reads as colourless against the skin for a fraction of a D–F price.',
    },
    clarity: {
      body: "Clarity measures the tiny birthmarks — inclusions — formed as the diamond grew. Most are microscopic. A stone is 'eye-clean' when none are visible without magnification.",
      tip: 'Best value: VS1–VS2 is eye-clean to virtually everyone, without paying for flawless.',
    },
    carat: {
      body: "Carat is weight, not size alone — and price climbs steeply at the round numbers. A well-cut stone can also wear larger than its weight suggests.",
      tip: 'Insider move: choose just under a milestone (1.9ct, not 2.0) for a near-identical look and a real saving.',
    },
  };

  return (
    <section className="relative py-16 sm:py-24 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-72 bg-[hsl(var(--secondary)/0.05)] blur-3xl rounded-full" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
            <div className="h-px w-8 sm:w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase">
              Diamond Education
            </span>
            <div className="h-px w-8 sm:w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
          </div>
          <h2 className="font-luxury-serif text-[1.75rem] sm:text-5xl font-light text-[hsl(var(--foreground))] leading-[1.12] sm:leading-[1.02] tracking-normal sm:tracking-tight text-balance">
            Understand the{' '}
            <span className="italic font-light text-[hsl(var(--secondary-rich))]">Four Cs</span>
          </h2>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] font-luxury-sans text-[13px] sm:text-base max-w-[21rem] sm:max-w-lg mx-auto leading-relaxed font-light text-balance">
            The language every diamond is graded in. Adjust each below and watch
            the stone respond — knowledge you can see.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-10 sm:mb-14">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              aria-pressed={active === t.id}
              className={`group px-5 sm:px-7 py-3 rounded-full cursor-pointer transition-all duration-300 active:scale-95 ${
                active === t.id
                  ? 'bg-[hsl(var(--primary))] shadow-md'
                  : 'border border-[hsl(var(--border))] hover:border-[hsl(var(--secondary)/0.5)] bg-[hsl(var(--card))]'
              }`}
            >
              <span className={`block font-luxury-serif text-base sm:text-lg leading-none ${active === t.id ? 'text-[hsl(var(--secondary))]' : 'text-[hsl(var(--foreground))]'}`}>
                {t.label}
              </span>
              <span className={`block font-luxury-sans text-[9px] tracking-[0.2em] uppercase mt-1 ${active === t.id ? 'text-[hsl(var(--secondary)/0.7)]' : 'text-[hsl(var(--muted-foreground))]'}`}>
                {t.essence}
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* ── Live diamond ── */}
          <div className="order-1">
            <div className="relative mx-auto w-full max-w-sm aspect-square rounded-3xl bg-linear-to-br from-white via-[hsl(40,30%,98%)] to-[hsl(40,18%,93%)] shadow-(--shadow-elegant) overflow-hidden flex items-center justify-center">
              <div className="absolute inset-3 border border-[hsl(43,50%,55%,0.22)] rounded-2xl pointer-events-none" />
              <span className="pointer-events-none absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/60 to-transparent animate-glint" />

              <div className="relative w-3/5 h-3/5 animate-float-y" style={{ ['--float-duration' as string]: '6.5s' }}>
                <Diamond cut={cut} color={color} clarity={clarity} carat={carat} />
              </div>

              {/* Live grade chips */}
              <div className="absolute bottom-4 inset-x-4 flex flex-wrap justify-center gap-1.5">
                {[
                  `${cutGrades[cut]} cut`,
                  `Colour ${colorGrades[color]}`,
                  clarityGrades[clarity],
                  `${caratLabel} ct`,
                ].map((chip) => (
                  <span key={chip} className="rounded-full bg-white/75 backdrop-blur-md border border-white/60 px-3 py-1 font-luxury-sans text-[10px] tracking-[0.12em] uppercase text-[hsl(240,9%,15%)]/75">
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Control + copy ── */}
          <div className="order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: luxEase }}
              >
                {/* Cut */}
                {active === 'cut' && (
                  <ControlBlock title="Cut" subtitle={cutGrades[cut]}>
                    <GradePills options={cutGrades} value={cut} onChange={setCut} />
                  </ControlBlock>
                )}

                {/* Color */}
                {active === 'color' && (
                  <ControlBlock title="Colour" subtitle={`${colorGrades[color]} · ${colorBand(color)}`}>
                    <div className="flex items-center gap-5">
                      <Slider value={[color]} onValueChange={(v) => setColor(v[0])} min={0} max={colorGrades.length - 1} step={1} aria-label="Diamond colour grade" className="flex-1" />
                      <span className="font-luxury-serif text-2xl font-light text-[hsl(var(--lead-text))] w-9 text-center shrink-0">
                        {colorGrades[color]}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2 font-luxury-sans text-[9px] tracking-[0.15em] uppercase text-[hsl(var(--muted-foreground))]">
                      <span>D · Icy</span>
                      <span>K · Warm</span>
                    </div>
                  </ControlBlock>
                )}

                {/* Clarity */}
                {active === 'clarity' && (
                  <ControlBlock title="Clarity" subtitle={`${clarityGrades[clarity]} · ${clarityLabel[clarity]}`}>
                    <GradePills options={clarityGrades} value={clarity} onChange={setClarity} />
                  </ControlBlock>
                )}

                {/* Carat */}
                {active === 'carat' && (
                  <ControlBlock title="Carat" subtitle={`${caratLabel} ct`}>
                    <div className="flex items-center gap-5">
                      <Slider value={[carat]} onValueChange={(v) => setCarat(v[0])} min={0.25} max={3} step={0.25} aria-label="Carat weight" className="flex-1" />
                      <span className="font-luxury-serif text-2xl font-light text-[hsl(var(--lead-text))] w-16 text-right tabular-nums shrink-0">
                        {caratLabel} ct
                      </span>
                    </div>
                  </ControlBlock>
                )}

                {/* Copy */}
                <p className="mt-6 text-[hsl(var(--muted-foreground))] font-luxury-sans text-[13px] sm:text-[15px] leading-relaxed font-light">
                  {copy[active].body}
                </p>

                {/* Tip */}
                <div className="mt-5 flex items-start gap-3 rounded-xl border border-[hsl(var(--secondary)/0.3)] bg-[hsl(var(--secondary)/0.06)] px-4 py-3.5">
                  <span className="mt-0.5 w-1.5 h-1.5 rotate-45 bg-[hsl(var(--secondary))] shrink-0" />
                  <p className="font-luxury-sans text-[12px] sm:text-[13px] leading-relaxed text-[hsl(var(--foreground)/0.8)]">
                    {copy[active].tip}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Deepen / CTA */}
            <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href="/blog/diamond-cut-color-clarity-guide"
                className="group inline-flex items-center justify-center gap-2 font-luxury-sans text-[11px] tracking-[0.18em] uppercase text-[hsl(var(--foreground)/0.8)] border border-[hsl(var(--foreground)/0.2)] hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-rich))] px-6 py-3.5 rounded-sm transition-all duration-400"
              >
                Read the Full Guide
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center justify-center gap-2 font-luxury-sans text-[11px] tracking-[0.18em] uppercase text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300"
              >
                Shop Certified Diamonds
                <span className="text-[hsl(var(--secondary))]">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ControlBlock({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="font-luxury-serif text-2xl sm:text-3xl font-light text-[hsl(var(--foreground))]">
          {title}
        </h3>
        <span className="font-luxury-sans text-[11px] tracking-[0.18em] uppercase text-[hsl(var(--secondary-rich))]">
          {subtitle}
        </span>
      </div>
      {children}
    </div>
  );
}

function GradePills({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt, i) => (
        <button
          key={opt}
          type="button"
          aria-pressed={value === i}
          onClick={() => onChange(i)}
          className={`px-4 py-2.5 rounded-full font-luxury-sans text-xs tracking-[0.06em] cursor-pointer transition-all duration-300 active:scale-95 ${
            value === i
              ? 'bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] shadow-md'
              : 'border border-[hsl(var(--border))] text-[hsl(var(--foreground)/0.7)] hover:border-[hsl(var(--secondary)/0.5)] hover:text-[hsl(var(--foreground))] bg-[hsl(var(--card))]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
