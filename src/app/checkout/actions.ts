'use server';

import {mutate, query} from '@/lib/vendure/api';
import {
    SetOrderShippingAddressMutation,
    SetOrderBillingAddressMutation,
    SetOrderShippingMethodMutation,
    AddPaymentToOrderMutation,
    CreateCustomerAddressMutation,
    TransitionOrderToStateMutation,
} from '@/lib/vendure/mutations';
import {GetActiveOrderForCheckoutQuery} from '@/lib/vendure/queries';
import {revalidatePath, updateTag} from 'next/cache';
import {redirect} from "next/navigation";

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
        {input: shippingAddress},
        {useAuthToken: true}
    );

    if (shippingResult.data.setOrderShippingAddress.__typename !== 'Order') {
        throw new Error('Failed to set shipping address');
    }

    if (useSameForBilling) {
        await mutate(
            SetOrderBillingAddressMutation,
            {input: shippingAddress},
            {useAuthToken: true}
        );
    }

    revalidatePath('/checkout');
}

export async function setShippingMethod(shippingMethodId: string) {
    const result = await mutate(
        SetOrderShippingMethodMutation,
        {shippingMethodId: [shippingMethodId]},
        {useAuthToken: true}
    );

    if (result.data.setOrderShippingMethod.__typename !== 'Order') {
        throw new Error('Failed to set shipping method');
    }

    revalidatePath('/checkout');
}

export async function createCustomerAddress(address: AddressInput) {
    const result = await mutate(
        CreateCustomerAddressMutation,
        {input: address},
        {useAuthToken: true}
    );

    if (!result.data.createCustomerAddress) {
        throw new Error('Failed to create customer address');
    }

    revalidatePath('/checkout');
    return result.data.createCustomerAddress;
}

export async function transitionToArrangingPayment() {
    try {
        const result = await mutate(
            TransitionOrderToStateMutation,
            {state: 'ArrangingPayment'},
            {useAuthToken: true}
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
    try {
        // Check current order state before attempting transition
        let currentState: string | undefined;
        try {
            const orderQuery = await query(GetActiveOrderForCheckoutQuery, {}, {useAuthToken: true});
            currentState = orderQuery.data.activeOrder?.state;
            console.log('Current order state:', currentState);
        } catch (queryError) {
            console.warn('Could not query order state, proceeding with transition:', queryError);
        }

        // Only transition if not already in ArrangingPayment
        if (currentState !== 'ArrangingPayment') {
            try {
                await transitionToArrangingPayment();
            } catch (transitionError) {
                // Log the transition error but continue if it's the same-state error
                if (transitionError instanceof Error) {
                    // Check if it's the same-state transition error (safe to ignore)
                    if (transitionError.message.includes('ArrangingPayment') || 
                        transitionError.message.includes('ORDER_STATE_TRANSITION_ERROR')) {
                        // Order is already in correct state, continue
                        console.log('Order already in ArrangingPayment state, continuing...');
                    } else {
                        // Different error, rethrow
                        console.error('Unexpected transition error:', transitionError);
                        throw transitionError;
                    }
                } else {
                    throw transitionError;
                }
            }
        } else {
            console.log('Order already in ArrangingPayment state, skipping transition');
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
            metadata.paymentIntentId = paymentIntentId;
        }

        // Log what we're sending for debugging
        console.log('Placing order with:', {
            paymentMethodCode,
            hasPaymentIntentId: !!paymentIntentId,
            metadataKeys: Object.keys(metadata)
        });

        // Add payment to the order
        const result = await mutate(
            AddPaymentToOrderMutation,
            {
                input: {
                    method: paymentMethodCode,
                    metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
                },
            },
            {useAuthToken: true}
        );

        // Check the result
        if (result.data.addPaymentToOrder.__typename !== 'Order') {
            const errorResult = result.data.addPaymentToOrder;
            const errorMessage = `Failed to place order: ${errorResult.errorCode} - ${errorResult.message}`;
            
            // Enhanced logging for debugging
            console.error('=== PAYMENT FAILED ===');
            console.error('Error:', errorMessage);
            console.error('Payment method code:', paymentMethodCode);
            console.error('Payment intent ID:', paymentIntentId || 'none');
            console.error('Metadata sent:', JSON.stringify(metadata, null, 2));
            console.error('Full error result:', JSON.stringify(errorResult, null, 2));
            console.error('========================');
            
            throw new Error(errorMessage);
        }

        const orderCode = result.data.addPaymentToOrder.code;

        if (!orderCode) {
            console.error('Order code is missing from response');
            console.error('Full response:', JSON.stringify(result.data.addPaymentToOrder, null, 2));
            throw new Error('Order code is missing from response');
        }

        // Update the cart tag to immediately invalidate cached cart data
        updateTag('cart');
        updateTag('active-order');

        // Redirect to order confirmation
        // Note: redirect() throws a special error that Next.js catches - this is expected
        redirect(`/order-confirmation/${orderCode}`);
    } catch (error) {
        // Log the full error for debugging
        console.error('=== PLACE ORDER ERROR ===');
        console.error('Error type:', error?.constructor?.name);
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
        if (error instanceof Error && 'digest' in error) {
            console.error('Error digest:', (error as any).digest);
        }
        console.error('==========================');
        
        // Re-throw with more context if it's not a redirect
        if (error instanceof Error) {
            // Check if it's a Next.js redirect (which throws an error but is expected)
            // Redirect errors have a specific digest pattern
            const isRedirect = 
                error.message.includes('NEXT_REDIRECT') || 
                (error as any).digest?.startsWith('NEXT_REDIRECT') ||
                (error as any).digest?.startsWith('1'); // Next.js redirect digest pattern
            
            if (isRedirect) {
                // This is a redirect, let it propagate (Next.js handles this)
                throw error;
            }
            // For other errors, add more context but preserve original message
            const enhancedError = new Error(`Failed to place order: ${error.message}`);
            (enhancedError as any).originalError = error;
            throw enhancedError;
        }
        throw error;
    }
}
