import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, buildCanonicalUrl } from '@/lib/metadata';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd, generateCollectionSchema, generateFAQSchema } from '@/lib/seo/schema';
import { engagementCategory, weddingCategory } from '@/lib/ring-categories';
import { getTaxonomyEntry, getTaxonomyByBase } from '@/lib/seo/taxonomy';

/**
 * The top-level jewellery hub.
 *
 * Every BreadcrumbList on the site — product pages, category pages, price
 * pages — declares `/jewelry` as its root, but the route did not exist, so the
 * first link in the structured breadcrumb trail of every page 404'd.
 *
 * Beyond fixing that, this is the site's main crawl path: it links to all ~90
 * category pages from one place, which is how deep categories get discovered
 * and how link equity reaches them from the home page in two hops.
 */

const TITLE = `All Jewelry — Lab-Grown Diamond Rings by Style, Shape & Metal | ${SITE_NAME}`;
const DESCRIPTION =
  'Browse every Ever and Always category: engagement rings and wedding bands by style, setting, band, diamond shape, metal and price. Certified lab-grown diamonds, made to order.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'lab grown diamond rings',
    'diamond ring categories',
    'engagement rings by shape',
    'wedding bands by metal',
    'affordable diamond jewelry usa',
    'custom diamond rings',
  ],
  alternates: { canonical: buildCanonicalUrl('/jewelry') },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: buildCanonicalUrl('/jewelry'),
  },
};

const FAQS = [
  {
    question: 'What does Ever and Always sell?',
    answer:
      'Ever and Always is a US jeweller specialising in certified lab-grown diamond engagement rings, wedding bands and fully custom designs. Every piece is made to order, in 10K or 14K gold, two-tone gold or platinum, and carries a lifetime warranty on the setting.',
  },
  {
    question: 'How are Ever and Always prices so much lower than a traditional jeweller?',
    answer:
      'Two reasons. We set lab-grown diamonds, which cost a fraction of mined stones of identical grade, and we sell direct rather than through a showroom chain. A ring that would list at $6,000 with a mined centre stone typically lands between $1,200 and $2,000 here with the same carat, cut, colour and clarity.',
  },
  {
    question: 'Can any ring on the site be customised?',
    answer:
      'Yes. Every category here can be made to order — change the diamond shape, carat weight, metal, setting or band profile on any design. You can also start from nothing and send a sketch or reference photo. There is no design fee and custom orders ship in roughly three to four weeks.',
  },
  {
    question: 'Where is Ever and Always based?',
    answer:
      'Ever and Always is based at 7000 Arundel Mills Cir, Hanover, Maryland 21076, and ships free across the United States.',
  },
];

interface HubGroup {
  id: string;
  label: string;
  caption: string;
  slugs: string[];
}

function groupsFor(base: 'engagement' | 'wedding'): HubGroup[] {
  const config = base === 'engagement' ? engagementCategory : weddingCategory;
  return config.groups.map((group) => ({
    id: `${base}-${group.id}`,
    label: group.label,
    caption: group.caption,
    slugs: group.items.map((item) => item.slug),
  }));
}

function CategoryColumn({ group }: { group: HubGroup }) {
  return (
    <div>
      <h3 className="font-luxury-sans text-[10px] tracking-[0.28em] uppercase text-[hsl(var(--secondary))]">
        {group.label}
      </h3>
      <p className="mt-1.5 text-xs text-muted-foreground font-light">{group.caption}</p>
      <ul className="mt-4 space-y-2 text-sm font-light">
        {group.slugs.map((slug) => {
          const entry = getTaxonomyEntry(slug);
          if (!entry) return null;
          return (
            <li key={slug}>
              <Link
                href={`/collection/${slug}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {entry.h1}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function JewelryHubPage() {
  const occasion = getTaxonomyByBase('other');

  const allSlugs = [
    ...groupsFor('engagement').flatMap((g) => g.slugs),
    ...groupsFor('wedding').flatMap((g) => g.slugs),
    ...occasion.map((e) => e.slug),
  ];

  const listSchema = generateCollectionSchema({
    name: 'All Jewelry',
    description: DESCRIPTION,
    url: buildCanonicalUrl('/jewelry'),
    base: SITE_URL,
    slug: 'jewelry',
    products: allSlugs.flatMap((slug) => {
      const entry = getTaxonomyEntry(slug);
      return entry ? [{ name: entry.h1, url: `${SITE_URL}/collection/${slug}` }] : [];
    }),
  });

  return (
    <>
      <JsonLd data={listSchema} />
      <JsonLd data={generateFAQSchema(FAQS)} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Breadcrumbs items={[{ name: 'Jewelry', href: '/jewelry' }]} />

        <header className="max-w-3xl">
          <p className="font-luxury-sans text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--secondary))]">
            The Full Collection
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-luxury-serif font-light">
            Lab-Grown Diamond Rings
          </h1>
          <p className="mt-5 text-lg text-muted-foreground font-light">
            Every category we make, in one place. Engagement rings and wedding bands
            organised by style, setting, band, diamond shape, metal and price, each set
            with independently certified lab-grown diamonds.
          </p>
          <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
            Nothing here is a stock mount. Rings are made to order in our Maryland
            workshop, which means any design on this site can be rebuilt around a
            different stone, metal or setting without a custom surcharge.
          </p>
        </header>

        <section className="mt-16">
          <div className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--border))] pb-3">
            <h2 className="text-2xl sm:text-3xl font-luxury-serif font-light">
              Engagement Rings
            </h2>
            <Link
              href="/engagement-rings"
              className="shrink-0 font-luxury-sans text-[10px] tracking-[0.2em] uppercase text-[hsl(var(--secondary-rich))] hover:underline"
            >
              View the edit
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {groupsFor('engagement').map((group) => (
              <CategoryColumn key={group.id} group={group} />
            ))}
          </div>
        </section>

        <section className="mt-20">
          <div className="flex items-baseline justify-between gap-4 border-b border-[hsl(var(--border))] pb-3">
            <h2 className="text-2xl sm:text-3xl font-luxury-serif font-light">
              Wedding Rings
            </h2>
            <Link
              href="/wedding-rings"
              className="shrink-0 font-luxury-sans text-[10px] tracking-[0.2em] uppercase text-[hsl(var(--secondary-rich))] hover:underline"
            >
              View the edit
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
            {groupsFor('wedding').map((group) => (
              <CategoryColumn key={group.id} group={group} />
            ))}
          </div>
        </section>

        {occasion.length > 0 && (
          <section className="mt-20">
            <h2 className="text-2xl sm:text-3xl font-luxury-serif font-light border-b border-[hsl(var(--border))] pb-3">
              By Occasion
            </h2>
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {occasion.map((entry) => (
                <li key={entry.slug}>
                  <Link href={`/collection/${entry.slug}`} className="group block">
                    <h3 className="font-luxury-serif text-lg font-light group-hover:text-[hsl(var(--secondary-rich))] transition-colors">
                      {entry.h1}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed">
                      {entry.intro[0]}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-20 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-luxury-serif font-light">
            Questions about buying from Ever and Always
          </h2>
          <dl className="mt-6 space-y-6">
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
      </div>
    </>
  );
}
