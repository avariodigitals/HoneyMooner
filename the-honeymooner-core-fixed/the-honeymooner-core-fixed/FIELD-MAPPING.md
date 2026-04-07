# The Honeymooner Core – Field Mapping

## Packages

### WordPress core fields
- Title -> package title / H1 / selector label
- Excerpt -> summary cards / related package snippets
- Featured image -> hero image / enquiry summary card image
- Content -> long body content if needed

### Package meta
- package_id -> internal package reference
- destination_id -> linked destination post ID
- category -> honeymoon / anniversary / family_escape / luxury_retreat
- subtitle -> hero subtitle
- summary -> short overview text
- intro_content -> SEO paragraph under “Experience [Destination]”
- days -> duration days
- nights -> duration nights
- starting_price -> package price from
- currency -> NGN / USD / GBP
- pricing_basis -> per_couple / per_person / per_family
- rating -> star rating
- review_count -> total reviews
- pricing_tiers[] -> experience level selector
- inclusions[] -> fee covers list
- exclusions[] -> not included list
- departures[] -> available departure dates
- itinerary[] -> journey at a glance / day-by-day plan
- seo_title -> SEO title
- meta_description -> meta description
- canonical_url -> canonical URL

## Destinations
- Title -> destination name
- Excerpt -> destination summary card
- Featured image -> destination hero image
- subtitle -> destination subtitle
- intro_content -> destination intro block
- best_time_to_visit -> season guidance
- highlights[] -> highlight items
- seo_title -> SEO title
- meta_description -> meta description
- canonical_url -> canonical URL

## Leads
Frontend form maps as follows:
- Select Package -> package_id + package_name
- Experience Level -> package_tier
- Occasion -> occasion
- Full Name -> traveler_name
- Email Address -> email
- WhatsApp / Phone -> phone
- Departure Date -> departure_date
- Country of Residence -> country_of_residence
- Adults -> adults
- Children -> children
- Special Requests -> message
- Submitted page URL -> source_url
- Default status -> new

## REST endpoints
- GET /wp-json/honeymooner/v1/packages
- GET /wp-json/honeymooner/v1/packages/{slug}
- GET /wp-json/honeymooner/v1/packages-options
- GET /wp-json/honeymooner/v1/destinations
- GET /wp-json/honeymooner/v1/destinations/{slug}
- POST /wp-json/honeymooner/v1/leads
