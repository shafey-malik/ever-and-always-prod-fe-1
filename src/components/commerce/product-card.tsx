'use client';

import { useState } from 'react';
import Image from 'next/image';
import {FragmentOf, readFragment} from '@/graphql';
import {ProductCardFragment} from '@/lib/vendure/fragments';
import {Price} from '@/components/commerce/price';
import {Suspense} from "react";
import Link from "next/link";
import { ImageOff } from 'lucide-react';

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
            className="group block bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300 ease-out hover:-translate-y-1"
        >
            <div className="aspect-square relative bg-muted">
                {normalizedImageSrc && !imageError ? (
                    <Image
                        src={normalizedImageSrc}
                        alt={product.productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={handleImageError}
                        unoptimized={normalizedImageSrc.includes('my-shop.com')}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted">
                        <ImageOff className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm">No image</span>
                    </div>
                )}
            </div>
            <div className="p-4 space-y-2">
                <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {product.productName}
                </h3>
                <Suspense fallback={<div className="h-8 w-36 rounded bg-muted"></div>}>
                    <p className="text-lg font-bold">
                        {product.priceWithTax.__typename === 'PriceRange' ? (
                            product.priceWithTax.min !== product.priceWithTax.max ? (
                                <>
                                    from <Price value={product.priceWithTax.min}/>
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
