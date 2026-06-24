import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type Currency = 'EUR' | 'CHF' | 'USD' | 'GBP';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountInEur: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const rates = {
  EUR: 1,
  CHF: 0.96,
  USD: 1.08,
  GBP: 0.86,
};

const symbols = {
  EUR: '€',
  CHF: 'CHF',
  USD: '$',
  GBP: '£',
};

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('suissetvb-currency');
    return (saved as Currency) || 'EUR';
  });

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem('suissetvb-currency', c);
  };

  const formatPrice = (amountInEur: number) => {
    const rate = rates[currency];
    const converted = amountInEur * rate;
    
    return currency === 'CHF' 
      ? `${converted.toFixed(2)} ${symbols[currency]}`
      : `${symbols[currency]}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
