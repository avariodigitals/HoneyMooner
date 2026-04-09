import { dataService } from './dataService';
import type { TravelPackage } from '../types';

const WP_BASE_URL = import.meta.env.VITE_WP_BASE_URL ?? 'https://cms.thehoneymoonertravel.com/wp-json';
const GIFT_PRODUCTS_ENDPOINT = import.meta.env.VITE_WP_GIFT_PRODUCTS_ENDPOINT;
const ENABLE_WC_STORE_FALLBACK = (import.meta.env.VITE_WP_ENABLE_WC_STORE_FALLBACK ?? 'false') === 'true';
const REQUIRE_CUSTOM_GIFT_PRODUCTS = (import.meta.env.VITE_WP_REQUIRE_CUSTOM_GIFT_PRODUCTS ?? 'true') === 'true';

export interface GiftCardTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  productId: number;
  productSlug: string;
  paymentPackageId?: string;
  paymentTierId?: string;
}

export interface GiftCardPackage {
  id: string;
  title: string;
  featuredImage: string;
  summary: string;
  tiers: GiftCardTier[];
}

let giftPackagesCache: GiftCardPackage[] | null = null;
let giftPackagesInflight: Promise<GiftCardPackage[]> | null = null;

interface StoreApiProduct {
  id: number;
  name: string;
  slug: string;
  description?: string;
  short_description?: string;
  images?: Array<{ src?: string }>;
  categories?: Array<{ slug?: string }>;
  tags?: Array<{ slug?: string }>;
  prices?: {
    currency_code?: string;
    currency_minor_unit?: number;
    price?: string;
    regular_price?: string;
  };
}

interface CustomGiftProduct {
  product_id: number;
  product_slug: string;
  product_name?: string;
  destination_name: string;
  tier_name: string;
  amount: number;
  currency?: string;
  image?: string;
  summary?: string;
  payment_package_id?: string;
  payment_tier_id?: string;
}

function buildPackagesFromWpPackages(packages: TravelPackage[]): GiftCardPackage[] {
  const honeymoonPackages = packages.filter((pkg) => pkg.category === 'honeymoon' && pkg.tiers.length > 0);

  return honeymoonPackages.map((pkg, packageIndex) => {
    const tiers: GiftCardTier[] = [...pkg.tiers]
      .sort((a, b) => tierOrder(a.name) - tierOrder(b.name))
      .map((tier, tierIndex) => ({
        id: tier.id,
        name: tier.name,
        price: tier.price,
        currency: 'USD',
        // Deterministic numeric id for UI state; payment mapping uses the explicit IDs below.
        productId: (packageIndex + 1) * 100 + (tierIndex + 1),
        productSlug: `${pkg.slug}-${slugify(tier.name)}`
      }));

    return {
      id: pkg.id,
      title: pkg.title,
      featuredImage: pkg.featuredImage,
      summary: pkg.summary,
      tiers
    };
  });
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseDestinationAndTier(name: string): { destination: string; tierName: string } {
  const parts = name.split(' - ');
  const tierName = parts[1]?.trim() || 'Premium';
  const destination = (parts[0] || name).replace(/\s*honeymoon\s+gift\s+card\s*$/i, '').trim();
  return {
    destination: destination || name,
    tierName
  };
}

function normalizeTierName(value: string): string {
  const normalized = value.trim().toLowerCase();
  if (normalized.includes('ultra')) return 'Ultra Luxuria';
  if (normalized.includes('luxuria')) return 'Luxuria';
  return 'Premium';
}

function tierOrder(name: string): number {
  if (name === 'Premium') return 1;
  if (name === 'Luxuria') return 2;
  return 3;
}

function parseStorePrice(product: StoreApiProduct): { amount: number; currency: string } {
  const currency = product.prices?.currency_code || 'USD';
  const minorUnits = Number(product.prices?.currency_minor_unit ?? 2);
  const minorPrice = Number(product.prices?.price ?? 0);

  if (Number.isFinite(minorPrice) && minorPrice > 0) {
    return {
      amount: minorPrice / Math.pow(10, minorUnits),
      currency
    };
  }

  const regularPrice = Number(product.prices?.regular_price ?? 0);
  return {
    amount: Number.isFinite(regularPrice) ? regularPrice : 0,
    currency
  };
}

function buildPackagesFromCustomProducts(products: CustomGiftProduct[]): GiftCardPackage[] {
  const grouped = new Map<string, GiftCardPackage>();

  products.forEach((product) => {
    const parsed = parseDestinationAndTier(product.product_name || '');
    const destinationName = product.destination_name?.trim() || parsed.destination || 'Honeymoon Gift';
    const packageId = slugify(destinationName);
    const existing = grouped.get(packageId);

    const tier: GiftCardTier = {
      id: `${product.product_id}-${slugify(product.tier_name || 'premium')}`,
      name: normalizeTierName(product.tier_name || 'Premium'),
      price: Number(product.amount || 0),
      currency: product.currency || 'USD',
      productId: Number(product.product_id),
      productSlug: product.product_slug || `${packageId}-gift-card`,
      paymentPackageId: product.payment_package_id,
      paymentTierId: product.payment_tier_id
    };

    if (existing) {
      existing.tiers.push(tier);
      return;
    }

    grouped.set(packageId, {
      id: packageId,
      title: `${destinationName} Honeymoon Gift Card`,
      featuredImage: product.image || '',
      summary: product.summary || `Gift a honeymoon experience in ${destinationName}.`,
      tiers: [tier]
    });
  });

  return Array.from(grouped.values())
    .map((pkg) => ({
      ...pkg,
      tiers: pkg.tiers.sort((a, b) => tierOrder(a.name) - tierOrder(b.name))
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

function hasValidPaymentMapping(packages: GiftCardPackage[]): boolean {
  return packages.every((pkg) =>
    pkg.tiers.every((tier) =>
      typeof tier.paymentPackageId === 'string' &&
      tier.paymentPackageId.trim().length > 0 &&
      typeof tier.paymentTierId === 'string' &&
      tier.paymentTierId.trim().length > 0
    )
  );
}

function buildPackagesFromStoreProducts(products: StoreApiProduct[]): GiftCardPackage[] {
  const eligible = products.filter((product) => {
    const categories = product.categories || [];
    const tags = product.tags || [];

    const hasGiftCategory = categories.some((category) => category.slug === 'gift-cards');
    const hasGiftTag = tags.some((tag) => tag.slug === 'gift-card');
    const looksLikeGiftCard = /gift\s*card/i.test(product.name || '');

    return hasGiftCategory || hasGiftTag || looksLikeGiftCard;
  });

  const grouped = new Map<string, GiftCardPackage>();

  eligible.forEach((product) => {
    const { destination, tierName } = parseDestinationAndTier(product.name || 'Honeymoon Gift Card');
    const packageId = slugify(destination);
    const existing = grouped.get(packageId);
    const { amount, currency } = parseStorePrice(product);

    const tier: GiftCardTier = {
      id: `${product.id}-${slugify(tierName)}`,
      name: normalizeTierName(tierName),
      price: amount,
      currency,
      productId: product.id,
      productSlug: product.slug || `${packageId}-${slugify(tierName)}`
    };

    if (existing) {
      existing.tiers.push(tier);
      if (!existing.featuredImage && product.images?.[0]?.src) {
        existing.featuredImage = product.images[0].src;
      }
      return;
    }

    grouped.set(packageId, {
      id: packageId,
      title: `${destination} Honeymoon Gift Card`,
      featuredImage: product.images?.[0]?.src || '',
      summary: product.short_description || product.description || `Gift a honeymoon experience in ${destination}.`,
      tiers: [tier]
    });
  });

  return Array.from(grouped.values())
    .map((pkg) => ({
      ...pkg,
      tiers: pkg.tiers.sort((a, b) => tierOrder(a.name) - tierOrder(b.name))
    }))
    .sort((a, b) => a.title.localeCompare(b.title));
}

function hasVisiblePrices(packages: GiftCardPackage[]): boolean {
  return packages.some((pkg) => pkg.tiers.some((tier) => Number(tier.price) > 0));
}

async function fetchStoreProducts(): Promise<StoreApiProduct[]> {
  const pageSize = 100;
  const allProducts: StoreApiProduct[] = [];

  for (let page = 1; page < 20; page += 1) {
    const response = await fetch(`${WP_BASE_URL}/wc/store/v1/products?per_page=${pageSize}&page=${page}`);
    if (!response.ok) {
      throw new Error('Unable to load WooCommerce store products from WordPress.');
    }

    const data = await response.json() as StoreApiProduct[];
    if (!Array.isArray(data) || data.length === 0) break;

    allProducts.push(...data);
    if (data.length < pageSize) break;
  }

  return allProducts;
}

export async function getGiftCardPackages(forceRefresh = false): Promise<GiftCardPackage[]> {
  if (!forceRefresh && giftPackagesCache) {
    return giftPackagesCache;
  }

  if (!forceRefresh && giftPackagesInflight) {
    return giftPackagesInflight;
  }

  giftPackagesInflight = (async () => {
    if (GIFT_PRODUCTS_ENDPOINT) {
      const customResponse = await fetch(`${WP_BASE_URL}${GIFT_PRODUCTS_ENDPOINT}`);
      if (!customResponse.ok) {
        throw new Error('Unable to load published gift card products from WordPress.');
      }

      const customData = await customResponse.json() as CustomGiftProduct[];
      if (!Array.isArray(customData) || customData.length === 0) {
        throw new Error('No published gift card products were returned from WordPress.');
      }

      const packages = buildPackagesFromCustomProducts(customData);
      if (packages.length === 0) {
        throw new Error('Gift card products were returned, but could not be grouped into packages.');
      }

      if (REQUIRE_CUSTOM_GIFT_PRODUCTS && !hasValidPaymentMapping(packages)) {
        throw new Error('Some gift card products are missing payment mappings in WordPress.');
      }

      giftPackagesCache = packages;
      return packages;
    }

    if (REQUIRE_CUSTOM_GIFT_PRODUCTS) {
      throw new Error('Gift card products endpoint is not configured.');
    }

    const wpPackages = await dataService.getPackages();
    if (wpPackages.length > 0) {
      const packages = buildPackagesFromWpPackages(wpPackages);
      if (hasVisiblePrices(packages)) {
        giftPackagesCache = packages;
        return packages;
      }
    }

    if (ENABLE_WC_STORE_FALLBACK || wpPackages.length > 0) {
      try {
        const storeProducts = await fetchStoreProducts();
        const packages = buildPackagesFromStoreProducts(storeProducts);
        giftPackagesCache = packages;
        return packages;
      } catch {
        // Ignore Woo Store fallback failures.
      }
    }

    giftPackagesCache = [];
    return [];
  })();

  try {
    return await giftPackagesInflight;
  } finally {
    giftPackagesInflight = null;
  }
}
