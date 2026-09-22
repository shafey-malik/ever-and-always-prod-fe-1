import type { Metadata } from 'next';
import { CategoryLanding } from '@/components/category/category-landing';
import { engagementCategory } from '@/lib/ring-categories';
import { SITE_NAME, SITE_URL, buildCanonicalUrl } from '@/lib/metadata';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd, generateCollectionSchema, generateFAQSchema } from '@/lib/seo/schema';
import { getTaxonomyEntry } from '@/lib/seo/taxonomy';

const TITLE = `Engagement Rings — Lab-Grown Diamonds by Style, Shape & Metal | ${SITE_NAME}`;
const DESCRIPTION =
  'Shop engagement rings by style, setting, band, diamond shape, metal and price. Certified lab-grown diamonds, made to order, free US shipping and a lifetime warranty.';

const FAQS = [
  {
    question: 'How much should an engagement ring cost?',
    answer:
      'The "three months salary" rule came from a 1930s advertising campaign and has no basis in anything else. In practice, most Ever and Always customers spend between $900 and $3,000. Because we set certified lab-grown diamonds, that budget buys roughly three to four times the carat weight it would buy in a mined stone of the same grade.',
  },
  {
    question: 'Which diamond shape is best for an engagement ring?',
    answer:
      'Round brilliant is the most popular and returns the most light, but it is also the most expensive per carat. Oval and cushion look larger for their weight and cost less. Emerald and Asscher show clarity more openly, so they suit a higher clarity grade. There is no wrong answer, only a trade-off between sparkle, apparent size and price.',
  },
  {
    question: 'How do I find her ring size without asking?',
    answer:
      'Borrow a ring she already wears on that finger and have us measure it, or trace its inner circle and send us the image. If the size is wrong we resize free within the first year, so an approximate size is enough to propose with.',
  },
  {
    question: 'Can I design an engagement ring that is not on the site?',
    answer:
      'Yes. Every ring we make is made to order, and custom designs carry no design fee. Send a photograph, a sketch or a description and our designers will produce a CAD rendering for you to approve before anything is made.',
  },
  {
    question: 'Does Ever and Always ship engagement rings for free?',
    answer:
      'Yes. Shipping is free, insured and signature-required everywhere in the United States, with no minimum order value.',
  },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'engagement rings',
    'lab grown diamond engagement rings',
    'affordable engagement rings',
    'engagement rings under $2000',
    'cheap engagement rings usa',
    'custom engagement rings',
    'engagement rings by diamond shape',
    'buy engagement rings online',
  ],
  alternates: { canonical: buildCanonicalUrl('/engagement-rings') },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: buildCanonicalUrl('/engagement-rings'),
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function EngagementRingsPage() {
  // Every subcategory tile as a structured ItemList, so the hub is readable as
  // a category index rather than as an undifferentiated page of images.
  const items = engagementCategory.groups.flatMap((group) =>
    group.items.flatMap((item) => {
      const entry = getTaxonomyEntry(item.slug);
      return entry ? [{ name: entry.h1, url: `${SITE_URL}/collection/${item.slug}` }] : [];
    }),
  );

  return (
    <>
      <JsonLd
        data={generateCollectionSchema({
          name: 'Engagement Rings',
          description: DESCRIPTION,
          url: buildCanonicalUrl('/engagement-rings'),
          base: SITE_URL,
          slug: 'engagement-rings',
          products: items,
        })}
      />
      <JsonLd data={generateFAQSchema(FAQS)} />

      <Breadcrumbs
        items={[
          { name: 'Jewelry', href: '/jewelry' },
          { name: 'Engagement Rings', href: '/engagement-rings' },
        ]}
      />

      <CategoryLanding config={engagementCategory} />

      {/* Visible answers to the questions that actually precede this purchase.
          The tile grid above is almost entirely images and links, which gives a
          search or answer engine nothing to quote for this page. */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-luxury-serif font-light">
          Choosing an engagement ring
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
