'use server';

import { mutate, query } from '@/lib/vendure/api';
import {
    SetOrderShippingAddressMutation,
    SetOrderBillingAddressMutation,
    SetOrderShippingMethodMutation,
    AddPaymentToOrderMutation,
    CreateCustomerAddressMutation,
    TransitionOrderToStateMutation,
    CreateStripePaymentIntentMutation,
} from '@/lib/vendure/mutations';
import { GetActiveOrderForCheckoutQuery } from '@/lib/vendure/queries';
import { revalidatePath, updateTag } from 'next/cache';
import { redirect } from "next/navigation";

interface AddressInput {
    fullName: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    countryCode: string;
    phoneNumber: string;
    company?: string;
}

export async function setShippingAddress(
    shippingAddress: AddressInput,
    useSameForBilling: boolean
) {
    const shippingResult = await mutate(
        SetOrderShippingAddressMutation,
        { input: shippingAddress },
        { useAuthToken: true }
    );

    if (shippingResult.data.setOrderShippingAddress.__typename !== 'Order') {
        throw new Error('Failed to set shipping address');
    }

    if (useSameForBilling) {
        await mutate(
            SetOrderBillingAddressMutation,
            { input: shippingAddress },
            { useAuthToken: true }
        );
    }

    revalidatePath('/checkout');
}

export async function setShippingMethod(shippingMethodId: string) {
    try {
        const result = await mutate(
            SetOrderShippingMethodMutation,
            { shippingMethodId: [shippingMethodId] },
            { useAuthToken: true }
        );

        if (result.data.setOrderShippingMethod.__typename !== 'Order') {
            const errorResult = result.data.setOrderShippingMethod;
            const errorMessage = errorResult.message || 'Failed to set shipping method';
            console.error('Failed to set shipping method:', errorMessage);
            console.error('Shipping method ID:', shippingMethodId);
            console.error('Full error:', JSON.stringify(errorResult, null, 2));
            throw new Error(`Failed to set shipping method: ${errorMessage}`);
        }

        revalidatePath('/checkout');
    } catch (error) {
        console.error('setShippingMethod error:', error);
        throw error;
    }
}

export async function createCustomerAddress(address: AddressInput) {
    const result = await mutate(
        CreateCustomerAddressMutation,
        { input: address },
        { useAuthToken: true }
    );

    if (!result.data.createCustomerAddress) {
        throw new Error('Failed to create customer address');
    }

    revalidatePath('/checkout');
    return result.data.createCustomerAddress;
}

export async function createStripePaymentIntent() {
    try {
        // First, ensure the order is in ArrangingPayment state
        // This is required by Vendure before creating a payment intent
        try {
            const orderQuery = await query(GetActiveOrderForCheckoutQuery, {}, { useAuthToken: true });
            const order = (orderQuery.data as any).activeOrder;
            
            if (!order) {
                return {
                    success: false,
                    error: 'No active order found. Please add items to your cart.',
                };
            }
            
            const currentState = order.state;
            
            if (currentState !== 'ArrangingPayment') {
                await transitionToArrangingPayment();
            }
        } catch (transitionError) {
            // If transition fails, try to continue anyway - the mutation might still work
            // But log the error for debugging
            if (transitionError instanceof Error) {
                // Only continue if it's a state transition error (order might already be in correct state)
                if (!transitionError.message.includes('ORDER_STATE_TRANSITION_ERROR') && 
                    !transitionError.message.includes('ArrangingPayment')) {
                    return {
                        success: false,
                        error: 'Failed to prepare order for payment. Please try again.',
                    };
                }
            }
        }
        
        const result = await mutate(
            CreateStripePaymentIntentMutation,
            {},
            { useAuthToken: true }
        );

        // The mutation returns a String (client secret) directly
        const clientSecret = result.data.createStripePaymentIntent as string;

        // Validate client secret format (Stripe client secrets start with specific prefixes)
        if (clientSecret && typeof clientSecret === 'string' && clientSecret.length > 0) {
            // Basic validation: Stripe client secrets are typically long strings
            if (clientSecret.length < 20) {
                return {
                    success: false,
                    error: 'Invalid payment intent received. Please try again.',
                };
            }
            
            return {
                success: true,
                clientSecret: clientSecret,
            };
        } else {
            return {
                success: false,
                error: 'Failed to create payment intent. Please try again or contact support.',
            };
        }
    } catch (error) {
        // Handle different error types
        let errorMessage = 'Failed to create payment intent. Please try again.';
        
        if (error instanceof Error) {
            // Network errors
            if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('timeout')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }
            // HTTP errors
            else if (error.message.includes('HTTP error')) {
                if (error.message.includes('401') || error.message.includes('403')) {
                    errorMessage = 'Authentication error. Please sign in and try again.';
                } else if (error.message.includes('400')) {
                    errorMessage = 'Invalid request. Please refresh the page and try again.';
                } else if (error.message.includes('500')) {
                    errorMessage = 'Server error. Please try again in a moment.';
                }
            }
            // Other errors - use the original message if it's user-friendly
            else if (error.message && !error.message.includes('at ') && !error.message.includes('Error:')) {
                errorMessage = error.message;
            }
        }
        
        return {
            success: false,
            error: errorMessage,
        };
    }
}

export async function transitionToArrangingPayment() {
    try {
        const result = await mutate(
            TransitionOrderToStateMutation,
            { state: 'ArrangingPayment' },
            { useAuthToken: true }
        );

        // Check if the transition was successful
        if (result.data.transitionOrderToState?.__typename === 'Order') {
            revalidatePath('/checkout');
            return;
        }

        // Handle transition errors
        if (result.data.transitionOrderToState?.__typename === 'OrderStateTransitionError') {
            const errorResult = result.data.transitionOrderToState;

            // Check if the order is already in ArrangingPayment state
            // This can happen if the user navigates back or the order was already transitioned
            const isAlreadyInState =
                (errorResult.fromState === 'ArrangingPayment' && errorResult.toState === 'ArrangingPayment') ||
                (errorResult.fromState === 'ArrangingPayment');

            // Also check the error message for the same-state transition
            const messageIndicatesSameState =
                errorResult.message?.includes('Cannot transition Order from "ArrangingPayment" to "ArrangingPayment"') ||
                errorResult.message?.includes('from "ArrangingPayment" to "ArrangingPayment"') ||
                errorResult.message?.toLowerCase().includes('already in state') ||
                (errorResult.message?.includes('ArrangingPayment') && errorResult.message?.includes('ArrangingPayment'));

            // Check error code - ORDER_STATE_TRANSITION_ERROR with same from/to states
            const isSameStateError =
                errorResult.errorCode === 'ORDER_STATE_TRANSITION_ERROR' &&
                isAlreadyInState;

            if (isAlreadyInState || messageIndicatesSameState || isSameStateError) {
                // Order is already in the correct state, no need to throw an error
                // This is a valid scenario - just continue
                revalidatePath('/checkout');
                return;
            }

            // For any other transition error, throw it
            const errorMessage = `Failed to transition order state: ${errorResult.errorCode} - ${errorResult.message}`;
            console.error('State transition error:', errorMessage);
            throw new Error(errorMessage);
        }

        // If we get here, something unexpected happened
        console.error('Unexpected transition result:', result.data.transitionOrderToState);
        revalidatePath('/checkout');
    } catch (error) {
        // Log and rethrow
        console.error('transitionToArrangingPayment error:', error);
        throw error;
    }
}

export async function placeOrder(paymentMethodCode: string, paymentIntentId?: string) {
    // Validate inputs
    if (!paymentMethodCode || typeof paymentMethodCode !== 'string' || paymentMethodCode.trim().length === 0) {
        throw new Error('Payment method is required');
    }

    try {
        // Check current order state before attempting transition
        let currentState: string | undefined;
        let order: any = null;
        
        try {
            const orderQuery = await query(GetActiveOrderForCheckoutQuery, {}, { useAuthToken: true });
            order = (orderQuery.data as any).activeOrder;
            currentState = order?.state;
            
            // Validate order exists
            if (!order) {
                throw new Error('No active order found. Please add items to your cart.');
            }
        } catch (queryError) {
            if (queryError instanceof Error && queryError.message.includes('No active order')) {
                throw queryError;
            }
            // Continue with transition attempt if query fails
        }

        // Only transition if not already in ArrangingPayment
        if (currentState !== 'ArrangingPayment') {
            try {
                await transitionToArrangingPayment();
            } catch (transitionError) {
                // Handle transition errors gracefully
                if (transitionError instanceof Error) {
                    // Check if it's the same-state transition error (safe to ignore)
                    if (transitionError.message.includes('ArrangingPayment') ||
                        transitionError.message.includes('ORDER_STATE_TRANSITION_ERROR')) {
                        // Order is already in correct state, continue
                        // This is expected in some edge cases
                    } else {
                        // Different error - might be critical
                        throw new Error(`Failed to prepare order for payment: ${transitionError.message}`);
                    }
                } else {
                    throw new Error('Failed to prepare order for payment. Please try again.');
                }
            }
        }

        // Prepare metadata based on payment method
        const metadata: Record<string, unknown> = {};

        // For standard payment, include the required fields
        if (paymentMethodCode === 'standard-payment') {
            metadata.shouldDecline = false;
            metadata.shouldError = false;
            metadata.shouldErrorOnSettle = false;
        }

        // For Stripe payments, include the payment intent ID in metadata
        // Vendure Stripe plugin expects this to link the payment
        if (paymentIntentId && paymentMethodCode.toLowerCase().includes('stripe')) {
            // Validate payment intent ID format (Stripe IDs start with specific prefixes)
            if (paymentIntentId.startsWith('pi_') || paymentIntentId.length > 20) {
                metadata.paymentIntentId = paymentIntentId;
            } else {
                // Invalid payment intent ID format
                throw new Error('Invalid payment confirmation. Please complete the payment again.');
            }
        } else if (paymentMethodCode.toLowerCase().includes('stripe') && !paymentIntentId) {
            // Stripe payment but no intent ID - this shouldn't happen if payment was confirmed
            // But we'll allow it in case webhook handles it
            // Don't add metadata, let webhook handle it
        }

        // Add payment to the order
        // Build the input object - only include metadata if it has values
        const result = await mutate(
            AddPaymentToOrderMutation,
            {
                input: {
                    method: paymentMethodCode,
                    metadata: Object.keys(metadata).length > 0 ? metadata : {},
                },
            },
            { useAuthToken: true }
        );

        // Check the result
        if (result.data.addPaymentToOrder.__typename !== 'Order') {
            const errorResult = result.data.addPaymentToOrder;
            const errorMessage = `Failed to place order: ${errorResult.errorCode} - ${errorResult.message}`;

            console.error('Payment failed:', errorMessage);

            throw new Error(errorMessage);
        }

        const orderCode = (result.data.addPaymentToOrder as any).code;

        if (!orderCode || typeof orderCode !== 'string' || orderCode.trim().length === 0) {
            throw new Error('Order confirmation failed. Please contact support with your payment details.');
        }

        // Update the cart tag to immediately invalidate cached cart data
        updateTag('cart');
        updateTag('active-order');

        // Redirect to order confirmation
        // Note: redirect() throws a special error that Next.js catches - this is expected
        redirect(`/order-confirmation/${orderCode}`);
    } catch (error) {
        // Handle redirects (Next.js redirect() throws an error, but it's expected)
        if (error instanceof Error) {
            const isRedirect =
                error.message.includes('NEXT_REDIRECT') ||
                (error as any).digest?.startsWith('NEXT_REDIRECT');

            if (isRedirect) {
                // This is a redirect, let it propagate (Next.js handles this)
                throw error;
            }

            // For other errors, provide user-friendly messages
            let errorMessage = error.message;
            
            // Enhance error messages for common cases
            if (error.message.includes('No active order')) {
                errorMessage = 'Your cart is empty. Please add items before placing an order.';
            } else if (error.message.includes('transition') || error.message.includes('state')) {
                errorMessage = 'Order processing error. Please refresh the page and try again.';
            } else if (error.message.includes('Payment') || error.message.includes('payment')) {
                errorMessage = error.message; // Keep payment-related errors as-is
            } else if (!error.message || error.message.includes('at ') || error.message.includes('Error:')) {
                errorMessage = 'Failed to place order. Please try again or contact support.';
            }

            throw new Error(errorMessage);
        }
        
        throw new Error('An unexpected error occurred. Please try again.');
    }
}
