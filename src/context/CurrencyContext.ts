import { createContext } from 'react';
import type { Currency } from '../types';

export const currencies: Currency[] = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.78 },
  { code: 'NGN', symbol: '₦', rate: 1500 }, // Current approx market rate
];

export interface CurrencyContextType {
  currency: Currency;
  setCurrency: (code: string) => void;
  formatPrice: (priceInUSD: number, fromCurrency?: string) => string;
  availableCurrencies: Currency[];
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);
