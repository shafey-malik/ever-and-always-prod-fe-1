'use client';

import { ReactNode, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const luxEase = [0.22, 1, 0.36, 1] as const;

type RevealVariant = 'up' | 'scale' | 'fade';

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  /** Reveal style — defaults to a rich rise-and-settle */
  variant?: RevealVariant;
  className?: string;
}

/**
 * Section-level scroll reveal. As a section nears the viewport it rises,
 * settles from a hair of scale, and fades in on a long luxury easing curve.
 * Honors reduced-motion (plain fade) and only animates once.
 */
export function AnimatedSection({
  children,
  delay = 0,
  variant = 'up',
  className,
}: AnimatedSectionProps) {
  const ref = useRef(null);
  // Trigger a touch before the section is fully on screen so it feels alive, not late
  const isInView = useInView(ref, { once: true, margin: '0px 0px -14% 0px' });
  const shouldReduce = useReducedMotion();

  // Scalars are computed; the target objects are inlined in JSX for clean typing
  const fromY = shouldReduce || variant !== 'up' ? 0 : 64;
  const fromScale = shouldReduce || variant === 'fade' ? 1 : variant === 'scale' ? 0.93 : 0.985;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: fromY, scale: fromScale }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: fromY, scale: fromScale }
      }
      transition={{
        duration: shouldReduce ? 0.3 : 0.95,
        delay: shouldReduce ? 0 : delay,
        ease: luxEase,
        // Let the fade run a hair longer than the move for a softer settle
        opacity: {
          duration: shouldReduce ? 0.3 : 1.1,
          delay: shouldReduce ? 0 : delay,
          ease: luxEase,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
