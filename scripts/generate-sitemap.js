import fs from 'fs';
import fetch from 'node-fetch';

const BASE_URL = 'https://thehoneymoonertravel.com';
const CMS_URL = 'https://cms.thehoneymoonertravel.com';

async function fetchData(endpoint) {
  try {
    const res = await fetch(`${CMS_URL}/wp-json/wp/v2/${endpoint}?per_page=100`);
    return await res.json();
  } catch (err) {
    console.log('Error fetching', endpoint);
    return [];
  }
}

function generateUrl(loc, priority = 0.8, changefreq = 'weekly') {
  return `
  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

async function generateSitemap() {
  console.log('Generating sitemap...');

  const packages = await fetchData('packages');
  const destinations = await fetchData('destinations');
  const posts = await fetchData('posts');

  let urls = `
  ${generateUrl(`${BASE_URL}/`, 1.0)}
  ${generateUrl(`${BASE_URL}/packages`, 0.9)}
  ${generateUrl(`${BASE_URL}/destinations`, 0.9)}
  ${generateUrl(`${BASE_URL}/journal`, 0.8)}
  `;

  packages.forEach((item) => {
    urls += generateUrl(`${BASE_URL}/packages/${item.slug}`, 0.8);
  });

  destinations.forEach((item) => {
    urls += generateUrl(`${BASE_URL}/destinations/${item.slug}`, 0.8);
  });

  posts.forEach((item) => {
    urls += generateUrl(`${BASE_URL}/journal/${item.slug}`, 0.7);
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  fs.writeFileSync('./public/sitemap.xml', sitemap);

  console.log('Sitemap generated successfully');
}

generateSitemap();