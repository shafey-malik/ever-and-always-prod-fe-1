'use client';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useWishlist, type WishlistItem } from '@/lib/wishlist/wishlist-context';

interface WishlistButtonProps {
  item: WishlistItem;
  /** "overlay" = frosted circle for image corners; "bare" = just the icon */
  variant?: 'overlay' | 'bare';
  className?: string;
}

/**
 * The heart. Toggles a piece in/out of the wishlist and shows a toast.
 * Calls preventDefault/stopPropagation so it works safely inside a card <Link>.
 */
export function WishlistButton({
  item,
  variant = 'overlay',
  className = '',
}: WishlistButtonProps) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(item.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggle(item);
    if (nowSaved) {
      toast.success('Saved to your wishlist', {
        description: item.name,
        action: {
          label: 'View',
          onClick: () => {
            window.location.href = '/wishlist';
          },
        },
      });
    } else {
      toast('Removed from wishlist', { description: item.name });
    }
  };

  const base =
    variant === 'overlay'
      ? 'w-9 h-9 rounded-full bg-white/85 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-sm'
      : 'inline-flex items-center justify-center';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${item.name} from wishlist` : `Save ${item.name} to wishlist`}
      className={`group/heart cursor-pointer transition-all duration-300 active:scale-90 ${base} ${
        saved
          ? 'text-[hsl(var(--secondary-rich))]'
          : 'text-[hsl(var(--foreground)/0.55)] hover:text-[hsl(var(--secondary-rich))]'
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-all duration-300 ${
          saved ? 'fill-[hsl(var(--secondary))] scale-110' : 'fill-transparent group-hover/heart:scale-110'
        }`}
        strokeWidth={1.6}
      />
    </button>
  );
}
