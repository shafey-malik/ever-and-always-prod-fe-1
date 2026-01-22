'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ImageOff } from 'lucide-react';

interface CartItemImageProps {
    imageUrl: string | null | undefined;
    alt: string;
    productSlug: string;
}

// Normalize image URL - fix backslashes to forward slashes
const normalizeImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    return url.replace(/\\/g, '/');
};

export function CartItemImage({ imageUrl, alt, productSlug }: CartItemImageProps) {
    const [imageError, setImageError] = useState(false);
    const normalizedUrl = normalizeImageUrl(imageUrl);

    if (!normalizedUrl || imageError) {
        return (
            <Link
                href={`/product/${productSlug}`}
                className="flex-shrink-0 w-full sm:w-[120px] h-[120px] flex items-center justify-center bg-muted rounded-md"
            >
                <ImageOff className="w-8 h-8 opacity-50 text-muted-foreground" />
            </Link>
        );
    }

    return (
        <Link
            href={`/product/${productSlug}`}
            className="flex-shrink-0"
        >
            <Image
                src={normalizedUrl}
                alt={alt}
                width={120}
                height={120}
                className="rounded-md object-cover w-full sm:w-[120px] h-[120px]"
                onError={() => setImageError(true)}
                unoptimized={normalizedUrl.includes('my-shop.com')}
            />
        </Link>
    );
}
