'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Gem, ShieldCheck, MapPin, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      // Small delay for a subtle entry
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleNext = () => {
    setStep(2);
  };

  if (!isMounted) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
    }}>
      <DialogContent title="Welcome to Ever & Always" showCloseButton={false} className="sm:max-w-md p-0 overflow-hidden bg-[hsl(var(--card))] border-[hsl(var(--border))] rounded-2xl">
        {/* Custom close button to float over animations */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors rounded-full hover:bg-[hsl(var(--muted))]"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative w-full min-h-[460px] flex">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex flex-col p-8 sm:p-10 justify-between"
              >
                <div>
                  <h2 className="font-luxury-serif text-3xl sm:text-4xl font-light text-[hsl(var(--foreground))] mb-2 tracking-tight">
                    Welcome to <span className="italic text-[hsl(var(--secondary))] whitespace-nowrap">Ever & Always</span>
                  </h2>
                  <p className="font-luxury-sans text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-[0.25em] mb-10">
                    A tradition of excellence
                  </p>

                  <div className="flex flex-col gap-6">
                    {/* Item 1 */}
                    <div className="flex items-center gap-6 group">
                      <div className="w-16 h-16 rounded-full bg-linear-to-br from-[hsl(var(--secondary)/0.05)] to-[hsl(var(--secondary)/0.15)] flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md">
                        <Gem className="w-7 h-7 text-[hsl(var(--secondary-rich))]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="font-luxury-serif text-[18px] text-[hsl(var(--foreground))] leading-tight mb-1.5">Expertise in Custom Premium Jewelry</h4>
                        <p className="font-luxury-sans text-[13px] text-[hsl(var(--muted-foreground))] font-light leading-relaxed pr-2">
                          Masterfully crafted pieces tailored exclusively to your vision.
                        </p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center gap-6 group">
                      <div className="w-16 h-16 rounded-full bg-linear-to-br from-[hsl(var(--secondary)/0.05)] to-[hsl(var(--secondary)/0.15)] flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md">
                        <ShieldCheck className="w-7 h-7 text-[hsl(var(--secondary-rich))]" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="font-luxury-serif text-[18px] text-[hsl(var(--foreground))] leading-tight mb-1.5">Right Pricing with Best Quality</h4>
                        <p className="font-luxury-sans text-[13px] text-[hsl(var(--muted-foreground))] font-light leading-relaxed pr-2">
                          Transparent value without compromising our exceptional standards.
                        </p>
                      </div>
                    </div>

                    {/* Highlighted Offline Store */}
                    <div className="relative mt-2 p-5 rounded-xl bg-linear-to-r from-[hsl(var(--secondary)/0.15)] via-[hsl(var(--secondary)/0.05)] to-transparent border border-[hsl(var(--secondary)/0.2)] overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[hsl(var(--secondary)/0.1)] rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                      <div className="flex items-center gap-6 relative z-10">
                        <div className="w-16 h-16 rounded-full bg-[hsl(var(--background))] border border-[hsl(var(--secondary)/0.3)] flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md group-hover:border-[hsl(var(--secondary))]">
                          <MapPin className="w-7 h-7 text-[hsl(var(--secondary-rich))]" strokeWidth={1.5} />
                        </div>
                        <div>
                          <span className="inline-block mb-1.5 font-luxury-sans text-[10px] tracking-[0.2em] uppercase text-[hsl(var(--secondary-rich))] font-medium">
                            Experience in Person
                          </span>
                          <h4 className="font-luxury-serif text-[18px] text-[hsl(var(--foreground))] leading-tight mb-1.5">Offline Store Visit Us At</h4>
                          <p className="font-luxury-sans text-[13px] text-[hsl(var(--muted-foreground))] font-light leading-relaxed pr-2">
                            5th Avenue, New York City. Experience our luxury firsthand.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="group inline-flex items-center gap-2 font-luxury-sans text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--foreground))] hover:text-[hsl(var(--secondary-rich))] transition-colors"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 text-[hsl(var(--secondary))] transition-transform duration-500 group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-full flex flex-col p-8 sm:p-10 text-center items-center justify-center h-full min-h-[460px]"
              >
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-[hsl(var(--secondary)/0.05)] to-[hsl(var(--secondary)/0.15)] flex items-center justify-center mb-8 shadow-sm">
                  <Gem className="w-9 h-9 text-[hsl(var(--secondary-rich))]" strokeWidth={1} />
                </div>
                <h3 className="font-luxury-serif text-3xl sm:text-4xl font-light text-[hsl(var(--foreground))] mb-4">
                  Begin Your <span className="italic text-[hsl(var(--secondary))]">Journey</span>
                </h3>
                <p className="font-luxury-sans text-[13px] text-[hsl(var(--muted-foreground))] font-light leading-relaxed max-w-[280px] mx-auto mb-10">
                  Create an account to save your favorite pieces, track your bespoke orders, and enjoy exclusive member benefits.
                </p>

                <div className="flex flex-col w-full gap-5 max-w-[260px]">
                  <Link
                    href="/sign-in"
                    onClick={handleClose}
                    className="w-full bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] hover:brightness-110 px-8 py-4 text-[11px] tracking-[0.22em] uppercase font-light rounded-sm transition-all duration-500 active:scale-[0.98] shadow-md hover:shadow-lg"
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={handleClose}
                    className="w-full font-luxury-sans text-[11px] tracking-[0.1em] uppercase text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors duration-300"
                  >
                    Continue as Guest
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
