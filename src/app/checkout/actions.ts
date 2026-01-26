'use server';

import {mutate} from '@/lib/vendure/api';
import {
    SetOrderShippingAddressMutation,
    SetOrderBillingAddressMutation,
    SetOrderShippingMethodMutation,
    AddPaymentToOrderMutation,
    CreateCustomerAddressMutation,
    TransitionOrderToStateMutation,
} from '@/lib/vendure/mutations';
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
    const result = await mutate(
        TransitionOrderToStateMutation,
        {state: 'ArrangingPayment'},
        {useAuthToken: true}
    );

    if (result.data.transitionOrderToState?.__typename === 'OrderStateTransitionError') {
        const errorResult = result.data.transitionOrderToState;
        // If the order is already in ArrangingPayment state, that's okay - just continue
        // Check for the specific error message about same-state transition
        if (
            errorResult.message?.includes('Cannot transition Order from "ArrangingPayment" to "ArrangingPayment"') ||
            errorResult.message?.includes('from "ArrangingPayment" to "ArrangingPayment"') ||
            errorResult.transitionError === 'ALREADY_IN_STATE'
        ) {
            // Order is already in the correct state, no need to throw an error
            revalidatePath('/checkout');
            return;
        }
        throw new Error(
            `Failed to transition order state: ${errorResult.errorCode} - ${errorResult.message}`
        );
    }

    revalidatePath('/checkout');
}

export async function placeOrder(paymentMethodCode: string, paymentIntentId?: string) {
    // First, transition the order to ArrangingPayment state (if not already there)
    // This function now handles the case where the order is already in that state gracefully
    try {
        await transitionToArrangingPayment();
    } catch (error) {
        // If transition fails but it's because we're already in the state, continue
        // Otherwise, rethrow the error
        if (error instanceof Error && error.message.includes('ArrangingPayment')) {
            // Likely already in the correct state, continue with payment
        } else {
            throw error;
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

    // For Stripe payments, include the payment intent ID
    if (paymentIntentId && paymentMethodCode.toLowerCase().includes('stripe')) {
        metadata.paymentIntentId = paymentIntentId;
    }

    // Add payment to the order
    const result = await mutate(
        AddPaymentToOrderMutation,
        {
            input: {
                method: paymentMethodCode,
                metadata,
            },
        },
        {useAuthToken: true}
    );

    if (result.data.addPaymentToOrder.__typename !== 'Order') {
        const errorResult = result.data.addPaymentToOrder;
        throw new Error(
            `Failed to place order: ${errorResult.errorCode} - ${errorResult.message}`
        );
    }

    const orderCode = result.data.addPaymentToOrder.code;

    // Update the cart tag to immediately invalidate cached cart data
    updateTag('cart');
    updateTag('active-order');

    redirect(`/order-confirmation/${orderCode}`);
}
