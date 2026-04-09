declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: any[]) => void;
  }
}

export const GA_ID = import.meta.env.VITE_GA_ID;

export function initGA() {
  if (typeof window === 'undefined') return;

  if (!GA_ID) {
    console.log('GA missing: VITE_GA_ID not found');
    return;
  }

  if (document.getElementById('ga-script')) {
    console.log('GA already initialized');
    return;
  }

  console.log('GA loading:', GA_ID);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function (...args: any[]) {
    window.dataLayer.push(args);
  };

  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.gtag('js', new Date());
  window.gtag('config', GA_ID, {
    debug_mode: true,
    send_page_view: true,
  });
}

export function trackPageView(url: string) {
  if (typeof window === 'undefined') return;

  if (!GA_ID) {
    console.log('GA missing in trackPageView');
    return;
  }

  if (!window.gtag) {
    console.log('GA not ready yet');
    return;
  }

  console.log('GA page view:', url);

  window.gtag('config', GA_ID, {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
    debug_mode: true,
  });
}