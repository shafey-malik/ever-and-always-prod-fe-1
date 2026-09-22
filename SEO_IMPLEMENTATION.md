# SEO implementation — Ever and Always

Storefront: **https://everandalways.store**
Positioning: certified **lab-grown** diamond rings, budget-friendly, made to order, Hanover MD.

---

## 1. What was broken (fixed in this pass)

These were live in production and each one independently prevented ranking.

| Problem | Effect | Fix |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` held the Vendure API URL locally and `http://localhost:3001` on Vercel | Every canonical, OG URL and sitemap entry pointed at a non-existent host. Pages could not be indexed. | `src/lib/metadata.ts` now rejects localhost / API / preview hosts and pins production to the real domain |
| `public/robots.txt` shadowed `app/robots.ts` | The generated rules and the sitemap reference were never served | Deleted the static file |
| Sitemap listed 34 URLs, none of them a category or product | The ~90 category pages had no discovery path | `app/sitemap.ts` now pulls collections and products from Vendure; 105 URLs |
| All 90 Vendure collections store `name`/`description` as their own slug | `<title>engagement-solitaire</title>` on every category page | `src/lib/seo/taxonomy.ts` supplies H1, title, description, copy and FAQs for all of them |
| 18 navbar dropdown links built slugs by string munging | 18 site-wide 404s (e.g. `/collection/engagement-white-gold`) | Menu entries now carry real slugs |
| `/jewelry` did not exist but was the root of every BreadcrumbList | Every breadcrumb trail started with a 404 | Built `/jewelry` as the category hub |
| 24 `/collections/*` pages rendered the same unfiltered grid | Near-duplicate pages competing with the real categories | 301s into the canonical category pages |
| All 5 `/price/*` pages returned HTTP 500 | Budget-intent pages entirely unavailable | Route opted out of prerendering |
| Product FAQ markup promised free shipping over $50 and 50 countries | Contradicted the rest of the site; AI assistants quote this back as fact | One shared source in `src/lib/seo/faqs.ts` |

Verified: full crawl of 112 internal URLs returns **112× 200, 0 broken links**.

---

## 2. Architecture

```
src/lib/seo/
├── business.ts    NAP, hours, policies — single source of truth
├── taxonomy.ts    SEO record for all 90 Vendure collections
├── schema.tsx     JSON-LD generators
├── faqs.ts        Shared store FAQs (visible copy + markup)
├── collections.ts Legacy /collections data (now redirect targets only)
├── price-pages.ts Budget landing pages
└── blog-posts.ts  Journal content
```

### URL map

| Route | Purpose |
|---|---|
| `/` | Home |
| `/jewelry` | Category hub linking to all ~90 categories |
| `/engagement-rings`, `/wedding-rings` | Taxonomy hubs with FAQ + ItemList |
| `/collection/[slug]` | The 90 real category pages |
| `/lab-grown-diamonds` | Pillar page for the core differentiator |
| `/custom` | Custom design service + Service schema |
| `/price/[slug]` | 5 budget landing pages |
| `/product/[slug]` | Product detail |
| `/blog`, `/blog/[slug]` | Journal |
| `/llms.txt` | Plain-text brief for AI answer engines |

---

## 3. Structured data

Emitted on every page as one `@graph`: **Organization + WebSite + JewelryStore**, cross-linked by `@id` so the brand, the site and the store resolve to one entity.

Per page type:

- Category → `CollectionPage` + `FAQPage` + `BreadcrumbList`
- Product → `Product` (with `hasMerchantReturnPolicy`, `shippingDetails`, `priceValidUntil`) + `FAQPage` + `BreadcrumbList`
- `/custom` → `Service` + `FAQPage`
- `/lab-grown-diamonds`, `/blog/*` → `Article` + `FAQPage`

`aggregateRating` is emitted **only** when real reviews exist. Inventing one is a manual-action risk.

---

## 4. AI answer-engine optimisation

- `robots.ts` names 20 AI crawlers explicitly (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, meta-externalagent and others) with the same access as Googlebot.
- `/llms.txt` states the business facts, price ranges, policies and a full category index in plain text.
- Every category, hub and pillar page carries **visible** prose and FAQ answers, not just markup. Answer engines quote rendered text.
- Faceted URLs (`?page=`, `?sort=`, `?facet=`) are disallowed to protect crawl budget.

---

## 5. Still required from the business owner

These cannot be done in code and are currently the largest remaining gaps.

1. **Set `NEXT_PUBLIC_SITE_URL=https://everandalways.store` in Vercel** (Production). The code now defends against a wrong value, but fix the source.
2. **Fill in `telephone`, `email` and `sameAs` in `src/lib/seo/business.ts`.** `sameAs` (social and directory profiles) is the single weakest part of the brand's footprint and is how a brand query disambiguates.
3. **Create and verify a Google Business Profile** at the Hanover MD address. The address is currently associated with a differently named jeweller, which can block verification — expect to provide evidence of a distinct business at that suite.
4. **Confirm the opening hours** in `business.ts` match the profile exactly.
5. **Submit the sitemap** in Google Search Console and Bing Webmaster Tools.
6. **Replace the placeholder catalogue.** Three products named "ring 1/2/3" cannot rank category pages; the infrastructure is data-driven and will populate automatically.
7. **Get reviews.** Once real ratings exist, pass them to `generateProductSchema` and the `aggregateRating` block activates.
8. **Refresh `blog-posts.ts`** — one post is titled "Engagement Ring Trends 2024" and one references natural-diamond sourcing, which conflicts with lab-grown-only positioning.
