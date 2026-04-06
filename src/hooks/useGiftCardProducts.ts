import { useEffect, useState } from 'react';
import { getGiftCardPackages, type GiftCardPackage } from '../services/giftCardService';

export function useGiftCardProducts() {
  const [giftPackages, setGiftPackages] = useState<GiftCardPackage[]>([]);
  const [isLoadingGiftPackages, setIsLoadingGiftPackages] = useState(true);
  const [giftPackagesError, setGiftPackagesError] = useState('');

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setIsLoadingGiftPackages(true);
      setGiftPackagesError('');

      try {
        const packages = await getGiftCardPackages();
        if (ignore) return;
        setGiftPackages(packages);
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
