'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    // TODO: GIF asset — replace with cinematic hero video/GIF for this slide
    image: '/hero-diamond-1.jpg',
    title: 'Timeless Elegance',
    subtitle: 'Classic Solitaire Collection',
    description:
      'Discover the perfect symbol of eternal love with our exquisite collection of diamond solitaires.',
    collectionLink: '/collection/engagement-solitaire',
  },
  {
    id: 2,
    // TODO: GIF asset — replace with cinematic hero video/GIF for this slide
    image: '/hero-diamond-2.jpg',
    title: 'Rose Gold Romance',
    subtitle: 'Emerald Cut · Rose Gold',
    description:
      'Embrace modern luxury with our stunning emerald cut diamonds in romantic rose gold settings.',
    collectionLink: '/collection/engagement-emerald',
  },
  {
    id: 3,
    // TODO: GIF asset — replace with cinematic hero video/GIF for this slide
    image: '/hero-diamond-3.jpg',
    title: 'Oval Cut Perfection',
    subtitle: 'Oval Diamonds · Pavé Detail',
    description:
      'Experience the brilliance of oval diamonds complemented by delicate pavé craftsmanship.',
    collectionLink: '/collection/engagement-oval',
  },
  {
    id: 4,
    // TODO: GIF asset — replace with cinematic hero video/GIF for this slide
    image: '/hero-diamond-4.jpg',
    title: 'Platinum Prestige',
    subtitle: 'Round Brilliant · Platinum',
    description:
      'Indulge in the finest platinum settings featuring our most brilliant round diamonds.',
    collectionLink: '/collection/engagement-round',
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000);
  };

  useEffect(() => {
    startTimer();
    return () => clearTimer();
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    startTimer();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    startTimer();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    startTimer();
  };

  return (
    <div className="relative h-[calc(100vh-4.25rem)] md:h-[calc(100vh-7rem)] min-h-[580px] overflow-hidden bg-[hsl(var(--foreground))]">

      {/* Full-bleed background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover object-center"
            priority={currentSlide === 0}
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays for text readability */}
      <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

      {/* Editorial content — anchored bottom-left */}
      <div className="absolute inset-0 flex flex-col justify-end pb-16 sm:pb-20 lg:pb-24 px-8 sm:px-14 lg:px-20 xl:px-28 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-xl"
          >
            {/* Overline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[hsl(var(--secondary))] font-luxury-sans text-xs tracking-[0.3em] uppercase font-light mb-5"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {/* Decorative rule */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 56 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-[hsl(var(--secondary))] mb-6 opacity-80"
            />

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-luxury-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-[0.92] tracking-tight mb-8"
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/65 font-luxury-sans text-sm sm:text-base leading-relaxed max-w-xs mb-10 font-light"
            >
              {slides[currentSlide].description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-5"
            >
              <Link
                href={slides[currentSlide].collectionLink}
                className="inline-flex items-center border border-[hsl(var(--secondary)/0.55)] text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))] hover:text-black hover:border-[hsl(var(--secondary))] px-8 py-3 text-xs tracking-[0.18em] uppercase font-light transition-all duration-400 cursor-pointer"
                style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
              >
                View Collection
              </Link>
              <Link
                href="/consultation"
                className="text-white/60 hover:text-white font-luxury-sans text-xs tracking-[0.15em] uppercase font-light transition-colors duration-300 flex items-center gap-2 cursor-pointer"
              >
                Book Consultation
                <span className="text-[hsl(var(--secondary))]">→</span>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows — glass circles at mid-height edges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 pointer-events-none z-20"
      >
        <button
          type="button"
          onClick={prevSlide}
          className="pointer-events-auto bg-white/8 backdrop-blur-md hover:bg-white/16 border border-white/12 rounded-full p-3 sm:p-3.5 transition-all duration-300 hover:scale-110 group cursor-pointer flex-shrink-0"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="pointer-events-auto bg-white/8 backdrop-blur-md hover:bg-white/16 border border-white/12 rounded-full p-3 sm:p-3.5 transition-all duration-300 hover:scale-110 group cursor-pointer flex-shrink-0"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/80 group-hover:text-white" />
        </button>
      </motion.div>

      {/* Bottom bar — dots left, counter right */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 sm:bottom-10 left-8 sm:left-14 lg:left-20 xl:left-28 right-8 sm:right-12 flex items-center justify-between z-20"
      >
        {/* Dot indicators */}
        <div className="flex items-center gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 rounded-full cursor-pointer flex-shrink-0 ${index === currentSlide
                ? 'w-8 h-1.5 bg-[hsl(var(--secondary))]'
                : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/60'
                }`}
            />
          ))}
        </div>

        {/* Editorial slide counter */}
        <div className="flex items-center gap-2 font-luxury-sans text-xs text-white/45 tracking-[0.15em]">
          <span className="text-white/75">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span className="w-6 h-px bg-white/30" />
          <span>{String(slides.length).padStart(2, '0')}</span>
        </div>
      </motion.div>
    </div>
  );
}
