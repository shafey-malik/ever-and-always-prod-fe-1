'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageOff, ZoomIn, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface ProductImageCarouselProps {
    images: Array<{
        id: string;
        preview: string;
        source: string;
    }>;
}

// Normalize image URL - fix backslashes to forward slashes
const normalizeImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    return url.replace(/\\/g, '/');
};

export function ProductImageCarousel({ images }: ProductImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-2xl flex flex-col items-center justify-center border border-border/50 shadow-lg">
                <ImageOff className="w-16 h-16 mb-3 opacity-40 text-muted-foreground" />
                <span className="text-muted-foreground font-medium">No images available</span>
            </div>
        );
    }

    const handleImageError = (index: number) => {
        setImageErrors((prev) => new Set(prev).add(index));
    };

    const currentImage = images[currentIndex];
    const normalizedSource = normalizeImageUrl(currentImage?.source);
    const hasError = imageErrors.has(currentIndex);

    const goToPrevious = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        setTimeout(() => setIsAnimating(false), 300);
    };

    const goToNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        setTimeout(() => setIsAnimating(false), 300);
    };

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (!isLightboxOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'Escape') setIsLightboxOpen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, currentIndex]);

    return (
        <>
            <div className="space-y-5">
                {/* Main Image */}
                <div className="relative aspect-square bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl overflow-hidden group border border-[hsl(var(--lead-text))]/15 shadow-xl">
                    {/* Subtle gold accent border */}
                    <div className="absolute inset-0 rounded-2xl border border-[hsl(var(--lead-text))]/10 pointer-events-none" />
                    {normalizedSource && !hasError ? (
                        <>
                            <div key={currentIndex} className="absolute inset-0 animate-fade-in">
                                <Image
                                    src={normalizedSource}
                                    alt={`Product image ${currentIndex + 1}`}
                                    fill
                                    className="object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority={currentIndex === 0}
                                    onError={() => handleImageError(currentIndex)}
                                    unoptimized={normalizedSource.includes('my-shop.com')}
                                    onClick={() => setIsLightboxOpen(true)}
                                />
                            </div>

                            {/* Zoom Indicator */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm rounded-full p-2">
                                <ZoomIn className="w-5 h-5 text-white" />
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-muted/30">
                            <ImageOff className="w-16 h-16 mb-3 opacity-40 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground font-medium">Image unavailable</span>
                        </div>
                    )}

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 shadow-lg"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 shadow-lg"
                                aria-label="Next image"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                            {currentIndex + 1} / {images.length}
                        </div>
                    )}
                </div>

                {/* Thumbnail Grid */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                        {images.map((image, index) => {
                            const normalizedPreview = normalizeImageUrl(image.preview);
                            const thumbnailHasError = imageErrors.has(index);
                            const isActive = index === currentIndex;
                            
                            return (
                                <button
                                    key={image.id}
                                    onClick={() => {
                                        if (index !== currentIndex) {
                                            setCurrentIndex(index);
                                        }
                                    }}
                                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 group/thumb ${
                                        isActive
                                            ? 'border-[hsl(var(--lead-text))]/40 shadow-lg ring-2 ring-[hsl(var(--lead-text))]/20 scale-[1.05]'
                                            : 'border-border/50 hover:border-[hsl(var(--lead-text))]/30 hover:scale-[1.02] shadow-sm'
                                    }`}
                                >
                                    {normalizedPreview && !thumbnailHasError ? (
                                        <>
                                            <Image
                                                src={normalizedPreview}
                                                alt={`Thumbnail ${index + 1}`}
                                                fill
                                                className={`object-cover transition-all duration-300 ${
                                                    isActive ? 'brightness-100' : 'brightness-90 group-hover/thumb:brightness-100'
                                                }`}
                                                sizes="(max-width: 1024px) 25vw, 12.5vw"
                                                onError={() => handleImageError(index)}
                                                unoptimized={normalizedPreview.includes('my-shop.com')}
                                            />
                                            {isActive && (
                                                <div className="absolute inset-0 bg-primary/10" />
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted/50">
                                            <ImageOff className="w-5 h-5 opacity-40 text-muted-foreground" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
                <DialogContent 
                    className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-0 shadow-2xl"
                    showCloseButton={false}
                >
                    <DialogTitle className="sr-only">
                        Product Image {currentIndex + 1} of {images.length}
                    </DialogTitle>
                    <div className="relative w-full h-full flex items-center justify-center">
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-2.5 transition-all hover:scale-110 shadow-lg"
                            aria-label="Close lightbox"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {normalizedSource && !hasError && (
                            <>
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={goToPrevious}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-3 transition-all hover:scale-110"
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={goToNext}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full p-3 transition-all hover:scale-110"
                                            aria-label="Next image"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </>
                                )}

                                <div className="relative w-full h-full flex items-center justify-center p-8">
                                    <div key={currentIndex} className="relative w-full h-full max-w-6xl animate-fade-in">
                                        <Image
                                            src={normalizedSource}
                                            alt={`Product image ${currentIndex + 1}`}
                                            fill
                                            className="object-contain"
                                            sizes="100vw"
                                            unoptimized={normalizedSource.includes('my-shop.com')}
                                        />
                                    </div>
                                </div>

                                {images.length > 1 && (
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                                        {currentIndex + 1} / {images.length}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
