/**
 * Single source of truth for the brand's real-world identity (NAP), the facts
 * search engines and AI answer engines use to recognise "Ever and Always" as a
 * distinct entity, and the commerce policies that feed Product structured data.
 *
 * Anything here is published in structured data and in the page footer, so keep
 * it consistent with the Google Business Profile character for character — a
 * mismatched suite number or phone format is the most common reason a local
 * listing fails to consolidate.
 */

export const BUSINESS = {
  /** Legal/display name. Must match the GBP listing exactly. */
  name: 'Ever and Always',
  /** Alternate spellings people actually search for. Fed to `alternateName`. */
  alternateNames: [
    'Ever & Always',
    'EverandAlways',
    'Ever and Always Jewelry',
    'Ever and Always Diamonds',
    'Ever and Always Fine Diamond Jewelry',
  ],
  legalName: 'Ever and Always',
  slogan: 'Certified lab-grown diamonds, without the traditional markup.',
  description:
    'Ever and Always is a US lab-grown diamond jeweller offering certified engagement rings, wedding bands and fully custom designs at a fraction of mined-diamond prices. Every ring is made to order and backed by a lifetime warranty.',

  address: {
    street: '7000 Arundel Mills Cir',
    locality: 'Hanover',
    region: 'MD',
    regionName: 'Maryland',
    postalCode: '21076',
    country: 'US',
  },

  /** Approximate coordinates for Arundel Mills, Hanover MD. */
  geo: { latitude: 39.1573, longitude: -76.7208 },

  /**
   * TODO(owner): fill these in. They are omitted from structured data while
   * blank rather than published as empty strings, which would be invalid.
   * A published phone number is a direct local-ranking and trust signal.
   */
  telephone: '' as string,
  email: '' as string,

  /**
   * TODO(owner): add every profile the brand actually controls. `sameAs` is the
   * primary way an entity is disambiguated from similarly named businesses, and
   * it is currently the weakest part of this brand's footprint.
   */
  sameAs: [] as string[],

  priceRange: '$$',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Credit Card, Debit Card, Apple Pay, Google Pay',
  areaServed: 'US',

  /** Storefront hours. Empty array omits `openingHoursSpecification`. */
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '10:00', closes: '20:00' },
    { days: ['Saturday'], opens: '10:00', closes: '20:00' },
    { days: ['Sunday'], opens: '11:00', closes: '18:00' },
  ],
} as const;

/** Commerce policies published in Product structured data and on-page copy. */
export const POLICY = {
  returnDays: 30,
  warranty: 'Lifetime warranty on the setting',
  freeShippingThresholdUsd: 0,
  shippingCountry: 'US',
  handlingDaysMin: 1,
  handlingDaysMax: 3,
  transitDaysMin: 2,
  transitDaysMax: 7,
  customLeadTimeWeeks: '3-4',
} as const;

/** One-line NAP string for the footer and for copy/paste into directories. */
export const FORMATTED_ADDRESS = `${BUSINESS.address.street}, ${BUSINESS.address.locality}, ${BUSINESS.address.region} ${BUSINESS.address.postalCode}`;
