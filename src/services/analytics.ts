declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function initGA() {
  console.log('GA handled in index.html');
}

export function trackPageView(url: string) {
  if (typeof window === 'undefined') return;
  if (!window.gtag) {
    console.log('GA not ready');
    return;
  }

  console.log('GA page view:', url);

  window.gtag('event', 'page_view', {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
    debug_mode: true,
  });
}