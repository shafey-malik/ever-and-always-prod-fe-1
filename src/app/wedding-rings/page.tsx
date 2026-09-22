import type { Metadata } from 'next';
import { CategoryLanding } from '@/components/category/category-landing';
import { weddingCategory } from '@/lib/ring-categories';
import { SITE_NAME, SITE_URL, buildCanonicalUrl } from '@/lib/metadata';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd, generateCollectionSchema, generateFAQSchema } from '@/lib/seo/schema';
import { getTaxonomyEntry } from '@/lib/seo/taxonomy';

const TITLE = `Wedding Rings & Bands — For Every Hand | ${SITE_NAME}`;
const DESCRIPTION =
  'Shop wedding bands by gender, style, setting, band design and metal. Lab-grown diamond and classic metal bands, made to order, with free US shipping.';

const FAQS = [
  {
    question: 'How much does a wedding band cost?',
    answer:
      'Plain metal bands at Ever and Always start around $200, diamond-set bands typically run $400 to $1,200, and full eternity bands in lab-grown diamonds usually fall between $900 and $2,500. Metal weight and diamond coverage drive the price far more than brand does.',
  },
  {
    question: 'What is the difference between comfort fit and standard fit?',
    answer:
      'A comfort fit band is domed on the inside so it glides over the knuckle and sits on a smaller contact area. It is noticeably easier to wear daily, especially in wider bands, and it usually means ordering a quarter size down from your standard-fit size.',
  },
  {
    question: 'Should the wedding band match the engagement ring metal?',
    answer:
      'It does not have to. Mixing metals is common and deliberate. The one practical caution is hardness: a platinum band worn against a 10K gold ring will wear the softer metal over years of contact, so matching hardness matters more than matching colour.',
  },
  {
    question: 'Can you make a band that fits my existing engagement ring?',
    answer:
      'Yes. Send photographs and the ring size and we will cut a contour or notched band that sits flush against it, even if the engagement ring was bought elsewhere.',
  },
  {
    question: 'Do you make matching sets for both partners?',
    answer:
      'Yes. Couple matching bands are a standard category, and any design can be produced in a narrower and a wider width so the pair reads as a set without being identical.',
  },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'wedding rings',
    'wedding bands',
    'mens wedding bands',
    'womens wedding bands',
    'affordable wedding rings',
    'matching wedding ring sets',
    'lab grown diamond wedding band',
    'eternity bands',
  ],
  alternates: { canonical: buildCanonicalUrl('/wedding-rings') },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: buildCanonicalUrl('/wedding-rings'),
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function WeddingRingsPage() {
  // Every subcategory tile as a structured ItemList, so the hub is readable as
  // a category index rather than as an undifferentiated page of images.
  const items = weddingCategory.groups.flatMap((group) =>
    group.items.flatMap((item) => {
      const entry = getTaxonomyEntry(item.slug);
      return entry ? [{ name: entry.h1, url: `${SITE_URL}/collection/${item.slug}` }] : [];
    }),
  );

  return (
    <>
      <JsonLd
        data={generateCollectionSchema({
          name: 'Wedding Rings',
          description: DESCRIPTION,
          url: buildCanonicalUrl('/wedding-rings'),
          base: SITE_URL,
          slug: 'wedding-rings',
          products: items,
        })}
      />
      <JsonLd data={generateFAQSchema(FAQS)} />

      <Breadcrumbs
        items={[
          { name: 'Jewelry', href: '/jewelry' },
          { name: 'Wedding Rings', href: '/wedding-rings' },
        ]}
      />

      <CategoryLanding config={weddingCategory} />

      {/* Visible answers to the questions that actually precede this purchase.
          The tile grid above is almost entirely images and links, which gives a
          search or answer engine nothing to quote for this page. */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-luxury-serif font-light">
          Choosing a wedding band
        </h2>
        <dl className="mt-6 space-y-7">
          {FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="font-medium">{faq.question}</dt>
              <dd className="mt-1.5 text-sm text-muted-foreground font-light leading-relaxed">
                {faq.answer}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
