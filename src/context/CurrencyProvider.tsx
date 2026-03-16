import React, { useState } from 'react';
import type { Currency } from '../types';
import { CurrencyContext, currencies } from './CurrencyContext';

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('honeymooner_currency');
    return saved ? JSON.parse(saved) : currencies[0];
  });

  const setCurrency = (code: string) => {
    const newCurrency = currencies.find(c => c.code === code) || currencies[0];
    setCurrencyState(newCurrency);
    localStorage.setItem('honeymooner_currency', JSON.stringify(newCurrency));
  };

  const formatPrice = (priceInUSD: number) => {
    const converted = priceInUSD * currency.rate;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, availableCurrencies: currencies }}>
      {children}
    </CurrencyContext.Provider>
  );
}
