'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Mail, Sparkles } from 'lucide-react';
import { SHOP_EMAIL } from '@/lib/custom-ring-config';
import {
    sendCustomJewelryInquiry,
    type CustomInquiryFormState,
} from '@/app/custom/actions';

interface DescribeToExpertProps {
    onBack: () => void;
}

const initialState: CustomInquiryFormState = { ok: false };

const inputClasses =
    'w-full px-4 py-2.5 rounded-md bg-[hsl(var(--background))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--foreground)/0.45)] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--secondary))] focus:border-[hsl(var(--secondary))] transition-all font-luxury-sans';

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-xs text-[hsl(var(--destructive))] font-luxury-sans">{message}</p>;
}

function SubmitButton({
    canSend,
    lockRef,
}: {
    canSend: boolean;
    lockRef: React.RefObject<boolean>;
}) {
    const { pending } = useFormStatus();
    const enabled = canSend && !pending;

    // Release the double-submit lock once the action settles.
    useEffect(() => {
        if (!pending) lockRef.current = false;
    }, [pending, lockRef]);

    return (
        <button
            type="submit"
            disabled={!enabled}
            aria-disabled={!enabled}
            onClick={(e) => {
                // Synchronous double-submit guard.
                if (lockRef.current) {
                    e.preventDefault();
                    return;
                }
                lockRef.current = true;
            }}
            className={`w-full flex items-center justify-center gap-2.5 border py-3 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-400 cursor-pointer ${enabled
                ? 'border-[hsl(var(--secondary))] text-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))] hover:text-black hover:border-[hsl(var(--secondary))]'
                : 'border-[hsl(var(--border))] text-[hsl(var(--foreground)/0.55)] cursor-not-allowed opacity-60'
                }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)' }}
        >
            <Mail className="w-4 h-4" />
            {pending ? 'Sending…' : 'Send to Our Experts'}
            <Sparkles className="w-4 h-4" />
        </button>
    );
}

export function DescribeToExpert({ onBack }: DescribeToExpertProps) {
    const [state, formAction] = useFormState(sendCustomJewelryInquiry, initialState);
    const submittingRef = useRef(false);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [vision, setVision] = useState('');

    const canSend = vision.trim().length > 0 && email.trim().length > 0;
    const fieldErrors = state.fieldErrors ?? {};

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
                        {state.ok ? (
                            <div className="text-center space-y-3 py-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--secondary))]">
                                    <Sparkles className="w-6 h-6 text-black" />
                                </div>
                                <h3 className="font-luxury-serif text-2xl font-light text-[hsl(var(--foreground))]">
                                    Thank you{state.name?.trim() ? `, ${state.name.trim()}` : ''}.
                                </h3>
                                <p className="text-[hsl(var(--foreground)/0.75)] font-luxury-sans text-sm">
                                    We&rsquo;ll be in touch within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form action={formAction} className="space-y-4">
                                {/* Honeypot — hidden from real users, bots fill it. */}
                                <input
                                    name="website"
                                    type="text"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    className="absolute -left-[9999px]"
                                    aria-hidden
                                />

                                <div className="space-y-1.5">
                                    <label htmlFor="custom-name" className="font-luxury-sans text-sm font-semibold text-[hsl(var(--foreground))] block">
                                        Your Name <span className="text-[hsl(var(--foreground)/0.6)] font-normal">(optional)</span>
                                    </label>
                                    <input
                                        id="custom-name"
                                        name="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Jane Doe"
                                        className={inputClasses}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="custom-email" className="font-luxury-sans text-sm font-semibold text-[hsl(var(--foreground))] block">
                                        Email
                                    </label>
                                    <input
                                        id="custom-email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="jane@example.com"
                                        className={inputClasses}
                                    />
                                    <FieldError message={fieldErrors.email} />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="custom-phone" className="font-luxury-sans text-sm font-semibold text-[hsl(var(--foreground))] block">
                                        Phone <span className="text-[hsl(var(--foreground)/0.6)] font-normal">(optional)</span>
                                    </label>
                                    <input
                                        id="custom-phone"
                                        name="phone"
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+1 (555) 123-4567"
                                        className={inputClasses}
                                    />
                                    <FieldError message={fieldErrors.phone} />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="custom-vision" className="font-luxury-sans text-sm font-semibold text-[hsl(var(--foreground))] block">
                                        Describe Your Vision
                                    </label>
                                    <textarea
                                        id="custom-vision"
                                        name="vision"
                                        required
                                        value={vision}
                                        onChange={(e) => setVision(e.target.value)}
                                        rows={5}
                                        placeholder="Tell us about the cut, metal, setting, story, occasion, budget — anything that helps us picture it."
                                        className={`${inputClasses} resize-none`}
                                    />
                                    <FieldError message={fieldErrors.vision} />
                                    <p className="text-xs text-[hsl(var(--foreground)/0.65)] font-luxury-sans">
                                        We&rsquo;ll send your vision straight to our experts and reply within 24 hours.
                                    </p>
                                </div>

                                {state.error && (
                                    <div className="p-3 rounded-md bg-[hsl(var(--destructive)/0.1)] border border-[hsl(var(--destructive)/0.2)] space-y-1">
                                        <p className="text-xs text-[hsl(var(--destructive))] font-luxury-sans font-medium">
                                            {state.error}
                                        </p>
                                        <p className="text-xs text-[hsl(var(--destructive)/0.85)] font-luxury-sans">
                                            Or email us at{' '}
                                            <a href={`mailto:${SHOP_EMAIL}`} className="underline">
                                                {SHOP_EMAIL}
                                            </a>
                                            .
                                        </p>
                                    </div>
                                )}

                                <SubmitButton canSend={canSend} lockRef={submittingRef} />
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
