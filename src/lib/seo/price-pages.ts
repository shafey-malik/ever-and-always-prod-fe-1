/**
 * Price-based SEO landing pages for Ever and Always
 * Targets high-intent budget-conscious searches
 */

export interface PricePage {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  content: string;
  maxPrice: number;
  breadcrumbs: Array<{ name: string; href: string }>;
}

export const PRICE_PAGES: PricePage[] = [
  {
    slug: "diamond-rings-under-500",
    title: "Diamond Rings Under $500 | Affordable Diamond Jewelry | Ever and Always",
    description:
      "Shop beautiful diamond rings under $500 at Ever and Always. Quality diamonds, transparent pricing, and premium craftsmanship at unbeatable prices.",
    metaDescription:
      "Discover affordable diamond rings under $500 at Ever and Always. Quality diamonds, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "diamond rings under 500",
      "cheap diamond rings",
      "affordable diamond rings",
      "diamond rings under $500",
      "budget diamond rings",
    ],
    h1: "Diamond Rings Under $500",
    content: `Finding beautiful diamond rings under $500 doesn't mean compromising on quality. At Ever and Always, we offer stunning diamond jewelry at unbeatable prices.

Our collection of diamond rings under $500 features:
- Lab-grown and natural diamonds
- Premium metal settings (white gold, yellow gold, rose gold)
- Expert craftsmanship
- Lifetime warranty
- Free shipping across the USA

We believe everyone deserves beautiful diamond jewelry, regardless of budget. That's why we offer transparent pricing with no hidden fees and guarantee the best value for your money.`,
    maxPrice: 500,
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Price Range", href: "/price-range" },
      { name: "Under $500", href: "/diamond-rings-under-500" },
    ],
  },
  {
    slug: "diamond-rings-under-1000",
    title: "Diamond Rings Under $1,000 | Quality & Affordable | Ever and Always",
    description:
      "Shop premium diamond rings under $1,000 at Ever and Always. Wide selection, transparent pricing, and trusted quality. Free shipping included.",
    metaDescription:
      "Discover premium diamond rings under $1,000 at Ever and Always. Quality diamonds, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "diamond rings under 1000",
      "diamond rings under $1000",
      "affordable engagement rings under 1000",
      "cheap diamond rings",
      "budget diamond jewelry",
    ],
    h1: "Diamond Rings Under $1,000",
    content: `Our collection of diamond rings under $1,000 offers exceptional value without compromising on quality or beauty. Whether you're looking for an engagement ring, wedding band, or special occasion piece, we have something perfect for you.

What you'll find in our under $1,000 collection:
- Certified diamonds (lab-grown and natural)
- Premium metal settings
- Various diamond shapes and styles
- Expert craftsmanship
- Lifetime warranty and free shipping

At Ever and Always, we make luxury accessible with transparent pricing and guaranteed quality.`,
    maxPrice: 1000,
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Price Range", href: "/price-range" },
      { name: "Under $1,000", href: "/diamond-rings-under-1000" },
    ],
  },
  {
    slug: "diamond-rings-under-2000",
    title: "Diamond Rings Under $2,000 | Premium Quality | Ever and Always",
    description:
      "Shop premium diamond rings under $2,000 at Ever and Always. Stunning designs, certified diamonds, and transparent pricing. Free shipping & lifetime warranty.",
    metaDescription:
      "Discover premium diamond rings under $2,000 at Ever and Always. Certified diamonds, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "diamond rings under 2000",
      "diamond rings under $2000",
      "affordable engagement rings under 2000",
      "best diamond rings under 2000",
      "quality diamond rings",
    ],
    h1: "Diamond Rings Under $2,000",
    content: `Our diamond rings under $2,000 collection features premium quality diamonds and exquisite craftsmanship. Perfect for engagement rings, wedding bands, or special occasions.

Featured in this collection:
- Certified lab-grown and natural diamonds
- Premium metal settings (platinum, white gold, yellow gold, rose gold)
- Popular diamond shapes (round, princess, oval, cushion, emerald)
- Various ring styles (solitaire, halo, three-stone)
- Lifetime warranty and free shipping

At Ever and Always, we combine premium quality with affordable pricing, ensuring you get the best value for your investment.`,
    maxPrice: 2000,
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Price Range", href: "/price-range" },
      { name: "Under $2,000", href: "/diamond-rings-under-2000" },
    ],
  },
  {
    slug: "affordable-engagement-rings",
    title: "Affordable Engagement Rings | Best Prices Online | Ever and Always",
    description:
      "Shop affordable engagement rings at Ever and Always. Transparent pricing, premium quality, and trusted sourcing. Find the perfect ring without breaking the bank.",
    metaDescription:
      "Discover affordable engagement rings at Ever and Always. Best prices online, premium quality, and free shipping. Shop now!",
    keywords: [
      "affordable engagement rings",
      "cheap engagement rings",
      "budget engagement rings",
      "affordable engagement rings online",
      "best engagement ring prices",
    ],
    h1: "Affordable Engagement Rings",
    content: `Finding the perfect engagement ring shouldn't break the bank. At Ever and Always, we offer beautiful, affordable engagement rings with transparent pricing and premium quality.

Why choose our affordable engagement rings:
- Transparent pricing with no hidden fees
- Premium craftsmanship and materials
- Wide selection of styles and designs
- Lab-grown and natural diamond options
- Lifetime warranty and free shipping
- 30-day return policy

We believe every proposal deserves a beautiful ring, and we make that possible with our affordable pricing and commitment to quality.`,
    maxPrice: 0, // No max price for this page
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Engagement Rings", href: "/engagement-rings" },
      { name: "Affordable", href: "/affordable-engagement-rings" },
    ],
  },
  {
    slug: "budget-wedding-rings",
    title: "Budget Wedding Rings | Affordable Wedding Bands | Ever and Always",
    description:
      "Shop budget wedding rings at Ever and Always. Beautiful wedding bands for both partners at affordable prices. Free shipping and lifetime warranty.",
    metaDescription:
      "Discover budget wedding rings at Ever and Always. Affordable wedding bands, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "budget wedding rings",
      "affordable wedding bands",
      "cheap wedding rings",
      "budget wedding bands",
      "affordable wedding rings online",
    ],
    h1: "Budget Wedding Rings",
    content: `Your wedding rings should be beautiful, meaningful, and affordable. At Ever and Always, we offer budget-friendly wedding rings without compromising on quality or style.

Our budget wedding ring collection includes:
- Matching wedding ring sets
- Men's and women's wedding bands
- Various metal options (white gold, yellow gold, rose gold, platinum)
- Diamond and non-diamond options
- Lifetime warranty and free shipping

We understand that weddings involve many expenses, which is why we offer beautiful wedding rings at prices that fit your budget.`,
    maxPrice: 0, // No max price for this page
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Wedding Rings", href: "/wedding-rings" },
      { name: "Budget", href: "/budget-wedding-rings" },
    ],
  },
];

/**
 * Get price page by slug
 */
export function getPricePage(slug: string): PricePage | undefined {
  return PRICE_PAGES.find((page) => page.slug === slug);
}

/**
 * Get all price page slugs
 */
export function getAllPricePageSlugs(): string[] {
  return PRICE_PAGES.map((page) => page.slug);
}
