import React, { useState, useEffect } from 'react';
import { CurrencyContext, currencies as initialCurrencies } from './CurrencyContext';

const SUPPORTED_CODES = new Set(initialCurrencies.map((currency) => currency.code));
let detectCurrencyPromise: Promise<string | null> | null = null;

function normalizeCurrencyCode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const code = value.trim().toUpperCase();
  return SUPPORTED_CODES.has(code) ? code : null;
}

function currencyFromCountryCode(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const country = value.trim().toUpperCase();
  const countryCurrencyMap: Record<string, string> = {
    NG: 'NGN',
    GB: 'GBP',
    US: 'USD',
    IE: 'EUR',
    FR: 'EUR',
    DE: 'EUR',
    ES: 'EUR',
    IT: 'EUR',
    NL: 'EUR',
    BE: 'EUR',
    PT: 'EUR'
  };
  return normalizeCurrencyCode(countryCurrencyMap[country]);
}

function currencyFromTimeZone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!tz) return null;
    const timezoneCurrencyMap: Record<string, string> = {
      'Africa/Lagos': 'NGN',
      'Europe/London': 'GBP',
      'Europe/Dublin': 'EUR',
      'America/New_York': 'USD'
    };
    return normalizeCurrencyCode(timezoneCurrencyMap[tz]);
  } catch {
    return null;
  }
}

function currencyFromLocale(): string | null {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const region = locale.split('-')[1]?.toUpperCase();
    if (!region) return null;
    const regionCurrencyMap: Record<string, string> = {
      US: 'USD',
      GB: 'GBP',
      NG: 'NGN',
      IE: 'EUR',
      FR: 'EUR',
      DE: 'EUR',
      ES: 'EUR',
      IT: 'EUR',
      NL: 'EUR',
      BE: 'EUR',
      PT: 'EUR'
    };
    return normalizeCurrencyCode(regionCurrencyMap[region]);
  } catch {
    return null;
  }
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function detectCurrencyCode(): Promise<string | null> {
  // Prefer stable client-side signals first to avoid flaky geo API calls.
  const tzCurrency = currencyFromTimeZone();
  if (tzCurrency) return tzCurrency;

  const localeCurrency = currencyFromLocale();
  if (localeCurrency) return localeCurrency;

  // Local development often triggers CORS/429 on free geo APIs; skip external probes.
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  if (host === 'localhost' || host === '127.0.0.1') {
    return null;
  }

  const providers = [
    async () => {
      const response = await fetchWithTimeout('https://ipapi.co/json/', 3500);
      if (!response.ok) return null;
      const data = await response.json() as { currency?: string; country_code?: string };
      return currencyFromCountryCode(data.country_code) || normalizeCurrencyCode(data.currency);
    },
    async () => {
      const response = await fetchWithTimeout('https://ipwho.is/', 3500);
      if (!response.ok) return null;
      const data = await response.json() as { currency?: { code?: string }; country_code?: string };
      return currencyFromCountryCode(data.country_code) || normalizeCurrencyCode(data.currency?.code);
    }
  ];

  for (const provider of providers) {
    try {
      const code = await provider();
      if (code) return code;
    } catch {
      // Try next provider silently.
    }
  }

  return null;
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentCode, setCurrentCode] = useState<string>(initialCurrencies[0].code);

  const [rates, setRates] = useState<Record<string, number>>({});

  useEffect(() => {
    let ignore = false;

    const detectLocation = async () => {
      try {
        if (!detectCurrencyPromise) {
          detectCurrencyPromise = detectCurrencyCode();
        }
        const detectedCode = await detectCurrencyPromise;
        if (detectedCode && !ignore) {
          setCurrentCode(detectedCode);
        }
      } catch {
        // Keep default currency silently when detection is unavailable.
      }
    };

    const performFetch = async () => {
      try {
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data.result === 'success' && !ignore) {
          setRates(data.rates);
        }
      } catch (error) {
        console.error('Failed to fetch currency rates:', error);
      }
    };

    detectLocation();
    performFetch();

    return () => {
      ignore = true;
    };
  }, []);

  const currency = initialCurrencies.find(c => c.code === currentCode) || initialCurrencies[0];
  const currentRate = rates[currentCode] || currency.rate;

  const setCurrency = (code: string) => {
    setCurrentCode(code);
  };

  const formatPrice = (priceInUSD: number, fromCurrency?: string) => {
    const rate = fromCurrency ? (rates[fromCurrency] || 1) : 1;
    const priceInSelectedCurrency = (priceInUSD / rate) * currentRate;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceInSelectedCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency: { ...currency, rate: currentRate }, 
      setCurrency, 
      formatPrice, 
      availableCurrencies: initialCurrencies.map(c => ({
        ...c,
        rate: rates[c.code] || c.rate
      }))
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export default CurrencyProvider;
