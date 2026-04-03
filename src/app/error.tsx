'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
            <div className="text-center space-y-6 max-w-md">
                <h1 className="text-6xl font-bold text-primary">500</h1>
                <h2 className="text-2xl font-semibold">Something went wrong</h2>
                <p className="text-muted-foreground">
                    An unexpected error occurred. Please try again or return home.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={reset} variant="outline">
                        Try Again
                    </Button>
                    <Button asChild>
                        <Link href="/">Go to Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
