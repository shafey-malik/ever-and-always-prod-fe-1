/**
 * Schema.org structured data for Ever and Always.
 *
 * Two audiences are served here and they want different things:
 *
 * 1. Classic search engines, which use this for rich results (product price,
 *    breadcrumbs, FAQ accordions, local pack eligibility).
 * 2. AI answer engines, which use it to decide *what this business is* and
 *    whether a claim on the page is safe to repeat. That is why the graph is
 *    anchored on stable `@id` values and why Organization, WebSite and the
 *    physical store cross-reference each other instead of being emitted as
 *    three unrelated islands.
 *
 * Node ids are URL fragments off the site origin so every page in the site
 * refers to the same entity rather than redeclaring a new one.
 */

import { BUSINESS, POLICY } from './business';

/** A JSON-LD node. Deliberately loose: schema.org is open-world. */
export type JsonLdNode = Record<string, unknown>;

const SCHEMA_CONTEXT = 'https://schema.org';

/** Stable node identifiers, resolved against the site origin. */
export const schemaId = {
  organization: (base: string) => `${base}/#organization`,
  website: (base: string) => `${base}/#website`,
  store: (base: string) => `${base}/#store`,
  product: (base: string, slug: string) => `${base}/product/${slug}#product`,
  collection: (base: string, slug: string) => `${base}/collection/${slug}#collection`,
};

/** Drop undefined/empty entries so no empty strings reach the output. */
function compact<T extends JsonLdNode>(node: T): T {
  const out: JsonLdNode = {};
  for (const [key, value] of Object.entries(node)) {
    if (value === undefined || value === null) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out as T;
}

function postalAddress(): JsonLdNode {
  return {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.address.street,
    addressLocality: BUSINESS.address.locality,
    addressRegion: BUSINESS.address.region,
    postalCode: BUSINESS.address.postalCode,
    addressCountry: BUSINESS.address.country,
  };
}

/* ------------------------------------------------------------------ *
 * Entity: Organization
 * ------------------------------------------------------------------ */

/**
 * The brand entity. `alternateName` carries the spellings people actually
 * type ("Ever & Always", "everandalways"), which is what lets a brand query in
 * any form resolve to this site rather than to a similarly named jeweller.
 */
export function generateOrganizationSchema(config: {
  url: string;
  logo?: string;
  description?: string;
}): JsonLdNode {
  const base = config.url.replace(/\/+$/, '');

  return compact({
    '@context': SCHEMA_CONTEXT,
    '@type': 'Organization',
    '@id': schemaId.organization(base),
    name: BUSINESS.name,
    alternateName: [...BUSINESS.alternateNames],
    legalName: BUSINESS.legalName,
    url: `${base}/`,
    logo: {
      '@type': 'ImageObject',
      url: config.logo || `${base}/cube-logo-small.webp`,
      caption: BUSINESS.name,
    },
    image: config.logo || `${base}/cube-logo-small.webp`,
    slogan: BUSINESS.slogan,
    description: config.description || BUSINESS.description,
    address: postalAddress(),
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    knowsAbout: [
      'Lab-grown diamonds',
      'Engagement rings',
      'Wedding bands',
      'Custom ring design',
      'Diamond certification and the 4Cs',
    ],
    contactPoint: compact({
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: BUSINESS.telephone,
      email: BUSINESS.email,
      areaServed: BUSINESS.areaServed,
      availableLanguage: ['en'],
      url: `${base}/consultation`,
    }),
    sameAs: [...BUSINESS.sameAs],
  });
}

/* ------------------------------------------------------------------ *
 * Entity: WebSite (enables the sitelinks search box)
 * ------------------------------------------------------------------ */

export function generateWebSiteSchema(base: string): JsonLdNode {
  const origin = base.replace(/\/+$/, '');

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    '@id': schemaId.website(origin),
    url: `${origin}/`,
    name: BUSINESS.name,
    alternateName: [...BUSINESS.alternateNames],
    description: BUSINESS.description,
    inLanguage: 'en-US',
    publisher: { '@id': schemaId.organization(origin) },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/* ------------------------------------------------------------------ *
 * Entity: the physical store (local pack + "near me" queries)
 * ------------------------------------------------------------------ */

/**
 * JewelryStore is a LocalBusiness subtype, so this is what makes the brand
 * eligible for the map pack and for "lab grown diamond rings near me" in the
 * Baltimore/DC corridor. It must agree with the Google Business Profile.
 */
export function generateLocalBusinessSchema(base: string): JsonLdNode {
  const origin = base.replace(/\/+$/, '');

  return compact({
    '@context': SCHEMA_CONTEXT,
    '@type': 'JewelryStore',
    '@id': schemaId.store(origin),
    name: BUSINESS.name,
    description: BUSINESS.description,
    url: `${origin}/`,
    image: `${origin}/cube-logo-small.webp`,
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    address: postalAddress(),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    priceRange: BUSINESS.priceRange,
    currenciesAccepted: BUSINESS.currenciesAccepted,
    paymentAccepted: BUSINESS.paymentAccepted,
    parentOrganization: { '@id': schemaId.organization(origin) },
    areaServed: [
      { '@type': 'State', name: 'Maryland' },
      { '@type': 'City', name: 'Baltimore' },
      { '@type': 'City', name: 'Washington, D.C.' },
      { '@type': 'Country', name: 'United States' },
    ],
    openingHoursSpecification: BUSINESS.openingHours.map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [...slot.days],
      opens: slot.opens,
      closes: slot.closes,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Lab-Grown Diamond Rings',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'Engagement Rings', url: `${origin}/engagement-rings` },
        { '@type': 'OfferCatalog', name: 'Wedding Rings', url: `${origin}/wedding-rings` },
        { '@type': 'OfferCatalog', name: 'Custom Ring Design', url: `${origin}/custom` },
      ],
    },
    sameAs: [...BUSINESS.sameAs],
  });
}

/* ------------------------------------------------------------------ *
 * Entity: Service (custom ring design)
 * ------------------------------------------------------------------ */

export function generateCustomDesignServiceSchema(base: string): JsonLdNode {
  const origin = base.replace(/\/+$/, '');

  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Service',
    name: 'Custom Ring Design',
    serviceType: 'Custom engagement ring and wedding band design',
    url: `${origin}/custom`,
    provider: { '@id': schemaId.organization(origin) },
    areaServed: { '@type': 'Country', name: 'United States' },
    description:
      'Design a one-of-a-kind lab-grown diamond ring from a sketch, a reference image or a description. Free CAD rendering before you commit, no design fee, and delivery in roughly three to four weeks.',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `${origin}/custom`,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Custom design options',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Design from a reference image' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Build a ring stone by stone' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Redesign or reset an heirloom' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Private design consultation' } },
      ],
    },
  };
}

/* ------------------------------------------------------------------ *
 * Product
 * ------------------------------------------------------------------ */

/**
 * Product schema with the merchant-listing fields Google now expects.
 *
 * `hasMerchantReturnPolicy` and `shippingDetails` are what move a listing from
 * a bare price snippet to a full merchant listing experience; omitting them is
 * the most common reason a correctly marked-up product shows no rich result.
 * `priceValidUntil` is required for the price to keep displaying at all.
 */
export function generateProductSchema(product: {
  name: string;
  description?: string;
  images?: string[];
  sku?: string;
  price: number;
  currency: string;
  url: string;
  base: string;
  slug: string;
  inStock?: boolean;
  material?: string;
  color?: string;
  category?: string;
  rating?: { value: number; count: number };
  reviews?: Array<{ author: string; date: string; body: string; rating: number }>;
}): JsonLdNode {
  const origin = product.base.replace(/\/+$/, '');

  // Prices are quoted for a rolling year; a stale date suppresses the snippet.
  const priceValidUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const node: JsonLdNode = compact({
    '@context': SCHEMA_CONTEXT,
    '@type': 'Product',
    '@id': schemaId.product(origin, product.slug),
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    mpn: product.sku,
    category: product.category,
    material: product.material,
    color: product.color,
    brand: {
      '@type': 'Brand',
      name: BUSINESS.name,
    },
    manufacturer: { '@id': schemaId.organization(origin) },
    offers: compact({
      '@type': 'Offer',
      '@id': `${product.url}#offer`,
      url: product.url,
      priceCurrency: product.currency,
      price: product.price.toFixed(2),
      priceValidUntil,
      availability:
        product.inStock !== false
          ? 'https://schema.org/InStock'
          : 'https://schema.org/BackOrder',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': schemaId.organization(origin) },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: POLICY.shippingCountry,
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: POLICY.returnDays,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'USD',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: POLICY.shippingCountry,
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: POLICY.handlingDaysMin,
            maxValue: POLICY.handlingDaysMax,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: POLICY.transitDaysMin,
            maxValue: POLICY.transitDaysMax,
            unitCode: 'DAY',
          },
        },
      },
    }),
  });

  // Ratings are only emitted when they come from real reviews. Inventing an
  // aggregateRating is a manual-action risk and gets the markup ignored.
  if (product.rating && product.rating.count > 0) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value.toString(),
      reviewCount: product.rating.count.toString(),
      bestRating: '5',
      worstRating: '1',
    };
  }

  if (product.reviews && product.reviews.length > 0) {
    node.review = product.reviews.map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.author },
      datePublished: review.date,
      reviewBody: review.body,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    }));
  }

  return node;
}

/* ------------------------------------------------------------------ *
 * Collection / ItemList
 * ------------------------------------------------------------------ */

export function generateCollectionSchema(collection: {
  name: string;
  description?: string;
  url: string;
  base: string;
  slug: string;
  image?: string;
  products?: Array<{ name: string; url: string; image?: string; price?: number }>;
  breadcrumbUrl?: string;
}): JsonLdNode {
  const origin = collection.base.replace(/\/+$/, '');

  const node: JsonLdNode = compact({
    '@context': SCHEMA_CONTEXT,
    '@type': 'CollectionPage',
    '@id': schemaId.collection(origin, collection.slug),
    name: collection.name,
    description: collection.description,
    url: collection.url,
    image: collection.image,
    inLanguage: 'en-US',
    isPartOf: { '@id': schemaId.website(origin) },
    about: { '@id': schemaId.organization(origin) },
  });

  if (collection.products && collection.products.length > 0) {
    node.mainEntity = {
      '@type': 'ItemList',
      numberOfItems: collection.products.length,
      itemListElement: collection.products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: product.url,
        name: product.name,
        image: product.image,
      })),
    };
  }

  return node;
}

/* ------------------------------------------------------------------ *
 * FAQ, Breadcrumb, Article
 * ------------------------------------------------------------------ */

export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): JsonLdNode {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): JsonLdNode {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  url: string;
  base: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  section?: string;
}): JsonLdNode {
  const origin = article.base.replace(/\/+$/, '');

  return compact({
    '@context': SCHEMA_CONTEXT,
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    url: article.url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': article.url },
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    articleSection: article.section,
    inLanguage: 'en-US',
    author: article.authorName
      ? { '@type': 'Person', name: article.authorName }
      : { '@id': schemaId.organization(origin) },
    publisher: { '@id': schemaId.organization(origin) },
    isPartOf: { '@id': schemaId.website(origin) },
  });
}

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */

/**
 * Render one or more JSON-LD nodes.
 *
 * `<` is escaped so a product name or review body containing markup cannot
 * break out of the script element.
 */
export function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
  const payload = Array.isArray(data)
    ? { '@context': SCHEMA_CONTEXT, '@graph': data.map(({ '@context': _ctx, ...rest }) => rest) }
    : data;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, '\\u003c'),
      }}
    />
  );
}
