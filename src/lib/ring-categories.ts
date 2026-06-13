/**
 * Subcategory taxonomy for the Engagement / Wedding ring landing pages.
 *
 * Each item links to a collection at /collection/{slug}. Slugs are derived
 * deterministically from the name and prefixed with the base ("engagement" |
 * "wedding") so they namespace cleanly against the existing collection routes.
 */

export type GroupKind = 'card' | 'shape' | 'metal' | 'price';

export interface CategoryItem {
  name: string;
  note?: string;
  slug: string;
}

export interface CategoryGroup {
  id: string;
  label: string;
  caption: string;
  kind: GroupKind;
  items: CategoryItem[];
}

export interface RingCategoryConfig {
  base: 'engagement' | 'wedding';
  name: string;
  overline: string;
  titleLead: string;
  titleAccent: string;
  subtitle: string;
  heroImage: string;
  groups: CategoryGroup[];
}

const slugify = (s: string) =>
  s
    .normalize('NFD') // decompose accents so é → e + mark, then drop the mark below
    .toLowerCase()
    .replace(/\([^)]*\)/g, '') // drop parentheticals
    .replace(/[/&]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Build items from raw names; text in (parentheses) becomes a small note. */
function build(base: string, names: string[]): CategoryItem[] {
  return names.map((raw) => {
    const m = raw.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
    const name = (m ? m[1] : raw).trim();
    const note = m ? m[2].trim() : undefined;
    return { name, note, slug: `${base}-${slugify(name)}` };
  });
}

const priceItems = (base: string): CategoryItem[] => [
  { name: 'Under $1,000', slug: `${base}-under-1000` },
  { name: '$1,000 – $2,500', slug: `${base}-1000-2500` },
  { name: '$2,500 – $5,000', slug: `${base}-2500-5000` },
  { name: '$5,000 – $10,000', slug: `${base}-5000-10000` },
  { name: '$10,000 & Above', slug: `${base}-10000-plus` },
];

export const engagementCategory: RingCategoryConfig = {
  base: 'engagement',
  name: 'Engagement Rings',
  overline: 'The Engagement Edit',
  titleLead: 'Engagement',
  titleAccent: 'Rings',
  subtitle:
    'A proposal deserves a ring as singular as the moment. Explore our full atelier — by style, setting, shape, metal and more.',
  heroImage: '/hero-diamond-2.jpg',
  groups: [
    {
      id: 'style',
      label: 'By Style',
      caption: 'The silhouette that tells your story.',
      kind: 'card',
      items: build('engagement', [
        'Solitaire',
        'Halo',
        'Hidden Halo',
        'Double Halo',
        'Three Stone',
        'Pavé',
        'Vintage / Antique',
        'Modern / Minimalist',
        'Nature-Inspired',
        'Geometric / Architectural',
        'Cluster',
      ]),
    },
    {
      id: 'setting',
      label: 'By Setting Type',
      caption: 'How the light meets the stone.',
      kind: 'card',
      items: build('engagement', [
        'Prong Setting (4-prong, 6-prong, double prong)',
        'Bezel Setting',
        'Tension Setting',
        'Channel Setting',
        'Bar Setting',
        'Flush (Gypsy) Setting',
        'Cathedral Setting',
        'Trellis Setting',
        'East-West Setting',
      ]),
    },
    {
      id: 'band',
      label: 'By Band / Shank',
      caption: 'The line that wraps the finger.',
      kind: 'card',
      items: build('engagement', [
        'Straight Band',
        'Tapered Band',
        'Knife Edge Band',
        'Split Shank',
        'Twisted / Braided Band',
        'Infinity Band',
        'Euro Shank',
        'Thick Band',
        'Thin Band',
      ]),
    },
    {
      id: 'shape',
      label: 'By Diamond Shape',
      caption: 'Begin with the cut that speaks to you.',
      kind: 'shape',
      items: build('engagement', [
        'Round',
        'Princess',
        'Cushion',
        'Oval',
        'Emerald',
        'Pear',
        'Radiant',
        'Asscher',
        'Marquise',
        'Heart',
      ]),
    },
    {
      id: 'metal',
      label: 'By Metal',
      caption: 'Set the tone in gold or platinum.',
      kind: 'metal',
      items: build('engagement', [
        '10K White Gold',
        '14K White Gold',
        '10K Yellow Gold',
        '14K Yellow Gold',
        '10K Rose Gold',
        '14K Rose Gold',
        'Platinum',
        'Two-Tone Gold',
      ]),
    },
    {
      id: 'price',
      label: 'By Price',
      caption: 'Find the one within your means.',
      kind: 'price',
      items: priceItems('engagement'),
    },
  ],
};

export const weddingCategory: RingCategoryConfig = {
  base: 'wedding',
  name: 'Wedding Rings',
  overline: 'The Wedding Edit',
  titleLead: 'Wedding',
  titleAccent: 'Bands',
  subtitle:
    'The ring you will wear every day, forever. Discover bands for every hand — by style, setting, design and metal.',
  heroImage: '/hero-diamond-4.jpg',
  groups: [
    {
      id: 'gender',
      label: 'By Gender',
      caption: 'Bands for every hand.',
      kind: 'card',
      items: build('wedding', [
        "Women's Wedding Bands",
        "Men's Wedding Bands",
        'Unisex Bands',
        'Couple Matching Bands',
      ]),
    },
    {
      id: 'style',
      label: 'By Style',
      caption: 'From the classic to the unexpected.',
      kind: 'card',
      items: build('wedding', [
        'Classic Bands',
        'Diamond Bands',
        'Eternity Bands (Full Eternity)',
        'Half Eternity Bands',
        'Stackable Bands',
        'Minimalist Bands',
        'Vintage Bands',
        'Enhancers',
      ]),
    },
    {
      id: 'setting',
      label: 'By Setting Style',
      caption: 'How the diamonds are held.',
      kind: 'card',
      items: build('wedding', [
        'Pavé Bands',
        'Channel Set Bands',
        'Bezel Set Bands',
        'Bar Set Bands',
        'Flush Set Bands',
      ]),
    },
    {
      id: 'band',
      label: 'By Band Design',
      caption: 'Comfort, contour and character.',
      kind: 'card',
      items: build('wedding', [
        'Straight',
        'Knife Edge',
        'Domed',
        'Flat',
        'Comfort Fit',
        'Braided / Twisted',
      ]),
    },
    {
      id: 'metal',
      label: 'By Metal',
      caption: 'Set the tone in gold or platinum.',
      kind: 'metal',
      items: build('wedding', [
        'White Gold',
        'Yellow Gold',
        'Rose Gold',
        'Platinum',
        'Two-Tone',
      ]),
    },
  ],
};
