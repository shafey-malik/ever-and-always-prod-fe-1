'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { sendConsultationInquiry, type ConsultationFormState } from './actions';

const initialState: ConsultationFormState = { ok: false };

function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-sm text-destructive">{message}</p>;
}

function SubmitButton({ lockRef }: { lockRef: React.RefObject<boolean> }) {
    const { pending } = useFormStatus();

    // Release the double-submit lock once the action settles, so a user who
    // hit a validation error can correct it and resubmit.
    useEffect(() => {
        if (!pending) lockRef.current = false;
    }, [pending, lockRef]);

    return (
        <Button
            type="submit"
            className="w-full btn-luxury"
            disabled={pending}
            aria-disabled={pending}
            onClick={(e) => {
                // Synchronous double-submit guard: a second click landing before
                // React re-renders the pending state is swallowed here.
                if (lockRef.current) {
                    e.preventDefault();
                    return;
                }
                lockRef.current = true;
            }}
        >
            <Calendar className="w-4 h-4 mr-2" />
            {pending ? 'Sending…' : 'Request Consultation'}
        </Button>
    );
}

export function ConsultationForm() {
    const [state, formAction] = useFormState(sendConsultationInquiry, initialState);
    const submittingRef = useRef(false);

    const fieldErrors = state.fieldErrors ?? {};

    if (state.ok) {
        return (
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-8 text-center space-y-3 animate-fade-in-up">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--secondary))] mb-1">
                    <Calendar className="w-6 h-6 text-[hsl(var(--accent-foreground))]" />
                </div>
                <h3 className="font-luxury-serif text-2xl text-[hsl(var(--foreground))]">
                    Thank you{state.firstName ? `, ${state.firstName}` : ''}.
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] font-luxury-sans">
                    We&rsquo;ll be in touch within 24 hours.
                </p>
            </div>
        );
    }

    return (
        <form action={formAction} className="space-y-6">
            {/* Honeypot — hidden from real users, bots fill it. */}
            <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px]"
                aria-hidden
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" placeholder="John" required />
                    <FieldError message={fieldErrors.firstName} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" placeholder="Doe" required />
                    <FieldError message={fieldErrors.lastName} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                    <FieldError message={fieldErrors.email} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                    <FieldError message={fieldErrors.phone} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="preferredDate">Preferred Date</Label>
                <Input id="preferredDate" name="preferredDate" type="date" required />
                <FieldError message={fieldErrors.preferredDate} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="preferredTime">Preferred Time</Label>
                <Input id="preferredTime" name="preferredTime" type="time" required />
                <FieldError message={fieldErrors.preferredTime} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="interest">What are you interested in?</Label>
                <select
                    id="interest"
                    name="interest"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                >
                    <option value="">Select an option</option>
                    <option value="engagement-ring">Engagement Ring</option>
                    <option value="wedding-ring">Wedding Ring</option>
                    <option value="custom-jewelry">Custom Jewelry</option>
                    <option value="diamond-selection">Diamond Selection</option>
                    <option value="repair-service">Repair Service</option>
                    <option value="other">Other</option>
                </select>
                <FieldError message={fieldErrors.interest} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your vision or any specific requirements..."
                    rows={5}
                    className="resize-none"
                />
                <FieldError message={fieldErrors.message} />
            </div>

            {state.error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md space-y-1">
                    <p className="text-sm text-destructive font-medium">{state.error}</p>
                    <p className="text-sm text-destructive/80">
                        Or email us at{' '}
                        <a href="mailto:orders@everandalways.com" className="underline">
                            orders@everandalways.com
                        </a>
                        .
                    </p>
                </div>
            )}

            <SubmitButton lockRef={submittingRef} />
        </form>
    );
}
