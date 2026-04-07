/// <reference types="node" />
import { initialDestinations, initialPackages } from '../src/data/mock';
import process from 'node:process';
import { Buffer } from 'node:buffer';

type WooProduct = {
  id: number;
  sku?: string;
  name?: string;
  meta_data?: Array<{ key?: string; value?: unknown }>;
};

type WooCategory = {
  id: number;
  name: string;
  slug: string;
};

const WOO_BASE_URL = (process.env.WOO_BASE_URL || 'https://cms.thehoneymoonertravel.com/wp-json').replace(/\/+$/, '');
const WOO_CONSUMER_KEY = process.env.WOO_CONSUMER_KEY;
const WOO_CONSUMER_SECRET = process.env.WOO_CONSUMER_SECRET;
const DRY_RUN = process.env.DRY_RUN === 'true';

if (!WOO_CONSUMER_KEY || !WOO_CONSUMER_SECRET) {
  console.error('Missing WooCommerce credentials. Set WOO_CONSUMER_KEY and WOO_CONSUMER_SECRET.');
  process.exit(1);
}

const authHeader = `Basic ${Buffer.from(`${WOO_CONSUMER_KEY}:${WOO_CONSUMER_SECRET}`).toString('base64')}`;

async function wooRequest<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
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
    throw new Error(`WooCommerce request failed (${response.status}) ${path}: ${text}`);
  }

  return await response.json() as T;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function findProductBySku(sku: string): Promise<WooProduct | null> {
  const products = await wooRequest<WooProduct[]>(`/wc/v3/products?sku=${encodeURIComponent(sku)}&per_page=1`);
  return products[0] || null;
}

async function listProductsByCategory(categoryId: number): Promise<WooProduct[]> {
  const all: WooProduct[] = [];
  for (let page = 1; page < 20; page += 1) {
    const products = await wooRequest<WooProduct[]>(`/wc/v3/products?category=${categoryId}&per_page=100&page=${page}`);
    if (!Array.isArray(products) || products.length === 0) break;
    all.push(...products);
    if (products.length < 100) break;
  }
  return all;
}

function getMetaValue(product: WooProduct, key: string): string {
  const found = product.meta_data?.find((item) => item?.key === key)?.value;
  return typeof found === 'string' ? found.trim() : '';
}

function resolveDestinationNameFromMeta(product: WooProduct): string {
  const destinationName = getMetaValue(product, '_hm_destination_name');
  if (destinationName) return destinationName;

  const destinationId = getMetaValue(product, '_hm_destination_id');
  if (!destinationId) return '';

  const fallbackDestination = initialDestinations.find((item) => String(item.id) === destinationId);
  return fallbackDestination?.name || '';
}

async function repairGiftProductTitles(giftCardsCategoryId: number | null): Promise<number> {
  if (!giftCardsCategoryId) return 0;

  const products = await listProductsByCategory(giftCardsCategoryId);
  let repaired = 0;

  for (const product of products) {
    const currentName = (product.name || '').trim();
    if (currentName !== '') continue;

    const destinationName = resolveDestinationNameFromMeta(product) || 'Honeymoon';
    const tierName = getMetaValue(product, '_hm_tier_name') || 'Premium';
    const repairedTitle = `${destinationName} Honeymoon Gift Card - ${tierName}`;

    if (DRY_RUN) {
      console.log(`[DRY_RUN] REPAIR title for product #${product.id} => ${repairedTitle}`);
    } else {
      await wooRequest<WooProduct>(`/wc/v3/products/${product.id}`, 'PUT', { name: repairedTitle });
      console.log(`Repaired title for product #${product.id}`);
    }

    repaired += 1;
  }

  return repaired;
}

async function ensureCategory(name: string, slug: string): Promise<number | null> {
  const existing = await wooRequest<WooCategory[]>(`/wc/v3/products/categories?slug=${encodeURIComponent(slug)}&per_page=1`);
  if (existing[0]?.id) return existing[0].id;

  if (DRY_RUN) {
    console.log(`[DRY_RUN] CREATE category ${name} (${slug})`);
    return null;
  }

  const created = await wooRequest<WooCategory>('/wc/v3/products/categories', 'POST', { name, slug });
  return created.id;
}

async function run(): Promise<void> {
  console.log(`WooCommerce base URL: ${WOO_BASE_URL}`);
  console.log(`Dry run: ${DRY_RUN}`);

  const giftCardsCategoryId = await ensureCategory('Gift Cards', 'gift-cards');
  const honeymoonCategoryId = await ensureCategory('Honeymoon', 'honeymoon');

  const repairedCount = await repairGiftProductTitles(giftCardsCategoryId);
  if (repairedCount > 0) {
    console.log(`Repaired empty gift product titles: ${repairedCount}`);
  }

  const honeymoonPackages = initialPackages.filter((pkg) => pkg.category === 'honeymoon');

  let created = 0;
  let updated = 0;

  for (const pkg of honeymoonPackages) {
    const destination = initialDestinations.find((item) => item.id === pkg.destinationId);
    const destinationName = destination?.name || pkg.title;

    for (const tier of pkg.tiers) {
      const tierSlug = slugify(tier.name);
      const sku = `hm-gift-${pkg.destinationId}-${tierSlug}`;

      const productName = `${destinationName} Honeymoon Gift Card - ${tier.name}`;
      const payload: Record<string, unknown> = {
        name: productName,
        type: 'simple',
        status: 'publish',
        featured: false,
        virtual: true,
        downloadable: false,
        sku,
        regular_price: tier.price.toFixed(2),
        short_description: pkg.summary,
        description: pkg.description,
        categories: [
          ...(giftCardsCategoryId ? [{ id: giftCardsCategoryId }] : []),
          ...(honeymoonCategoryId ? [{ id: honeymoonCategoryId }] : [])
        ],
        tags: [
          { name: 'gift-card' },
          { name: 'honeymoon' },
          { name: tier.name }
        ],
        meta_data: [
          { key: '_hm_package_id', value: pkg.id },
          { key: '_hm_destination_id', value: pkg.destinationId },
          { key: '_hm_destination_name', value: destinationName },
          { key: '_hm_tier_id', value: tier.id },
          { key: '_hm_tier_name', value: tier.name },
          { key: '_hm_billing_basis', value: tier.basis }
        ]
      };

      const existing = await findProductBySku(sku);
      if (existing) {
        if (DRY_RUN) {
          console.log(`[DRY_RUN] UPDATE product ${sku} (#${existing.id})`);
        } else {
          await wooRequest<WooProduct>(`/wc/v3/products/${existing.id}`, 'PUT', payload);
          console.log(`Updated product ${sku} (#${existing.id})`);
        }
        updated += 1;
      } else {
        if (DRY_RUN) {
          console.log(`[DRY_RUN] CREATE product ${sku}`);
        } else {
          const createdProduct = await wooRequest<WooProduct>('/wc/v3/products', 'POST', payload);
          console.log(`Created product ${sku} (#${createdProduct.id})`);
        }
        created += 1;
      }
    }
  }

  console.log(`Done. Created: ${created}, Updated: ${updated}, Repaired titles: ${repairedCount}`);
}

run().catch((error) => {
  console.error('Woo sync failed:', error);
  process.exit(1);
});
