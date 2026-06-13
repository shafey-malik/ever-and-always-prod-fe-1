'use client';

import { useState } from 'react';
import Image from 'next/image';
import {FragmentOf, readFragment} from '@/graphql';
import {ProductCardFragment} from '@/lib/vendure/fragments';
import {Price} from '@/components/commerce/price';
import {Suspense} from "react";
import Link from "next/link";
import { ImageOff } from 'lucide-react';
import { WishlistButton } from '@/components/commerce/wishlist-button';

interface ProductCardProps {
    product: FragmentOf<typeof ProductCardFragment>;
}

export function ProductCard({product: productProp}: ProductCardProps) {
    const product = readFragment(ProductCardFragment, productProp);
    const [imageError, setImageError] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(
        product.productAsset?.preview || null
    );

    const handleImageError = () => {
        setImageError(true);
        setImageSrc(null);
    };

    // Normalize image URL - fix backslashes to forward slashes
    const normalizeImageUrl = (url: string | null | undefined): string | null => {
        if (!url) return null;
        return url.replace(/\\/g, '/');
    };

    const normalizedImageSrc = normalizeImageUrl(imageSrc);

    return (
        <Link
            href={`/product/${product.slug}`}
            className="group relative block bg-[hsl(var(--card))] rounded-2xl overflow-hidden border border-[hsl(var(--border))] shadow-(--shadow-card) hover:shadow-(--shadow-elegant) hover:-translate-y-1.5 transition-all duration-500"
            style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
        >
            {/* Gold hairline reveal on hover */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-hover:border-[hsl(var(--secondary)/0.45)] transition-colors duration-500 z-20" />

            <div className="aspect-square relative bg-[hsl(var(--muted))] overflow-hidden">
                {normalizedImageSrc && !imageError ? (
                    <Image
                        src={normalizedImageSrc}
                        alt={product.productName}
                        fill
                        className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-108"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={handleImageError}
                        unoptimized={normalizedImageSrc.includes('my-shop.com')}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))]">
                        <ImageOff className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm">No image</span>
                    </div>
                )}

                {/* Soft editorial gradient on hover */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Wishlist heart */}
                <div className="absolute top-3 right-3 z-20">
                    <WishlistButton
                        item={{
                            id: product.slug,
                            name: product.productName,
                            href: `/product/${product.slug}`,
                            image: normalizedImageSrc,
                        }}
                    />
                </div>

                {/* Quick-view affordance */}
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/85 backdrop-blur-md border border-white/60 px-3.5 py-1.5 font-luxury-sans text-[10px] tracking-[0.18em] uppercase text-[hsl(240,9%,15%)] opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    View
                    <span className="text-[hsl(var(--secondary-rich))]">→</span>
                </span>
            </div>

            <div className="p-4 sm:p-5 space-y-2.5">
                <h3 className="font-luxury-serif text-[15px] sm:text-base font-medium leading-snug line-clamp-2 text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--secondary-rich))] transition-colors duration-300">
                    {product.productName}
                </h3>

                <div className="h-px w-8 bg-linear-to-r from-[hsl(var(--secondary)/0.7)] to-transparent transition-all duration-500 group-hover:w-14" />

                <Suspense fallback={<div className="h-8 w-36 rounded bg-[hsl(var(--muted))]"></div>}>
                    <p className="font-luxury-serif font-light text-lg sm:text-xl text-[hsl(var(--lead-text))]">
                        {product.priceWithTax.__typename === 'PriceRange' ? (
                            product.priceWithTax.min !== product.priceWithTax.max ? (
                                <>
                                    <span className="font-luxury-sans text-[9px] tracking-[0.22em] uppercase text-[hsl(var(--muted-foreground))] mr-1.5 align-middle">
                                        From
                                    </span>
                                    <Price value={product.priceWithTax.min}/>
                                </>
                            ) : (
                                <Price value={product.priceWithTax.min}/>
                            )
                        ) : product.priceWithTax.__typename === 'SinglePrice' ? (
                            <Price value={product.priceWithTax.value}/>
                        ) : null}
                    </p>
                </Suspense>
            </div>
        </Link>
    );
}
