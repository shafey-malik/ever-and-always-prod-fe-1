import { NextConfig } from 'next';

/**
 * The `/collections/*` routes were built as standalone keyword landing pages,
 * but none of them filter the catalogue — every one renders the same unfiltered
 * product grid. That makes 24 near-duplicate pages competing with the real
 * category pages under `/collection/*` for the same queries.
 *
 * Consolidating them with 301s moves whatever authority they hold onto the
 * canonical category page instead of splitting it. Targets are the hub pages
 * and the Vendure collection slugs; anything with no real equivalent points at
 * the closest hub.
 */
const COLLECTION_CONSOLIDATION: Record<string, string> = {
  // Hubs
  'engagement-rings': '/engagement-rings',
  'proposal-rings': '/engagement-rings',
  'promise-rings': '/engagement-rings',
  'wedding-rings': '/wedding-rings',

  // Real categories
  'mens-wedding-bands': '/collection/wedding-men-s-wedding-bands',
  'womens-wedding-bands': '/collection/wedding-women-s-wedding-bands',
  'solitaire-diamond-rings': '/collection/engagement-solitaire',
  'halo-diamond-rings': '/collection/engagement-halo',

  // Diamond shapes
  'round-cut-diamond-rings': '/collection/engagement-round',
  'princess-cut-diamond-rings': '/collection/engagement-princess',
  'oval-cut-diamond-rings': '/collection/engagement-oval',
  'cushion-cut-diamond-rings': '/collection/engagement-cushion',
  'emerald-cut-diamond-rings': '/collection/engagement-emerald',
  'pear-shaped-diamond-rings': '/collection/engagement-pear',
  'marquise-cut-diamond-rings': '/collection/engagement-marquise',
  'radiant-cut-diamond-rings': '/collection/engagement-radiant',
  'asscher-cut-diamond-rings': '/collection/engagement-asscher',
  'heart-shaped-diamond-rings': '/collection/engagement-heart',

  // Metals — 14K is the volume seller, so it is the canonical target
  'white-gold-diamond-rings': '/collection/engagement-14k-white-gold',
  'yellow-gold-diamond-rings': '/collection/engagement-14k-yellow-gold',
  'rose-gold-diamond-rings': '/collection/engagement-14k-rose-gold',
  'platinum-diamond-rings': '/collection/engagement-platinum',

  // Stone origin. We sell lab-grown only, so the "natural" page was both a
  // duplicate and inaccurate; it folds into the lab-grown pillar page.
  'lab-grown-diamond-rings': '/lab-grown-diamonds',
  'natural-diamond-rings': '/lab-grown-diamonds',
};

const nextConfig: NextConfig = {
    // cacheComponents disabled - causes build issues with dynamic routes
    // Using React cache() instead for data caching
    // Fix workspace root warning by explicitly setting the root
    // typescript: {
    //     // Ignore TypeScript errors during build (e.g., implicit any types)
    //     ignoreBuildErrors: true,
    // },
    turbopack: {
        root: process.cwd(),
    },
    images: {
        // This is necessary to display images from your local Vendure instance
        remotePatterns: [
            {
                hostname: 'readonlydemo.vendure.io',
            },
            {
                hostname: 'demo.vendure.io'
            },
            {
                hostname: 'localhost'
            },
            {
                hostname: 'images.unsplash.com'
            },
            {
                hostname: 'everandalways.store'
            },
            {
                hostname: 'www.everandalways.store'
            },
            {
                // Cloudflare R2 public bucket URL (r2.dev subdomain or custom domain)
                hostname: '*.r2.dev'
            },
            {
                hostname: '*.r2.cloudflarestorage.com'
            },
            {
                hostname: 'backend-production-28e0.up.railway.app'
            },
            {
                hostname: 'res.cloudinary.com'
            }
        ],
    },
    experimental: {
        rootParams: true
    },
    async redirects() {
        return [
            ...Object.entries(COLLECTION_CONSOLIDATION).map(([slug, destination]) => ({
                source: `/collections/${slug}`,
                destination,
                permanent: true,
            })),
            // `/jewelry` is the breadcrumb root on every product and category
            // page. It 404'd until now, which broke the crawl path advertised
            // by every BreadcrumbList on the site.
            { source: '/collections', destination: '/jewelry', permanent: true },
        ];
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;