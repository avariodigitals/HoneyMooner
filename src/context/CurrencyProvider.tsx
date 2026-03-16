import React, { useState, useEffect } from 'react';
import { CurrencyContext, currencies as initialCurrencies } from './CurrencyContext';

const CACHE_KEY = 'honeymooner_rates_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentCode, setCurrentCode] = useState<string>(() => {
    const saved = localStorage.getItem('honeymooner_currency_code');
    if (saved) return saved;
    return initialCurrencies[0].code;
  });

  const [rates, setRates] = useState<Record<string, number>>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { rates: cachedRates, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          return cachedRates;
        }
      }
    } catch (e) {
      console.error('Error reading currency cache', e);
    }
    return {};
  });

  useEffect(() => {
    let ignore = false;

    const performFetch = async () => {
      try {
        // Double check cache before hitting the network
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            return;
          }
        }

        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();
        
        if (data.result === 'success' && !ignore) {
          const newRates = data.rates;
          setRates(newRates);
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            rates: newRates,
            timestamp: Date.now()
          }));
        }
      } catch (error) {
        console.error('Failed to fetch currency rates:', error);
      }
    };

    performFetch();

    return () => {
      ignore = true;
    };
  }, []);

  const currency = initialCurrencies.find(c => c.code === currentCode) || initialCurrencies[0];
  const currentRate = rates[currentCode] || currency.rate;

  const setCurrency = (code: string) => {
    setCurrentCode(code);
    localStorage.setItem('honeymooner_currency_code', code);
  };

  const formatPrice = (priceInUSD: number) => {
    const converted = priceInUSD * currentRate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
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
