'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Phone, X, Sparkles } from 'lucide-react';

interface ProductInterestPopupProps {
    productName: string;
    productId: string;
}

export function ProductInterestPopup({ productName, productId }: ProductInterestPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        
        // Timer for 1 minute (60000ms)
        const timer = setTimeout(() => {
            // Check if we've already shown it for this product
            const hasSeen = localStorage.getItem(`hasSeenInterest_${productId}`);
            if (!hasSeen) {
                // Send tracking data
                fetch('/api/track-interest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productName, productId }),
                }).catch(err => console.error('Failed to track interest', err));

                // Show popup
                setIsOpen(true);
                // Mark as seen so we don't nag them again this session
                localStorage.setItem(`hasSeenInterest_${productId}`, 'true');
            }
        }, 60000);

        return () => clearTimeout(timer);
    }, [productId, productName]);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!isMounted) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) handleClose();
        }}>
            <DialogContent showCloseButton={false} className="sm:max-w-md p-0 overflow-hidden bg-[hsl(var(--card))] border-[hsl(var(--border))] rounded-2xl shadow-2xl">
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-50 p-2 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors rounded-full hover:bg-[hsl(var(--muted))]"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="relative w-full flex flex-col p-8 sm:p-10 text-center items-center justify-center bg-gradient-to-b from-[hsl(var(--card))] to-[hsl(var(--secondary)/0.05)]">
                    <div className="w-16 h-16 rounded-full bg-linear-to-br from-[hsl(var(--secondary)/0.05)] to-[hsl(var(--secondary)/0.15)] flex items-center justify-center mb-6 shadow-sm border border-[hsl(var(--secondary)/0.2)]">
                        <Sparkles className="w-8 h-8 text-[hsl(var(--secondary-rich))]" strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="font-luxury-serif text-3xl font-light text-[hsl(var(--foreground))] mb-3 leading-tight text-balance">
                        Still thinking about the <br/><span className="italic text-[hsl(var(--secondary))]">{productName}</span>?
                    </h3>
                    
                    <p className="font-luxury-sans text-[13px] text-[hsl(var(--muted-foreground))] font-light leading-relaxed max-w-[280px] mx-auto mb-8 text-balance">
                        Our jewelry experts are here to help you negotiate, inquire, or find out more. Let us guide you to the perfect piece.
                    </p>

                    <div className="w-full bg-[hsl(var(--background))] rounded-xl border border-[hsl(var(--border))] p-6 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[hsl(var(--secondary)/0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        <div className="flex flex-col items-center gap-3 relative z-10">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--secondary))] mb-1 shadow-md">
                                <Phone className="w-5 h-5" />
                            </div>
                            <span className="font-luxury-sans text-[11px] tracking-[0.2em] uppercase text-[hsl(var(--muted-foreground))] font-medium">
                                Contact Our Team
                            </span>
                            <a href="tel:+18000000000" className="font-luxury-serif text-2xl text-[hsl(var(--foreground))] hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300">
                                +1 (800) 000-0000
                            </a>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
