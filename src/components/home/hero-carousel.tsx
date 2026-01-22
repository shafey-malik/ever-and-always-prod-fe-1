'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const slides = [
  {
    id: 1,
    image: '/hero-diamond-1.jpg',
    title: 'Timeless Elegance',
    subtitle: 'Classic solitaire engagement rings',
    description:
      'Discover the perfect symbol of eternal love with our exquisite collection of diamond solitaires.',
  },
  {
    id: 2,
    image: '/hero-diamond-2.jpg',
    title: 'Rose Gold Romance',
    subtitle: 'Warm and sophisticated emerald cuts',
    description:
      'Embrace modern luxury with our stunning emerald cut diamonds in romantic rose gold settings.',
  },
  {
    id: 3,
    image: '/hero-diamond-3.jpg',
    title: 'Oval Cut Perfection',
    subtitle: 'Elegant oval diamonds with pavé detail',
    description:
      'Experience the brilliance of oval diamonds complemented by delicate pavé craftsmanship.',
  },
  {
    id: 4,
    image: '/hero-diamond-4.jpg',
    title: 'Platinum Prestige',
    subtitle: 'Ultimate luxury in platinum settings',
    description:
      'Indulge in the finest platinum settings featuring our most brilliant round diamonds.',
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
    <div className="relative h-[80vh] sm:h-[70vh] lg:h-[85vh] overflow-hidden bg-[hsl(var(--card))]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 h-full">
            {/* Content */}
            <div className="px-4 sm:px-8 lg:px-20 xl:px-32 py-8 sm:py-12 lg:py-0 z-10 flex flex-col justify-center bg-[hsl(var(--background))] lg:bg-transparent">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="max-w-2xl space-y-6 sm:space-y-8 w-full"
              >
                {/* Decorative line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 48 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="h-1 bg-gradient-to-r from-[hsl(var(--gold))] to-[hsl(var(--secondary))]"
                />

                <div className="space-y-2 sm:space-y-4">
                  <motion.p
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-xs sm:text-sm uppercase tracking-[0.15em] font-light"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.8 }}
                    className="font-luxury-serif text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-light text-[hsl(var(--foreground))] leading-tight tracking-tight"
                  >
                    {slides[currentSlide].title}
                  </motion.h1>
                </div>

                <motion.p
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-sm sm:text-base lg:text-lg leading-relaxed max-w-md font-light"
                >
                  {slides[currentSlide].description}
                </motion.p>

                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-5 pt-4 sm:pt-6 w-full sm:w-auto"
                >
                  <Link
                    href="/search"
                    className="btn-luxury text-[hsl(var(--secondary))] hover:text-[hsl(var(--background))] px-8 sm:px-10 py-3 sm:py-3.5 text-sm sm:text-base font-normal tracking-wide w-full sm:w-auto flex items-center justify-center cursor-pointer"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Collection
                  </Link>
                  <Link
                    href="/consultation"
                    className="bg-[hsl(var(--card))] px-8 sm:px-10 py-3 sm:py-3.5 text-sm sm:text-base font-normal border border-[hsl(var(--foreground))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--primary))] hover:text-[hsl(var(--secondary))] transition-all duration-500 tracking-wide w-full sm:w-auto rounded-lg cursor-pointer flex items-center justify-center"
                  >
                    Book Consultation
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="relative flex-1 min-h-[45vh] lg:min-h-0 w-full overflow-hidden"
            >
              <Image
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                fill
                className="object-cover object-center"
                priority={currentSlide === 0}
              />
              <div
                className="absolute inset-0 opacity-60 lg:opacity-100"
                style={{
                  background: 'linear-gradient(to bottom, transparent, transparent, linear-gradient(to right, transparent)'
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 sm:px-8 lg:px-12 z-20"
      >
        <button
          type="button"
          onClick={prevSlide}
          className="pointer-events-auto bg-white/8 backdrop-blur-md hover:bg-white/15 border border-white/10 rounded-full p-3 sm:p-4 transition-all duration-300 hover:scale-110 group z-30 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--secondary))] group-hover:text-[hsl(var(--primary))]" />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="pointer-events-auto bg-white/8 backdrop-blur-md hover:bg-white/15 border border-white/10 rounded-full p-3 sm:p-4 transition-all duration-300 hover:scale-110 group z-30 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[hsl(var(--secondary))] group-hover:text-[hsl(var(--primary))]" />
        </button>
      </motion.div>

      {/* Slide Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 sm:space-x-4"
      >
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            className={`transition-all duration-500 rounded-full cursor-pointer ${index === currentSlide
              ? 'w-8 sm:w-10 h-2 sm:h-2.5 bg-gradient-to-r from-[hsl(var(--rose-gold))] to-[hsl(var(--rose-gold))]'
              : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white hover:bg-white/40 border border-black/10'
              }`}
          />
        ))}
      </motion.div>
    </div>
  );
}
