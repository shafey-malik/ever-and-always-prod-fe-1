import type { Metadata } from 'next';
import { WishlistView } from '@/components/commerce/wishlist-view';
import { SITE_NAME, buildCanonicalUrl } from '@/lib/metadata';

export const metadata: Metadata = {
  title: `Your Wishlist | ${SITE_NAME}`,
  description:
    'The diamond pieces you have saved at Ever and Always — kept in one place, ready for when you are.',
  alternates: {
    canonical: buildCanonicalUrl('/wishlist'),
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function WishlistPage() {
  return (
    <div className="min-h-screen">
      <WishlistView />
    </div>
  );
}
