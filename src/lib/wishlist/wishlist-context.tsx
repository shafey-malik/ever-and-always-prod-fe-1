'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * Client-side wishlist — persisted to localStorage, no backend required.
 *
 * Stores a small serializable snapshot per saved piece so the wishlist page
 * can render without re-fetching. Hydration-safe: starts empty on the server,
 * fills from storage after mount, and only persists once hydrated so we never
 * clobber stored data with the initial empty state.
 */

export interface WishlistItem {
  id: string;
  name: string;
  href: string;
  image: string | null;
  price?: string;
}

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  hydrated: boolean;
  isSaved: (id: string) => boolean;
  toggle: (item: WishlistItem) => boolean; // returns the new saved state
  remove: (id: string) => void;
  clear: () => void;
}

const STORAGE_KEY = 'ea_wishlist_v1';

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // Corrupt/unavailable storage — start clean
    }
    setHydrated(true);
  }, []);

  // Persist after hydration; sync other tabs via the storage event
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore quota/availability errors
    }
  }, [items, hydrated]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : [];
        if (Array.isArray(parsed)) setItems(parsed);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const isSaved = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const toggle = useCallback((item: WishlistItem) => {
    let nowSaved = false;
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev.filter((i) => i.id !== item.id);
      }
      nowSaved = true;
      return [item, ...prev];
    });
    return nowSaved;
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      hydrated,
      isSaved,
      toggle,
      remove,
      clear,
    }),
    [items, hydrated, isSaved, toggle, remove, clear]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return ctx;
}
