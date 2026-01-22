import { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // cacheComponents disabled - causes build issues with dynamic routes
    // Using React cache() instead for data caching
    // Fix workspace root warning by explicitly setting the root
    turbopack: {
        root: process.cwd(),
    },
    images: {
        // This is necessary to display images from your local Vendure instance
        dangerouslyAllowLocalIP: true,
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
                hostname: 'www.my-shop.com'
            },
            {
                hostname: 'my-shop.com'
            }
        ],
    },
    experimental: {
        rootParams: true
    }
};

export default nextConfig;