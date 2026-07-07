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
  image?: string;
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

/** Public folder path for collection tile ring images — change here to relocate assets. */
export const COLLECTION_TILE_IMAGE_DIR = '/collection-tiles';

/** Resolve a tile image filename (or path) against {@link COLLECTION_TILE_IMAGE_DIR}. */
export function collectionTileImage(filename: string): string {
  return filename.startsWith('/') ? filename : `${COLLECTION_TILE_IMAGE_DIR}/${filename}`;
}

const slugify = (s: string) =>
  s
    .normalize('NFD') // decompose accents so é → e + mark, then drop the mark below
    .toLowerCase()
    .replace(/\([^)]*\)/g, '') // drop parentheticals
    .replace(/[/&]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

type CategoryItemInput = { name: string; note?: string; image: string };

/** Build items; each entry must include a configurable `image` filename or path. */
function build(base: string, names: CategoryItemInput[]): CategoryItem[] {
  return names.map((raw) => ({
    name: raw.name,
    note: raw.note,
    slug: `${base}-${slugify(raw.name)}`,
    image: collectionTileImage(raw.image),
  }));
}

const priceItems = (base: string): CategoryItem[] => [
  { name: 'Under $1,000', slug: `${base}-under-1000`, image: collectionTileImage('under-1000.png') },
  { name: '$1,000 – $2,500', slug: `${base}-1000-2500`, image: collectionTileImage('1000-2500.png') },
  { name: '$2,500 – $5,000', slug: `${base}-2500-5000`, image: collectionTileImage('2500-5000.png') },
  { name: '$5,000 – $10,000', slug: `${base}-5000-10000`, image: collectionTileImage('5000-10000.png') },
  { name: '$10,000 & Above', slug: `${base}-10000-plus`, image: collectionTileImage('10000-plus.png') },
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
        { name: 'Solitaire', image: 'A1.png' },
        { name: 'Halo', image: 'A2.png' },
        { name: 'Hidden Halo', image: 'A3.png' },
        { name: 'Double Halo', image: 'A4.png' },
        { name: 'Three Stone', image: 'A5.png' },
        { name: 'Pavé', image: 'A6.png' },
        { name: 'Vintage / Antique', image: 'A7.png' },
        { name: 'Modern / Minimalist', image: 'A8.png' },
        { name: 'Nature-Inspired', image: 'A9.png' },
        { name: 'Geometric / Architectural', image: 'A10.png' },
        { name: 'Cluster', image: 'A11.png' },
      ]),
    },
    {
      id: 'setting',
      label: 'By Setting Type',
      caption: 'How the light meets the stone.',
      kind: 'card',
      items: build('engagement', [
        { name: 'Prong Setting', note: '4-prong, 6-prong, double prong', image: 'B1.png' },
        { name: 'Bezel Setting', image: 'B2.png' },
        { name: 'Tension Setting', image: 'B3.png' },
        { name: 'Channel Setting', image: 'B4.png' },
        { name: 'Bar Setting', image: 'B5.png' },
        { name: 'Flush (Gypsy) Setting', image: 'B6.png' },
        { name: 'Cathedral Setting', image: 'B7.png' },
        { name: 'Trellis Setting', image: 'B8.png' },
        { name: 'East-West Setting', image: 'B9.png' },
      ]),
    },
    {
      id: 'band',
      label: 'By Band / Shank',
      caption: 'The line that wraps the finger.',
      kind: 'card',
      items: build('engagement', [
        { name: 'Straight Band', image: 'C1.png' },
        { name: 'Tapered Band', image: 'C2.png' },
        { name: 'Knife Edge Band', image: 'C3.png' },
        { name: 'Split Shank', image: 'C4.png' },
        { name: 'Twisted / Braided Band', image: 'C5.png' },
        { name: 'Infinity Band', image: 'C6.png' },
        { name: 'Euro Shank', image: 'C7.png' },
        { name: 'Thick Band', image: 'C8.png' },
        { name: 'Thin Band', image: 'C9.png' },
      ]),
    },
    {
      id: 'shape',
      label: 'By Diamond Shape',
      caption: 'Begin with the cut that speaks to you.',
      kind: 'shape',
      items: build('engagement', [
        { name: 'Round', image: '' },
        { name: 'Princess', image: '' },
        { name: 'Cushion', image: '' },
        { name: 'Oval', image: '' },
        { name: 'Emerald', image: '' },
        { name: 'Pear', image: '' },
        { name: 'Radiant', image: '' },
        { name: 'Asscher', image: '' },
        { name: 'Marquise', image: '' },
        { name: 'Heart', image: '' },
      ]),
    },
    {
      id: 'metal',
      label: 'By Metal',
      caption: 'Set the tone in gold or platinum.',
      kind: 'metal',
      items: build('engagement', [
        { name: '10K White Gold', image: '' },
        { name: '14K White Gold', image: '' },
        { name: '10K Yellow Gold', image: '' },
        { name: '14K Yellow Gold', image: '' },
        { name: '10K Rose Gold', image: '' },
        { name: '14K Rose Gold', image: '' },
        { name: 'Platinum', image: '' },
        { name: 'Two-Tone Gold', image: '' },
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
        { name: "Women's Wedding Bands", image: 'D1.png' },
        { name: "Men's Wedding Bands", image: 'D2.png' },
        { name: 'Unisex Bands', image: 'D3.png' },
        { name: 'Couple Matching Bands', image: 'D4.png' },
      ]),
    },
    {
      id: 'style',
      label: 'By Style',
      caption: 'From the classic to the unexpected.',
      kind: 'card',
      items: build('wedding', [
        { name: 'Classic Bands', image: 'E1.png' },
        { name: 'Diamond Bands', image: 'E2.png' },
        { name: 'Eternity Bands', note: 'Full Eternity', image: 'E3.png' },
        { name: 'Half Eternity Bands', image: 'E4.png' },
        { name: 'Stackable Bands', image: 'E5.png' },
        { name: 'Minimalist Bands', image: 'E6.png' },
        { name: 'Vintage Bands', image: 'E7.png' },
        { name: 'Enhancers', image: 'E8.png' },
      ]),
    },
    {
      id: 'setting',
      label: 'By Setting Style',
      caption: 'How the diamonds are held.',
      kind: 'card',
      items: build('wedding', [
        { name: 'Pavé Bands', image: 'F1.png' },
        { name: 'Channel Set Bands', image: 'F2.png' },
        { name: 'Bezel Set Bands', image: 'F3.png' },
        { name: 'Bar Set Bands', image: 'F4.png' },
        { name: 'Flush Set Bands', image: 'F5.png' },
      ]),
    },
    {
      id: 'band',
      label: 'By Band Design',
      caption: 'Comfort, contour and character.',
      kind: 'card',
      items: build('wedding', [
        { name: 'Straight', image: 'G1.png' },
        { name: 'Knife Edge', image: 'G2.png' },
        { name: 'Domed', image: 'G3.png' },
        { name: 'Flat', image: 'G4.png' },
        { name: 'Comfort Fit', image: 'G5.png' },
        { name: 'Braided / Twisted', image: 'G6.png' },
      ]),
    },
    {
      id: 'metal',
      label: 'By Metal',
      caption: 'Set the tone in gold or platinum.',
      kind: 'metal',
      items: build('wedding', [
        { name: 'White Gold', image: '' },
        { name: 'Yellow Gold', image: '' },
        { name: 'Rose Gold', image: '' },
        { name: 'Platinum', image: '' },
        { name: 'Two-Tone', image: '' },
      ]),
    },
  ],
};
