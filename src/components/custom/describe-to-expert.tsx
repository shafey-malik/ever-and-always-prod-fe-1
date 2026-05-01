'use client';

import { useState } from 'react';
import { ArrowLeft, Mail, Sparkles } from 'lucide-react';
import { SHOP_EMAIL } from '@/lib/custom-ring-config';

interface DescribeToExpertProps {
    onBack: () => void;
}

export function DescribeToExpert({ onBack }: DescribeToExpertProps) {
    const [vision, setVision] = useState('');
    const [name, setName] = useState('');

    const subject = `Custom ring vision${name ? ` — ${name}` : ''}`;
    const body =
        `Hello Ever and Always team,\n\n` +
        `I'd love your help bringing this ring vision to life:\n\n` +
        `${vision || '[describe your ring here]'}\n\n` +
        (name ? `Thank you,\n${name}\n` : 'Thank you.\n');

    const mailto = `mailto:${SHOP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const canSend = vision.trim().length > 0;

    return (
        <section className="min-h-[86vh] py-8 sm:py-10 bg-[hsl(var(--surface-champagne))] dark:bg-[hsl(var(--surface-alt))] overflow-hidden">
            <div className="container mx-auto px-6 sm:px-8 lg:px-12">
                <div className="max-w-3xl mx-auto">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[hsl(var(--foreground)/0.75)] hover:text-[hsl(var(--foreground))] transition-colors mb-5 cursor-pointer"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back
                    </button>

                    <div className="text-center mb-6">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="h-px w-10 bg-linear-to-r from-transparent to-[hsl(var(--secondary))]" />
                            <span className="font-luxury-sans text-[hsl(var(--secondary))] text-[10px] tracking-[0.35em] uppercase">
                                Tell Us Your Vision
                            </span>
                            <div className="h-px w-10 bg-linear-to-l from-transparent to-[hsl(var(--secondary))]" />
                        </div>
                        <h2 className="font-luxury-serif text-2xl sm:text-3xl lg:text-4xl font-light text-[hsl(var(--foreground))] leading-tight">
                            Describe Your{' '}
                            <span className="italic text-[hsl(var(--secondary))]">Dream</span>{' '}
                            Ring
                        </h2>
                        <p className="mt-2 text-[hsl(var(--foreground)/0.75)] font-luxury-sans text-sm max-w-lg mx-auto leading-relaxed">
                            Share as much or as little as you wish — our master jewellers will handle the rest.
                        </p>
                    </div>

                    <div className="bg-[hsl(var(--card))] rounded-2xl shadow-(--shadow-elegant) p-6 sm:p-8 border border-[hsl(var(--border)/0.5)]">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="font-luxury-sans text-sm font-semibold text-[hsl(var(--foreground))] block">
                                    Your Name <span className="text-[hsl(var(--foreground)/0.6)] font-normal">(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Doe"
                                    className="w-full px-4 py-2.5 rounded-md bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground)/0.45)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--secondary))] focus:border-[hsl(var(--secondary))] transition-all font-luxury-sans"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-luxury-sans text-sm font-semibold text-[hsl(var(--foreground))] block">
                                    Describe Your Vision
                                </label>
                                <textarea
                                    value={vision}
                                    onChange={(e) => setVision(e.target.value)}
                                    rows={5}
                                    placeholder="Tell us about the cut, metal, setting, story, occasion, budget — anything that helps us picture it."
                                    className="w-full px-4 py-2.5 rounded-md bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground)/0.45)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--secondary))] focus:border-[hsl(var(--secondary))] transition-all font-luxury-sans resize-none"
                                />
                                <p className="text-xs text-[hsl(var(--foreground)/0.65)] font-luxury-sans">
                                    Sending will open your default email app with everything pre-filled.
                                </p>
                            </div>

                            <a
                                href={canSend ? mailto : undefined}
                                aria-disabled={!canSend}
                                onClick={(e) => {
                                    if (!canSend) e.preventDefault();
                                }}
                                className={`w-full flex items-center justify-center gap-2.5 border py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-400 cursor-pointer ${canSend
                                    ? 'border-[hsl(var(--secondary))] text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))] hover:text-black hover:border-[hsl(var(--secondary))]'
                                    : 'border-[hsl(var(--border))] text-[hsl(var(--foreground)/0.55)] cursor-not-allowed opacity-60'
                                    }`}
                                style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
                            >
                                <Mail className="w-4 h-4" />
                                Send to Our Experts
                                <Sparkles className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
