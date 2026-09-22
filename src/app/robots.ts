import { MetadataRoute } from "next";
import { SITE_URL, IS_PRODUCTION_SITE } from "@/lib/metadata";

/**
 * Paths that must never be indexed: authenticated areas, the funnel, and
 * transient auth flows. Kept in one place so robots and page-level `robots`
 * metadata cannot drift apart.
 */
const PRIVATE_PATHS = [
  "/api/",
  "/account/",
  "/cart/",
  "/checkout/",
  "/order-confirmation/",
  "/sign-in",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify",
  "/verify-pending",
  "/wishlist",
];

/**
 * Faceted-navigation and pagination parameters. Every combination produces a
 * near-duplicate of its parent category, so they burn crawl budget that should
 * be spent on the 90+ real category pages. Blocked at the parameter level
 * rather than the path level so the clean category URLs stay fully crawlable.
 */
const CRAWL_TRAP_PARAMS = [
  "/*?*page=",
  "/*?*sort=",
  "/*?*facet=",
  "/*?*fv=",
  "/*?*metal=",
  "/*?*shape=",
  "/*?*q=",
];

/**
 * AI answer engines and their crawlers.
 *
 * These are listed explicitly rather than left to the `*` wildcard: several of
 * these agents treat an explicit named `Allow` as affirmative permission to use
 * the site for grounding and citation, and an unnamed agent under a restrictive
 * wildcard is the most common reason a brand is absent from AI answers. Search
 * and answer agents get the same access as Googlebot; nothing here grants more
 * than the public storefront.
 */
const AI_ANSWER_AGENTS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google AI surfaces (AI Overviews / Gemini grounding)
  "Google-Extended",
  // Apple Intelligence
  "Applebot",
  "Applebot-Extended",
  // Microsoft Copilot rides Bingbot, but the standalone agent is named too
  "Bingbot",
  // Others that feed retrieval-augmented answers
  "Amazonbot",
  "meta-externalagent",
  "MistralAI-User",
  "DuckAssistBot",
  "cohere-ai",
  "YouBot",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  // Preview and local deploys must never invite a crawler in — a preview host
  // that gets indexed competes with the production domain for the brand term.
  if (!IS_PRODUCTION_SITE) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...PRIVATE_PATHS, ...CRAWL_TRAP_PARAMS],
      },
      ...AI_ANSWER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
