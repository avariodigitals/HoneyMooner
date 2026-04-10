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
  schema?: Record<string, unknown>;
}

const SEO: React.FC<SEOProps> = ({
  title = 'The Honeymoonner | Luxury Romantic Travel & Honeymoon Packages',
  description = 'Curated luxury honeymoon packages and romantic escapes. Discover the world\'s most intimate destinations with The Honeymoonner.',
  keywords = 'honeymoon, romantic travel, luxury travel, honeymoon packages, romantic getaways, destination wedding',
  image = 'https://ik.imagekit.io/lrnty9ku6/HoneyMooner/Full%20Logo%20No%20BG%20-%20Sec%20Color.png',
  url = 'https://thehoneymoonner.com',
  canonical,
  type = 'website',
  schema
}) => {
  const siteTitle = title.includes('The Honeymoonner') ? title : `${title} | The Honeymoonner`;
  const effectiveUrl = canonical || url;

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={effectiveUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

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
