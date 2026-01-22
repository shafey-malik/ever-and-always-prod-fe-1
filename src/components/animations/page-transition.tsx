'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();

  useEffect(() => {
    // Trigger page enter animation
    const timer = setTimeout(() => {
      document.body.classList.add('page-loaded');
    }, 10);

    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      key={pathname}
      className={cn(
        'page-enter animate-fade-in-scale',
        className
      )}
    >
      {children}
    </div>
  );
}
