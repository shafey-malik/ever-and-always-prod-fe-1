'use server';

import {mutate} from '@/lib/vendure/api';
import {
    RemoveFromCartMutation,
    AdjustCartItemMutation,
    ApplyPromotionCodeMutation,
    RemovePromotionCodeMutation
} from '@/lib/vendure/mutations';
import {updateTag} from 'next/cache';

export async function removeFromCart(lineId: string) {
    await mutate(RemoveFromCartMutation, {lineId}, {useAuthToken: true});
    updateTag('cart');
}

export async function adjustQuantity(lineId: string, quantity: number) {
    await mutate(AdjustCartItemMutation, {lineId, quantity}, {useAuthToken: true});
    updateTag('cart');
}

export async function applyPromotionCode(formData: FormData) {
    const code = formData.get('code') as string;
    if (!code) return;

    // The backend refuses coupon changes once checkout has started (the payment
    // amount is already fixed). Swallow that so the cart re-renders unchanged
    // instead of showing the error page.
    try {
        const res = await mutate(ApplyPromotionCodeMutation, {couponCode: code}, {useAuthToken: true});
        console.log({res: res.data.applyCouponCode})
    } catch (error) {
        console.warn('applyCouponCode refused:', error instanceof Error ? error.message : error);
    }
    updateTag('cart');
}

export async function removePromotionCode(formData: FormData) {
    const code = formData.get('code') as string;
    if (!code) return;

    try {
        const res = await mutate(RemovePromotionCodeMutation, {couponCode: code}, {useAuthToken: true});
        console.log({removeRes: res.data.removeCouponCode});
    } catch (error) {
        console.warn('removeCouponCode refused:', error instanceof Error ? error.message : error);
    }
    updateTag('cart');
}
