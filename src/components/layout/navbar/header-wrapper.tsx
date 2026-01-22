import { Suspense } from 'react';
import { Header } from './header';
import { getTopCollections } from '@/lib/vendure/cached';
import { getActiveCustomer } from '@/lib/vendure/actions';
import { query } from '@/lib/vendure/api';
import { GetActiveOrderQuery } from '@/lib/vendure/queries';
import { cache } from 'react';

const getCartQuantity = cache(async () => {
  const orderResult = await query(GetActiveOrderQuery, undefined, {
    useAuthToken: true,
    tags: ['cart'],
  });

  return orderResult.data.activeOrder?.totalQuantity || 0;
});

export async function HeaderWrapper() {
  const [collections, customer, cartQuantity] = await Promise.all([
    getTopCollections(),
    getActiveCustomer(),
    getCartQuantity(),
  ]);

  const isSignedIn = !!customer?.id;

  return (
    <Header
      cartQuantity={cartQuantity}
      isSignedIn={isSignedIn}
      collections={collections}
    />
  );
}
