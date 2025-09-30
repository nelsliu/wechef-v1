const toFiniteNumber = (value: unknown): number => {
  const num = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
};

export const toNum = (value: unknown): number => toFiniteNumber(value);

export const safeMul = (a: unknown, b: unknown): number => {
  return toFiniteNumber(a) * toFiniteNumber(b);
};

export const safeDiv = (a: unknown, b: unknown): number => {
  const numerator = toFiniteNumber(a);
  const denominator = toFiniteNumber(b);
  if (denominator === 0) {
    return 0;
  }
  return numerator / denominator;
};

export const truncate = (value: unknown, decimals = 2): number => {
  const num = toFiniteNumber(value);
  const factor = 10 ** decimals;
  return Math.trunc(num * factor) / factor;
};

export const formatCurrency = (
  value: unknown,
  options: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD' }
): string => {
  const amount = toFiniteNumber(value);
  return new Intl.NumberFormat('en-US', options).format(amount);
};
