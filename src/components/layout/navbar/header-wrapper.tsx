import { Suspense } from 'react';
import { Header } from './header';
import { getTopCollections } from '@/lib/vendure/cached';
import { getActiveCustomer } from '@/lib/vendure/actions';
import { query } from '@/lib/vendure/api';
import { GetActiveOrderQuery } from '@/lib/vendure/queries';
import { cache } from 'react';

const getCartQuantity = cache(async () => {
  try {
    const orderResult = await query(GetActiveOrderQuery, undefined, {
      useAuthToken: true,
      tags: ['cart'],
    });
    return orderResult.data.activeOrder?.totalQuantity || 0;
  } catch (error) {
    // Gracefully handle API errors during build (e.g., missing env vars)
    console.warn('Failed to fetch cart quantity:', error);
    return 0;
  }
});

export async function HeaderWrapper() {
  // Gracefully handle API errors during build (e.g., missing env vars or backend not available)
  let collections: { id: string; name: string; slug: string }[] = [];
  let customer: { id: string; firstName: string; lastName: string; emailAddress: string } | null = null;
  let cartQuantity = 0;

  try {
    [collections, customer, cartQuantity] = await Promise.all([
      getTopCollections().catch((error) => {
        console.warn('Failed to fetch collections:', error);
        return [];
      }),
      getActiveCustomer().catch((error) => {
        // getActiveCustomer uses cookies() which may fail during build
        // This is expected and we'll just show as not signed in
        if ((error as any)?.digest === 'DYNAMIC_SERVER_USAGE' || (error as any)?.message?.includes('cookies')) {
          return null;
        }
        console.warn('Failed to fetch customer:', error);
        return null;
      }),
      getCartQuantity(),
    ]);
  } catch (error) {
    // If all API calls fail, continue with empty/default values
    console.warn('HeaderWrapper: Some API calls failed during build:', error);
  }

  const isSignedIn = !!customer?.id;

  return (
    <Header
      cartQuantity={cartQuantity}
      isSignedIn={isSignedIn}
      collections={collections}
    />
  );
}
