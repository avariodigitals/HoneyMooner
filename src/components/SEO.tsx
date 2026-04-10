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
  title = 'The Honeymoonner | Luxury Romantic Travel & Honeymoon Packages',
  description = 'Curated luxury honeymoon packages and romantic escapes. Discover the world\'s most intimate destinations with The Honeymoonner.',
  canonical,
  image = DEFAULT_IMAGE,
  noindex = false,
  raw,
}: SEOProps) {
  const rawHead = useMemo(() => (raw ? parseRawHeadHtml(raw) : null), [raw]);
  const canonicalUrl = canonical || 'https://thehoneymooner.com';

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

      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
}