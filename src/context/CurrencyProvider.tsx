import React, { useState, useEffect } from 'react';
import { CurrencyContext, currencies as initialCurrencies } from './CurrencyContext';

const CACHE_KEY = 'honeymooner_rates_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours
const DETECTION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currentCode, setCurrentCode] = useState<string>(() => {
    const manualChoice = localStorage.getItem('honeymooner_currency_manual');
    if (manualChoice) return manualChoice;
    
    const autoDetected = localStorage.getItem('honeymooner_currency_auto');
    if (autoDetected) return autoDetected;

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

    const detectLocation = async () => {
      // 1. Skip if user already manually selected a currency
      if (localStorage.getItem('honeymooner_currency_manual')) return;

      // 2. Check if we have a fresh auto-detection (within 7 days)
      const lastDetection = localStorage.getItem('honeymooner_last_detection');
      if (lastDetection) {
        const timestamp = parseInt(lastDetection, 10);
        if (Date.now() - timestamp < DETECTION_EXPIRY) return;
      }

      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.currency && !ignore) {
          const matched = initialCurrencies.find(c => c.code === data.currency);
          if (matched) {
            setCurrentCode(data.currency);
            localStorage.setItem('honeymooner_currency_auto', data.currency);
            localStorage.setItem('honeymooner_last_detection', Date.now().toString());
          }
        }
      } catch (error) {
        console.error('Failed to detect location currency:', error);
      }
    };

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
    localStorage.setItem('honeymooner_currency_manual', code);
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
