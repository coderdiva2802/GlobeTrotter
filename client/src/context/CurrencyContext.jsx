import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateFromINR: 1, formatLocale: 'en-IN' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateFromINR: 0.012, formatLocale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateFromINR: 0.011, formatLocale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateFromINR: 0.0095, formatLocale: 'en-GB' },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rateFromINR: 0.044, formatLocale: 'ar-AE' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateFromINR: 1.80, formatLocale: 'ja-JP' },
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('gt_currency') || 'INR';
  });

  useEffect(() => {
    localStorage.setItem('gt_currency', currency);
  }, [currency]);

  const activeCurrency = CURRENCIES[currency] || CURRENCIES.INR;

  /**
   * Convert an amount in base INR to the selected currency
   */
  const convertPrice = (amountInINR) => {
    if (amountInINR === null || amountInINR === undefined || isNaN(amountInINR)) return 0;
    const rate = activeCurrency.rateFromINR;
    return Math.round(Number(amountInINR) * rate);
  };

  /**
   * Format an amount given in base INR into a currency string
   * e.g. formatPrice(24999) -> "₹24,999" (INR) or "$300" (USD)
   */
  const formatPrice = (amountInINR, options = {}) => {
    if (amountInINR === null || amountInINR === undefined || isNaN(amountInINR)) {
      return `${activeCurrency.symbol}0`;
    }

    const isNegative = Number(amountInINR) < 0;
    const absVal = Math.abs(Number(amountInINR));
    const converted = Math.round(absVal * activeCurrency.rateFromINR);

    let formattedNum = converted.toLocaleString(activeCurrency.formatLocale || 'en-IN');
    if (options.showDecimals && activeCurrency.code !== 'JPY') {
      formattedNum = (absVal * activeCurrency.rateFromINR).toFixed(2);
    }

    const sign = isNegative ? '-' : '';
    return `${sign}${activeCurrency.symbol}${formattedNum}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        activeCurrency,
        convertPrice,
        formatPrice,
        currencies: Object.values(CURRENCIES),
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
