import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
  noindex?: boolean;
  raw?: string;
};

const DEFAULT_IMAGE =
  'https://ik.imagekit.io/lrnty9ku6/HoneyMooner/Full%20Logo%20No%20BG%20-%20Sec%20Color.png';

function createAttributes(element: Element) {
  const attrs: Record<string, string> = {};
  for (let i = 0; i < element.attributes.length; i += 1) {
    const attr = element.attributes[i];
    attrs[attr.name] = attr.value;
  }
  return attrs;
}

function parseRawHeadHtml(raw: string) {
  if (typeof window === 'undefined') return null;
  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, 'text/html');
  return Array.from(doc.head.children).map((node, index) => {
    const attrs = createAttributes(node);
    const key = `seo-${node.tagName.toLowerCase()}-${index}`;

    switch (node.tagName.toLowerCase()) {
      case 'title':
        return <title key={key}>{node.textContent}</title>;
      case 'meta':
        return <meta key={key} {...attrs} />;
      case 'link':
        return <link key={key} {...attrs} />;
      case 'script':
        return (
          <script
            key={key}
            {...attrs}
            dangerouslySetInnerHTML={{ __html: node.innerHTML }}
          />
        );
      case 'style':
        return (
          <style
            key={key}
            {...attrs}
            dangerouslySetInnerHTML={{ __html: node.innerHTML }}
          />
        );
      default:
        return null;
    }
  });
}

export default function SEO({
  title = 'The Honeymooner Travel | Luxury Romantic Travel & Honeymoon Packages',
  description = 'Curated luxury honeymoon packages and romantic escapes. Discover the world\'s most intimate destinations with The Honeymooner Travel.',
  canonical,
  image = DEFAULT_IMAGE,
  noindex = false,
  raw,
}: SEOProps) {
  const rawHead = useMemo(() => (raw ? parseRawHeadHtml(raw) : null), [raw]);
  const canonicalUrl = canonical || 'https://thehoneymoonertravel.com';

  if (raw && rawHead) {
    return <Helmet>{rawHead}</Helmet>;
  }

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta
        name="robots"
        content={noindex ? 'noindex,nofollow' : 'index,follow'}
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content="The Honeymooner Travel" />
      {image && <meta property="og:image" content={image} />}
      <meta property="og:image:alt" content="The Honeymooner Travel - Luxury Honeymoon Packages" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {image && <meta property="twitter:image" content={image} />}
      <meta property="twitter:image:alt" content="The Honeymooner Travel - Luxury Honeymoon Packages" />

      {/* Additional SEO */}
      <meta name="author" content="The Honeymooner Travel" />
      <link rel="author" href="https://thehoneymoonertravel.com" />
      <meta name="publisher" content="The Honeymooner Travel" />
    </Helmet>
  );
}