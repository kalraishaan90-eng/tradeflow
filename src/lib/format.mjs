// Shared currency & number formatting for StockShadow.
// The simulator economy is INR (₹) end-to-end — every tab must use these
// helpers instead of ad-hoc Intl.NumberFormat('en-US', USD) calls.

const inr2 = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const inr0 = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** ₹1,234.56 — default money formatter (2 decimals). */
export function formatINR(val) {
  return inr2.format(Number(val) || 0);
}

/** ₹1,235 — whole-rupee money (mutual funds, large sums). */
export function formatINR0(val) {
  return inr0.format(Number(val) || 0);
}

/** 1,234.56 — plain number with grouping, no symbol. */
export function formatNumber(val, decimals = 2) {
  return (Number(val) || 0).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Signed P&L: +₹123.00 / -₹45.00 (sign from the value itself). */
export function formatPnL(val) {
  const n = Number(val) || 0;
  return `${n >= 0 ? '+' : '-'}${formatINR(Math.abs(n))}`;
}
