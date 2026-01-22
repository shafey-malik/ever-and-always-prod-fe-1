'use client';

import { useState } from 'react';
import Image from 'next/image';

const diamondTypes = [
  {
    id: 'round',
    name: 'Round',
    img: '/round.png',
    centralImg: '/round.png',
    position: { top: '0%', left: '50%' },
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'princess',
    name: 'Princess',
    img: '/princess.png',
    centralImg: '/princess.png',
    position: { top: '5%', left: '95%' },
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    img: '/emerald.png',
    centralImg: '/emerald.png',
    position: { top: '35%', left: '95%' },
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'oval',
    name: 'Oval',
    img: '/oval.png',
    centralImg: '/oval.png',
    position: { top: '40%', left: '50%' },
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'cushion',
    name: 'Cushion',
    img: '/cushion.png',
    centralImg: '/cushion.png',
    position: { top: '-5%', left: '5%' },
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
  {
    id: 'pear',
    name: 'Pear',
    img: '/pear.png',
    centralImg: '/pear.png',
    position: { top: '-80%', left: '5%' },
    color: 'from-[hsl(var(--secondary))] to-[hsl(var(--secondary-rich))]',
  },
];

export function DiamondSelector() {
  const [selectedDiamond, setSelectedDiamond] = useState('round');
  const [hoveredDiamond, setHoveredDiamond] = useState<string | null>(null);
  const currentCentralImg = diamondTypes.find((d) =>
    hoveredDiamond ? d.id === hoveredDiamond : d.id === selectedDiamond,
  )?.centralImg;

  return (
    <section className="py-24 bg-[hsl(var(--card))] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2 animate-pulse bg-[hsl(var(--secondary))]"></div>
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2 animate-pulse bg-[hsl(var(--secondary))]"
        style={{ animationDelay: '1s' }}
      ></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center space-y-6 mb-16 lg:mb-20">
          <div className="inline-block">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent to-[hsl(var(--primary))]"></div>
              <span className="text-[hsl(var(--primary))] font-luxury-sans text-sm font-semibold tracking-widest uppercase">
                Discover
              </span>
              <div className="h-1 w-12 bg-gradient-to-l from-transparent to-[hsl(var(--primary))]"></div>
            </div>
          </div>
          <h2 className="font-luxury-serif text-5xl lg:text-6xl font-bold bg-[hsl(var(--secondary))] bg-clip-text text-transparent">
            <span className="text-[hsl(var(--foreground))]">Select Your </span>{' '}
            Diamond <span className="text-[hsl(var(--foreground))]">Cut</span>
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-lg max-w-2xl mx-auto leading-relaxed">
            Each diamond cut reflects light differently, creating its own unique
            sparkle and character. Hover over each cut to discover your perfect
            match.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          {/* Circular Diamond Selector */}
          <div className="relative w-96 h-96 flex-shrink-0 mx-auto lg:mx-0">
            {/* Animated outer rings */}
            <div
              className="absolute inset-0 rounded-full border-2 border-[hsl(var(--primary))] opacity-20 animate-spin"
              style={{ animationDuration: '20s' }}
            ></div>
            <div
              className="absolute inset-4 rounded-full border border-[hsl(var(--secondary))] opacity-10 animate-spin"
              style={{
                animationDuration: '30s',
                animationDirection: 'reverse',
              }}
            ></div>
            <div className="absolute inset-8 rounded-full border border-[hsl(var(--primary))] opacity-10"></div>

            {/* Central Ring Image - Enhanced */}
            <div className="absolute inset-16 bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-full shadow-2xl flex items-center justify-center group ring-2 ring-[hsl(var(--primary))]/20 transition-all duration-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))]/5 to-transparent rounded-full group-hover:from-[hsl(var(--primary))]/10 transition-all duration-500"></div>
              {currentCentralImg && (
                <Image
                  src={currentCentralImg}
                  alt="Selected Diamond"
                  width={160}
                  height={160}
                  className="w-40 h-40 object-contain rounded-full transition-all duration-500 drop-shadow-lg group-hover:drop-shadow-2xl group-hover:scale-105"
                />
              )}
            </div>

            {/* Diamond Cut Buttons - Enhanced with animations */}
            {diamondTypes.map((diamond) => {
              const isSelected = selectedDiamond === diamond.id;
              const isHovered = hoveredDiamond === diamond.id;
              const isActive = isSelected || isHovered;

              return (
                <button
                  key={diamond.id}
                  onClick={() => setSelectedDiamond(diamond.id)}
                  onMouseEnter={() => setHoveredDiamond(diamond.id)}
                  onMouseLeave={() => setHoveredDiamond(null)}
                  className={`absolute w-20 h-20 rounded-full transition-all duration-300 flex items-center justify-center group relative cursor-pointer ${isActive ? 'z-50' : ''
                    }`}
                  style={{
                    top: diamond.position.top,
                    left: diamond.position.left,
                    transform: isActive
                      ? 'translate(-50%, -50%) scale(1.25)'
                      : 'translate(-50%, -50%)',
                    transformOrigin: 'center center',
                  }}
                >
                  {/* Animated background glow */}
                  <div
                    className={`absolute inset-0 rounded-full blur-lg opacity-0 transition-all duration-300 ${isActive
                      ? `bg-gradient-to-br ${diamond.color} opacity-60 animate-pulse`
                      : ''
                      }`}
                  ></div>

                  {/* Main button container */}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-300 ${isActive
                      ? `bg-gradient-to-br ${diamond.color} shadow-2xl`
                      : 'bg-white shadow-lg hover:shadow-xl border border-[hsl(var(--primary))]/10'
                      }`}
                  ></div>

                  {/* Diamond Image */}
                  <Image
                    src={diamond.img}
                    alt={diamond.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Tooltip */}
                  <div
                    className={`absolute bottom-full mb-3 px-4 py-2 bg-gradient-to-r ${diamond.color} text-slate-900 text-sm font-luxury-sans font-semibold rounded-lg transition-all duration-200 whitespace-nowrap shadow-xl backdrop-blur-sm ${isHovered
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2 pointer-events-none'
                      }`}
                  >
                    {diamond.name}
                    <div
                      className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[hsl(var(--primary))] ${isHovered ? '' : ''
                        }`}
                    ></div>
                  </div>

                  {/* Selection ring indicator */}
                  {isSelected && (
                    <div
                      className="absolute inset-0 rounded-full border-2 border-white bg-[hsl(var(--secondary-rich))] animate-pulse"
                      style={{ animationDuration: '4s' }}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Diamond Info - Enhanced */}
          <div className="max-w-md w-full space-y-8 backdrop-blur-sm">
            <div className="space-y-4 animate-fade-in">
              <div>
                <div className="inline-block mb-3">
                  <span className="text-xs font-semibold tracking-widest uppercase text-[hsl(var(--secondary))] font-luxury-sans">
                    Featured Cut
                  </span>
                </div>
                <h3 className="font-luxury-serif text-4xl lg:text-5xl font-bold text-[hsl(var(--foreground))] capitalize transition-all duration-300">
                  {diamondTypes.find((d) => d.id === selectedDiamond)?.name} Cut
                </h3>
              </div>
              <div className="h-1.5 w-24 bg-[hsl(var(--secondary))] rounded-full"></div>
            </div>

            <div className="space-y-6 text-[hsl(var(--muted-foreground))] font-luxury-sans">
              {selectedDiamond === 'round' && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-base leading-relaxed">
                    The most popular diamond cut, known for its exceptional
                    brilliance and fire. The round brilliant cut maximizes light
                    return through its 58 facets.
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Maximum brilliance and sparkle</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Timeless and classic appeal</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Excellent for all ring styles</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedDiamond === 'princess' && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-base leading-relaxed">
                    A modern square cut that combines the brilliance of a round
                    with a contemporary geometric shape. Perfect for those who
                    love clean lines.
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Modern and sophisticated</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Brilliant sparkle</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Great value proposition</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedDiamond === 'emerald' && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-base leading-relaxed">
                    A step-cut diamond featuring long, lean lines that create a
                    hall-of-mirrors effect. Emphasizes clarity and showcases the
                    diamond's natural beauty.
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Elegant hall-of-mirrors effect</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Vintage-inspired glamour</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Emphasizes diamond clarity</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedDiamond === 'oval' && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-base leading-relaxed">
                    An elongated version of the round brilliant cut that offers
                    similar sparkle while creating the illusion of greater size
                    and elegant finger coverage.
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Elongated elegant appearance</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Creates illusion of larger size</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Flattering on all hand types</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedDiamond === 'cushion' && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-base leading-relaxed">
                    A romantic cut with rounded corners and larger facets that
                    create a soft, romantic glow. Perfect blend of old-world
                    charm and modern brilliance.
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Romantic vintage appeal</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Soft, pillow-like appearance</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Excellent fire and brilliance</span>
                    </li>
                  </ul>
                </div>
              )}

              {selectedDiamond === 'pear' && (
                <div className="space-y-4 animate-fade-in">
                  <p className="text-base leading-relaxed">
                    A unique combination of round and marquise cuts, creating an
                    elegant teardrop shape that's both classic and distinctive.
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Unique teardrop silhouette</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Elongates the finger</span>
                    </li>
                    <li className="flex items-center gap-3 group">
                      <span className="w-2 h-2 rounded-full bg-[hsl(var(--secondary))] group-hover:scale-150 transition-transform duration-300"></span>
                      <span>Distinctive and eye-catching</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
