import type {Metadata} from 'next';
import {query} from '@/lib/vendure/api';
import {
    GetActiveOrderForCheckoutQuery,
    GetCustomerAddressesQuery,
    GetEligiblePaymentMethodsQuery,
    GetEligibleShippingMethodsQuery,
} from '@/lib/vendure/queries';
import {redirect} from 'next/navigation';
import CheckoutFlow from './checkout-flow';
import {CheckoutProvider} from './checkout-provider';
import {noIndexRobots} from '@/lib/metadata';
import {getActiveCustomer} from '@/lib/vendure/actions';
import {getAvailableCountriesCached} from '@/lib/vendure/cached';

export const metadata: Metadata = {
    title: 'Checkout',
    description: 'Complete your purchase.',
    robots: noIndexRobots(),
};

export default async function CheckoutPage() {
    try {
        // Check if user is authenticated
        const customer = await getActiveCustomer();
        if (!customer) {
            redirect('/sign-in?redirectTo=/checkout');
        }

        const [orderRes, addressesRes, countriesRes, shippingMethodsRes, paymentMethodsRes] =
            await Promise.allSettled([
                query(GetActiveOrderForCheckoutQuery, {}, {useAuthToken: true}),
                query(GetCustomerAddressesQuery, {}, {useAuthToken: true}),
                getAvailableCountriesCached(),
                query(GetEligibleShippingMethodsQuery, {}, {useAuthToken: true}),
                query(GetEligiblePaymentMethodsQuery, {}, {useAuthToken: true}),
            ]);

        // Handle order query result
        if (orderRes.status === 'rejected') {
            console.error('Failed to fetch active order:', orderRes.reason);
            redirect('/cart');
        }
        const activeOrder = orderRes.value.data.activeOrder;

        if (!activeOrder || activeOrder.lines.length === 0) {
            return redirect('/cart');
        }

        // If the order is no longer in AddingItems state, it's been completed
        // Redirect to the order confirmation page
        if (activeOrder.state !== 'AddingItems' && activeOrder.state !== 'ArrangingPayment') {
            return redirect(`/order-confirmation/${activeOrder.code}`);
        }

        // Handle other query results with fallbacks
        const addresses = addressesRes.status === 'fulfilled' 
            ? addressesRes.value.data.activeCustomer?.addresses || []
            : [];
        
        const shippingMethods = shippingMethodsRes.status === 'fulfilled'
            ? shippingMethodsRes.value.data.eligibleShippingMethods || []
            : [];
        
        const paymentMethods = paymentMethodsRes.status === 'fulfilled'
            ? paymentMethodsRes.value.data.eligiblePaymentMethods?.filter((m) => m.isEligible) || []
            : [];
        
        const countries = countriesRes.status === 'fulfilled'
            ? countriesRes.value
            : [];

        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>
                <CheckoutProvider
                    order={activeOrder}
                    addresses={addresses}
                    countries={countries}
                    shippingMethods={shippingMethods}
                    paymentMethods={paymentMethods}
                >
                    <CheckoutFlow/>
                </CheckoutProvider>
            </div>
        );
    } catch (error) {
        console.error('Checkout page error:', error);
        // Redirect to cart on any error
        redirect('/cart');
    }
}
