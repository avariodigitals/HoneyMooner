import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  canonical?: string;
  type?: string;
  noindex?: boolean;
  schema?: Record<string, unknown>;
}

const SEO: React.FC<SEOProps> = ({
  title = 'The Honeymooner Travel | Luxury Romantic Travel & Honeymoon Packages',
  description = 'Curated luxury honeymoon packages and romantic escapes. Discover the world\'s most intimate destinations with The Honeymooner Travel.',
  keywords = 'honeymoon, romantic travel, luxury travel, honeymoon packages, romantic getaways, destination wedding',
  image = 'https://thehoneymoonertravel.com/images/logo-colored.png',
  url = 'https://thehoneymoonertravel.com',
  canonical,
  type = 'website',
  noindex = false,
  schema
}) => {
  const siteTitle = title.includes('The Honeymooner Travel') ? title : `${title} | The Honeymooner Travel`;
  const effectiveUrl = canonical || url;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="author" content="The Honeymooner Travel" />
      <meta name="publisher" content="The Honeymooner Travel" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={effectiveUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="The Honeymooner Travel" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={effectiveUrl} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical Link */}
      <link rel="canonical" href={effectiveUrl} />

      {/* JSON-LD Schema.org Markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
