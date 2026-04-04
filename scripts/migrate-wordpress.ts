/* eslint-disable no-console */
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

type WPMedia = {
  id: number;
  source_url?: string;
  title?: { rendered: string };
};

const WP_BASE_URL = process.env.WP_BASE_URL || 'https://cms.thehoneymoonner.com/wp-json';
const WP_USERNAME = process.env.WP_USERNAME;
const WP_PASSWORD = process.env.WP_PASSWORD;
const WP_TOKEN = process.env.WP_TOKEN;
const DRY_RUN = process.env.DRY_RUN === 'true';
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

function mediaHeaders(token: string, fileName: string, mimeType: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Disposition': `attachment; filename="${fileName}"`,
    'Content-Type': mimeType
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

function fileNameFromUrl(url: string, fallback: string) {
  try {
    const parsed = new URL(url);
    const lastPart = parsed.pathname.split('/').filter(Boolean).pop();
    if (!lastPart) return fallback;
    return lastPart.includes('.') ? lastPart : `${lastPart}.jpg`;
  } catch {
    return fallback;
  }
}

async function uploadMedia(token: string, sourceUrl: string, fallbackName: string): Promise<number | null> {
  try {
    const imageResponse = await fetch(sourceUrl);
    if (!imageResponse.ok) {
      console.error(`Failed to download media from ${sourceUrl}: ${imageResponse.status}`);
      return null;
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const fileName = fileNameFromUrl(sourceUrl, fallbackName);

    const response = await fetch(`${WP_BASE_URL}/wp/v2/media`, {
      method: 'POST',
      headers: mediaHeaders(token, fileName, contentType),
      body: Buffer.from(arrayBuffer)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Failed media upload for ${sourceUrl}: ${response.status} ${text}`);
      return null;
    }

    const data = await response.json() as WPMedia;
    console.log(`Uploaded media: ${fileName} (#${data.id})`);
    return data.id;
  } catch (error) {
    console.error(`Media upload error for ${sourceUrl}:`, error);
    return null;
  }
}

async function upsert(
  token: string,
  type: 'destinations' | 'packages' | 'posts',
  slug: string,
  payload: Record<string, unknown>
): Promise<number | null> {
  const existing = await findBySlug(type, slug);
  const method = 'POST';
  const url = existing
    ? `${WP_BASE_URL}/wp/v2/${type}/${existing.id}`
    : `${WP_BASE_URL}/wp/v2/${type}`;

  const finalPayload = {
    ...payload,
    slug,
    status: 'publish'
  };

  if (DRY_RUN) {
    console.log(`[DRY_RUN] ${existing ? 'UPDATE' : 'CREATE'} ${type}: ${slug}`);
    return existing?.id || null;
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
  const premium = tiers.find((t) => t.name === 'Premium');
  const luxuria = tiers.find((t) => t.name === 'Luxuria');
  const ultra = tiers.find((t) => t.name === 'Ultra Luxuria');

  return {
    premium: premium
      ? { id: premium.id, name: premium.name, price: premium.price, basis: premium.basis }
      : { id: 'premium', name: 'Premium', price: 0, basis: 'per couple' },
    luxuria: luxuria
      ? { id: luxuria.id, name: luxuria.name, price: luxuria.price, basis: luxuria.basis }
      : { id: 'luxuria', name: 'Luxuria', price: 0, basis: 'per couple' },
    ultra_luxuria: ultra
      ? { id: ultra.id, name: ultra.name, price: ultra.price, basis: ultra.basis }
      : { id: 'ultra-luxuria', name: 'Ultra Luxuria', price: 0, basis: 'per couple' }
  };
}

async function run() {
  console.log(`Using WordPress API: ${WP_BASE_URL}`);
  console.log(`Import scope: ${IMPORT_SCOPE.join(', ') || 'all'}`);
  const token = await login();
  const destinationIdMap = new Map<string, number>();
  const mediaIdCache = new Map<string, number>();
  const categoryIdCache = new Map<string, number>();
  let fallbackMediaId: number | null = null;

  async function getMediaId(sourceUrl: string, fallbackName: string): Promise<number | null> {
    const cached = mediaIdCache.get(sourceUrl);
    if (cached) return cached;
    if (DRY_RUN) {
      console.log(`[DRY_RUN] upload media: ${sourceUrl}`);
      return null;
    }
    const mediaId = await uploadMedia(token, sourceUrl, fallbackName);
    if (mediaId) {
      mediaIdCache.set(sourceUrl, mediaId);
      return mediaId;
    }

    if (fallbackMediaId === null) {
      const fallbackUrl = 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80';
      fallbackMediaId = await uploadMedia(token, fallbackUrl, 'fallback-media.jpg');
    }

    return fallbackMediaId;
  }

  async function getCategoryId(name: string, slug: string): Promise<number | null> {
    const cached = categoryIdCache.get(slug);
    if (cached) return cached;
    const categoryId = await ensureCategory(token, name, slug);
    if (categoryId) categoryIdCache.set(slug, categoryId);
    return categoryId;
  }

  if (shouldImport('destinations')) {
    console.log('\nImporting destinations...');
    for (const dest of initialDestinations) {
      const destinationImageId = await getMediaId(dest.image, `${dest.slug}-destination.jpg`);
      const id = await upsert(token, 'destinations', dest.slug, {
        title: dest.name,
        content: dest.description,
        excerpt: dest.description,
        acf: {
          country: dest.country,
          continent: dest.continent,
          image: destinationImageId,
          starting_price: dest.startingPrice ?? 0,
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

      const packageFeaturedImageId = await getMediaId(pkg.featuredImage, `${pkg.slug}-featured.jpg`);

      await upsert(token, 'packages', pkg.slug, {
        title: pkg.title,
        content: pkg.description,
        excerpt: pkg.summary,
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

      const postFeaturedImageId = await getMediaId(post.image, `${post.slug}-post.jpg`);
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
      const testimonialImageId = await getMediaId(testimonial.image, `${slug}.jpg`);
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
