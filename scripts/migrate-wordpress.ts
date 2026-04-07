import { initialDestinations, initialPackages, initialPosts, initialTestimonials } from '../src/data/mock';

type WPEntity = {
  id: number;
  slug: string;
  title?: { rendered: string };
};

type WPCategory = {
  id: number;
  slug: string;
};

const WP_BASE_URL = process.env.WP_BASE_URL || 'https://cms.thehoneymoonner.com/wp-json';
const WP_USERNAME = process.env.WP_USERNAME;
const WP_PASSWORD = process.env.WP_PASSWORD;
const WP_TOKEN = process.env.WP_TOKEN;
const DRY_RUN = process.env.DRY_RUN === 'true';
const RESET_WORDPRESS = process.env.RESET_WORDPRESS === 'true';
const IMPORT_SCOPE = (process.env.IMPORT_SCOPE || 'all')
  .split(',')
  .map((item) => item.trim().toLowerCase())
  .filter(Boolean);

function shouldImport(section: 'destinations' | 'packages' | 'posts' | 'testimonials') {
  if (IMPORT_SCOPE.length === 0) return true;
  if (IMPORT_SCOPE.includes('all')) return true;
  return IMPORT_SCOPE.includes(section);
}

if (!WP_TOKEN && (!WP_USERNAME || !WP_PASSWORD)) {
  console.error('Missing credentials. Set WP_TOKEN or both WP_USERNAME and WP_PASSWORD.');
  process.exit(1);
}

async function login(): Promise<string> {
  if (WP_TOKEN) return WP_TOKEN;

  const body = new URLSearchParams();
  body.set('username', WP_USERNAME || '');
  body.set('password', WP_PASSWORD || '');

  const response = await fetch(`${WP_BASE_URL}/jwt-auth/v1/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Login failed: ${response.status} ${text}`);
  }

  const data = await response.json() as { token?: string; jwt_token?: string; data?: { token?: string } };
  const token = data.token || data.jwt_token || data.data?.token;
  if (!token) throw new Error('Token not found in auth response.');
  return token;
}

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
}

async function findBySlug(type: 'destinations' | 'packages' | 'posts', slug: string): Promise<WPEntity | null> {
  const response = await fetch(`${WP_BASE_URL}/wp/v2/${type}?slug=${encodeURIComponent(slug)}&per_page=1`);
  if (!response.ok) return null;
  const data = await response.json() as WPEntity[];
  return data[0] || null;
}

async function findCategoryBySlug(slug: string): Promise<WPCategory | null> {
  const response = await fetch(`${WP_BASE_URL}/wp/v2/categories?slug=${encodeURIComponent(slug)}&per_page=1`);
  if (!response.ok) return null;
  const data = await response.json() as WPCategory[];
  return data[0] || null;
}

async function ensureCategory(token: string, name: string, slug: string): Promise<number | null> {
  const existing = await findCategoryBySlug(slug);
  if (existing) return existing.id;

  if (DRY_RUN) {
    console.log(`[DRY_RUN] CREATE category: ${slug}`);
    return null;
  }

  const response = await fetch(`${WP_BASE_URL}/wp/v2/categories`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ name, slug })
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Failed to create category ${slug}: ${response.status} ${text}`);
    return null;
  }

  const data = await response.json() as WPCategory;
  console.log(`Created category: ${slug} (#${data.id})`);
  return data.id;
}

async function listAllEntities(token: string, type: 'destinations' | 'packages'): Promise<WPEntity[]> {
  const results: WPEntity[] = [];
  let page = 1;

  while (true) {
    const response = await fetch(`${WP_BASE_URL}/wp/v2/${type}?per_page=100&page=${page}` , {
      headers: authHeaders(token)
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to list ${type}: ${response.status} ${text}`);
    }

    const data = await response.json() as WPEntity[];
    results.push(...data);

    const totalPages = Number(response.headers.get('X-WP-TotalPages') || '1');
    if (page >= totalPages || data.length === 0) break;
    page += 1;
  }

  return results;
}

async function deleteEntity(token: string, type: 'destinations' | 'packages', id: number): Promise<boolean> {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] DELETE ${type} #${id}`);
    return true;
  }

  const response = await fetch(`${WP_BASE_URL}/wp/v2/${type}/${id}?force=true`, {
    method: 'DELETE',
    headers: authHeaders(token)
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Failed to delete ${type} #${id}: ${response.status} ${text}`);
    return false;
  }

  return true;
}

async function resetEntities(token: string, type: 'destinations' | 'packages'): Promise<void> {
  const entities = await listAllEntities(token, type);

  if (entities.length === 0) {
    console.log(`No existing ${type} to delete.`);
    return;
  }

  console.log(`Deleting ${entities.length} existing ${type}...`);
  for (const entity of entities) {
    await deleteEntity(token, type, entity.id);
  }
}

async function upsert(
  token: string,
  type: 'destinations' | 'packages' | 'posts',
  slug: string,
  payload: Record<string, unknown>
): Promise<number | null> {
  const existing = await findBySlug(type, slug);
  const method = existing ? 'PUT' : 'POST';
  const url = existing
    ? `${WP_BASE_URL}/wp/v2/${type}/${existing.id}`
    : `${WP_BASE_URL}/wp/v2/${type}`;

  const finalPayload: Record<string, unknown> = {
    ...payload,
    slug,
    status: 'publish'
  };

  if (DRY_RUN) {
    console.log(`[DRY_RUN] ${existing ? 'UPDATE' : 'CREATE'} ${type}: ${slug}`);
    return existing?.id || null;
  }

  if (type === 'packages' && payload.title) {
    console.log(`Setting ${slug} title to: "${payload.title}"`);
  }

  const response = await fetch(url, {
    method,
    headers: authHeaders(token),
    body: JSON.stringify(finalPayload)
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Failed ${existing ? 'update' : 'create'} for ${type}/${slug}: ${response.status} ${text}`);
    return null;
  }

  const data = await response.json() as WPEntity;
  console.log(`${existing ? 'Updated' : 'Created'} ${type}: ${slug} (#${data.id})`);
  return data.id;
}

function normalizePricingTiersForFreeAcf(
  tiers: Array<{ id: string; name: string; price: number; basis: string }>
) {
  return tiers
    .filter((tier) => Number(tier.price) > 0)
    .map((tier) => ({
      tier_id: tier.id,
      tier_name: tier.name,
      tier_price: Number(tier.price),
      tier_basis: tier.basis,
      tier_label: '',
      tier_description: ''
    }));
}

async function run() {
  console.log(`Using WordPress API: ${WP_BASE_URL}`);
  console.log(`Import scope: ${IMPORT_SCOPE.join(', ') || 'all'}`);
  console.log(`Reset mode: ${RESET_WORDPRESS ? 'enabled' : 'disabled'}`);
  const token = await login();
  const destinationStartingPriceById = new Map<string, number>();
  for (const pkg of initialPackages) {
    const packageMinTier = Math.min(...pkg.tiers.map((tier) => Number(tier.price || 0)).filter((price) => price > 0));
    if (!Number.isFinite(packageMinTier) || packageMinTier <= 0) continue;
    const existing = destinationStartingPriceById.get(pkg.destinationId);
    if (!existing || packageMinTier < existing) {
      destinationStartingPriceById.set(pkg.destinationId, packageMinTier);
    }
  }

  const destinationIdMap = new Map<string, number>();
  const categoryIdCache = new Map<string, number>();

  async function getMediaId(): Promise<number | null> {
    // Skip media uploads - images are already attached in WordPress
    return null;
  }

  async function getCategoryId(name: string, slug: string): Promise<number | null> {
    const cached = categoryIdCache.get(slug);
    if (cached) return cached;
    const categoryId = await ensureCategory(token, name, slug);
    if (categoryId) categoryIdCache.set(slug, categoryId);
    return categoryId;
  }

  if (RESET_WORDPRESS) {
    if (shouldImport('packages')) {
      await resetEntities(token, 'packages');
    }

    if (shouldImport('destinations')) {
      await resetEntities(token, 'destinations');
    }
  }

  if (shouldImport('destinations')) {
    console.log('\nImporting destinations...');
    for (const dest of initialDestinations) {
      const destinationImageId = await getMediaId();
      const computedDestinationStart = Number(dest.startingPrice || 0) > 0
        ? Number(dest.startingPrice)
        : Number(destinationStartingPriceById.get(dest.id) || 0);
      const id = await upsert(token, 'destinations', dest.slug, {
        title: dest.name,
        content: dest.description,
        excerpt: dest.description,
        meta: {
          country: dest.country,
          continent: dest.continent,
          image: dest.image,
          starting_price: computedDestinationStart,
          intro_content: dest.description,
          best_time_to_visit: dest.bestTimeToVisit ?? '',
          highlights: (dest.popularFor ?? []).map((value) => ({ title: value, description: '' })),
          seo_title: `${dest.name} Honeymoon Destination`,
          meta_description: dest.description ?? ''
        },
        acf: {
          country: dest.country,
          continent: dest.continent,
          image: destinationImageId,
          starting_price: computedDestinationStart,
          best_time_to_visit: dest.bestTimeToVisit ?? '',
          popular_for: JSON.stringify(dest.popularFor ?? [])
        }
      });
      if (id) destinationIdMap.set(dest.id, id);
    }
  } else {
    console.log('\nSkipping destinations import (not in scope).');
  }

  if (shouldImport('packages')) {
    console.log('\nImporting packages...');
    for (const pkg of initialPackages) {
      let wpDestinationId = destinationIdMap.get(pkg.destinationId);
      if (!wpDestinationId) {
        const sourceDestination = initialDestinations.find((dest) => dest.id === pkg.destinationId);
        if (sourceDestination) {
          const existingDestination = await findBySlug('destinations', sourceDestination.slug);
          if (existingDestination?.id) {
            wpDestinationId = existingDestination.id;
            destinationIdMap.set(pkg.destinationId, existingDestination.id);
          }
        }
      }
      if (!wpDestinationId) {
        console.warn(`Skipping package ${pkg.slug}: destination not found for ${pkg.destinationId}`);
        continue;
      }

      const packageFeaturedImageId = await getMediaId();

      await upsert(token, 'packages', pkg.slug, {
        title: pkg.title,
        content: pkg.description,
        excerpt: pkg.summary,
        meta: {
          package_id: pkg.id,
          destination_id: wpDestinationId,
          category: pkg.category,
          summary: pkg.summary,
          intro_content: pkg.description,
          experience_content: pkg.description,
          days: pkg.duration.days,
          nights: pkg.duration.nights,
          starting_price: pkg.tiers[0]?.price ?? 0,
          currency: 'USD',
          pricing_basis: pkg.tiers[0]?.basis ?? 'per couple',
          pricing_tiers: normalizePricingTiersForFreeAcf(pkg.tiers),
          inclusions: pkg.inclusions,
          exclusions: pkg.exclusions,
          departures: pkg.departures,
          itinerary: pkg.itinerary ?? [],
          seo_title: pkg.seo.title,
          meta_description: pkg.seo.description
        },
        acf: {
          category: pkg.category,
          summary: pkg.summary,
          featured_image: packageFeaturedImageId,
          gallery: pkg.gallery.join('\n'),
          destination_id: [wpDestinationId],
          duration: {
            days: pkg.duration.days,
            nights: pkg.duration.nights
          },
          pricing_tiers: normalizePricingTiersForFreeAcf(pkg.tiers),
          inclusions: JSON.stringify(pkg.inclusions),
          exclusions: pkg.exclusions.join('\n'),
          tags: pkg.tags.join(','),
          departures: JSON.stringify(pkg.departures),
          itinerary: JSON.stringify(pkg.itinerary ?? []),
          seo: {
            title: pkg.seo.title,
            description: pkg.seo.description,
            keywords: pkg.seo.keywords.join(',')
          }
        }
      });
    }
  } else {
    console.log('\nSkipping packages import (not in scope).');
  }

  if (shouldImport('posts')) {
    console.log('\nImporting blog posts...');
    for (const post of initialPosts) {
      const parsedDate = new Date(post.date);
      const wpDate = Number.isNaN(parsedDate.getTime())
        ? undefined
        : new Date(Date.UTC(parsedDate.getUTCFullYear(), parsedDate.getUTCMonth(), parsedDate.getUTCDate(), 12, 0, 0)).toISOString();

      const postFeaturedImageId = await getMediaId();
      const postCategorySlug = post.category.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const postCategoryId = await getCategoryId(post.category, postCategorySlug);

      await upsert(token, 'posts', post.slug, {
        title: post.title,
        content: post.content || post.excerpt,
        excerpt: post.excerpt,
        ...(postFeaturedImageId ? { featured_media: postFeaturedImageId } : {}),
        ...(postCategoryId ? { categories: [postCategoryId] } : {}),
        ...(wpDate ? { date: wpDate } : {})
      });
    }
  } else {
    console.log('\nSkipping blog posts import (not in scope).');
  }

  if (shouldImport('testimonials')) {
    console.log('\nImporting testimonials...');
    const testimonialsCategoryId = await getCategoryId('Testimonials', 'testimonials');

    for (const testimonial of initialTestimonials) {
      const slug = `testimonial-${testimonial.coupleName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
      const testimonialImageId = await getMediaId();
      const meta = {
        location: testimonial.location,
        destination: testimonial.destination,
        rating: testimonial.rating,
        date: testimonial.date
      };

      await upsert(token, 'posts', slug, {
        title: testimonial.coupleName,
        excerpt: testimonial.quote,
        content: `<!-- hm_testimonial_meta:${JSON.stringify(meta)} -->\n<p>${testimonial.story}</p>`,
        ...(testimonialImageId ? { featured_media: testimonialImageId } : {}),
        ...(testimonialsCategoryId ? { categories: [testimonialsCategoryId] } : {})
      });
    }
  } else {
    console.log('\nSkipping testimonials import (not in scope).');
  }

  console.log('\nMigration complete.');
}

run().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
