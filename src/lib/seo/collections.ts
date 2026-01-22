/**
 * SEO-optimized collection definitions for Ever and Always
 * These collections target high-intent keywords in the diamond jewelry market
 */

export interface SEOCollection {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  h2?: string[];
  content?: string;
  breadcrumbs: Array<{ name: string; href: string }>;
  relatedCollections?: string[];
}

export const SEO_COLLECTIONS: Record<string, SEOCollection> = {
  // Engagement & Proposal
  "engagement-rings": {
    slug: "engagement-rings",
    title: "Affordable Engagement Rings | Ever and Always",
    description:
      "Shop beautiful, affordable engagement rings at Ever and Always. Transparent pricing, premium craftsmanship, and trusted sourcing. Find the perfect ring for your proposal.",
    metaDescription:
      "Discover affordable engagement rings at Ever and Always. Transparent pricing, premium craftsmanship, and trusted sourcing. Free shipping & lifetime warranty. Shop now!",
    keywords: [
      "affordable engagement rings",
      "cheap engagement rings",
      "engagement rings online",
      "buy engagement rings USA",
      "best engagement ring prices",
    ],
    h1: "Affordable Engagement Rings",
    h2: [
      "Why Choose Ever and Always for Engagement Rings?",
      "Popular Engagement Ring Styles",
      "How to Choose the Perfect Engagement Ring",
    ],
    content: `At Ever and Always, we believe everyone deserves a beautiful engagement ring without breaking the bank. Our collection features stunning engagement rings crafted with premium materials and exceptional attention to detail.

We offer transparent pricing with no hidden fees, ensuring you get the best value for your investment. All our engagement rings come with a lifetime warranty and free shipping across the United States.`,
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Engagement Rings", href: "/engagement-rings" },
    ],
    relatedCollections: [
      "proposal-rings",
      "promise-rings",
      "diamond-rings-under-2000",
    ],
  },
  "proposal-rings": {
    slug: "proposal-rings",
    title: "Proposal Rings | Perfect Rings for Your Proposal | Ever and Always",
    description:
      "Find the perfect proposal ring at Ever and Always. Beautiful, affordable rings designed to make your proposal moment unforgettable.",
    metaDescription:
      "Shop proposal rings at Ever and Always. Affordable, beautiful rings perfect for your special moment. Free shipping & lifetime warranty.",
    keywords: [
      "proposal rings",
      "rings for proposal",
      "affordable proposal rings",
      "proposal ring ideas",
    ],
    h1: "Proposal Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Proposal Rings", href: "/proposal-rings" },
    ],
    relatedCollections: ["engagement-rings", "promise-rings"],
  },
  "promise-rings": {
    slug: "promise-rings",
    title: "Promise Rings | Affordable Promise Rings | Ever and Always",
    description:
      "Express your commitment with beautiful promise rings from Ever and Always. Affordable, meaningful jewelry for every relationship stage.",
    metaDescription:
      "Shop affordable promise rings at Ever and Always. Beautiful designs, transparent pricing, and trusted quality. Free shipping available.",
    keywords: [
      "promise rings",
      "affordable promise rings",
      "promise rings for couples",
      "buy promise rings online",
    ],
    h1: "Promise Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Promise Rings", href: "/promise-rings" },
    ],
    relatedCollections: ["engagement-rings", "proposal-rings"],
  },
  // Wedding & Commitment
  "wedding-rings": {
    slug: "wedding-rings",
    title: "Affordable Wedding Rings | Wedding Bands | Ever and Always",
    description:
      "Shop affordable wedding rings and bands at Ever and Always. Beautiful designs for both partners, transparent pricing, and premium quality.",
    metaDescription:
      "Discover affordable wedding rings and bands at Ever and Always. Premium craftsmanship, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "affordable wedding rings",
      "wedding bands",
      "wedding rings online",
      "cheap wedding rings",
      "buy wedding rings USA",
    ],
    h1: "Affordable Wedding Rings & Bands",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Wedding Rings", href: "/wedding-rings" },
    ],
    relatedCollections: [
      "mens-wedding-bands",
      "womens-wedding-bands",
      "matching-wedding-ring-sets",
    ],
  },
  "mens-wedding-bands": {
    slug: "mens-wedding-bands",
    title: "Men's Wedding Bands | Affordable Men's Rings | Ever and Always",
    description:
      "Shop men's wedding bands at Ever and Always. Classic and modern designs, affordable prices, and premium craftsmanship.",
    metaDescription:
      "Discover affordable men's wedding bands at Ever and Always. Premium quality, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "mens wedding bands",
      "men's wedding rings",
      "affordable mens wedding bands",
      "mens diamond wedding bands",
    ],
    h1: "Men's Wedding Bands",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Men's Jewelry", href: "/mens-jewelry" },
      { name: "Men's Wedding Bands", href: "/mens-wedding-bands" },
    ],
    relatedCollections: ["wedding-rings", "mens-diamond-rings"],
  },
  "womens-wedding-bands": {
    slug: "womens-wedding-bands",
    title: "Women's Wedding Bands | Affordable Women's Rings | Ever and Always",
    description:
      "Shop women's wedding bands at Ever and Always. Elegant designs, affordable prices, and premium quality craftsmanship.",
    metaDescription:
      "Discover affordable women's wedding bands at Ever and Always. Beautiful designs, transparent pricing, and free shipping.",
    keywords: [
      "womens wedding bands",
      "women's wedding rings",
      "affordable womens wedding bands",
      "womens diamond wedding bands",
    ],
    h1: "Women's Wedding Bands",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Women's Jewelry", href: "/womens-jewelry" },
      { name: "Women's Wedding Bands", href: "/womens-wedding-bands" },
    ],
    relatedCollections: ["wedding-rings", "womens-diamond-rings"],
  },
  // Diamond Types
  "lab-grown-diamond-rings": {
    slug: "lab-grown-diamond-rings",
    title: "Lab Grown Diamond Rings | Ethical & Affordable | Ever and Always",
    description:
      "Shop lab grown diamond rings at Ever and Always. Ethical, sustainable, and affordable diamonds with the same brilliance as natural diamonds.",
    metaDescription:
      "Discover lab grown diamond rings at Ever and Always. Ethical, sustainable, and affordable. Same brilliance, better price. Shop now!",
    keywords: [
      "lab grown diamond rings",
      "lab created diamonds",
      "ethical diamond rings",
      "sustainable diamonds",
      "affordable lab diamonds",
    ],
    h1: "Lab Grown Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Diamond Types", href: "/diamond-types" },
      { name: "Lab Grown Diamonds", href: "/lab-grown-diamond-rings" },
    ],
    relatedCollections: [
      "natural-diamond-rings",
      "ethical-diamond-rings",
      "conflict-free-diamond-rings",
    ],
  },
  "natural-diamond-rings": {
    slug: "natural-diamond-rings",
    title: "Natural Diamond Rings | Certified Diamonds | Ever and Always",
    description:
      "Shop natural diamond rings at Ever and Always. Certified, conflict-free diamonds with transparent pricing and premium craftsmanship.",
    metaDescription:
      "Discover natural diamond rings at Ever and Always. Certified, conflict-free diamonds with transparent pricing. Shop now!",
    keywords: [
      "natural diamond rings",
      "certified diamonds",
      "real diamond rings",
      "natural diamonds online",
    ],
    h1: "Natural Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Diamond Types", href: "/diamond-types" },
      { name: "Natural Diamonds", href: "/natural-diamond-rings" },
    ],
    relatedCollections: [
      "lab-grown-diamond-rings",
      "conflict-free-diamond-rings",
    ],
  },
  // Ring Styles
  "solitaire-diamond-rings": {
    slug: "solitaire-diamond-rings",
    title: "Solitaire Diamond Rings | Classic Elegance | Ever and Always",
    description:
      "Shop solitaire diamond rings at Ever and Always. Timeless elegance with a single brilliant diamond. Affordable prices and premium quality.",
    metaDescription:
      "Discover affordable solitaire diamond rings at Ever and Always. Classic elegance, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "solitaire diamond rings",
      "solitaire engagement rings",
      "single diamond rings",
      "classic solitaire rings",
    ],
    h1: "Solitaire Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Ring Styles", href: "/ring-styles" },
      { name: "Solitaire Rings", href: "/solitaire-diamond-rings" },
    ],
    relatedCollections: ["halo-diamond-rings", "three-stone-rings"],
  },
  "halo-diamond-rings": {
    slug: "halo-diamond-rings",
    title: "Halo Diamond Rings | Brilliant Design | Ever and Always",
    description:
      "Shop halo diamond rings at Ever and Always. A center diamond surrounded by smaller diamonds for maximum brilliance. Affordable and stunning.",
    metaDescription:
      "Discover affordable halo diamond rings at Ever and Always. Maximum brilliance, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "halo diamond rings",
      "halo engagement rings",
      "diamond halo rings",
      "affordable halo rings",
    ],
    h1: "Halo Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Ring Styles", href: "/ring-styles" },
      { name: "Halo Rings", href: "/halo-diamond-rings" },
    ],
    relatedCollections: ["solitaire-diamond-rings", "hidden-halo-rings"],
  },
  // Diamond Shapes
  "round-cut-diamond-rings": {
    slug: "round-cut-diamond-rings",
    title: "Round Cut Diamond Rings | Classic Brilliance | Ever and Always",
    description:
      "Shop round cut diamond rings at Ever and Always. The most popular diamond shape with maximum brilliance and fire. Affordable prices guaranteed.",
    metaDescription:
      "Discover affordable round cut diamond rings at Ever and Always. Maximum brilliance, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "round cut diamond rings",
      "round engagement rings",
      "round diamond rings",
      "affordable round cut diamonds",
    ],
    h1: "Round Cut Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Diamond Shapes", href: "/diamond-shapes" },
      { name: "Round Cut", href: "/round-cut-diamond-rings" },
    ],
    relatedCollections: [
      "princess-cut-diamond-rings",
      "oval-cut-diamond-rings",
      "cushion-cut-diamond-rings",
    ],
  },
  "princess-cut-diamond-rings": {
    slug: "princess-cut-diamond-rings",
    title: "Princess Cut Diamond Rings | Modern Elegance | Ever and Always",
    description:
      "Shop princess cut diamond rings at Ever and Always. Modern square cut with brilliant sparkle. Affordable prices and premium quality.",
    metaDescription:
      "Discover affordable princess cut diamond rings at Ever and Always. Modern elegance, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "princess cut diamond rings",
      "princess cut engagement rings",
      "square diamond rings",
      "affordable princess cut diamonds",
    ],
    h1: "Princess Cut Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Diamond Shapes", href: "/diamond-shapes" },
      { name: "Princess Cut", href: "/princess-cut-diamond-rings" },
    ],
    relatedCollections: [
      "round-cut-diamond-rings",
      "cushion-cut-diamond-rings",
      "emerald-cut-diamond-rings",
    ],
  },
  "oval-cut-diamond-rings": {
    slug: "oval-cut-diamond-rings",
    title: "Oval Cut Diamond Rings | Elongated Elegance | Ever and Always",
    description:
      "Shop oval cut diamond rings at Ever and Always. Elongated shape that flatters the finger. Affordable prices and stunning brilliance.",
    metaDescription:
      "Discover affordable oval cut diamond rings at Ever and Always. Elongated elegance, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "oval cut diamond rings",
      "oval engagement rings",
      "oval diamond rings",
      "affordable oval cut diamonds",
    ],
    h1: "Oval Cut Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Diamond Shapes", href: "/diamond-shapes" },
      { name: "Oval Cut", href: "/oval-cut-diamond-rings" },
    ],
    relatedCollections: [
      "round-cut-diamond-rings",
      "pear-shaped-diamond-rings",
      "marquise-cut-diamond-rings",
    ],
  },
  "cushion-cut-diamond-rings": {
    slug: "cushion-cut-diamond-rings",
    title: "Cushion Cut Diamond Rings | Vintage Charm | Ever and Always",
    description:
      "Shop cushion cut diamond rings at Ever and Always. Vintage-inspired square with rounded corners. Affordable prices and timeless beauty.",
    metaDescription:
      "Discover affordable cushion cut diamond rings at Ever and Always. Vintage charm, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "cushion cut diamond rings",
      "cushion engagement rings",
      "cushion diamond rings",
      "affordable cushion cut diamonds",
    ],
    h1: "Cushion Cut Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Diamond Shapes", href: "/diamond-shapes" },
      { name: "Cushion Cut", href: "/cushion-cut-diamond-rings" },
    ],
    relatedCollections: [
      "princess-cut-diamond-rings",
      "round-cut-diamond-rings",
      "emerald-cut-diamond-rings",
    ],
  },
  "emerald-cut-diamond-rings": {
    slug: "emerald-cut-diamond-rings",
    title: "Emerald Cut Diamond Rings | Art Deco Elegance | Ever and Always",
    description:
      "Shop emerald cut diamond rings at Ever and Always. Rectangular step-cut with elegant hall-of-mirrors effect. Affordable luxury.",
    metaDescription:
      "Discover affordable emerald cut diamond rings at Ever and Always. Art Deco elegance, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "emerald cut diamond rings",
      "emerald cut engagement rings",
      "rectangular diamond rings",
      "affordable emerald cut diamonds",
    ],
    h1: "Emerald Cut Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Diamond Shapes", href: "/diamond-shapes" },
      { name: "Emerald Cut", href: "/emerald-cut-diamond-rings" },
    ],
    relatedCollections: [
      "cushion-cut-diamond-rings",
      "asscher-cut-diamond-rings",
      "princess-cut-diamond-rings",
    ],
  },
  "pear-shaped-diamond-rings": {
    slug: "pear-shaped-diamond-rings",
    title: "Pear Shaped Diamond Rings | Unique Elegance | Ever and Always",
    description:
      "Shop pear shaped diamond rings at Ever and Always. Teardrop shape that elongates the finger. Affordable prices and unique beauty.",
    metaDescription:
      "Discover affordable pear shaped diamond rings at Ever and Always. Unique elegance, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "pear shaped diamond rings",
      "pear engagement rings",
      "teardrop diamond rings",
      "affordable pear cut diamonds",
    ],
    h1: "Pear Shaped Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Diamond Shapes", href: "/diamond-shapes" },
      { name: "Pear Shaped", href: "/pear-shaped-diamond-rings" },
    ],
    relatedCollections: [
      "oval-cut-diamond-rings",
      "marquise-cut-diamond-rings",
      "round-cut-diamond-rings",
    ],
  },
  "marquise-cut-diamond-rings": {
    slug: "marquise-cut-diamond-rings",
    title: "Marquise Cut Diamond Rings | Elongated Brilliance | Ever and Always",
    description:
      "Shop marquise cut diamond rings at Ever and Always. Football-shaped cut that maximizes carat weight. Affordable and stunning.",
    metaDescription:
      "Discover affordable marquise cut diamond rings at Ever and Always. Elongated brilliance, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "marquise cut diamond rings",
      "marquise engagement rings",
      "football diamond rings",
      "affordable marquise cut diamonds",
    ],
    h1: "Marquise Cut Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Diamond Shapes", href: "/diamond-shapes" },
      { name: "Marquise Cut", href: "/marquise-cut-diamond-rings" },
    ],
    relatedCollections: [
      "oval-cut-diamond-rings",
      "pear-shaped-diamond-rings",
      "round-cut-diamond-rings",
    ],
  },
  "radiant-cut-diamond-rings": {
    slug: "radiant-cut-diamond-rings",
    title: "Radiant Cut Diamond Rings | Brilliant & Modern | Ever and Always",
    description:
      "Shop radiant cut diamond rings at Ever and Always. Square cut with brilliant faceting. Affordable prices and modern elegance.",
    metaDescription:
      "Discover affordable radiant cut diamond rings at Ever and Always. Brilliant & modern, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "radiant cut diamond rings",
      "radiant engagement rings",
      "square brilliant diamonds",
      "affordable radiant cut diamonds",
    ],
    h1: "Radiant Cut Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Diamond Shapes", href: "/diamond-shapes" },
      { name: "Radiant Cut", href: "/radiant-cut-diamond-rings" },
    ],
    relatedCollections: [
      "princess-cut-diamond-rings",
      "cushion-cut-diamond-rings",
      "round-cut-diamond-rings",
    ],
  },
  "asscher-cut-diamond-rings": {
    slug: "asscher-cut-diamond-rings",
    title: "Asscher Cut Diamond Rings | Vintage Square | Ever and Always",
    description:
      "Shop Asscher cut diamond rings at Ever and Always. Vintage square step-cut with art deco appeal. Affordable luxury.",
    metaDescription:
      "Discover affordable Asscher cut diamond rings at Ever and Always. Vintage square elegance, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "asscher cut diamond rings",
      "asscher engagement rings",
      "square step cut diamonds",
      "affordable asscher cut diamonds",
    ],
    h1: "Asscher Cut Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Diamond Shapes", href: "/diamond-shapes" },
      { name: "Asscher Cut", href: "/asscher-cut-diamond-rings" },
    ],
    relatedCollections: [
      "emerald-cut-diamond-rings",
      "princess-cut-diamond-rings",
      "cushion-cut-diamond-rings",
    ],
  },
  "heart-shaped-diamond-rings": {
    slug: "heart-shaped-diamond-rings",
    title: "Heart Shaped Diamond Rings | Romantic Symbol | Ever and Always",
    description:
      "Shop heart shaped diamond rings at Ever and Always. Romantic symbol of love. Affordable prices and meaningful design.",
    metaDescription:
      "Discover affordable heart shaped diamond rings at Ever and Always. Romantic symbol, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "heart shaped diamond rings",
      "heart engagement rings",
      "heart diamond rings",
      "affordable heart cut diamonds",
    ],
    h1: "Heart Shaped Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Diamond Shapes", href: "/diamond-shapes" },
      { name: "Heart Shaped", href: "/heart-shaped-diamond-rings" },
    ],
    relatedCollections: [
      "round-cut-diamond-rings",
      "oval-cut-diamond-rings",
      "promise-rings",
    ],
  },
  // Metals
  "white-gold-diamond-rings": {
    slug: "white-gold-diamond-rings",
    title: "White Gold Diamond Rings | Classic Elegance | Ever and Always",
    description:
      "Shop white gold diamond rings at Ever and Always. Classic white metal that enhances diamond brilliance. Affordable prices and premium quality.",
    metaDescription:
      "Discover affordable white gold diamond rings at Ever and Always. Classic elegance, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "white gold diamond rings",
      "white gold engagement rings",
      "white gold rings",
      "affordable white gold diamonds",
    ],
    h1: "White Gold Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Metals", href: "/metals" },
      { name: "White Gold", href: "/white-gold-diamond-rings" },
    ],
    relatedCollections: [
      "yellow-gold-diamond-rings",
      "rose-gold-diamond-rings",
      "platinum-diamond-rings",
    ],
  },
  "yellow-gold-diamond-rings": {
    slug: "yellow-gold-diamond-rings",
    title: "Yellow Gold Diamond Rings | Warm Elegance | Ever and Always",
    description:
      "Shop yellow gold diamond rings at Ever and Always. Warm, classic metal that never goes out of style. Affordable prices and timeless beauty.",
    metaDescription:
      "Discover affordable yellow gold diamond rings at Ever and Always. Warm elegance, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "yellow gold diamond rings",
      "yellow gold engagement rings",
      "gold diamond rings",
      "affordable yellow gold diamonds",
    ],
    h1: "Yellow Gold Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Metals", href: "/metals" },
      { name: "Yellow Gold", href: "/yellow-gold-diamond-rings" },
    ],
    relatedCollections: [
      "white-gold-diamond-rings",
      "rose-gold-diamond-rings",
      "platinum-diamond-rings",
    ],
  },
  "rose-gold-diamond-rings": {
    slug: "rose-gold-diamond-rings",
    title: "Rose Gold Diamond Rings | Romantic Elegance | Ever and Always",
    description:
      "Shop rose gold diamond rings at Ever and Always. Romantic pink hue that's modern and elegant. Affordable prices and stunning beauty.",
    metaDescription:
      "Discover affordable rose gold diamond rings at Ever and Always. Romantic elegance, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "rose gold diamond rings",
      "rose gold engagement rings",
      "pink gold rings",
      "affordable rose gold diamonds",
    ],
    h1: "Rose Gold Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Metals", href: "/metals" },
      { name: "Rose Gold", href: "/rose-gold-diamond-rings" },
    ],
    relatedCollections: [
      "white-gold-diamond-rings",
      "yellow-gold-diamond-rings",
      "platinum-diamond-rings",
    ],
  },
  "platinum-diamond-rings": {
    slug: "platinum-diamond-rings",
    title: "Platinum Diamond Rings | Ultimate Luxury | Ever and Always",
    description:
      "Shop platinum diamond rings at Ever and Always. The most durable and luxurious metal. Affordable prices for premium quality.",
    metaDescription:
      "Discover affordable platinum diamond rings at Ever and Always. Ultimate luxury, transparent pricing, and free shipping. Shop now!",
    keywords: [
      "platinum diamond rings",
      "platinum engagement rings",
      "platinum rings",
      "affordable platinum diamonds",
    ],
    h1: "Platinum Diamond Rings",
    breadcrumbs: [
      { name: "Jewelry", href: "/jewelry" },
      { name: "Metals", href: "/metals" },
      { name: "Platinum", href: "/platinum-diamond-rings" },
    ],
    relatedCollections: [
      "white-gold-diamond-rings",
      "yellow-gold-diamond-rings",
      "rose-gold-diamond-rings",
    ],
  },
};

/**
 * Get SEO collection by slug
 */
export function getSEOCollection(slug: string): SEOCollection | undefined {
  return SEO_COLLECTIONS[slug];
}

/**
 * Get all SEO collection slugs
 */
export function getAllSEOCollectionSlugs(): string[] {
  return Object.keys(SEO_COLLECTIONS);
}
