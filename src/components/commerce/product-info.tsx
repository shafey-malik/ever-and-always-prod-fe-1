'use client';

import { useState, useMemo, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShoppingCart, CheckCircle2 } from 'lucide-react';
import { addToCart } from '@/app/product/[slug]/actions';
import { toast } from 'sonner';
import { Price } from '@/components/commerce/price';

interface ProductInfoProps {
    product: {
        id: string;
        name: string;
        description: string;
        variants: Array<{
            id: string;
            name: string;
            sku: string;
            priceWithTax: number;
            stockLevel: string;
            options: Array<{
                id: string;
                code: string;
                name: string;
                groupId: string;
                group: {
                    id: string;
                    code: string;
                    name: string;
                };
            }>;
        }>;
        optionGroups: Array<{
            id: string;
            code: string;
            name: string;
            options: Array<{
                id: string;
                code: string;
                name: string;
            }>;
        }>;
    };
    searchParams: { [key: string]: string | string[] | undefined };
}

export function ProductInfo({ product, searchParams }: ProductInfoProps) {
    const pathname = usePathname();
    const router = useRouter();
    const currentSearchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [isAdded, setIsAdded] = useState(false);

    // Initialize selected options from URL
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const initialOptions: Record<string, string> = {};

        // Load from URL search params
        product.optionGroups.forEach((group) => {
            const paramValue = searchParams[group.code];
            if (typeof paramValue === 'string') {
                // Find the option by code
                const option = group.options.find((opt) => opt.code === paramValue);
                if (option) {
                    initialOptions[group.id] = option.id;
                }
            }
        });

        return initialOptions;
    });

    // Find the matching variant based on selected options
    const selectedVariant = useMemo(() => {
        if (product.variants.length === 1) {
            return product.variants[0];
        }

        // If not all option groups have a selection, return null
        if (Object.keys(selectedOptions).length !== product.optionGroups.length) {
            return null;
        }

        // Find variant that matches all selected options
        return product.variants.find((variant) => {
            const variantOptionIds = variant.options.map((opt) => opt.id);
            const selectedOptionIds = Object.values(selectedOptions);
            return selectedOptionIds.every((optId) => variantOptionIds.includes(optId));
        });
    }, [selectedOptions, product.variants, product.optionGroups]);

    const handleOptionChange = (groupId: string, optionId: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [groupId]: optionId,
        }));

        // Find the option group and option to get their codes
        const group = product.optionGroups.find((g) => g.id === groupId);
        const option = group?.options.find((opt) => opt.id === optionId);

        if (group && option) {
            // Update URL with option code
            const params = new URLSearchParams(currentSearchParams);
            params.set(group.code, option.code);
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        startTransition(async () => {
            const result = await addToCart(selectedVariant.id, 1);

            if (result.success) {
                setIsAdded(true);
                toast.success('Added to cart', {
                    description: `${product.name} has been added to your cart`,
                });

                // Reset the added state after 2 seconds
                setTimeout(() => setIsAdded(false), 2000);
            } else {
                toast.error('Error', {
                    description: result.error || 'Failed to add item to cart',
                });
            }
        });
    };

    const isInStock = selectedVariant && selectedVariant.stockLevel !== 'OUT_OF_STOCK';
    const canAddToCart = selectedVariant && isInStock;

    return (
        <div className="space-y-8">
            {/* Product Title & Price */}
            <div className="space-y-3 pb-4 border-b border-[hsl(var(--lead-text))]/20">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-foreground leading-tight">
                    {product.name}
                </h1>
                {selectedVariant && (
                    <div className="flex items-baseline gap-3">
                        <p className="text-3xl sm:text-4xl font-bold text-foreground">
                            <Price value={selectedVariant.priceWithTax} />
                        </p>
                    </div>
                )}
            </div>

            {/* Product Description */}
            <div className="prose prose-sm sm:prose-base max-w-none text-muted-foreground leading-relaxed">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>

            {/* Option Groups */}
            {product.optionGroups.length > 0 && (
                <div className="space-y-8 pt-4 bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 sm:p-8 border border-[hsl(var(--lead-text))]/15 shadow-sm relative overflow-hidden">
                    {/* Subtle gold accent on top border */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--lead-text))]/30 to-transparent" />
                    {product.optionGroups.map((group, groupIndex) => (
                        <div 
                            key={group.id} 
                            className="space-y-4 pb-6 border-b border-border/30 last:border-b-0 last:pb-0"
                        >
                            <div className="flex items-center gap-2">
                                <Label className="text-lg font-semibold text-foreground font-serif">
                                    {group.name}
                                </Label>
                                {selectedOptions[group.id] && (
                                    <span className="text-xs text-muted-foreground font-medium">
                                        (Required)
                                    </span>
                                )}
                            </div>
                            <RadioGroup
                                value={selectedOptions[group.id] || ''}
                                onValueChange={(value) => handleOptionChange(group.id, value)}
                                className="mt-2"
                            >
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {group.options.map((option) => {
                                        const isSelected = selectedOptions[group.id] === option.id;
                                        return (
                                            <div key={option.id} className="relative">
                                                <RadioGroupItem
                                                    value={option.id}
                                                    id={option.id}
                                                    className="peer sr-only"
                                                />
                                                <Label
                                                    htmlFor={option.id}
                                                    className={`
                                                        group relative flex items-center justify-center rounded-xl 
                                                        border-2 px-5 sm:px-6 py-3.5 sm:py-4 cursor-pointer 
                                                        transition-all duration-300 min-h-[52px] font-medium 
                                                        text-sm sm:text-base backdrop-blur-sm
                                                        ${
                                                            isSelected
                                                                ? 'border-[hsl(var(--lead-text))]/40 bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 text-primary shadow-lg shadow-primary/10 scale-[1.02] ring-2 ring-[hsl(var(--lead-text))]/20 font-semibold relative'
                                                                : 'border-border/60 bg-background/80 hover:border-[hsl(var(--lead-text))]/30 hover:bg-gradient-to-br hover:from-accent/40 hover:to-accent/20 hover:text-accent-foreground hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
                                                        }
                                                    `}
                                                >
                                                    <span className="relative z-10 text-center leading-tight">
                                                        {option.name}
                                                    </span>
                                                    {isSelected && (
                                                        <>
                                                            {/* Gold accent border on selected */}
                                                            <div className="absolute inset-0 rounded-xl border border-[hsl(var(--lead-text))]/30 pointer-events-none" />
                                                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[hsl(var(--lead-text))] shadow-sm animate-pulse" />
                                                            <div className="absolute inset-0 rounded-xl bg-primary/5 pointer-events-none" />
                                                        </>
                                                    )}
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </RadioGroup>
                        </div>
                    ))}
                </div>
            )}

            {/* Stock Status & Add to Cart */}
            <div className="space-y-4 pt-2 border-t border-[hsl(var(--lead-text))]/20">
                {selectedVariant && (
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isInStock ? 'bg-green-500' : 'bg-destructive'}`} />
                        <span className={`text-sm font-medium ${isInStock ? 'text-green-600 dark:text-green-500' : 'text-destructive'}`}>
                            {isInStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                )}

                {/* Add to Cart Button */}
                <Button
                    size="lg"
                    className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={!canAddToCart || isPending}
                    onClick={handleAddToCart}
                >
                    {isAdded ? (
                        <>
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Added to Cart
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            {isPending
                                ? 'Adding...'
                                : !selectedVariant && product.optionGroups.length > 0
                                    ? 'Select Options'
                                    : !isInStock
                                        ? 'Out of Stock'
                                        : 'Add to Cart'}
                        </>
                    )}
                </Button>

                {/* SKU */}
                {selectedVariant && (
                    <div className="text-xs text-muted-foreground text-center pt-2">
                        SKU: <span className="font-mono font-medium">{selectedVariant.sku}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
