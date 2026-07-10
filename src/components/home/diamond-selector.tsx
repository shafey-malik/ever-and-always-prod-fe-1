'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveImageSrc } from '@/lib/cloudinary';

/**
 * Thumbnail positions computed on a perfect hexagonal circle.
 *
 * Container: w-72 (288px) on mobile, w-96 (384px) on sm+.
 * Orbit radius: 46% of container (thumbnail centres at 46% from container centre).
 * Starting angle: –90° (12 o'clock), stepping +60° clockwise.
 *
 *   i  angle   cos       sin        left           top
 *   0  -90°    0        -1         50%             4%
 *   1  -30°    0.866   -0.5        89.8%           27%
 *   2   30°    0.866    0.5        89.8%           73%
 *   3   90°    0         1         50%             96%
 *   4  150°   -0.866    0.5        10.2%           73%
 *   5  210°   -0.866   -0.5        10.2%           27%
 *
 * translate(-50%, -50%) centres each button on its coordinate.
 */
const diamondTypes = [
  {
    id: 'round',
    name: 'Round',
    img: '/round.png',
    centralImg: '/round.png',
    position: { top: '4%', left: '50%' },        // 12 o'clock
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'princess',
    name: 'Princess',
    img: '/princess.png',
    centralImg: '/princess.png',
    position: { top: '27%', left: '89.8%' },    // 2 o'clock
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    img: '/emerald.png',
    centralImg: '/emerald.png',
    position: { top: '73%', left: '89.8%' },    // 4 o'clock
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'oval',
    name: 'Oval',
    img: '/oval.png',
    centralImg: '/oval.png',
    position: { top: '96%', left: '50%' },      // 6 o'clock
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'cushion',
    name: 'Cushion',
    img: '/cushion.png',
    centralImg: '/cushion.png',
    position: { top: '73%', left: '10.2%' },    // 8 o'clock
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'pear',
    name: 'Pear',
    img: '/pear.png',
    centralImg: '/pear.png',
    position: { top: '27%', left: '10.2%' },    // 10 o'clock
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
];

const diamondDescriptions: Record<string, { body: string; traits: string[] }> = {
  round: {
    body: 'The most popular diamond cut, known for its exceptional brilliance and fire. The round brilliant cut maximizes light return through its 58 facets.',
    traits: ['Maximum brilliance and sparkle', 'Timeless and classic appeal', 'Excellent for all ring styles'],
  },
  princess: {
    body: 'A modern square cut that combines the brilliance of a round with a contemporary geometric shape. Perfect for those who love clean lines.',
    traits: ['Modern and sophisticated', 'Brilliant sparkle', 'Great value proposition'],
  },
  emerald: {
    body: "A step-cut diamond featuring long, lean lines that create a hall-of-mirrors effect. Emphasizes clarity and showcases the diamond's natural beauty.",
    traits: ['Elegant hall-of-mirrors effect', 'Vintage-inspired glamour', 'Emphasizes diamond clarity'],
  },
  oval: {
    body: 'An elongated version of the round brilliant cut that offers similar sparkle while creating the illusion of greater size and elegant finger coverage.',
    traits: ['Elongated elegant appearance', 'Creates illusion of larger size', 'Flattering on all hand types'],
  },
  cushion: {
    body: 'A romantic cut with rounded corners and larger facets that create a soft, romantic glow. Perfect blend of old-world charm and modern brilliance.',
    traits: ['Romantic vintage appeal', 'Soft, pillow-like appearance', 'Excellent fire and brilliance'],
  },
  pear: {
    body: "A unique combination of round and marquise cuts, creating an elegant teardrop shape that's both classic and distinctive.",
    traits: ['Unique teardrop silhouette', 'Elongates the finger', 'Distinctive and eye-catching'],
  },
};

const getCollectionLink = (diamondId: string): string => {
  const collectionMap: Record<string, string> = {
    round: 'round-cut-diamond-rings',
    princess: 'princess-cut-diamond-rings',
    emerald: 'emerald-cut-diamond-rings',
    oval: 'oval-cut-diamond-rings',
    cushion: 'cushion-cut-diamond-rings',
    pear: 'pear-shaped-diamond-rings',
  };
  return `/collection/${collectionMap[diamondId] || 'round-cut-diamond-rings'}`;
};

export function DiamondSelector() {
  const [selectedDiamond, setSelectedDiamond] = useState('round');
  const [hoveredDiamond, setHoveredDiamond] = useState<string | null>(null);
  const [rippling, setRippling] = useState<string | null>(null);

  const activeDiamond = hoveredDiamond || selectedDiamond;
  const activeData = diamondTypes.find((d) => d.id === activeDiamond)!;
  const activeDesc = diamondDescriptions[activeDiamond];

  const handleSelect = (id: string) => {
    if (id === selectedDiamond) return;
    setSelectedDiamond(id);
    setRippling(id);
    setTimeout(() => setRippling(null), 700);
  };

  return (
    <section className="py-16 sm:py-24 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] relative overflow-hidden">

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] bg-[hsl(var(--secondary)/0.05)] blur-3xl rounded-full" />

      <div className="container mx-auto px-5 sm:px-6 relative z-10">

        {/* Section heading */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
            <div className="h-px w-8 sm:w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase">
              Discover
            </span>
            <div className="h-px w-8 sm:w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
          </div>
          <h2 className="font-luxury-serif text-[1.75rem] sm:text-5xl lg:text-6xl font-light text-[hsl(var(--foreground))] leading-[1.15] sm:leading-[1.05] tracking-normal sm:tracking-tight text-balance max-w-[18rem] sm:max-w-none mx-auto">
            Select Your{' '}
            <span className="italic font-light text-[hsl(var(--secondary-rich))]">Diamond</span>{' '}
            Cut
          </h2>
          <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2.5">
            <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary))]" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[hsl(var(--secondary))]" />
            <span className="w-1 h-1 rounded-full bg-[hsl(var(--secondary))]" />
          </div>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] font-luxury-sans text-[13px] sm:text-base max-w-[20rem] sm:max-w-lg mx-auto leading-relaxed font-light text-balance">
            Each cut reflects light differently, creating its own unique sparkle
            and character. Tap a shape to discover your perfect match.
          </p>
        </div>

        {/* Main layout: circle + info */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-10 sm:gap-16 lg:gap-20">

          {/* ── Circular selector ── */}
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 shrink-0 mx-auto lg:mx-0">

            {/* Spinning rings */}
            <div
              className="absolute inset-0 rounded-full border-2 border-[hsl(var(--secondary))] opacity-20 animate-spin"
              style={{ animationDuration: '20s' }}
            />
            <div
              className="absolute inset-4 rounded-full border border-[hsl(var(--secondary))] opacity-10 animate-spin"
              style={{ animationDuration: '30s', animationDirection: 'reverse' }}
            />
            <div className="absolute inset-8 rounded-full border border-[hsl(var(--secondary))] opacity-10" />

            {/* Central disc — always light so the diamond image is visible */}
            <div className="absolute inset-16 sm:inset-20 bg-linear-to-br from-white via-slate-50 to-slate-100 rounded-full shadow-2xl flex items-center justify-center ring-2 ring-[hsl(var(--secondary)/0.2)] overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-[hsl(var(--secondary)/0.08)] to-transparent" />
              {/* Image crossfades when selection changes */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDiamond}
                  initial={{ opacity: 0, scale: 0.75, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.75, rotate: 8 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10"
                >
                  <Image
                    src={resolveImageSrc(activeData.centralImg) || activeData.centralImg}
                    alt={activeData.name}
                    width={160}
                    height={160}
                    className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-lg"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Orbital thumbnail buttons */}
            {diamondTypes.map((diamond) => {
              const isSelected = selectedDiamond === diamond.id;
              const isHovered = hoveredDiamond === diamond.id;
              const isActive = isSelected || isHovered;
              const isRippling = rippling === diamond.id;

              return (
                <button
                  key={diamond.id}
                  onClick={() => handleSelect(diamond.id)}
                  onMouseEnter={() => setHoveredDiamond(diamond.id)}
                  onMouseLeave={() => setHoveredDiamond(null)}
                  className={`absolute w-14 h-14 sm:w-20 sm:h-20 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer ${isActive ? 'z-50' : 'z-10'
                    }`}
                  style={{
                    top: diamond.position.top,
                    left: diamond.position.left,
                    transform: isActive
                      ? 'translate(-50%, -50%) scale(1.2)'
                      : 'translate(-50%, -50%)',
                  }}
                >
                  {/* Ripple ring — expands outward on click */}
                  <AnimatePresence>
                    {isRippling && (
                      <motion.span
                        key="ripple"
                        className={`absolute inset-0 rounded-full bg-linear-to-br ${diamond.color} pointer-events-none`}
                        initial={{ scale: 1, opacity: 0.7 }}
                        animate={{ scale: 3, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Pulse glow behind active button */}
                  {isActive && (
                    <div
                      className={`absolute inset-0 rounded-full blur-md opacity-60 animate-pulse bg-linear-to-br ${diamond.color}`}
                    />
                  )}

                  {/* Button face — white bg keeps black images visible; gold gradient when active */}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive
                        ? `bg-linear-to-br ${diamond.color} shadow-2xl`
                        : 'bg-white shadow-lg hover:shadow-xl border border-[hsl(var(--secondary)/0.18)]'
                      }`}
                  />

                  {/* Diamond shape image */}
                  <Image
                    src={resolveImageSrc(diamond.img) || diamond.img}
                    alt={diamond.name}
                    width={48}
                    height={48}
                    className={`w-8 h-8 sm:w-12 sm:h-12 object-contain relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'hover:scale-110'
                      }`}
                  />

                  {/* Tooltip — appears above the button */}
                  <span
                    className={`absolute bottom-full mb-2 sm:mb-3 px-3 py-1.5 bg-linear-to-r ${diamond.color} text-[hsl(var(--foreground))] text-xs sm:text-sm font-luxury-sans font-semibold rounded-lg whitespace-nowrap shadow-xl pointer-events-none transition-all duration-200 z-20 ${isHovered
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-2'
                      }`}
                  >
                    {diamond.name}
                  </span>

                  {/* Selection ring */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-full ring-2 ring-[hsl(var(--secondary))] ring-offset-2 ring-offset-[hsl(var(--surface-champagne))] dark:ring-offset-[hsl(var(--surface-alt))]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Info panel ── */}
          <div className="max-w-md w-full space-y-6 sm:space-y-8 text-center lg:text-left px-2 sm:px-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDiamond}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6 sm:space-y-8"
              >
                <div className="space-y-3">
                  <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] uppercase">
                    Featured Cut
                  </span>
                  <h3 className="font-luxury-serif text-[2rem] sm:text-4xl lg:text-5xl font-light text-[hsl(var(--foreground))] capitalize leading-tight">
                    {activeData.name}
                  </h3>
                  <div className="h-px w-16 sm:w-20 bg-linear-to-r from-[hsl(var(--secondary))] to-transparent mx-auto lg:mx-0" />
                </div>

                <div className="space-y-5 text-[hsl(var(--muted-foreground))] font-luxury-sans">
                  <p className="text-[13px] sm:text-base leading-relaxed font-light">
                    {activeDesc.body}
                  </p>
                  <ul className="space-y-3 text-[13px] sm:text-sm">
                    {activeDesc.traits.map((trait) => (
                      <li
                        key={trait}
                        className="flex items-center gap-3 justify-center lg:justify-start group"
                      >
                        <span className="w-1.5 h-1.5 rotate-45 bg-[hsl(var(--secondary))] shrink-0 group-hover:scale-150 transition-transform duration-300" />
                        <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={getCollectionLink(selectedDiamond)} className="inline-block w-full sm:w-auto">
                  <button className="group/btn inline-flex items-center justify-center w-full sm:w-auto border border-[hsl(var(--foreground)/0.2)] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] hover:text-black hover:border-[hsl(var(--secondary))] px-7 sm:px-8 py-3.5 sm:py-3 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-light transition-all duration-500 cursor-pointer rounded-sm">
                    View {activeData.name} Collection
                    <span className="ml-3 text-[hsl(var(--secondary))] group-hover/btn:text-black transition-all duration-500 group-hover/btn:translate-x-1">→</span>
                  </button>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
