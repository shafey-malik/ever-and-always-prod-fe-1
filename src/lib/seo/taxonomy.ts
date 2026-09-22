/**
 * SEO layer over the Vendure collection taxonomy.
 *
 * The Vendure catalogue stores each category's `name` and `description` as the
 * raw slug ("engagement-solitaire"), so a category page rendered straight from
 * the API produces `<title>engagement-solitaire</title>` and a meta description
 * of "engagement-solitaire". This module is the storefront-side source of truth
 * that turns every collection slug into a human, keyword-bearing record: H1,
 * title, meta description, intro copy, FAQs and breadcrumbs.
 *
 * Entries are derived from {@link engagementCategory} / {@link weddingCategory}
 * so the navigation tiles and the category pages can never disagree about a
 * slug. Anything outside that tree is declared in EXTRA_ENTRIES.
 */

import {
  engagementCategory,
  weddingCategory,
  type CategoryGroup,
  type RingCategoryConfig,
} from '@/lib/ring-categories';

export interface TaxonomyFaq {
  question: string;
  answer: string;
}

export interface TaxonomyEntry {
  /** Vendure collection slug — the `/collection/[slug]` route segment. */
  slug: string;
  /** Human display name, e.g. "Hidden Halo". */
  name: string;
  base: 'engagement' | 'wedding' | 'other';
  groupId: string;
  groupLabel: string;
  /** Page H1, e.g. "Hidden Halo Engagement Rings". */
  h1: string;
  /** Full `<title>`, brand suffix included. */
  title: string;
  metaDescription: string;
  /** Above-the-fold intro paragraphs. */
  intro: string[];
  /** Supporting copy rendered below the product grid. */
  body: string[];
  keywords: string[];
  faqs: TaxonomyFaq[];
  breadcrumbs: Array<{ name: string; href: string }>;
  /** Sibling slugs inside the same group, for internal linking. */
  related: string[];
}

const BRAND = 'Ever and Always';

/** Parent hub for each base. */
const BASE_HUB: Record<'engagement' | 'wedding', { label: string; href: string; noun: string }> = {
  engagement: { label: 'Engagement Rings', href: '/engagement-rings', noun: 'engagement ring' },
  wedding: { label: 'Wedding Rings', href: '/wedding-rings', noun: 'wedding band' },
};

/**
 * Compose the H1 from a category name.
 *
 * The taxonomy names are inconsistent about whether they already carry the
 * noun ("Men's Wedding Bands" does, "Solitaire" does not) and whether they
 * carry a trailing qualifier ("Bezel Setting", "Straight Band"). Appending
 * blindly yields "Men's Wedding Bands Wedding Bands", so normalise first.
 */
function buildH1(name: string, base: 'engagement' | 'wedding', groupId: string): string {
  const clean = name.replace(/\s*\/\s*/g, ' & ');

  if (groupId === 'price') {
    // "Under $1,000" reads as a suffix, not a modifier.
    return `${BASE_HUB[base].label} ${clean}`;
  }

  // Already a complete phrase: "Women's Wedding Bands", "Diamond Bands".
  if (/\b(ring|rings|band|bands|enhancers)\b/i.test(clean)) {
    if (base === 'wedding' && !/wedding/i.test(clean)) {
      // "Eternity Bands" -> "Eternity Wedding Bands"
      return clean.replace(/\bBands?\b/i, (m) => `Wedding ${m}`);
    }
    if (base === 'engagement' && !/engagement/i.test(clean)) {
      // "Straight Band" -> "Straight Band Engagement Rings"
      return `${clean} Engagement Rings`;
    }
    return clean;
  }

  if (groupId === 'setting') {
    // "Bezel Setting" -> "Bezel Set Engagement Rings"
    const setKind = clean.replace(/\s*Setting$/i, '');
    return `${setKind} Set ${base === 'engagement' ? 'Engagement Rings' : 'Wedding Bands'}`;
  }

  if (groupId === 'shape') {
    // Shape names are bare ("Oval"); "oval cut engagement ring" is the query.
    return `${clean} Cut ${base === 'engagement' ? 'Engagement Rings' : 'Wedding Bands'}`;
  }

  return `${clean} ${base === 'engagement' ? 'Engagement Rings' : 'Wedding Bands'}`;
}

/** Lowercase an H1 for use mid-sentence, preserving metal karats like 14K. */
function lower(h1: string): string {
  return h1.replace(/\b[A-Z][a-z]+\b/g, (m) => m.toLowerCase());
}

/** Per-group descriptive angle, so 91 pages do not share one paragraph. */
const GROUP_ANGLE: Record<string, (name: string, base: 'engagement' | 'wedding') => string> = {
  style: (n) =>
    `The ${n.toLowerCase()} silhouette is one of the most requested shapes in our atelier, and it is one of the clearest places to see what lab-grown changes: the same look, the same certification, at a fraction of the mined price.`,
  setting: (n) =>
    `A ${n.toLowerCase().replace(/\s*setting$/, '')} setting decides how much light reaches the stone and how the ring wears day to day. We cut and finish every setting in house, so the fit is right before the stone is ever seated.`,
  band: (n) =>
    `The ${n.toLowerCase()} profile is what your hand actually feels. It shapes the proportion of the whole ring, and it is the detail most often overlooked when buying online.`,
  shape: (n) =>
    `${n} is among the most searched diamond cuts in the United States, and lab-grown makes the larger carat weights in this shape genuinely reachable. Every stone is independently graded before it is set.`,
  metal: (n) =>
    `${n} is a practical choice as much as an aesthetic one. It sets the warmth of the stone, the upkeep it needs, and a meaningful part of the final price.`,
  price: (n, b) =>
    `Everything on this page is priced ${n.toLowerCase()}. No hidden setting fees, no markup on certification, and the same lifetime warranty as every other ${BASE_HUB[b].noun} we make.`,
  gender: (n) =>
    `Our ${n.toLowerCase()} are built for daily wear first: comfortable inner edges, durable metal choices, and diamonds set flush enough to survive real life.`,
};

function angleFor(groupId: string, name: string, base: 'engagement' | 'wedding'): string {
  const fn = GROUP_ANGLE[groupId] ?? GROUP_ANGLE.style;
  return fn(name, base);
}

function clampDescription(text: string, max = 158): string {
  return text.length <= max ? text : text.slice(0, max - 3).replace(/\s\S*$/, '') + '...';
}

function buildMetaDescription(h1: string, base: 'engagement' | 'wedding'): string {
  const noun = BASE_HUB[base].noun;
  return clampDescription(
    `Shop ${lower(h1)} at ${BRAND}. Certified lab-grown diamonds, honest pricing, free US shipping. Custom ${noun} designs welcome.`,
  );
}

function buildKeywords(h1: string, name: string, base: 'engagement' | 'wedding'): string[] {
  const l = lower(h1);
  return [
    l,
    `lab grown ${l}`,
    `affordable ${l}`,
    `${l} under $2000`,
    `cheap ${l} usa`,
    `${name.toLowerCase()} ${BASE_HUB[base].noun}`,
    `buy ${l} online`,
    `custom ${l}`,
  ];
}

function buildFaqs(h1: string, name: string, base: 'engagement' | 'wedding'): TaxonomyFaq[] {
  const l = lower(h1);
  const singular = l.replace(/s$/, '');
  return [
    {
      question: `How much do ${l} cost at ${BRAND}?`,
      answer: `Because we set certified lab-grown diamonds rather than mined stones, ${l} at ${BRAND} typically cost 60-80% less than a mined equivalent of the same carat, cut, colour and clarity. Most pieces in this category fall between $500 and $3,000, and the price shown is the price you pay: certification and the setting are included.`,
    },
    {
      question: `Are the diamonds in your ${l} real diamonds?`,
      answer: `Yes. Lab-grown diamonds are chemically, physically and optically identical to mined diamonds. Same carbon crystal, same hardness, same sparkle, and graded on the same 4Cs scale by independent laboratories. The only difference is origin, which is why they cost dramatically less.`,
    },
    {
      question: `Can I order a custom ${name.toLowerCase()} ${BASE_HUB[base].noun}?`,
      answer: `Yes. Every ${singular} can be made to order. Choose the diamond shape, carat, metal and setting, or send a reference image and our designers will draft it for you. Custom work carries no design fee and ships in roughly three to four weeks.`,
    },
    {
      question: `What is the return policy on ${l}?`,
      answer: `Returns are accepted within 30 days of delivery in original condition, including made-to-order pieces that do not fit. Every ring also carries a lifetime warranty on the setting and free resizing within the first year.`,
    },
  ];
}

function entryFromItem(
  config: RingCategoryConfig,
  group: CategoryGroup,
  item: { name: string; slug: string },
  siblings: string[],
): TaxonomyEntry {
  const base = config.base;
  const hub = BASE_HUB[base];
  const h1 = buildH1(item.name, base, group.id);
  const singular = lower(h1).replace(/s$/, '');

  return {
    slug: item.slug,
    name: item.name,
    base,
    groupId: group.id,
    groupLabel: group.label,
    h1,
    title: `${h1} | Lab-Grown Diamonds | ${BRAND}`,
    metaDescription: buildMetaDescription(h1, base),
    intro: [
      `${h1} from ${BRAND}, set with independently certified lab-grown diamonds and priced without the traditional jewellery markup.`,
      angleFor(group.id, item.name, base),
    ],
    body: [
      `Every ${singular} in this collection is made to order in our Maryland workshop. You choose the diamond, the metal and the finish, and we cut the setting to suit that exact stone rather than dropping it into a stock mount.`,
      `If nothing here is quite right, it can be built. Send a sketch, a screenshot or a description to our design team and we will draft your ${hub.noun} at no charge before you commit to anything.`,
    ],
    keywords: buildKeywords(h1, item.name, base),
    faqs: buildFaqs(h1, item.name, base),
    breadcrumbs: [
      { name: 'Jewelry', href: '/jewelry' },
      { name: hub.label, href: hub.href },
      { name: h1, href: `/collection/${item.slug}` },
    ],
    related: siblings.filter((s) => s !== item.slug).slice(0, 8),
  };
}

/** Collections that exist in Vendure but sit outside the engagement/wedding tree. */
const EXTRA_ENTRIES: TaxonomyEntry[] = [
  {
    slug: 'bridal',
    name: 'Bridal',
    base: 'other',
    groupId: 'occasion',
    groupLabel: 'By Occasion',
    h1: 'Bridal Ring Sets',
    title: `Bridal Ring Sets | Matching Engagement & Wedding Rings | ${BRAND}`,
    metaDescription: `Shop bridal ring sets at ${BRAND}: matching lab-grown diamond engagement rings and wedding bands, sold together and priced together. Free US shipping.`,
    intro: [
      'Bridal sets pair an engagement ring with the band it was designed to sit against, so the two meet flush with no gap and no compromise.',
      'Buying the pair together is almost always cheaper than buying them apart, and it removes the hardest part of the process: finding a band months later that actually fits the ring you already own.',
    ],
    body: [
      'Every set is built around certified lab-grown diamonds, which is what lets us offer a matched pair at the price most jewellers charge for the engagement ring alone.',
      'Sets can be split, resized or redesigned at any point. If you have already bought the engagement ring elsewhere, send us a photo and we will cut a contour band to match it.',
    ],
    keywords: [
      'bridal ring sets',
      'matching engagement and wedding ring sets',
      'affordable bridal sets',
      'lab grown diamond bridal set',
      'his and hers wedding sets',
    ],
    faqs: [
      {
        question: 'What is included in a bridal set?',
        answer:
          'A bridal set includes the engagement ring and the matching wedding band designed to sit against it. Some sets add a second band for a partner, and the product page lists exactly what ships.',
      },
      {
        question: 'Is a bridal set cheaper than buying the rings separately?',
        answer:
          'Usually, yes. The two rings are cut from the same design and produced in one run, so the set price at Ever and Always is typically 15-25% below the combined individual prices.',
      },
    ],
    breadcrumbs: [
      { name: 'Jewelry', href: '/jewelry' },
      { name: 'Bridal Sets', href: '/collection/bridal' },
    ],
    related: ['engagement-solitaire', 'wedding-couple-matching-bands', 'wedding-women-s-wedding-bands'],
  },
  {
    slug: 'anniversary',
    name: 'Anniversary',
    base: 'other',
    groupId: 'occasion',
    groupLabel: 'By Occasion',
    h1: 'Anniversary Rings',
    title: `Anniversary Rings | Lab-Grown Diamond Bands | ${BRAND}`,
    metaDescription: `Shop anniversary rings at ${BRAND}: eternity bands, diamond bands and upgrade rings in certified lab-grown diamonds. Honest pricing and free US shipping.`,
    intro: [
      'An anniversary ring marks time rather than a promise, which is why it is usually the piece people allow themselves to buy bigger.',
      'Lab-grown diamonds are what make that realistic. A full eternity band that would run five figures in mined stones lands in the low four figures here, with identical certification.',
    ],
    body: [
      'Eternity and half-eternity bands are the most common choice, but many customers use an anniversary as the moment to upgrade the centre stone of an existing ring. We do that too, and we credit the original stone.',
      'Tell us the year you are marking and the ring already on the hand, and our designers will propose something that stacks with it rather than fighting it.',
    ],
    keywords: [
      'anniversary rings',
      'diamond anniversary band',
      'eternity ring anniversary',
      'affordable anniversary rings',
      'lab grown diamond anniversary ring',
    ],
    faqs: [
      {
        question: 'What is the difference between an anniversary ring and a wedding band?',
        answer:
          'A wedding band is exchanged at the ceremony and is usually simpler. An anniversary ring is bought later to mark a milestone and is typically more heavily set with diamonds, often as an eternity or half-eternity band worn alongside the original pair.',
      },
      {
        question: 'Can I upgrade my existing diamond instead of buying a new ring?',
        answer:
          'Yes. Ever and Always credits the value of your current centre stone against a larger lab-grown diamond and resets it into a new or existing setting.',
      },
    ],
    breadcrumbs: [
      { name: 'Jewelry', href: '/jewelry' },
      { name: 'Anniversary Rings', href: '/collection/anniversary' },
    ],
    related: ['wedding-eternity-bands', 'wedding-half-eternity-bands', 'wedding-diamond-bands'],
  },
  {
    slug: 'statement',
    name: 'Statement',
    base: 'other',
    groupId: 'occasion',
    groupLabel: 'By Occasion',
    h1: 'Statement Diamond Rings',
    title: `Statement Diamond Rings | Bold Lab-Grown Designs | ${BRAND}`,
    metaDescription: `Shop statement diamond rings at ${BRAND}: oversized, cluster and architectural designs in certified lab-grown diamonds at a fraction of mined prices.`,
    intro: [
      'Statement rings are where lab-grown diamonds stop being a budget decision and start being a design one. Carat weight that would be prohibitive in mined stones becomes a starting point.',
      'These are cocktail and right-hand rings: cluster settings, oversized centres, architectural metalwork, made to be noticed.',
    ],
    body: [
      'Most statement pieces are made to order, because scale is personal. We model the ring to your finger size before cutting metal, so the proportion is right on your hand rather than on a display finger.',
      'Bring a reference from anywhere, whether a runway photo, an auction listing or a family heirloom, and we will quote it.',
    ],
    keywords: [
      'statement diamond rings',
      'cocktail rings',
      'big diamond rings affordable',
      'oversized lab grown diamond ring',
      'right hand diamond ring',
    ],
    faqs: [
      {
        question: 'How large can a lab-grown diamond centre stone be?',
        answer:
          'We regularly set lab-grown centres from 1 to 8 carats and can source larger on request. Because lab-grown pricing does not spike at the round-carat thresholds the way mined pricing does, larger stones stay proportionally affordable.',
      },
    ],
    breadcrumbs: [
      { name: 'Jewelry', href: '/jewelry' },
      { name: 'Statement Rings', href: '/collection/statement' },
    ],
    related: ['engagement-cluster', 'engagement-geometric-architectural', 'engagement-double-halo'],
  },
];

/**
 * Duplicate collections that exist in Vendure and resolve to a page we already
 * own under a better URL. Six are legacy shape collections created before the
 * `engagement-*` tree existed; one is an accidental re-import ("...-2").
 *
 * They stay crawlable and keep rendering real content, but their canonical
 * points at the primary URL so the pair cannot split ranking signals for the
 * same query.
 */
const DUPLICATE_SLUG_ALIASES: Record<string, string> = {
  'round-cut-diamond-rings': 'engagement-round',
  'princess-cut-diamond-rings': 'engagement-princess',
  'emerald-cut-diamond-rings': 'engagement-emerald',
  'oval-cut-diamond-rings': 'engagement-oval',
  'cushion-cut-diamond-rings': 'engagement-cushion',
  'pear-shaped-diamond-rings': 'engagement-pear',
  'engagement-modern-minimalist-2': 'engagement-modern-minimalist',
};

function buildTaxonomy(): Record<string, TaxonomyEntry> {
  const map: Record<string, TaxonomyEntry> = {};

  for (const config of [engagementCategory, weddingCategory]) {
    for (const group of config.groups) {
      const siblings = group.items.map((i) => i.slug);
      for (const item of group.items) {
        // The catalogue contains one duplicated slug; the first definition wins.
        if (!map[item.slug]) {
          map[item.slug] = entryFromItem(config, group, item, siblings);
        }
      }
    }
  }

  for (const entry of EXTRA_ENTRIES) map[entry.slug] = entry;

  return map;
}

export const TAXONOMY: Record<string, TaxonomyEntry> = buildTaxonomy();

/** Resolve a slug to its SEO record, following duplicate aliases. */
export function getTaxonomyEntry(slug: string): TaxonomyEntry | undefined {
  return TAXONOMY[slug] ?? TAXONOMY[DUPLICATE_SLUG_ALIASES[slug]];
}

/** Primary slugs only — what belongs in the sitemap and in internal links. */
export function getAllTaxonomySlugs(): string[] {
  return Object.keys(TAXONOMY);
}

/** The URL a given collection slug should declare as its canonical. */
export function getCanonicalCollectionSlug(slug: string): string {
  return DUPLICATE_SLUG_ALIASES[slug] ?? slug;
}

export function isDuplicateSlug(slug: string): boolean {
  return slug in DUPLICATE_SLUG_ALIASES;
}

/** Entries filtered by base, for hub pages and internal-link blocks. */
export function getTaxonomyByBase(base: TaxonomyEntry['base']): TaxonomyEntry[] {
  return Object.values(TAXONOMY).filter((e) => e.base === base);
}
