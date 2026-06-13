'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gem,
  Sparkles,
  Eye,
  BadgeCheck,
  Ruler,
  Leaf,
  Sun,
  Scale,
  Palette,
  LayoutGrid,
} from 'lucide-react';

/**
 * Product-specific diamond education. Reads the product's own facet values
 * (from both the product and its variants) and renders an interactive,
 * illustrated explainer for each attribute — turning a bare spec list into
 * something a buyer actually understands. Pure front-end.
 */

interface FacetValue {
  id: string;
  name: string;
  code: string;
  facet: { id: string; name: string; code: string };
}

interface ProductDiamondGuideProps {
  facetValues: readonly FacetValue[];
}

const luxEase = [0.22, 1, 0.36, 1] as const;

// The catalog uses two parallel facet vocabularies — a detailed one and a
// short taxonomy. Fold the short codes into their detailed equivalents.
const FACET_ALIAS: Record<string, string> = {
  shape: 'diamond-shape',
  metal: 'metal-type',
  style: 'setting-style',
};

// Order the spec cards appear in; only these facets get a card
const FACET_ORDER = [
  'diamond-shape',
  'carat-weight',
  'cut-quality',
  'diamond-color',
  'diamond-clarity',
  'metal-type',
  'setting-style',
  'diamond-type',
  'type',
  'certification',
  'fluorescence',
  'polish',
  'symmetry',
  'band-width',
];

const SHAPE_IMAGES: Record<string, string> = {
  round: '/round.png',
  princess: '/princess.png',
  oval: '/oval.png',
  cushion: '/cushion.png',
  emerald: '/emerald.png',
  pear: '/pear.png',
};

const COLORLESS = ['d', 'e', 'f', 'g', 'h', 'i', 'j'];

type Spec = {
  facetCode: string;
  label: string;
  value: string; // display value (may list several)
  values: string[]; // distinct raw values
  body: string;
  scale?: { items: string[]; active: string; lowLabel: string; highLabel: string };
};

const norm = (s: string) => s.trim().toLowerCase();

function humanList(values: string[]): string {
  const v = values.map((x) => x.toLowerCase());
  if (v.length === 1) return v[0];
  if (v.length === 2) return `${v[0]} and ${v[1]}`;
  return `${v.slice(0, -1).join(', ')} and ${v[v.length - 1]}`;
}

function buildSpec(facetCode: string, values: string[]): Spec | null {
  const primary = values[0];
  const v = norm(primary);
  const multi = values.length > 1;
  const display = multi ? values.join(' · ') : primary;

  switch (facetCode) {
    case 'diamond-shape': {
      const map: Record<string, string> = {
        round: 'The round brilliant is cut to a precise formula across 58 facets — the most efficient shape for returning light. It is the benchmark for fire and the most enduring choice of all.',
        princess: 'A modern square cut with sharp corners and brilliant faceting. It offers contemporary geometry with sparkle close to a round, often at gentler pricing.',
        oval: 'An elongated brilliant that wears larger than its weight and lengthens the finger — all the fire of a round, in a softer, more distinctive silhouette.',
        cushion: 'Rounded corners and large facets give the cushion a soft, pillow-like glow — a romantic, vintage-leaning cut that scatters light beautifully.',
        emerald: 'A step cut with long, parallel facets creating a clear "hall of mirrors" rather than sparkle. Quiet, architectural elegance that rewards a clean stone.',
        pear: 'A teardrop marrying the round and the marquise — distinctive and elongating. Worn point-to-hand, it gracefully slims the finger.',
        radiant: 'Brilliant faceting in a trimmed-corner rectangle — the sparkle of a round with the shape of an emerald. Lively, characterful and forgiving.',
        asscher: 'A square step cut with deep, concentric facets and cropped corners — distinctly art-deco, prized for its mesmerising depth.',
        marquise: 'A regal, boat-shaped cut that maximises apparent size and elongates the hand. Few shapes look larger for their carat weight.',
        heart: 'The most romantic cut of all — a brilliant rendered as a heart. It demands masterful symmetry and makes an unmistakable statement.',
      };
      return { facetCode, label: 'Shape', value: display, values, body: map[v] ?? 'The outline and facet pattern of the diamond — the first thing the eye reads, and a reflection of personal taste.' };
    }

    case 'carat-weight':
      return {
        facetCode,
        label: 'Carat',
        value: display,
        values,
        body: 'Carat is the diamond\'s weight, and its presence on the hand. Price climbs steeply at the round numbers, so a precisely cut stone just under a milestone can look all but identical for meaningfully less.',
      };

    case 'cut-quality': {
      const map: Record<string, string> = {
        excellent: 'Excellent — the top tier. Light enters and returns almost completely for maximum brilliance and fire. Cut is where quality is most visible, and this is the best of it.',
        'very good': 'Very Good — captures nearly all the brilliance of an Excellent cut, usually at better value. To the naked eye, the difference is subtle.',
        good: 'Good — a sound, well-performing cut that still sparkles, balancing beauty with budget.',
      };
      return {
        facetCode, label: 'Cut', value: display, values,
        body: map[v] ?? 'Cut is the craftsmanship of the stone — how its angles return light to your eye. It matters more than any other factor.',
        scale: { items: ['Good', 'Very Good', 'Excellent'], active: primary, lowLabel: 'Good', highLabel: 'Excellent' },
      };
    }

    case 'diamond-color': {
      const isColorless = COLORLESS.includes(v);
      if (!isColorless) {
        return { facetCode, label: 'Colour', value: primary.toUpperCase(), values, body: 'A fancy-colour diamond — here, colour is the prize rather than its absence. Graded by the intensity of their hue, these stones are far rarer than colourless diamonds.' };
      }
      let body: string;
      if (['d', 'e', 'f'].includes(v)) body = `${primary.toUpperCase()} sits in the colourless range — the rarest and purest grades, with no detectable tint.`;
      else if (['g', 'h'].includes(v)) body = `${primary.toUpperCase()} is near-colourless and the connoisseur's value sweet spot — it faces up white against the skin for a fraction of a D.`;
      else body = `${primary.toUpperCase()} is near-colourless with a barely-warm cast that all but disappears in yellow or rose gold.`;
      return {
        facetCode, label: 'Colour', value: primary.toUpperCase(), values, body,
        scale: { items: ['D', 'E', 'F', 'G', 'H', 'I', 'J'], active: primary.toUpperCase(), lowLabel: 'Warm', highLabel: 'Icy' },
      };
    }

    case 'diamond-clarity': {
      const map: Record<string, string> = {
        fl: 'Flawless — no inclusions or blemishes under 10× magnification. Exceptionally rare and pristine.',
        if: 'Internally Flawless — no inclusions inside the stone under 10× magnification. Pristine and rare.',
        vvs1: 'Very, Very Slightly Included — inclusions so minute they challenge even an expert. Effectively perfect to the eye.',
        vvs2: 'Very, Very Slightly Included — microscopic inclusions, invisible without magnification.',
        vs1: 'Very Slightly Included — minor inclusions, invisible to the naked eye. A smart balance of purity and value.',
        vs2: 'Very Slightly Included — tiny inclusions, eye-clean to virtually everyone. The value-minded sweet spot.',
      };
      const cleanKey = v.split(',')[0].trim().replace(/\s+/g, '');
      return {
        facetCode, label: 'Clarity', value: display, values,
        body: map[cleanKey] ?? 'Clarity describes the tiny natural birthmarks formed as the diamond grew. This stone is eye-clean — any inclusions are invisible without magnification.',
        scale: { items: ['FL', 'IF', 'VVS', 'VS', 'SI'], active: cleanKey.replace(/[12]/g, '').toUpperCase(), lowLabel: 'Included', highLabel: 'Flawless' },
      };
    }

    case 'metal-type': {
      if (multi) {
        return {
          facetCode, label: 'Metal', value: display, values,
          body: `Offered in ${humanList(values)}. The metal sets the ring's tone — its colour and warmth shape how the diamond reads against the skin, and how the piece will wear over a lifetime.`,
        };
      }
      let body: string;
      if (v.includes('platinum')) body = 'Platinum — the rarest and most enduring precious metal. Naturally white, hypoallergenic, and dense enough to hold a diamond securely for generations.';
      else if (v.includes('white')) body = 'White Gold — gold alloyed and finished to a bright, cool white that makes diamonds look whiter still. Classic and endlessly versatile.';
      else if (v.includes('rose')) body = 'Rose Gold — copper-warmed gold with a romantic blush. Modern, flattering on many skin tones, and quietly distinctive.';
      else if (v.includes('yellow')) body = 'Yellow Gold — the timeless, warm choice. Its richness flatters warmer diamond colours and never falls out of fashion.';
      else if (v.includes('two')) body = 'Two-Tone — two metals combined for contrast and depth, letting the band and the stone each stand apart.';
      else body = 'The metal sets the tone — its colour and warmth shape how the diamond reads against the skin.';
      const karat = v.includes('18k') ? ' At 18k, the alloy is purer and richer in colour.' : v.includes('14k') ? ' At 14k, the alloy is harder and more scratch-resistant — ideal for daily wear.' : v.includes('10k') ? ' At 10k, the alloy is the most durable and affordable.' : '';
      return { facetCode, label: 'Metal', value: display, values, body: body + karat };
    }

    case 'setting-style': {
      const map: Record<string, string> = {
        'pavé bands': 'Pavé — tiny diamonds set close along the band so the metal all but disappears, and the whole ring shimmers.',
        pave: 'Pavé — tiny diamonds set close along the band so the metal all but disappears, and the whole ring shimmers.',
        pavé: 'Pavé — tiny diamonds set close along the band so the metal all but disappears, and the whole ring shimmers.',
        halo: 'Halo — a ring of smaller diamonds encircling the centre stone, making it look larger and amplifying its sparkle.',
        'channel set bands': 'Channel Set — stones held flush within a smooth metal channel. Sleek, snag-free and secure for everyday wear.',
        'bezel set bands': 'Bezel Set — a rim of metal wraps each stone completely. The most protective setting, with a clean, modern line.',
        'bar set bands': 'Bar Set — vertical metal bars separate the stones, holding them firmly while letting light enter from the sides.',
        'flush set bands': 'Flush Set — stones sunk level with the band\'s surface. Understated, durable, and smooth to the touch.',
      };
      return { facetCode, label: 'Setting', value: display, values, body: map[v] ?? 'The setting is how the diamonds are held — shaping both their security and the way they catch the light.' };
    }

    case 'diamond-type':
      if (v.includes('lab')) return { facetCode, label: 'Origin', value: display, values, body: 'Lab-Grown — chemically and optically identical to a mined diamond, grown in weeks rather than eons. The same brilliance and hardness, with a smaller footprint and a kinder price.' };
      return { facetCode, label: 'Origin', value: display, values, body: 'Natural — formed over billions of years deep within the earth. Prized for its rarity and the story it carries.' };

    case 'type': {
      const map: Record<string, string> = {
        'engagement ring': 'An engagement ring — traditionally given at a proposal and built around a centre diamond meant to be admired for a lifetime.',
        'wedding band': 'A wedding band — the ring exchanged at the ceremony. Designed to sit flush against an engagement ring or to stand beautifully on its own.',
        'tennis bracelet': 'A tennis bracelet — a continuous line of matched diamonds in a flexible, secure in-line setting. Understated brilliance for the wrist.',
      };
      return { facetCode, label: 'Designed As', value: display, values, body: map[v] ?? 'The kind of piece this is, and the moment it is made for.' };
    }

    case 'certification': {
      const map: Record<string, string> = {
        gia: 'GIA — the Gemological Institute of America, the world\'s most trusted and consistent grading authority.',
        igi: 'IGI — the International Gemological Institute, widely respected and especially prevalent for lab-grown diamonds.',
        egl: 'EGL — the European Gemological Laboratory, a long-established international grading body.',
      };
      return { facetCode, label: 'Certified by', value: display, values, body: map[v] ?? 'An independent laboratory has graded this diamond, so its quality is verified — not merely claimed.' };
    }

    case 'fluorescence': {
      const map: Record<string, string> = {
        none: 'None — no reaction under UV light. The most prized, especially at higher colour grades.',
        faint: 'Faint — a whisper of fluorescence, undetectable in everyday light.',
        medium: 'Medium — a gentle UV glow that can make a warmer diamond appear a touch whiter, and rarely affects daylight appearance.',
        strong: 'Strong — a pronounced UV glow that can lend warmer stones a whiter look; its effect in daylight varies stone to stone.',
      };
      return {
        facetCode, label: 'Fluorescence', value: display, values,
        body: map[v] ?? 'How the diamond glows under UV light — usually faint and harmless, occasionally even flattering.',
        scale: { items: ['None', 'Faint', 'Medium', 'Strong'], active: primary, lowLabel: 'None', highLabel: 'Strong' },
      };
    }

    case 'polish':
    case 'symmetry': {
      const label = facetCode === 'polish' ? 'Polish' : 'Symmetry';
      const detail = v === 'excellent' ? 'flawless finishing that lets light travel uninterrupted.' : v === 'very good' ? 'finishing so refined any deviation is invisible to the eye.' : 'sound finishing that performs well in everyday light.';
      const lead = facetCode === 'polish' ? 'how smooth the facet surfaces are' : 'how precisely the facets align';
      return {
        facetCode, label, value: display, values,
        body: `${label} is a finishing mark of the cutter's craft — ${lead}. ${primary}: ${detail}`,
        scale: { items: ['Good', 'Very Good', 'Excellent'], active: primary, lowLabel: 'Good', highLabel: 'Excellent' },
      };
    }

    case 'band-width':
      return { facetCode, label: 'Band Width', value: display, values, body: 'Band width shapes the ring\'s proportions on the hand — slimmer for delicate elegance, wider for presence and a reassuring, substantial weight.' };

    default:
      return null;
  }
}

function facetIcon(code: string) {
  const cls = 'w-5 h-5';
  switch (code) {
    case 'cut-quality': return <Sparkles className={cls} strokeWidth={1.5} />;
    case 'diamond-color': return <Palette className={cls} strokeWidth={1.5} />;
    case 'diamond-clarity': return <Eye className={cls} strokeWidth={1.5} />;
    case 'setting-style': return <LayoutGrid className={cls} strokeWidth={1.5} />;
    case 'certification': return <BadgeCheck className={cls} strokeWidth={1.5} />;
    case 'fluorescence': return <Sun className={cls} strokeWidth={1.5} />;
    case 'polish':
    case 'symmetry': return <Scale className={cls} strokeWidth={1.5} />;
    case 'band-width': return <Ruler className={cls} strokeWidth={1.5} />;
    case 'diamond-type': return <Leaf className={cls} strokeWidth={1.5} />;
    default: return <Gem className={cls} strokeWidth={1.5} />;
  }
}

function metalSwatch(name: string): string {
  const v = norm(name);
  if (v.includes('rose')) return 'linear-gradient(135deg, #fae3d9 0%, #e8b09a 55%, #cd8a70 100%)';
  if (v.includes('yellow')) return 'linear-gradient(135deg, #f9ecc8 0%, #e3c16f 55%, #c79b3b 100%)';
  if (v.includes('two')) return 'linear-gradient(135deg, #f4f5f7 0%, #f4f5f7 49%, #e3c16f 51%, #e3c16f 100%)';
  return 'linear-gradient(135deg, #f6f7f9 0%, #c8ced7 55%, #9aa3b2 100%)';
}

function Visual({ spec }: { spec: Spec }) {
  if (spec.facetCode === 'diamond-shape') {
    const img = SHAPE_IMAGES[norm(spec.values[0])];
    if (img) {
      return (
        <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-white via-slate-50 to-slate-200 shadow-inner flex items-center justify-center ring-1 ring-[hsl(var(--secondary)/0.2)]">
          <Image src={img} alt={spec.values[0]} width={64} height={64} className="w-14 h-14 object-contain drop-shadow" />
        </div>
      );
    }
  }
  if (spec.facetCode === 'metal-type') {
    if (spec.values.length > 1) {
      return (
        <div className="flex items-center justify-center -space-x-3">
          {spec.values.slice(0, 3).map((m) => (
            <span key={m} className="w-12 h-12 rounded-full shadow-md ring-2 ring-[hsl(var(--card))]" style={{ background: metalSwatch(m) }} />
          ))}
        </div>
      );
    }
    return <div className="w-24 h-24 rounded-full shadow-md ring-1 ring-[hsl(var(--secondary)/0.25)]" style={{ background: metalSwatch(spec.values[0]) }} />;
  }
  if (spec.facetCode === 'carat-weight') {
    return (
      <div className="relative w-24 h-24 rounded-full bg-linear-to-br from-white via-slate-50 to-slate-200 shadow-inner flex items-center justify-center ring-1 ring-[hsl(var(--secondary)/0.2)]">
        <span className="font-luxury-serif font-light text-xl text-[hsl(var(--lead-text))] leading-none text-center px-1">{spec.values[0]}</span>
      </div>
    );
  }
  return (
    <div className="w-24 h-24 rounded-full bg-[hsl(var(--secondary)/0.1)] flex items-center justify-center ring-1 ring-[hsl(var(--secondary)/0.25)] text-[hsl(var(--secondary-rich))]">
      <span className="scale-[1.7]">{facetIcon(spec.facetCode)}</span>
    </div>
  );
}

function GradeScale({ items, active, lowLabel, highLabel }: NonNullable<Spec['scale']>) {
  const activeNorm = norm(active);
  return (
    <div className="mt-5">
      <div className="flex gap-1.5">
        {items.map((item) => {
          const on = norm(item) === activeNorm;
          return (
            <div key={item} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`h-1.5 w-full rounded-full transition-colors duration-300 ${on ? 'bg-[hsl(var(--secondary))]' : 'bg-[hsl(var(--border))]'}`} />
              <span className={`font-luxury-sans text-[9px] sm:text-[10px] tracking-wide transition-colors duration-300 ${on ? 'text-[hsl(var(--secondary-rich))] font-semibold' : 'text-[hsl(var(--muted-foreground))]'}`}>
                {item}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 font-luxury-sans text-[9px] tracking-[0.15em] uppercase text-[hsl(var(--muted-foreground))]">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
}

export function ProductDiamondGuide({ facetValues }: ProductDiamondGuideProps) {
  const specs = useMemo(() => {
    // Collect distinct values per facet, folding short codes into detailed ones
    const byFacet = new Map<string, string[]>();
    for (const fv of facetValues) {
      const raw = fv.facet?.code;
      if (!raw) continue;
      const code = FACET_ALIAS[raw] ?? raw;
      const list = byFacet.get(code) ?? [];
      if (!list.some((x) => norm(x) === norm(fv.name))) list.push(fv.name);
      byFacet.set(code, list);
    }
    const out: Spec[] = [];
    for (const code of FACET_ORDER) {
      const values = byFacet.get(code);
      if (!values || values.length === 0) continue;
      const spec = buildSpec(code, values);
      if (spec) out.push(spec);
    }
    return out;
  }, [facetValues]);

  const [active, setActive] = useState(0);

  if (specs.length === 0) return null;

  const current = specs[Math.min(active, specs.length - 1)];

  return (
    <section className="relative py-16 sm:py-24 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[44rem] h-64 bg-[hsl(var(--secondary)/0.05)] blur-3xl rounded-full" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative max-w-5xl">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 sm:w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase">
              Know This Piece
            </span>
            <div className="h-px w-8 sm:w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
          </div>
          <h2 className="font-luxury-serif text-[1.6rem] sm:text-4xl font-light text-[hsl(var(--foreground))] leading-tight tracking-tight text-balance">
            The Anatomy of{' '}
            <span className="italic font-light text-[hsl(var(--secondary-rich))]">This Piece</span>
          </h2>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] font-luxury-sans text-[13px] sm:text-base max-w-[21rem] sm:max-w-lg mx-auto leading-relaxed font-light text-balance">
            Every detail of this piece, in plain language. Tap any spec to learn
            what it means and why it matters.
          </p>
        </div>

        {/* Spec chips */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5 mb-8 sm:mb-10">
          {specs.map((s, i) => {
            const chipValue = s.values.length > 1 ? `${s.values.length} options` : s.value;
            return (
              <button
                key={s.facetCode}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={active === i}
                className={`group flex items-center gap-2 pl-2.5 pr-4 py-2 rounded-full cursor-pointer transition-all duration-300 active:scale-95 ${
                  active === i
                    ? 'bg-[hsl(var(--primary))] shadow-md'
                    : 'bg-[hsl(var(--card))] border border-[hsl(var(--border))] hover:border-[hsl(var(--secondary)/0.5)]'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center ${active === i ? 'text-[hsl(var(--secondary))]' : 'text-[hsl(var(--secondary-rich))]'}`}>
                  <span className="scale-75">{facetIcon(s.facetCode)}</span>
                </span>
                <span className="text-left leading-none">
                  <span className={`block font-luxury-sans text-[8px] tracking-[0.18em] uppercase ${active === i ? 'text-[hsl(var(--secondary)/0.7)]' : 'text-[hsl(var(--muted-foreground))]'}`}>
                    {s.label}
                  </span>
                  <span className={`block font-luxury-sans text-xs font-medium mt-0.5 ${active === i ? 'text-[hsl(var(--secondary))]' : 'text-[hsl(var(--foreground))]'}`}>
                    {chipValue}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="bg-[hsl(var(--card))] rounded-2xl border border-[hsl(var(--border))] shadow-(--shadow-card) overflow-hidden">
          <div className="h-px bg-linear-to-r from-transparent via-[hsl(var(--secondary)/0.5)] to-transparent" />
          <AnimatePresence mode="wait">
            <motion.div
              key={current.facetCode}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: luxEase }}
              className="p-6 sm:p-9 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-9"
            >
              {/* Visual */}
              <div className="shrink-0">
                <Visual spec={current} />
              </div>

              {/* Text */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <span className="font-luxury-sans text-[10px] tracking-[0.28em] uppercase text-[hsl(var(--secondary))]">
                  {current.label}
                </span>
                <h3 className="mt-1.5 font-luxury-serif text-2xl sm:text-3xl font-light text-[hsl(var(--foreground))] leading-tight">
                  {current.value}
                </h3>
                <p className="mt-3.5 text-[hsl(var(--muted-foreground))] font-luxury-sans text-[13px] sm:text-[15px] leading-relaxed font-light">
                  {current.body}
                </p>
                {current.scale && <GradeScale {...current.scale} />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
