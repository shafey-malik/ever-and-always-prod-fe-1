'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { resolveImageSrc } from '@/lib/cloudinary';

//V0 17-06-26
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

const resolvedSlides = slides.map((slide) => ({
  ...slide,
  resolvedImage: resolveImageSrc(slide.image) || slide.image,
}));

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

  useEffect(() => {
    resolvedSlides.forEach((slide) => {
      const img = new window.Image();
      img.src = slide.resolvedImage;
    });
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
    <div className="relative h-[calc(100svh-4.25rem)] md:h-[calc(100vh-7rem)] min-h-[560px] overflow-hidden bg-[hsl(var(--foreground))]">

      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        {resolvedSlides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <motion.div
              key={slide.id}
              initial={false}
              animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 1.04 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={slide.resolvedImage}
                alt={slide.title}
                fill
                className="object-cover object-center"
                priority={index === 0}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Gradient overlays for text readability */}
      <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-black/20 pointer-events-none" />

      {/* Editorial content — anchored bottom-left */}
      <div className="absolute inset-0 flex flex-col justify-end pb-24 sm:pb-24 lg:pb-28 px-6 sm:px-14 lg:px-20 xl:px-28 z-10">
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
              className="text-[hsl(var(--secondary))] font-luxury-sans text-[10px] sm:text-xs tracking-[0.3em] uppercase font-light mb-4 sm:mb-5"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            {/* Decorative rule */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 56 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-px bg-[hsl(var(--secondary))] mb-5 sm:mb-6 opacity-80"
            />

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-luxury-serif text-[2.5rem] sm:text-6xl lg:text-7xl xl:text-8xl font-light text-white leading-[0.95] sm:leading-[0.92] tracking-tight mb-6 sm:mb-8"
            >
              {slides[currentSlide].title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/70 font-luxury-sans text-[13px] sm:text-base leading-relaxed max-w-[20rem] sm:max-w-xs mb-8 sm:mb-10 font-light"
            >
              {slides[currentSlide].description}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5"
            >
              <Link
                href={slides[currentSlide].collectionLink}
                className="inline-flex items-center justify-center sm:justify-start border border-[hsl(var(--secondary)/0.55)] text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))] hover:text-black hover:border-[hsl(var(--secondary))] px-7 sm:px-8 py-3.5 sm:py-3 text-[11px] sm:text-xs tracking-[0.2em] uppercase font-light transition-all duration-400 cursor-pointer"
                style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
              >
                View Collection
                <span className="ml-3 transition-transform duration-500 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/consultation"
                className="text-white/65 hover:text-white font-luxury-sans text-[11px] sm:text-xs tracking-[0.2em] sm:tracking-[0.15em] uppercase font-light transition-colors duration-300 inline-flex items-center justify-center sm:justify-start gap-2 cursor-pointer py-2 sm:py-0"
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
          aria-label="Previous slide"
          onClick={prevSlide}
          className="pointer-events-auto bg-black/30 sm:bg-white/8 backdrop-blur-md hover:bg-[hsl(var(--secondary)/0.2)] border border-white/15 hover:border-[hsl(var(--secondary)/0.6)] rounded-full p-2.5 sm:p-3.5 transition-all duration-300 hover:scale-110 group cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white/85 group-hover:text-[hsl(var(--secondary))]" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={nextSlide}
          className="pointer-events-auto bg-black/30 sm:bg-white/8 backdrop-blur-md hover:bg-[hsl(var(--secondary)/0.2)] border border-white/15 hover:border-[hsl(var(--secondary)/0.6)] rounded-full p-2.5 sm:p-3.5 transition-all duration-300 hover:scale-110 group cursor-pointer shrink-0"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/85 group-hover:text-[hsl(var(--secondary))]" />
        </button>
      </motion.div>

      {/* Bottom bar — dots left, counter right */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-7 sm:bottom-10 left-6 sm:left-14 lg:left-20 xl:left-28 right-6 sm:right-12 flex items-center justify-between z-20"
      >
        {/* Dot indicators */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => goToSlide(index)}
              className="relative p-2 -m-2 cursor-pointer shrink-0 group"
            >
              <span
                className={`block transition-all duration-500 rounded-full ${index === currentSlide
                  ? 'w-7 sm:w-8 h-1.5 bg-[hsl(var(--secondary))]'
                  : 'w-1.5 h-1.5 bg-white/40 group-hover:bg-white/70'
                  }`}
              />
            </button>
          ))}
        </div>

        {/* Editorial slide counter */}
        <div className="flex items-center gap-2 font-luxury-sans text-[10px] sm:text-xs text-white/50 tracking-[0.2em]">
          <span className="text-[hsl(var(--secondary))] font-medium">
            {String(currentSlide + 1).padStart(2, '0')}
          </span>
          <span className="w-5 sm:w-6 h-px bg-white/30" />
          <span>{String(slides.length).padStart(2, '0')}</span>
        </div>
      </motion.div>
    </div>
  );
}
