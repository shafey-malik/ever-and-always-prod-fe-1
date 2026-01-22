/**
 * Schema.org structured data utilities for SEO
 * Implements Product, Review, FAQ, Collection, and Organization schemas
 */

export interface ProductSchema {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description?: string;
  image?: string[];
  sku?: string;
  brand: {
    "@type": "Brand";
    name: string;
  };
  offers: {
    "@type": "Offer";
    url: string;
    priceCurrency: string;
    price: string;
    availability: "https://schema.org/InStock" | "https://schema.org/OutOfStock";
    priceValidUntil?: string;
    itemCondition?: "https://schema.org/NewCondition";
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string;
    reviewCount: string;
    bestRating?: string;
    worstRating?: string;
  };
  review?: ReviewSchema[];
}

export interface ReviewSchema {
  "@type": "Review";
  author: {
    "@type": "Person";
    name: string;
  };
  datePublished: string;
  reviewBody: string;
  reviewRating: {
    "@type": "Rating";
    ratingValue: string;
    bestRating?: string;
    worstRating?: string;
  };
}

export interface FAQSchema {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

export interface CollectionSchema {
  "@context": "https://schema.org";
  "@type": "CollectionPage";
  name: string;
  description?: string;
  url: string;
  image?: string;
  mainEntity?: {
    "@type": "ItemList";
    itemListElement: Array<{
      "@type": "ListItem";
      position: number;
      item: {
        "@type": "Product";
        name: string;
        url: string;
      };
    }>;
  };
}

export interface OrganizationSchema {
  "@context": "https://schema.org";
  "@type": "Organization";
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: {
    "@type": "ContactPoint";
    telephone?: string;
    contactType?: string;
    areaServed?: string;
  };
  sameAs?: string[];
  address?: {
    "@type": "PostalAddress";
    addressCountry: string;
    addressLocality?: string;
    addressRegion?: string;
  };
}

export interface BreadcrumbSchema {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Generate Product schema JSON-LD
 */
export function generateProductSchema(product: {
  name: string;
  description?: string;
  images?: string[];
  sku?: string;
  price: number;
  currency: string;
  url: string;
  inStock?: boolean;
  rating?: { value: number; count: number };
  reviews?: Array<{
    author: string;
    date: string;
    body: string;
    rating: number;
  }>;
}): ProductSchema {
  const schema: ProductSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images || [],
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Ever and Always",
    },
    offers: {
      "@type": "Offer",
      url: product.url,
      priceCurrency: product.currency,
      price: product.price.toString(),
      availability: product.inStock !== false
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  if (product.rating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating.value.toString(),
      reviewCount: product.rating.count.toString(),
      bestRating: "5",
      worstRating: "1",
    };
  }

  if (product.reviews && product.reviews.length > 0) {
    schema.review = product.reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      datePublished: review.date,
      reviewBody: review.body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating.toString(),
        bestRating: "5",
        worstRating: "1",
      },
    }));
  }

  return schema;
}

/**
 * Generate FAQ schema JSON-LD
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
): FAQSchema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Collection schema JSON-LD
 */
export function generateCollectionSchema(
  collection: {
    name: string;
    description?: string;
    url: string;
    image?: string;
    products?: Array<{ name: string; url: string }>;
  }
): CollectionSchema {
  const schema: CollectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: collection.name,
    description: collection.description,
    url: collection.url,
    image: collection.image,
  };

  if (collection.products && collection.products.length > 0) {
    schema.mainEntity = {
      "@type": "ItemList",
      itemListElement: collection.products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Product",
          name: product.name,
          url: product.url,
        },
      })),
    };
  }

  return schema;
}

/**
 * Generate Organization schema JSON-LD
 */
export function generateOrganizationSchema(config?: {
  url?: string;
  logo?: string;
  description?: string;
  phone?: string;
  address?: {
    country: string;
    city?: string;
    state?: string;
  };
  socialProfiles?: string[];
}): OrganizationSchema {
  const baseUrl = config?.url || "https://everandalways.com";
  
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ever and Always",
    url: baseUrl,
    logo: config?.logo || `${baseUrl}/logo.png`,
    description:
      config?.description ||
      "Ever and Always - America's most trusted source for affordable diamond jewelry. Transparent pricing, premium craftsmanship, and reliable sourcing.",
    ...(config?.phone && {
      contactPoint: {
        "@type": "ContactPoint",
        telephone: config.phone,
        contactType: "Customer Service",
        areaServed: "US",
      },
    }),
    ...(config?.address && {
      address: {
        "@type": "PostalAddress",
        addressCountry: config.address.country,
        ...(config.address.city && { addressLocality: config.address.city }),
        ...(config.address.state && { addressRegion: config.address.state }),
      },
    }),
    ...(config?.socialProfiles && { sameAs: config.socialProfiles }),
  };
}

/**
 * Generate Breadcrumb schema JSON-LD
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbSchema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Component to render JSON-LD script tag
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
