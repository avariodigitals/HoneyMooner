import https from 'https';

const WP_BASE_URL = 'https://cms.thehoneymoonertravel.com/wp-json';
const WP_USERNAME = 'Akinlaja';
const WP_PASSWORD = 'mVMJkdI5gI1zCVI0rh5@^u0t';

async function getToken() {
    return new Promise((resolve, reject) => {
        const body = `username=${WP_USERNAME}&password=${WP_PASSWORD}`;
        const options = {
            hostname: 'cms.thehoneymoonertravel.com',
            path: '/wp-json/jwt-auth/v1/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(body)
            }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (result.token) resolve(result.token);
                    else reject(new Error('Login failed: ' + data));
                } catch (e) {
                    reject(new Error('Invalid JSON response: ' + data));
                }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

const collections = [
  {
    slug: 'signature-experience',
    kind: 'theme',
    title: 'The Honeymooner Travel Signature Experience',
    eyebrow: 'For Families of Newlyweds',
    audience: 'Couples who want a premium surprise-led honeymoon',
    tagline: 'Not just a honeymoon... a love story designed by The Honeymooner Travel.',
    intro: 'A deeply curated honeymoon format with thoughtful surprises, visual storytelling, and meaningful touches that feel personal from the first day.',
    highlights: [
      'Surprise itinerary elements',
      'Cinematic love story photoshoot',
      'Personalised gifts + storytelling',
      'Scripture-based blessings'
    ],
    destinations: ['Curated globally based on couple preferences'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/yuriy-bogdanov-XuN44TajBGo-unsplash-scaled.jpg',
    match: {
      categories: ['honeymoon'],
    }
  },
  {
    slug: 'cultural-spiritual-romance',
    kind: 'theme',
    title: 'Cultural & Spiritual Romance',
    eyebrow: 'Meaningful Romance',
    audience: 'Deep, meaningful couples',
    tagline: 'Love with meaning, not just moments.',
    intro: 'Ideal for couples who want a honeymoon with depth, history, and a stronger sense of place and reflection.',
    highlights: [
      'History, culture, spiritual depth',
      'Slower pace with meaningful experiences',
      'Rich storytelling throughout the trip'
    ],
    destinations: ['Morocco', 'Turkey', 'Israel', 'Egypt'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1583939003579-730e3918a45a.jpg',
    match: {
      countries: ['Morocco', 'Turkey', 'Israel', 'Egypt'],
    }
  },
  {
    slug: 'city-lights-romance',
    kind: 'theme',
    title: 'City Lights Romance',
    eyebrow: 'Urban Love',
    audience: 'Urban, stylish couples',
    tagline: 'Love shines brighter in the city.',
    intro: 'For couples who want energy, elegance, nightlife, and a polished city-break honeymoon experience.',
    highlights: [
      'Fine dining',
      'Nightlife',
      'Shopping'
    ],
    destinations: ['Paris', 'London', 'New York City', 'Tokyo'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1502602898657-3e91760cbb34-2-scaled.jpg',
    match: {
      destinations: ['Paris', 'London', 'New York City', 'Tokyo'],
    }
  },
  {
    slug: 'winter-wonderland-romance',
    kind: 'theme',
    title: 'Winter Wonderland Romance',
    eyebrow: 'Cold-Season Escape',
    audience: 'Couples who want something different',
    tagline: 'Love in the cold, hearts on fire.',
    intro: 'A snow-rich honeymoon for couples who want fireplaces, warm drinks, and a romantic change of scenery.',
    highlights: [
      'Snow escapes',
      'Fireplaces',
      'Hot chocolate vibes'
    ],
    destinations: ['Switzerland', 'Iceland', 'Lapland'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/fernando-gago-MY7yQ1ISEIk-unsplash-scaled.jpg',
    match: {
      countries: ['Switzerland', 'Iceland', 'Lapland'],
    }
  },
  {
    slug: 'safari-beach-combo',
    kind: 'theme',
    title: 'Safari & Beach Combo',
    eyebrow: 'Adventure and Ease',
    audience: 'Couples who want adventure and relaxation',
    tagline: 'Wild love meets ocean calm.',
    intro: 'The balance of wildlife, soft sand, and relaxed luxury creates a honeymoon with variety and emotion.',
    highlights: [
      'Wildlife + beach in one trip',
      'Very popular for Africans & internationals'
    ],
    destinations: ['Kenya + Zanzibar', 'South Africa + Mauritius'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/pablo-heimplatz-OSboZGvoEz4-unsplash.jpg',
    match: {
      destinations: ['Nairobi', 'Zanzibar', 'Cape Town', 'Johannesburg', 'Mauritius'],
      countries: ['Kenya', 'Tanzania', 'South Africa', 'Mauritius'],
    }
  },
  {
    slug: 'island-hopping-romance',
    kind: 'theme',
    title: 'Island Hopping Romance',
    eyebrow: 'Water Lovers',
    audience: 'Couples who love water and aesthetics',
    tagline: 'Every island, a new love story.',
    intro: 'A beautiful rhythm of ferries, boats, sunsets, and beach clubs across multiple islands.',
    highlights: [
      'Move between islands',
      'Boat rides, beach clubs, sunsets'
    ],
    destinations: ['Greece', 'Maldives', 'Caribbean', 'Philippines'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/yuriy-bogdanov-XuN44TajBGo-unsplash-scaled.jpg',
    match: {
      countries: ['Greece', 'Maldives', 'Jamaica', 'Barbados', 'St Lucia', 'Philippines'],
      destinations: ['Santorini', 'Mykonos', 'Maldives', 'Bora Bora', 'Seychelles', 'Fiji'],
    }
  },
  {
    slug: 'multi-destination-adventure-love',
    kind: 'theme',
    title: 'Multi-Destination Adventure Love',
    eyebrow: 'More Than One Destination',
    audience: 'Couples who want variety and memories',
    tagline: 'One love, multiple destinations.',
    intro: 'A route-based honeymoon format that blends city, nature, and beach across 2 to 4 stops.',
    highlights: [
      '2-4 countries in one honeymoon',
      'Mix of city, nature, and beach'
    ],
    destinations: ['Dubai/Doha -> Bali -> Singapore', 'Paris -> Rome -> Santorini'],
    route: ['Port of Departure', 'First Stop', 'Second Stop', 'Third Stop', 'Return'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1464822759023-fed622ff2c3b-scaled.jpg',
    match: {
      destinations: ['Dubai', 'Doha', 'Bali', 'Singapore', 'Paris', 'Rome', 'Santorini'],
      countries: ['UAE', 'Qatar', 'Indonesia', 'Singapore', 'France', 'Italy', 'Greece'],
      categories: ['honeymoon'],
    }
  },
  {
    slug: 'ultra-luxury',
    kind: 'theme',
    title: 'Ultra Luxury',
    eyebrow: 'Top-Tier Travel',
    audience: 'High-net-worth couples and aspirational clients',
    tagline: 'If money wasn\'t a problem... this is it.',
    intro: 'A high-touch honeymoon style with VIP transfers, premium stays, and elevated service throughout.',
    highlights: [
      'Overwater villas',
      'Private jets',
      'Yacht dinners',
      'VIP experiences'
    ],
    destinations: ['Maldives', 'Dubai', 'Santorini', 'Amalfi Coast'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/cedric-dhaenens-69_7CRJUIOc-unsplash-scaled.jpg',
    match: {
      destinations: ['Maldives', 'Dubai', 'Santorini', 'Amalfi Coast'],
      countries: ['UAE', 'Greece', 'Italy'],
      tags: ['Luxury'],
    }
  },
  {
    slug: 'soft-luxury-escape',
    kind: 'theme',
    title: 'Soft Luxury Escape (Starter Honeymoon)',
    eyebrow: 'Luxury Within Reach',
    audience: 'Budget-conscious couples who still want elegance',
    tagline: 'Luxury, but make it attainable.',
    intro: 'Elegant, slow, and romantic without the pressure of an overcomplicated itinerary.',
    highlights: [
      'Africa + island combo',
      '4-star resorts, spa treatments, beach dinners',
      'Slow, romantic, not stressful'
    ],
    destinations: ['Zanzibar', 'Cape Verde', 'Mauritius'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1507525428034-b723cf961d3e-scaled.jpg',
    match: {
      destinations: ['Zanzibar', 'Cape Verde', 'Mauritius'],
      countries: ['Tanzania', 'Cape Verde', 'Mauritius'],
    }
  },
  {
    slug: 'west-africa-island-south-africa',
    kind: 'route',
    title: 'West Africa -> Island -> South Africa',
    eyebrow: 'Route Idea',
    audience: 'Couples who want multi-stop variety',
    tagline: 'A smooth cross-region journey.',
    intro: 'A route that blends city energy, island ease, and Southern African style into one honeymoon flow.',
    highlights: ['Regional variety', 'Strong honeymoon potential', 'Easy to personalize'],
    destinations: ['Port of Departure', 'Cotonou', 'Cape Verde', 'Cape Town', 'Johannesburg'],
    route: ['Port of Departure', 'Cotonou', 'Cape Verde', 'Cape Town', 'Johannesburg'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/yuriy-bogdanov-XuN44TajBGo-unsplash-scaled.jpg',
    match: {
      countries: ['Benin', 'Cape Verde', 'South Africa', 'Nigeria'],
    }
  },
  {
    slug: 'asian-love-tour',
    kind: 'route',
    title: 'The Asian Love Tour',
    eyebrow: 'Route Idea',
    audience: 'Couples who want city and island energy',
    tagline: 'A warm, colorful, and exciting route.',
    intro: 'A big-scope itinerary through Asia that combines vibrant cities, beach life, and luxury stays.',
    highlights: ['Big-city stops', 'Beach downtime', 'Ideal for adventurous couples'],
    destinations: ['Accra', 'Bali', 'Bangkok', 'Singapore', 'Malaysia'],
    route: ['Port of Departure', 'Accra', 'Bali', 'Bangkok', 'Singapore', 'Malaysia'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/hoi-an-and-da-nang-photographer-f1Yk1rGf3tE-unsplash-scaled.jpg',
    match: {
      destinations: ['Bali', 'Bangkok', 'Singapore'],
      countries: ['Indonesia', 'Thailand', 'Singapore', 'Malaysia'],
    }
  },
  {
    slug: 'east-africa-southern-africa',
    kind: 'route',
    title: 'East Africa -> Southern Africa',
    eyebrow: 'Safari + Beach',
    audience: 'Couples who want adventure and calm',
    tagline: 'Wildlife first, ocean calm after.',
    intro: 'A balanced route across East and Southern Africa with strong romance, wildlife, and beach appeal.',
    highlights: ['Safari and beach blend', 'Popular for African couples', 'Flexible stopover options'],
    destinations: ['Nairobi', 'Zanzibar', 'Cape Town', 'Namibia', 'Addis Ababa'],
    route: ['Port of Departure', 'Nairobi', 'Zanzibar', 'Cape Town', 'Namibia', 'Addis Ababa'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/pablo-heimplatz-OSboZGvoEz4-unsplash.jpg',
    match: {
      countries: ['Kenya', 'Tanzania', 'South Africa', 'Namibia', 'Ethiopia'],
    }
  },
  {
    slug: 'classic-south-africa-loop',
    kind: 'route',
    title: 'Classic South Africa Loop',
    eyebrow: 'Best Seller Potential',
    audience: 'Couples who want a proven route',
    tagline: 'A smooth loop built for romance.',
    intro: 'A practical and attractive route that can be adapted for long-haul or regional travelers.',
    highlights: ['Balanced city and island pacing', 'Strong visual appeal', 'Simple to customize'],
    destinations: ['Nairobi', 'Zanzibar', 'Cape Town', 'Johannesburg'],
    route: ['Port of Departure', 'Nairobi', 'Zanzibar', 'Cape Town', 'Johannesburg', 'Port of Arrival'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/yuriy-bogdanov-XuN44TajBGo-unsplash-scaled.jpg',
    match: {
      countries: ['Kenya', 'Tanzania', 'South Africa'],
    }
  },
  {
    slug: 'ultra-romance-route',
    kind: 'route',
    title: 'Ultra Romance Route',
    eyebrow: 'Premium Route',
    audience: 'Couples who want elegance and variety',
    tagline: 'For couples who want a premium itinerary.',
    intro: 'A luxury-first route that keeps the pace relaxed while moving through highly desirable destinations.',
    highlights: ['Luxury feel', 'Premium destination mix', 'Great for aspirational clients'],
    destinations: ['Nairobi', 'Mauritius', 'Cape Town', 'Johannesburg'],
    route: ['Port of Departure', 'Nairobi', 'Mauritius', 'Cape Town', 'Johannesburg', 'Port of Arrival'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/yuriy-bogdanov-XuN44TajBGo-unsplash-scaled.jpg',
    match: {
      countries: ['Kenya', 'Mauritius', 'South Africa'],
      tags: ['Luxury'],
    }
  },
  {
    slug: 'europe-love-trail',
    kind: 'route',
    title: 'Europe Love Trail',
    eyebrow: 'Classic Europe',
    audience: 'Couples who want a romantic city loop',
    tagline: 'A timeless route through Europe.',
    intro: 'This route is built for couples who love classic European romance, architecture, dining, and slow travel.',
    highlights: ['Cultural richness', 'Iconic photo opportunities', 'Elegant multi-city feel'],
    destinations: ['Paris', 'Santorini', 'Rome', 'Venice'],
    route: ['Port of Departure', 'Paris', 'Santorini', 'Rome', 'Venice'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1502602898657-3e91760cbb34-2-scaled.jpg',
    match: {
      destinations: ['Paris', 'Santorini', 'Rome', 'Venice'],
      countries: ['France', 'Greece', 'Italy'],
    }
  },
  {
    slug: 'turkey-greece-romance',
    kind: 'route',
    title: 'Turkey + Greece Romance',
    eyebrow: 'Culture and Island Luxury',
    audience: 'Couples who want a mixed-pace honeymoon',
    tagline: 'A route with culture, height, and sea views.',
    intro: 'Great for couples who want a mix of history, scenery, and island relaxation.',
    highlights: ['Deep cultural value', 'Great visual variety', 'Flexible luxury levels'],
    destinations: ['Istanbul', 'Cappadocia', 'Santorini', 'Mykonos'],
    route: ['Port of Departure', 'Istanbul', 'Cappadocia', 'Santorini', 'Mykonos'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1439066615861-d1af74d74000-scaled.jpg',
    match: {
      countries: ['Turkey', 'Greece'],
      destinations: ['Istanbul', 'Cappadocia', 'Santorini', 'Mykonos'],
    }
  },
  {
    slug: 'morocco-zanzibar-culture-beach',
    kind: 'route',
    title: 'Morocco + Zanzibar',
    eyebrow: 'Culture + Beach',
    audience: 'Couples who want contrast in one itinerary',
    tagline: 'History first, beach calm after.',
    intro: 'A route built for couples who want culture, desert, and a beach finale.',
    highlights: ['Strong contrast', 'High emotional appeal', 'Easy to market visually'],
    destinations: ['Marrakech', 'Sahara', 'Zanzibar'],
    route: ['Port of Departure', 'Marrakech', 'Sahara', 'Zanzibar'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/natalya-zaritskaya-SIOdjcYotms-unsplash-scaled.jpg',
    match: {
      countries: ['Morocco', 'Tanzania'],
      destinations: ['Marrakesh', 'Zanzibar'],
    }
  },
  {
    slug: 'island-obsession',
    kind: 'route',
    title: 'The Island Obsession',
    eyebrow: 'Island Icons',
    audience: 'Couples who love water and sunsets',
    tagline: 'A collection of iconic islands.',
    intro: 'This route idea is for island-focused couples and can be adapted into a single or multi-stop journey.',
    highlights: ['Aesthetic appeal', 'Easy to package', 'Strong honeymoon demand'],
    destinations: ['Maldives + UAE', 'Bora Bora', 'Seychelles + Mauritius'],
    route: ['Maldives + UAE', 'Bora Bora', 'Seychelles + Mauritius'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/yuriy-bogdanov-XuN44TajBGo-unsplash-scaled.jpg',
    match: {
      destinations: ['Maldives', 'Bora Bora', 'Seychelles', 'Mauritius', 'Dubai'],
      countries: ['Maldives', 'UAE', 'French Polynesia', 'Seychelles', 'Mauritius'],
    }
  },
  {
    slug: 'european-love-trail',
    kind: 'route',
    title: 'European Love Trail',
    eyebrow: 'Extended Europe',
    audience: 'Couples who want a longer multi-stop route',
    tagline: 'Longer route, more memories.',
    intro: 'A bigger European route that offers depth, movement, and a lot of memorable moments.',
    highlights: ['Ideal for longer honeymoons', 'Excellent upsell opportunity', 'Strong content value'],
    destinations: ['Paris', 'Venice', 'Amalfi Coast', 'Switzerland', 'Rome', 'Florence'],
    route: ['Paris', 'Venice', 'Amalfi Coast', 'Switzerland', 'Rome', 'Florence'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/fernando-gago-MY7yQ1ISEIk-unsplash-scaled.jpg',
    match: {
      countries: ['France', 'Italy', 'Switzerland'],
      destinations: ['Paris', 'Venice', 'Amalfi Coast', 'Rome', 'Florence'],
    }
  },
  {
    slug: 'caribbean-slow-love',
    kind: 'route',
    title: 'Caribbean Slow Love',
    eyebrow: 'Slow Pace',
    audience: 'Couples who want easy warmth and rest',
    tagline: 'Relaxed, warm, and romantic.',
    intro: 'Perfect for couples who want to slow down, rest, and enjoy a sun-soaked itinerary.',
    highlights: ['Relaxed pacing', 'Warm water and beaches', 'Great for long stays'],
    destinations: ['Saint Lucia', 'Jamaica + Bahamas', 'Antigua and Barbuda'],
    route: ['Saint Lucia', 'Jamaica + Bahamas', 'Antigua and Barbuda'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/photo-1507525428034-b723cf961d3e-scaled.jpg',
    match: {
      countries: ['Jamaica', 'Bahamas', 'Antigua and Barbuda', 'Saint Lucia'],
    }
  },
  {
    slug: 'safari-luxe-beach',
    kind: 'route',
    title: 'Safari + Luxe Beach',
    eyebrow: 'Adventure + Luxury',
    audience: 'Couples who want wildlife and soft landing',
    tagline: 'Safari first, luxury beach next.',
    intro: 'A route idea with strong upsell potential that combines wildlife with premium beach recovery time.',
    highlights: ['Strong Africa appeal', 'Great for couples seeking balance', 'Easy to adapt'],
    destinations: ['Kenya -> Zanzibar', 'Tanzania (Serengeti) -> Seychelles', 'South Africa -> Mauritius'],
    route: ['Kenya -> Zanzibar', 'Tanzania (Serengeti) -> Seychelles', 'South Africa -> Mauritius'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/pablo-heimplatz-OSboZGvoEz4-unsplash.jpg',
    match: {
      countries: ['Kenya', 'Tanzania', 'South Africa', 'Mauritius', 'Seychelles'],
    }
  },
  {
    slug: 'usa-dream-honeymoon',
    kind: 'route',
    title: 'USA Dream Honeymoon',
    eyebrow: 'Domestic Luxury',
    audience: 'US couples who want a home-country escape',
    tagline: 'A honeymoon with American variety.',
    intro: 'A domestic route idea for couples who want to keep the trip within the United States while still feeling special.',
    highlights: ['Easy for domestic clients', 'Varied landscapes', 'Good for short or extended itineraries'],
    destinations: ['Hawaii (Maui/Oahu)', 'Napa Valley -> Los Angeles', 'New York City -> Las Vegas'],
    route: ['Hawaii (Maui/Oahu)', 'Napa Valley -> Los Angeles', 'New York City -> Las Vegas'],
    heroImage: 'https://cms.thehoneymoonertravel.com/wp-content/uploads/2026/04/homepage-default-hero.jpg',
    match: {
      countries: ['USA'],
      destinations: ['Hawaii', 'Cancun', 'Los Cabos', 'Mendoza', 'Puerto Rico'],
    }
  }
];

async function checkExists(slug) {
    return new Promise((resolve) => {
        https.get(`${WP_BASE_URL}/wp/v2/route_ideas?slug=${slug}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const posts = JSON.parse(data);
                    if (Array.isArray(posts) && posts.length > 0) {
                        resolve(posts[0].id);
                    } else {
                        resolve(null);
                    }
                } catch (e) {
                    resolve(null);
                }
            });
        });
    });
}

async function upsertRoute(route, token) {
    const existingId = await checkExists(route.slug);
    
    const meta = {
        eyebrow: route.eyebrow,
        title_override: route.title,
        tagline: route.tagline,
        intro: route.intro,
        audience: route.audience,
        hero_image: route.heroImage,
        destinations: (route.destinations || []).join(', '),
        match_categories: (route.match?.categories || []).join(', '),
        match_countries: (route.match?.countries || []).join(', '),
        match_destinations: (route.match?.destinations || []).join(', '),
        match_tags: (route.match?.tags || []).join(', '),
        highlights: (route.highlights || []).map(text => ({ text })),
        route_stops: (route.route || []).map(name => ({ stop_name: name }))
    };

    const postData = JSON.stringify({
        title: route.title,
        slug: route.slug,
        status: 'publish',
        hm_route_data: meta
    });

    const options = {
        hostname: 'cms.thehoneymoonertravel.com',
        path: existingId ? `/wp-json/wp/v2/route_ideas/${existingId}` : '/wp-json/wp/v2/route_ideas',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    console.log(`${existingId ? 'Updated' : 'Created'} ${route.slug}`);
                    resolve();
                } else {
                    console.error(`Failed ${route.slug}: ${res.statusCode} - ${data}`);
                    reject(new Error(`Failed ${route.slug}`));
                }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

async function run() {
    console.log('--- Starting Route Sync (Upsert) ---');
    try {
        const token = await getToken();
        for (const route of collections) {
            try {
                await upsertRoute(route, token);
            } catch (e) {
                console.error(`Error processing ${route.slug}:`, e.message);
            }
        }
    } catch (e) {
        console.error('Sync failed:', e.message);
    }
    console.log('--- Sync Complete ---');
}

run();
