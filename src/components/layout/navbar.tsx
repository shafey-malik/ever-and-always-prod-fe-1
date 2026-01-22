import { Suspense } from "react";
import { HeaderWrapper } from '@/components/layout/navbar/header-wrapper';

export function Navbar() {
    return (
        <Suspense fallback={
            <header className="w-full bg-[hsl(var(--card))] shadow-[var(--shadow-card)] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="w-32 h-8 bg-muted animate-pulse rounded"></div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
                            <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
                            <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
                        </div>
                    </div>
                </div>
            </header>
        }>
            <HeaderWrapper />
        </Suspense>
    );
}