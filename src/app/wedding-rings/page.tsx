import type { Metadata } from 'next';
import { CategoryLanding } from '@/components/category/category-landing';
import { weddingCategory } from '@/lib/ring-categories';
import { SITE_NAME, buildCanonicalUrl } from '@/lib/metadata';

export const metadata: Metadata = {
  title: `Wedding Rings & Bands — Shop by Style, Setting & Metal | ${SITE_NAME}`,
  description:
    "Discover Ever and Always wedding bands for every hand — women's, men's and matching sets, by style, setting, band design and metal. The ring you wear forever.",
  alternates: {
    canonical: buildCanonicalUrl('/wedding-rings'),
  },
  openGraph: {
    title: `Wedding Rings & Bands | ${SITE_NAME}`,
    description:
      'Shop wedding bands by gender, style, setting, band design and metal at Ever and Always.',
    type: 'website',
    url: buildCanonicalUrl('/wedding-rings'),
  },
};

export default function WeddingRingsPage() {
  return <CategoryLanding config={weddingCategory} />;
}
