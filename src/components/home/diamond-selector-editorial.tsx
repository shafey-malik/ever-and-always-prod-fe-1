'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const diamondTypes = [
  {
    id: 'round',
    name: 'Round',
    img: '/round.png',
    centralImg: '/round.png',
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'princess',
    name: 'Princess',
    img: '/princess.png',
    centralImg: '/princess.png',
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    img: '/emerald.png',
    centralImg: '/emerald.png',
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'oval',
    name: 'Oval',
    img: '/oval.png',
    centralImg: '/oval.png',
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'cushion',
    name: 'Cushion',
    img: '/cushion.png',
    centralImg: '/cushion.png',
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'pear',
    name: 'Pear',
    img: '/pear.png',
    centralImg: '/pear.png',
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

const stripContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const stripItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

export function DiamondSelectorEditorial() {
  const [selectedDiamond, setSelectedDiamond] = useState('round');
  const [hoveredDiamond, setHoveredDiamond] = useState<string | null>(null);
  const shouldReduce = useReducedMotion();

  const activeDiamond = hoveredDiamond || selectedDiamond;
  const activeData = diamondTypes.find((d) => d.id === activeDiamond)!;
  const activeDesc = diamondDescriptions[activeDiamond];

  return (
    <section className="py-20 sm:py-28 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">

        {/* Section heading */}
        <div className="text-center mb-14 sm:mb-20">
          <h2 className="font-luxury-serif text-3xl sm:text-5xl lg:text-6xl font-light text-[hsl(var(--foreground))] leading-tight">
            Select Your{' '}
            <span className="italic text-[hsl(var(--secondary))]">Diamond</span>{' '}
            Cut
          </h2>
          <p className="mt-4 text-[hsl(var(--muted-foreground))] font-luxury-sans text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Each cut reflects light differently, creating its own unique sparkle and character.
          </p>
        </div>

        {/* Cut selection strip */}
        <motion.div
          className="flex items-center justify-center gap-3 sm:gap-5 lg:gap-8 mb-16 sm:mb-20 flex-wrap"
          variants={stripContainer}
          initial={shouldReduce ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {diamondTypes.map((diamond) => {
            const isActive = diamond.id === (hoveredDiamond || selectedDiamond);
            const isSelected = diamond.id === selectedDiamond;

            return (
              <motion.button
                key={diamond.id}
                variants={stripItem}
                onClick={() => setSelectedDiamond(diamond.id)}
                onMouseEnter={() => setHoveredDiamond(diamond.id)}
                onMouseLeave={() => setHoveredDiamond(null)}
                className="flex flex-col items-center gap-2.5 group cursor-pointer"
              >
                {/* Thumbnail circle */}
                <div
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center transition-all duration-400 ${isActive
                    ? 'bg-linear-to-br from-[hsl(var(--secondary)/0.18)] to-[hsl(var(--secondary-rich)/0.08)] shadow-[0_0_0_1.5px_hsl(var(--secondary)/0.7),0_8px_24px_-4px_hsl(var(--secondary)/0.25)] scale-105'
                    : 'bg-[hsl(var(--muted)/0.5)] shadow-(--shadow-card) hover:shadow-(--shadow-luxury)'
                    }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                >
                  <Image
                    src={diamond.img}
                    alt={diamond.name}
                    width={56}
                    height={56}
                    className={`w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 object-contain transition-all duration-400 ${isActive ? 'drop-shadow-lg scale-110' : ''
                      }`}
                  />
                  {isSelected && (
                    <div className="absolute inset-0 rounded-full ring-2 ring-[hsl(var(--secondary))] ring-offset-2 ring-offset-[hsl(var(--surface-champagne))] dark:ring-offset-[hsl(var(--surface-alt))]" />
                  )}
                </div>

                {/* Cut name */}
                <span
                  className={`font-luxury-sans text-[10px] sm:text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${isActive ? 'text-[hsl(var(--secondary))]' : 'text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]'
                    }`}
                >
                  {diamond.name}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Showcase — editorial split: large image left, info right */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDiamond}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              {/* Large diamond image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full bg-linear-to-br from-[hsl(var(--surface-luxury))] via-[hsl(var(--card))] to-[hsl(var(--muted)/0.4)] flex items-center justify-center shadow-(--shadow-premium)">
                  <div className="absolute inset-0 rounded-full ring-1 ring-[hsl(var(--secondary)/0.2)]" />
                  <Image
                    src={activeData.centralImg}
                    alt={activeData.name}
                    width={220}
                    height={220}
                    className="w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Cut info */}
              <div className="space-y-6 text-center lg:text-left">
                <div className="space-y-2">
                  <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] uppercase">
                    Featured Cut
                  </span>
                  <h3 className="font-luxury-serif text-4xl sm:text-5xl lg:text-6xl font-light text-[hsl(var(--foreground))] capitalize leading-tight">
                    {activeData.name}
                  </h3>
                  <div className="h-px w-16 bg-[hsl(var(--secondary))] mx-auto lg:mx-0 mt-3" />
                </div>

                <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-sm sm:text-base leading-relaxed max-w-sm mx-auto lg:mx-0">
                  {activeDesc.body}
                </p>

                <ul className="space-y-2.5">
                  {activeDesc.traits.map((trait) => (
                    <li key={trait} className="flex items-center gap-3 justify-center lg:justify-start group">
                      <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--secondary))] flex-shrink-0 group-hover:scale-150 transition-transform duration-300" />
                      <span className="font-luxury-sans text-sm text-[hsl(var(--foreground)/0.75)]">{trait}</span>
                    </li>
                  ))}
                </ul>

                <Link href={getCollectionLink(selectedDiamond)}>
                  <button className="mt-2 inline-flex items-center border border-[hsl(var(--foreground)/0.25)] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--primary-foreground))] hover:border-[hsl(var(--primary))] px-8 py-3 text-xs tracking-[0.18em] uppercase font-light transition-all duration-400 cursor-pointer rounded-sm">
                    View {activeData.name} Collection
                    <span className="ml-2 text-[hsl(var(--secondary))]">→</span>
                  </button>
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
