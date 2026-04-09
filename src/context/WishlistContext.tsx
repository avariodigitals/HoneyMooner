import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { useUser } from '../hooks/useUser';

interface WishlistContextType {
  wishlist: string[];
  isLoading: boolean;
  error: string;
  refreshWishlist: () => Promise<void>;
  addToWishlist: (id: string) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

type WishlistCachePayload = {
  items: string[];
  updatedAt: number;
};

const WISHLIST_CACHE_PREFIX = 'honeymoonner:wishlist:v1:';

function normalizeWishlistItems(items: unknown): string[] {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (typeof item === 'string' || typeof item === 'number') {
        const normalized = String(item).trim();
        return normalized || null;
      }

      return null;
    })
    .filter((item): item is string => Boolean(item));
}

function getWishlistCacheKey(): string | null {
  if (typeof window === 'undefined') return null;
  const token = authService.getToken();
  if (!token) return null;

  let hash = 0;
  for (let index = 0; index < token.length; index += 1) {
    hash = (hash * 31 + token.charCodeAt(index)) >>> 0;
  }

  return `${WISHLIST_CACHE_PREFIX}${hash.toString(16)}`;
}

function readWishlistCache(): WishlistCachePayload | null {
  if (typeof window === 'undefined') return null;
  const key = getWishlistCacheKey();
  if (!key) return null;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<WishlistCachePayload>;
    if (!Array.isArray(parsed.items)) return null;

    return {
      items: normalizeWishlistItems(parsed.items),
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now()
    };
  } catch {
    return null;
  }
}

function writeWishlistCache(items: string[]): void {
  if (typeof window === 'undefined') return;
  const key = getWishlistCacheKey();
  if (!key) return;

  try {
    const payload: WishlistCachePayload = { items: normalizeWishlistItems(items), updatedAt: Date.now() };
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Ignore localStorage write failures.
  }
}

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useUser();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const wishlistRef = useRef<string[]>([]);
  const mutationQueueRef = useRef(Promise.resolve());

  useEffect(() => {
    wishlistRef.current = wishlist;
  }, [wishlist]);

  const refreshWishlist = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      if (isAuthenticated) {
        const cached = readWishlistCache();
        if (cached) {
          wishlistRef.current = cached.items;
          setWishlist(cached.items);
        }

        const items = await dataService.getWishlist();
        const effectiveItems = cached ? cached.items : items;

        wishlistRef.current = effectiveItems;
        setWishlist(effectiveItems);
        writeWishlistCache(effectiveItems);

        if (cached && cached.items.length !== items.length) {
          void dataService.updateWishlist(cached.items);
        } else if (
          cached &&
          cached.items.some((item, index) => item !== items[index])
        ) {
          void dataService.updateWishlist(cached.items);
        }
      } else {
        wishlistRef.current = [];
        setWishlist([]);
      }
    } catch {
      setError('Unable to load your wishlist right now. Please try again shortly.');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const persistWishlist = useCallback(async (updater: (current: string[]) => string[]) => {
    const previousMutation = mutationQueueRef.current;

    const nextMutation = previousMutation
      .catch(() => undefined)
      .then(async () => {
        const current = wishlistRef.current;
        const next = updater(current);
        const hasChanged =
          next.length !== current.length || next.some((item, index) => item !== current[index]);

        if (!hasChanged) return;

        setError('');
        wishlistRef.current = next;
        setWishlist(next);
        writeWishlistCache(next);

        if (!isAuthenticated) return;

        const ok = await dataService.updateWishlist(next);
        if (!ok) {
          setError('Could not update your wishlist. Please try again.');
        }
      });

    mutationQueueRef.current = nextMutation;
    await nextMutation;
  }, [isAuthenticated]);

  const addToWishlist = useCallback(async (id: string) => {
    await persistWishlist((current) => (current.includes(id) ? current : [...current, id]));
  }, [persistWishlist]);

  const removeFromWishlist = useCallback(async (id: string) => {
    await persistWishlist((current) => current.filter((item) => item !== id));
  }, [persistWishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, isLoading, error, refreshWishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
