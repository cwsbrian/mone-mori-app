const CURRENCY_SYMBOLS: { [key: string]: string } = {
  CAD: 'CA$',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CNY: '¥',
  INR: '₹',
  KRW: '₩',
};

export const formatCurrency = (amount: number, currency: string = 'CAD'): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || currency;
  
  // Format with commas and 2 decimal places
  const formatted = Math.abs(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `${symbol}${formatted}`;
};

export const formatAmount = (amount: number, type: 'income' | 'expense', currency: string = 'CAD'): string => {
  const formatted = formatCurrency(amount, currency);
  return type === 'expense' ? `-${formatted}` : `+${formatted}`;
};

export const getCurrencySymbol = (currency: string): string => {
  return CURRENCY_SYMBOLS[currency] || currency;
};

export const parseCurrencyInput = (input: string): number => {
  // Remove all non-numeric characters except decimal point
  const cleaned = input.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

