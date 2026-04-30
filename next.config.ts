import { NextConfig } from 'next';

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
                hostname: 'everandalways.com'
            },
            {
                hostname: 'www.everandalways.com'
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
            }
        ],
    },
    experimental: {
        rootParams: true
    }
};

export default nextConfig;