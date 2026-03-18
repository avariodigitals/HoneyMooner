import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  schema?: Record<string, unknown>;
}

const SEO: React.FC<SEOProps> = ({
  title = 'The Honeymooner | Luxury Romantic Travel & Honeymoon Packages',
  description = 'Curated luxury honeymoon packages and romantic escapes. Discover the world\'s most intimate destinations with The Honeymooner.',
  keywords = 'honeymoon, romantic travel, luxury travel, honeymoon packages, romantic getaways, destination wedding',
  image = '/og-image.jpg',
  url = 'https://thehoneymooner.com',
  type = 'website',
  schema
}) => {
  const siteTitle = title.includes('The Honeymooner') ? title : `${title} | The Honeymooner`;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical Link */}
      <link rel="canonical" href={url} />

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
