/// <reference types="node" />
import process from 'node:process';
import { Buffer } from 'node:buffer';

type WooProduct = {
  id: number;
  sku?: string;
  name?: string;
  slug?: string;
  meta_data?: Array<{ id?: number; key?: string; value?: unknown }>;
};

type WooCategory = {
  id: number;
  name: string;
  slug: string;
};

type PackageTier = {
  tier_id?: string;
  id?: string;
  tier_name?: string;
  name?: string;
  tier_price?: number | string;
  price?: number | string;
};

type WPPackage = {
  id: number;
  slug?: string;
  title?: { rendered?: string };
  meta?: {
    package_id?: string;
    pricing_tiers?: PackageTier[];
  };
  hm_package_data?: {
    package_id?: string;
    pricing_tiers?: PackageTier[];
  };
};

const WOO_BASE_URL = (process.env.WOO_BASE_URL || 'https://cms.thehoneymoonertravel.com/wp-json').replace(/\/+$/, '');
const WOO_CONSUMER_KEY = process.env.WOO_CONSUMER_KEY;
const WOO_CONSUMER_SECRET = process.env.WOO_CONSUMER_SECRET;
const DRY_RUN = process.env.DRY_RUN !== 'false';

if (!WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) {
  console.error('Missing WooCommerce credentials. Set WOO_CONSUMER_KEY and WOO_CONSUMER_SECRET.');
  process.exit(1);
}

const authHeader = `Basic ${Buffer.from(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`).toString('base64')}`;

async function requestJson<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${WOO_BASE_URL}${path}`, {
        method,
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Request failed (${response.status}) ${path}: ${text}`);
      }

      return await response.json() as T;
    } catch (error) {
      lastError = error;
      if (attempt === 3) break;
      await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    }
  }

  throw lastError instanceof Error ? lastError : new Error(`Request failed for ${path}`);
}

async function requestPublicJson<T>(path: string): Promise<T> {
  const response = await fetch(`${WOO_BASE_URL}${path}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Public request failed (${response.status}) ${path}: ${text}`);
  }
  return await response.json() as T;
}

function slugify(value: string): string {
  return value
    .replace(/&amp;/gi, '&')
    .replace(/&#038;/gi, '&')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getMetaValue(product: WooProduct, key: string): string {
  const found = product.meta_data?.find((item) => item?.key === key)?.value;
  return typeof found === 'string' ? found.trim() : '';
}

function getPackageTiers(pkg: WPPackage): PackageTier[] {
  const tiers = pkg.meta?.pricing_tiers || pkg.hm_package_data?.pricing_tiers;
  return Array.isArray(tiers) ? tiers : [];
}

function getLegacyPackageId(pkg: WPPackage): string {
  return (pkg.meta?.package_id || pkg.hm_package_data?.package_id || '').trim();
}

function getPackageTitle(pkg: WPPackage): string {
  return (pkg.title?.rendered || '').trim();
}

function getPackageDestinationSlug(pkg: WPPackage): string {
  const rawSlug = (pkg.slug || '').trim();
  return rawSlug.endsWith('-honeymoon') ? rawSlug.slice(0, -'-honeymoon'.length) : rawSlug;
}

function resolveTierName(tier: PackageTier): string {
  return String(tier.tier_name || tier.name || '').trim();
}

function resolveTierId(tier: PackageTier): string {
  return String(tier.tier_id || tier.id || '').trim();
}

function resolveTierPrice(tier: PackageTier): number {
  const value = tier.tier_price ?? tier.price ?? 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

async function ensureCategory(name: string, slug: string): Promise<number | null> {
  const existing = await requestJson<WooCategory[]>(`/wc/v3/products/categories?slug=${encodeURIComponent(slug)}&per_page=1`);
  if (existing[0]?.id) return existing[0].id;

  if (DRY_RUN) {
    console.log(`[DRY_RUN] CREATE category ${name} (${slug})`);
    return null;
  }

  const created = await requestJson<WooCategory>('/wc/v3/products/categories', 'POST', { name, slug });
  return created.id;
}

async function listGiftProducts(giftCardsCategoryId: number | null): Promise<WooProduct[]> {
  const all: WooProduct[] = [];

  for (let page = 1; page < 20; page += 1) {
    const path = giftCardsCategoryId
      ? `/wc/v3/products?category=${giftCardsCategoryId}&per_page=100&page=${page}`
      : `/wc/v3/products?per_page=100&page=${page}`;
    const products = await requestJson<WooProduct[]>(path);
    if (!Array.isArray(products) || products.length === 0) break;
    all.push(...products);
    if (products.length < 100) break;
  }

  return all.filter((product) => /gift\s*card/i.test(product.name || '') || getMetaValue(product, '_hm_tier_name') !== '');
}

type PackageLookup = {
  packageId: string;
  packageSlug: string;
  destinationName: string;
  tiersByName: Map<string, { id: string; price: number }>;
};

async function fetchLivePackages(): Promise<PackageLookup[]> {
  const packages = await requestPublicJson<WPPackage[]>('/wp/v2/packages?per_page=100');

  return packages.map((pkg) => {
    const title = getPackageTitle(pkg);
    const destinationName = title.replace(/\s+Honeymoon Experience$/i, '').trim();
    const tiers = getPackageTiers(pkg);

    return {
      packageId: String(pkg.id),
      packageSlug: getPackageDestinationSlug(pkg),
      destinationName,
      tiersByName: new Map(
        tiers
          .map((tier) => ({
            key: slugify(resolveTierName(tier)),
            value: {
              id: resolveTierId(tier),
              price: resolveTierPrice(tier)
            }
          }))
          .filter((entry) => entry.key && entry.value.id)
          .map((entry) => [entry.key, entry.value])
      )
    };
  });
}

function resolveGiftProductMatch(product: WooProduct, packages: PackageLookup[]): { packageId: string; tierId: string } | null {
  const destinationName = getMetaValue(product, '_hm_destination_name');
  const tierName = getMetaValue(product, '_hm_tier_name');
  const normalizedDestination = slugify(destinationName);
  const normalizedTier = slugify(tierName);

  if (!normalizedDestination || !normalizedTier) return null;

  const matchedPackage = packages.find((pkg) => slugify(pkg.destinationName) === normalizedDestination || pkg.packageSlug === normalizedDestination);
  if (!matchedPackage) return null;

  const matchedTier = matchedPackage.tiersByName.get(normalizedTier);
  if (!matchedTier) return null;

  return {
    packageId: matchedPackage.packageId,
    tierId: matchedTier.id
  };
}

function buildMetaData(product: WooProduct, packageId: string, tierId: string) {
  const existing = product.meta_data || [];
  const filtered = existing.filter((item) => item?.key !== '_hm_package_id' && item?.key !== '_hm_tier_id');

  filtered.push({ key: '_hm_package_id', value: packageId });
  filtered.push({ key: '_hm_tier_id', value: tierId });

  return filtered.map((item) => ({
    id: item.id,
    key: item.key,
    value: item.value
  }));
}

async function run(): Promise<void> {
  console.log(`WooCommerce base URL: ${WOO_BASE_URL}`);
  console.log(`Dry run: ${DRY_RUN}`);

  const giftCardsCategoryId = await ensureCategory('Gift Cards', 'gift-cards');
  const packages = await fetchLivePackages();
  const giftProducts = await listGiftProducts(giftCardsCategoryId);

  let updated = 0;
  let unchanged = 0;
  let missing = 0;

  for (const product of giftProducts) {
    const match = resolveGiftProductMatch(product, packages);
    if (!match) {
      console.warn(`No package/tier match found for product #${product.id} (${product.name || 'Untitled'})`);
      missing += 1;
      continue;
    }

    const currentPackageId = getMetaValue(product, '_hm_package_id');
    const currentTierId = getMetaValue(product, '_hm_tier_id');

    if (currentPackageId === match.packageId && currentTierId === match.tierId) {
      unchanged += 1;
      continue;
    }

    if (DRY_RUN) {
      console.log(
        `[DRY_RUN] UPDATE product #${product.id} ${product.name || ''} :: _hm_package_id ${currentPackageId || '(empty)'} -> ${match.packageId}, _hm_tier_id ${currentTierId || '(empty)'} -> ${match.tierId}`
      );
    } else {
      await requestJson<WooProduct>(`/wc/v3/products/${product.id}`, 'PUT', {
        meta_data: buildMetaData(product, match.packageId, match.tierId)
      });
      console.log(`Updated product #${product.id} (${product.name || 'Untitled'})`);
    }

    updated += 1;
  }

  console.log(`Done. Updated: ${updated}, Unchanged: ${unchanged}, Missing matches: ${missing}`);
}

run().catch((error) => {
  console.error('Gift product sync failed:', error);
  process.exit(1);
});
