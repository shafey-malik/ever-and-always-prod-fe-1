'use client';

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ReactNode } from 'react';

// Validate Stripe publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

if (!stripePublishableKey) {
    console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Stripe payments will not work.');
}

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface StripeProviderProps {
    children: ReactNode;
    clientSecret?: string;
    options?: StripeElementsOptions;
}

export function StripeProvider({ children, clientSecret, options }: StripeProviderProps) {
    // Validate required props
    if (!clientSecret || typeof clientSecret !== 'string' || clientSecret.length === 0) {
        return (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">Invalid payment configuration. Please try again.</p>
            </div>
        );
    }

    if (!stripePromise) {
        return (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">Payment system is not configured. Please contact support.</p>
            </div>
        );
    }

    // Build options - when using clientSecret, we can't use mode
    const elementsOptions: StripeElementsOptions = {
        clientSecret,
        appearance: {
            theme: 'stripe',
            ...options?.appearance,
        },
        // Spread other options but exclude mode (not compatible with clientSecret)
        ...(options && Object.fromEntries(
            Object.entries(options).filter(([key]) => key !== 'mode')
        )),
    } as StripeElementsOptions;

    return (
        <Elements stripe={stripePromise} options={elementsOptions}>
            {children}
        </Elements>
    );
}
