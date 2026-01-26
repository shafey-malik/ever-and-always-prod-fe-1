'use client';

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ReactNode } from 'react';

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripeProviderProps {
    children: ReactNode;
    clientSecret?: string;
    options?: StripeElementsOptions;
}

export function StripeProvider({ children, clientSecret, options }: StripeProviderProps) {
    const elementsOptions: StripeElementsOptions = {
        ...options,
        clientSecret,
        appearance: {
            theme: 'stripe',
            ...options?.appearance,
        },
    };

    return (
        <Elements stripe={stripePromise} options={elementsOptions}>
            {children}
        </Elements>
    );
}
