import { Truck, Hammer, Sparkles, Clock } from 'lucide-react';

interface DeliveryNoticeProps {
    facetValues?: Array<{ code: string }> | null;
    className?: string;
}

export function DeliveryNotice({ facetValues, className = '' }: DeliveryNoticeProps) {
    if (!facetValues || facetValues.length === 0) return null;

    const hasExpress = facetValues.some(f => 
        f.code === 'delivery:express' || 
        f.code === 'express' ||
        f.code === 'ready-to-ship'
    );
    const hasNonExpress = facetValues.some(f => 
        f.code === 'delivery:non-express' || 
        f.code === 'non-express' || 
        f.code === 'on-demand'
    );
    if (hasExpress) {
        return (
            <div className={`flex items-start gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 ${className}`}>
                <div className="mt-0.5 shrink-0 bg-green-500/20 p-1.5 rounded-full">
                    <Truck className="w-4 h-4" />
                </div>
                <div>
                    <h5 className="font-semibold text-sm">Ready to Ship</h5>
                    <p className="text-xs mt-0.5 font-medium opacity-90">This piece has no making time and will be dispatched quickly!</p>
                </div>
            </div>
        );
    }

    if (hasNonExpress) {
        return (
            <div className={`flex items-start gap-3 p-3 rounded-xl bg-linear-to-r from-[hsl(var(--secondary)/0.15)] to-[hsl(var(--secondary)/0.05)] border border-[hsl(var(--secondary)/0.2)] text-[hsl(var(--secondary-rich))] ${className}`}>
                <div className="mt-0.5 shrink-0 bg-[hsl(var(--background))] border border-[hsl(var(--secondary)/0.3)] p-1.5 rounded-full shadow-sm">
                    <Sparkles className="w-4 h-4" />
                </div>
                <div>
                    <h5 className="font-luxury-serif font-semibold text-sm text-[hsl(var(--foreground))]">Custom Made For You</h5>
                    <p className="text-xs mt-0.5 font-luxury-sans text-[hsl(var(--muted-foreground))]">
                        We will craft a fresh piece just for you. Please allow roughly 2 weeks for crafting before dispatch.
                    </p>
                </div>
            </div>
        );
    }

    return null;
}
