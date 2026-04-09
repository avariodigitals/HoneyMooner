import { useEffect, useState } from 'react';
import { getGiftCardPackages, type GiftCardPackage } from '../services/giftCardService';

const GIFT_PACKAGES_CACHE_KEY = 'honeymoonner:gift-packages:v2';

function loadGiftPackagesCache(): GiftCardPackage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(GIFT_PACKAGES_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed as GiftCardPackage[] : [];
  } catch {
    return [];
  }
}

function persistGiftPackagesCache(packages: GiftCardPackage[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(GIFT_PACKAGES_CACHE_KEY, JSON.stringify(packages));
  } catch {
    // Ignore storage errors.
  }
}

export function useGiftCardProducts() {
  const [giftPackages, setGiftPackages] = useState<GiftCardPackage[]>(() => loadGiftPackagesCache());
  const [isLoadingGiftPackages, setIsLoadingGiftPackages] = useState(giftPackages.length === 0);
  const [giftPackagesError, setGiftPackagesError] = useState('');

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      if (giftPackages.length === 0) {
        setIsLoadingGiftPackages(true);
      }
      setGiftPackagesError('');

      try {
        const packages = await getGiftCardPackages();
        if (ignore) return;
        setGiftPackages(packages);
        persistGiftPackagesCache(packages);
      } catch (error) {
        if (ignore) return;
        const message = error instanceof Error
          ? error.message
          : 'Unable to load gift card products from WordPress.';
        setGiftPackagesError(message);
        setGiftPackages([]);
      } finally {
        if (!ignore) {
          setIsLoadingGiftPackages(false);
        }
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, []);

  return {
    giftPackages,
    isLoadingGiftPackages,
    giftPackagesError
  };
}
