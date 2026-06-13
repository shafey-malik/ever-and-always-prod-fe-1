import type { Metadata } from 'next';
import { CategoryLanding } from '@/components/category/category-landing';
import { engagementCategory } from '@/lib/ring-categories';
import { SITE_NAME, buildCanonicalUrl } from '@/lib/metadata';

export const metadata: Metadata = {
  title: `Engagement Rings — Shop by Style, Setting, Shape & Metal | ${SITE_NAME}`,
  description:
    'Explore the full Ever and Always engagement ring atelier — solitaire, halo, three-stone and more, by setting, band, diamond shape, metal and price. Find the ring that begins forever.',
  alternates: {
    canonical: buildCanonicalUrl('/engagement-rings'),
  },
  openGraph: {
    title: `Engagement Rings | ${SITE_NAME}`,
    description:
      'Shop engagement rings by style, setting, diamond shape, metal and price at Ever and Always.',
    type: 'website',
    url: buildCanonicalUrl('/engagement-rings'),
  },
};

export default function EngagementRingsPage() {
  return <CategoryLanding config={engagementCategory} />;
}
