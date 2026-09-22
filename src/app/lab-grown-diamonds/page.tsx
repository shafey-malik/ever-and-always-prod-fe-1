import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL, buildCanonicalUrl } from '@/lib/metadata';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { JsonLd, generateFAQSchema, generateArticleSchema } from '@/lib/seo/schema';
import { BUSINESS } from '@/lib/seo/business';

/**
 * Pillar page for the brand's actual differentiator.
 *
 * This is written to be quotable rather than merely readable: AI answer engines
 * lift short, self-contained, factual passages, so every claim here is stated in
 * one or two sentences with its number attached, and the comparison is a real
 * table rather than prose. It is also the consolidation target for the old
 * `/collections/lab-grown-diamond-rings` and `/collections/natural-diamond-rings`
 * pages, which duplicated each other.
 */

const TITLE = `Lab-Grown Diamonds Explained — Are They Real? | ${SITE_NAME}`;
const DESCRIPTION =
  'Lab-grown diamonds are real diamonds: identical carbon crystal, identical 4Cs grading, 60-80% lower price. How they are made, how they compare to mined, and what they cost.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    'lab grown diamonds',
    'are lab grown diamonds real diamonds',
    'lab grown vs natural diamonds',
    'lab created diamond engagement rings',
    'lab grown diamond price',
    'cvd vs hpht diamonds',
    'affordable lab grown diamond rings usa',
  ],
  alternates: { canonical: buildCanonicalUrl('/lab-grown-diamonds') },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'article',
    url: buildCanonicalUrl('/lab-grown-diamonds'),
  },
};

const COMPARISON: Array<{ attribute: string; lab: string; mined: string }> = [
  { attribute: 'Chemical composition', lab: 'Pure crystalline carbon', mined: 'Pure crystalline carbon' },
  { attribute: 'Hardness (Mohs)', lab: '10', mined: '10' },
  { attribute: 'Refractive index', lab: '2.42', mined: '2.42' },
  { attribute: 'Graded on the 4Cs', lab: 'Yes, by IGI / GIA', mined: 'Yes, by IGI / GIA' },
  { attribute: 'Visible difference', lab: 'None, at any magnification', mined: 'None, at any magnification' },
  { attribute: 'How origin is identified', lab: 'Trace growth markers, laser-inscribed on the girdle', mined: 'Trace nitrogen and inclusions' },
  { attribute: 'Typical price, 1.5ct VS1 F', lab: 'About $900 - $1,600', mined: 'About $9,000 - $14,000' },
  { attribute: 'Time to form', lab: 'Two to four weeks', mined: '1 to 3 billion years' },
];

const FAQS = [
  {
    question: 'Are lab-grown diamonds real diamonds?',
    answer:
      'Yes. A lab-grown diamond is the same mineral as a mined diamond: pure crystalline carbon in the same lattice, 10 on the Mohs hardness scale, with the same refractive index and the same fire. Gemmological laboratories grade them on the identical 4Cs scale. The US Federal Trade Commission removed "natural" from its definition of a diamond in 2018 precisely because the two are the same material. The only real difference is where the crystal formed.',
  },
  {
    question: 'Can a jeweller tell a lab-grown diamond from a mined one?',
    answer:
      'Not by eye, and not with a loupe. Distinguishing them requires specialised equipment that reads trace growth markers, which is why every lab-grown stone above 0.5ct is laser-inscribed on the girdle with its report number. Nobody looking at the ring on your hand can tell.',
  },
  {
    question: 'How much cheaper are lab-grown diamonds?',
    answer:
      'Typically 60-80% less than a mined diamond of the same carat, cut, colour and clarity. The gap widens as the stone gets larger, because mined prices spike at each carat threshold while lab-grown prices scale far more gradually. In practice most customers use the saving to move up one to two carats, or to move up in clarity and cut grade at the same carat weight.',
  },
  {
    question: 'Do lab-grown diamonds hold their value?',
    answer:
      'Lab-grown diamonds resell for less than mined diamonds, and this is the one genuine trade-off. It is worth keeping in perspective: mined diamonds also resell far below retail, typically for 25-50% of what was paid. If a ring is being bought to wear rather than as an investment, lab-grown gives you substantially more stone for the money. Ever and Always also credits your stone in full against a larger one if you upgrade with us later.',
  },
  {
    question: 'How are lab-grown diamonds made?',
    answer:
      'Two methods. CVD (Chemical Vapour Deposition) grows a diamond layer by layer from carbon-rich gas onto a thin diamond seed in a vacuum chamber. HPHT (High Pressure High Temperature) recreates the pressure and heat found deep in the earth, around 1,500C and 1.5 million pounds per square inch. Both produce the same result in roughly two to four weeks.',
  },
  {
    question: 'Are lab-grown diamonds better for the environment?',
    answer:
      'Generally yes, though it depends on the energy source of the growing facility. Lab-grown involves no mining, no open pits and no displaced earth, and the origin of every stone is fully traceable. That traceability is the more reliable claim, and it is why lab-grown is the default choice for customers who want certainty about sourcing.',
  },
  {
    question: 'Are the lab-grown diamonds at Ever and Always certified?',
    answer:
      `Yes. Every centre stone we set is independently graded and comes with its laboratory report, at no extra cost. Certification is included in the price shown, not added at checkout. ${SITE_NAME} is based at ${BUSINESS.address.street}, ${BUSINESS.address.locality}, ${BUSINESS.address.regionName}.`,
  },
];

function Fact({ figure, label }: { figure: string; label: string }) {
  return (
    <div className="border-l-2 border-[hsl(var(--secondary)/0.5)] pl-4">
      <p className="font-luxury-serif text-3xl font-light">{figure}</p>
      <p className="mt-1 text-xs text-muted-foreground font-light leading-relaxed">{label}</p>
    </div>
  );
}

export default function LabGrownDiamondsPage() {
  const url = buildCanonicalUrl('/lab-grown-diamonds');

  return (
    <>
      <JsonLd data={generateFAQSchema(FAQS)} />
      <JsonLd
        data={generateArticleSchema({
          title: 'Lab-Grown Diamonds Explained',
          description: DESCRIPTION,
          url,
          base: SITE_URL,
          section: 'Diamond Education',
          datePublished: '2026-01-15',
          dateModified: new Date().toISOString().slice(0, 10),
        })}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <Breadcrumbs
          items={[
            { name: 'Jewelry', href: '/jewelry' },
            { name: 'Lab-Grown Diamonds', href: '/lab-grown-diamonds' },
          ]}
        />

        <article className="max-w-3xl">
          <header>
            <p className="font-luxury-sans text-[10px] tracking-[0.3em] uppercase text-[hsl(var(--secondary))]">
              Diamond Education
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-luxury-serif font-light">
              Lab-Grown Diamonds, Explained
            </h1>
            <p className="mt-5 text-lg text-muted-foreground font-light">
              A lab-grown diamond is a real diamond. Same carbon crystal, same hardness,
              same sparkle, graded on the same scale by the same laboratories. It costs
              60-80% less because of where it formed, not what it is.
            </p>
          </header>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Fact figure="10" label="Mohs hardness, identical to mined" />
            <Fact figure="60-80%" label="Lower price, grade for grade" />
            <Fact figure="2-4 wks" label="To grow a gem-quality crystal" />
            <Fact figure="100%" label="Of our centre stones are certified" />
          </div>

          <section className="mt-14">
            <h2 className="text-2xl font-luxury-serif font-light">
              Lab-grown vs mined, attribute by attribute
            </h2>
            <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
              Every row below is measurable. The first six are identical between the two;
              only the last two differ.
            </p>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[hsl(var(--border))]">
                    <th scope="col" className="text-left font-medium py-3 pr-4">Attribute</th>
                    <th scope="col" className="text-left font-medium py-3 pr-4">Lab-grown</th>
                    <th scope="col" className="text-left font-medium py-3">Mined</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.attribute} className="border-b border-[hsl(var(--border))]">
                      <th scope="row" className="text-left font-light py-3 pr-4 align-top">
                        {row.attribute}
                      </th>
                      <td className="py-3 pr-4 align-top text-muted-foreground font-light">{row.lab}</td>
                      <td className="py-3 align-top text-muted-foreground font-light">{row.mined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-luxury-serif font-light">
              What the saving actually buys you
            </h2>
            <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
              The practical effect is not a cheaper ring. It is a bigger, cleaner, better-cut
              stone at the budget you already had. A customer with $2,000 to spend moves from
              roughly a 0.4ct mined centre to roughly a 1.5ct lab-grown centre of equal or
              better clarity and colour.
            </p>
            <p className="mt-3 text-sm text-muted-foreground font-light leading-relaxed">
              It also changes what is worth customising. Because the stone is no longer the
              overwhelming share of the cost, spending on the setting — a hidden halo, a
              split shank, hand engraving — stops being a luxury and becomes the interesting
              part of the decision.
            </p>
          </section>

          <section className="mt-14">
            <h2 className="text-2xl font-luxury-serif font-light">Questions people actually ask</h2>
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

          <section className="mt-14 border-t border-[hsl(var(--border))] pt-8">
            <h2 className="text-2xl font-luxury-serif font-light">Start looking</h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2.5 text-sm">
              {[
                { href: '/engagement-rings', label: 'Engagement rings' },
                { href: '/wedding-rings', label: 'Wedding bands' },
                { href: '/collection/engagement-round', label: 'Round cut engagement rings' },
                { href: '/collection/engagement-oval', label: 'Oval cut engagement rings' },
                { href: '/custom', label: 'Design a custom ring' },
                { href: '/jewelry', label: 'All categories' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </>
  );
}
