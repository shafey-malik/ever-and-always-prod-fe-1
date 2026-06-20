'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Phone, Loader2 } from 'lucide-react';
import { requestCancellation } from './actions';

interface CancelRequestDialogProps {
    orderCode: string;
    /** Pre-fill the phone field from the shipping address if available. */
    defaultPhone?: string | null;
}

export function CancelRequestDialog({ orderCode, defaultPhone }: CancelRequestDialogProps) {
    const [open, setOpen] = useState(false);
    const [phone, setPhone] = useState(defaultPhone?.trim() ?? '');
    const [error, setError] = useState<string | null>(null);
    const [succeeded, setSucceeded] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            const result = await requestCancellation(orderCode, phone);
            if (result.ok) {
                setSucceeded(true);
            } else {
                setError(result.error ?? 'Something went wrong. Please try again.');
            }
        });
    };

    const handleOpenChange = (isOpen: boolean) => {
        if (isPending) return; // prevent closing while in-flight
        setOpen(isOpen);
        // Reset internal state after the dialog animates out
        if (!isOpen) {
            setTimeout(() => {
                setError(null);
                setSucceeded(false);
                setPhone(defaultPhone?.trim() ?? '');
            }, 250);
        }
    };

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 hover:text-red-800"
                onClick={() => setOpen(true)}
            >
                Request Cancellation
            </Button>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-md">
                    {succeeded ? (
                        // ── Success state ───────────────────────────────────────────────
                        <div className="flex flex-col items-center text-center py-4 gap-4">
                            <CheckCircle2 className="h-12 w-12 text-green-500 shrink-0" />
                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">Request Submitted</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    We&rsquo;ve received your cancellation request for{' '}
                                    <strong>Order #{orderCode}</strong> and sent a confirmation to your email address.
                                </p>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    Our team will review your request and be in touch within{' '}
                                    <strong>24&ndash;48 hours</strong>. Thank you for your patience.
                                </p>
                            </div>
                            <Button className="w-full mt-2" onClick={() => setOpen(false)}>
                                Done
                            </Button>
                        </div>
                    ) : (
                        // ── Form state ──────────────────────────────────────────────────
                        <>
                            <DialogHeader>
                                <DialogTitle>Request Order Cancellation</DialogTitle>
                                <DialogDescription>
                                    Our team will review your request and contact you within 24–48 hours to
                                    discuss the details and work towards the best possible outcome for you.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 leading-relaxed">
                                A confirmation email will be sent to the address on your account. Please
                                provide a phone number below so our team can reach you promptly.
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cancel-phone">
                                        Phone Number <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="cancel-phone"
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            className="pl-10"
                                            required
                                            minLength={6}
                                            maxLength={30}
                                            disabled={isPending}
                                            autoComplete="tel"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-sm text-destructive">{error}</p>
                                )}

                                <div className="flex gap-3 pt-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleOpenChange(false)}
                                        disabled={isPending}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={isPending}
                                    >
                                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isPending ? 'Submitting…' : 'Submit Request'}
                                    </Button>
                                </div>
                            </form>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
