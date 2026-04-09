declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_ID = import.meta.env.VITE_GA_ID;

export function initGA() {
  if (!GA_ID) {
    console.log('GA missing: VITE_GA_ID not found');
    return;
  }

  if (typeof window === 'undefined') return;
  if (document.getElementById('ga-script')) return;

  console.log('GA loading:', GA_ID);

  const script1 = document.createElement('script');
  script1.id = 'ga-script';
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script1);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: any[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
}

export function trackPageView(url: string) {
  if (!GA_ID || !window.gtag) return;

  console.log('GA page view:', url);

  window.gtag('config', GA_ID, {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
  });
}