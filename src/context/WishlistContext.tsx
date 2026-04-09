import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dataService } from '../services/dataService';
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

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useUser();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshWishlist = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      if (isAuthenticated) {
        const items = await dataService.getWishlist();
        setWishlist(items);
      } else {
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

  const addToWishlist = useCallback(async (id: string) => {
    const next = wishlist.includes(id) ? wishlist : [...wishlist, id];
    console.log('[WishlistContext] addToWishlist, next:', next);
    setWishlist(next);
    if (isAuthenticated) {
      const ok = await dataService.updateWishlist(next);
      if (!ok) setError('Could not update your wishlist. Please try again.');
    }
  }, [wishlist, isAuthenticated]);

  const removeFromWishlist = useCallback(async (id: string) => {
    const next = wishlist.filter(item => item !== id);
    console.log('[WishlistContext] removeFromWishlist, next:', next);
    setWishlist(next);
    if (isAuthenticated) {
      const ok = await dataService.updateWishlist(next);
      if (!ok) setError('Could not update your wishlist. Please try again.');
    }
  }, [wishlist, isAuthenticated]);

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
