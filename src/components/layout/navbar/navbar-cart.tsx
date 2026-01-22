import {cache} from 'react';
import {CartIcon} from './cart-icon';
import {query} from '@/lib/vendure/api';
import {GetActiveOrderQuery} from '@/lib/vendure/queries';

const getCartItemCount = cache(async () => {
    const orderResult = await query(GetActiveOrderQuery, undefined, {
        useAuthToken: true,
        tags: ['cart'],
    });

    return orderResult.data.activeOrder?.totalQuantity || 0;
});

export async function NavbarCart() {
    const cartItemCount = await getCartItemCount();

    return <CartIcon cartItemCount={cartItemCount} />;
}
