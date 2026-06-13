'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X, ArrowRight, ImageOff } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist/wishlist-context';

const luxEase = [0.22, 1, 0.36, 1] as const;

export function WishlistView() {
  const { items, hydrated, remove, clear, count } = useWishlist();

  // Avoid an empty-state flash before localStorage hydrates
  if (!hydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[hsl(var(--secondary)/0.3)] border-t-[hsl(var(--secondary))] animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative py-12 sm:py-16 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[40rem] h-72 bg-[hsl(var(--secondary)/0.06)] blur-3xl rounded-full" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 sm:w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.3em] sm:tracking-[0.35em] uppercase">
              Saved Pieces
            </span>
            <div className="h-px w-8 sm:w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
          </div>
          <h1 className="font-luxury-serif text-[2rem] sm:text-5xl font-light text-[hsl(var(--foreground))] leading-tight tracking-tight">
            Your{' '}
            <span className="italic font-light text-[hsl(var(--secondary-rich))]">Wishlist</span>
          </h1>
          {count > 0 && (
            <p className="mt-4 text-[hsl(var(--muted-foreground))] font-luxury-sans text-[13px] sm:text-base font-light">
              {count} {count === 1 ? 'piece' : 'pieces'} you&apos;ve fallen for.
            </p>
          )}
        </div>

        {count === 0 ? (
          /* ── Empty state ── */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: luxEase }}
            className="max-w-md mx-auto text-center py-10"
          >
            <div className="mx-auto w-20 h-20 rounded-full border border-[hsl(var(--secondary)/0.35)] flex items-center justify-center mb-7">
              <Heart className="w-8 h-8 text-[hsl(var(--secondary))]" strokeWidth={1.2} />
            </div>
            <h2 className="font-luxury-serif text-2xl font-light text-[hsl(var(--foreground))] mb-3">
              Nothing saved yet
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans text-sm font-light leading-relaxed mb-8">
              Tap the heart on any piece to keep it here — a quiet collection of
              the ones that caught your eye.
            </p>
            <Link
              href="/search"
              className="group inline-flex items-center justify-center bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] hover:brightness-110 px-8 py-3.5 text-[11px] tracking-[0.22em] uppercase font-light transition-all duration-500 rounded-sm cursor-pointer active:scale-[0.98]"
              style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
            >
              Explore the Collection
              <ArrowRight className="w-3.5 h-3.5 ml-3 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        ) : (
          <>
            {/* ── Grid ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.article
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: luxEase }}
                    className="group relative flex flex-col bg-[hsl(var(--card))] rounded-2xl overflow-hidden border border-[hsl(var(--border))] shadow-(--shadow-card) hover:shadow-(--shadow-elegant) transition-all duration-500"
                  >
                    {/* Gold hairline on hover */}
                    <span className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-hover:border-[hsl(var(--secondary)/0.45)] transition-colors duration-500 z-20" />

                    <Link href={item.href} className="relative block aspect-square bg-[hsl(var(--muted))] overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                          unoptimized={item.image.includes('my-shop.com')}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[hsl(var(--muted-foreground))]">
                          <ImageOff className="w-10 h-10 mb-2 opacity-50" />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </Link>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.name} from wishlist`}
                      className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md border border-white/60 flex items-center justify-center text-[hsl(240,9%,15%)]/60 hover:text-[hsl(var(--destructive))] hover:bg-white shadow-sm cursor-pointer transition-all duration-300 active:scale-90"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Body */}
                    <div className="p-4 sm:p-5 flex flex-col flex-1">
                      <h3 className="font-luxury-serif text-[15px] sm:text-base font-medium leading-snug line-clamp-2 text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300">
                        {item.name}
                      </h3>
                      <div className="h-px w-8 bg-linear-to-r from-[hsl(var(--secondary)/0.7)] to-transparent my-2.5 transition-all duration-500 group-hover:w-14" />
                      {item.price && (
                        <p className="font-luxury-serif font-light text-lg text-[hsl(var(--lead-text))]">
                          {item.price}
                        </p>
                      )}
                      <Link
                        href={item.href}
                        className="mt-auto pt-3 group/btn inline-flex items-center justify-center w-full text-[11px] tracking-[0.18em] uppercase font-light border border-[hsl(var(--foreground)/0.18)] text-[hsl(var(--foreground)/0.78)] hover:border-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-rich))] py-2.5 transition-all duration-400 rounded-sm"
                      >
                        View Piece
                        <ArrowRight className="w-3 h-3 ml-2 transition-transform duration-500 group-hover/btn:translate-x-1" />
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Footer actions ── */}
            <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/search"
                className="group inline-flex items-center justify-center bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] hover:brightness-110 px-8 py-3.5 text-[11px] tracking-[0.22em] uppercase font-light transition-all duration-500 rounded-sm cursor-pointer active:scale-[0.98]"
                style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
              >
                Continue Exploring
                <ArrowRight className="w-3.5 h-3.5 ml-3 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              <button
                type="button"
                onClick={clear}
                className="font-luxury-sans text-[11px] tracking-[0.18em] uppercase text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] transition-colors duration-300 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
