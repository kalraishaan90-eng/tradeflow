export const STARTING_SIMULATED_CASH = 8000000;
export const MAX_SIMULATED_CASH = 20000000;
export const MAX_OPEN_ORDERS = 50;
export const MAX_ORDER_HISTORY = 100;
export const MAX_HISTORY_POINTS = 60;

const VALID_ORDER_TYPES = new Set(['BUY', 'SELL']);
const VALID_STATUSES = new Set(['FILLED', 'CANCELLED', 'REJECTED']);

function finiteNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function sanitizeSymbol(symbol) {
  return String(symbol || '')
    .replace(/[^a-zA-Z0-9 ._=/&:-]/g, '')
    .trim()
    .slice(0, 64);
}

function normalizeOrder(order, includeStatus = false) {
  if (!order || !VALID_ORDER_TYPES.has(order.type)) return null;

  const symbol = sanitizeSymbol(order.symbol);
  const shares = finiteNumber(order.shares);
  const price = finiteNumber(order.price);
  if (!symbol || !isValidTradeInput(shares, price)) return null;

  const normalized = {
    id: String(order.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    symbol,
    type: order.type,
    shares,
    price,
    orderType: String(order.orderType || 'Market').slice(0, 32),
    timestamp: String(order.timestamp || '').slice(0, 64),
  };

  if (includeStatus) {
    normalized.status = VALID_STATUSES.has(order.status) ? order.status : 'FILLED';
    if (Number.isFinite(Number(order.realizedPnL))) {
      normalized.realizedPnL = Number(Number(order.realizedPnL).toFixed(2));
    }
  }

  return normalized;
}

export function isValidTradeInput(quantity, price) {
  return Number.isInteger(Number(quantity))
    && Number(quantity) > 0
    && Number(quantity) <= 100000
    && Number.isFinite(Number(price))
    && Number(price) > 0;
}

export function clampDepositAmount(amount) {
  return clamp(Math.floor(finiteNumber(amount)), 0, MAX_SIMULATED_CASH);
}

export function getPendingBuyCommitments(portfolio = {}) {
  return (portfolio.orders || []).reduce((total, order) => {
    if (order?.type !== 'BUY') return total;
    const shares = finiteNumber(order.shares);
    const price = finiteNumber(order.price);
    return total + (shares > 0 && price > 0 ? shares * price : 0);
  }, 0);
}

export function getAvailableSharesForSell(portfolio = {}, symbol) {
  const target = sanitizeSymbol(symbol);
  const held = (portfolio.positions || [])
    .filter((position) => sanitizeSymbol(position.symbol) === target)
    .reduce((total, position) => total + Math.max(0, finiteNumber(position.shares)), 0);

  const committed = (portfolio.orders || [])
    .filter((order) => order?.type === 'SELL' && sanitizeSymbol(order.symbol) === target)
    .reduce((total, order) => total + Math.max(0, finiteNumber(order.shares)), 0);

  return Math.max(0, held - committed);
}

export function isLeaderboardEligible(portfolio = {}) {
  return portfolio.leaderboardEligible === true && finiteNumber(portfolio.cashDeposited) === 0;
}

export function normalizePortfolio(rawPortfolio = {}, fallback = {}) {
  const source = rawPortfolio && typeof rawPortfolio === 'object' ? rawPortfolio : {};
  const base = fallback && typeof fallback === 'object' ? fallback : {};

  const cashDeposited = clampDepositAmount(source.cashDeposited ?? base.cashDeposited ?? 0);

  const positions = Array.isArray(source.positions) ? source.positions : [];
  const normalizedPositions = positions
    .map((position) => {
      const symbol = sanitizeSymbol(position?.symbol);
      const shares = finiteNumber(position?.shares);
      const avgBuyPrice = finiteNumber(position?.avgBuyPrice);
      if (!symbol || shares <= 0 || avgBuyPrice <= 0) return null;
      return {
        symbol,
        shares,
        avgBuyPrice: Number(avgBuyPrice.toFixed(6)),
      };
    })
    .filter(Boolean)
    .slice(0, 100);

  const orders = (Array.isArray(source.orders) ? source.orders : [])
    .map((order) => normalizeOrder(order, false))
    .filter(Boolean)
    .slice(0, MAX_OPEN_ORDERS);

  const orderHistory = (Array.isArray(source.orderHistory) ? source.orderHistory : [])
    .map((order) => normalizeOrder(order, true))
    .filter(Boolean)
    .slice(-MAX_ORDER_HISTORY);

  const history = (Array.isArray(source.history) ? source.history : [])
    .map((point) => {
      const value = finiteNumber(point?.value, Number.NaN);
      return Number.isFinite(value) && value > 0 ? { value: Number(value.toFixed(2)) } : null;
    })
    .filter(Boolean)
    .slice(-MAX_HISTORY_POINTS);

  return {
    balance: Number(clamp(finiteNumber(source.balance ?? base.balance, STARTING_SIMULATED_CASH), 0, MAX_SIMULATED_CASH).toFixed(2)),
    positions: normalizedPositions,
    totalPnL: Number(finiteNumber(source.totalPnL ?? base.totalPnL).toFixed(2)),
    realizedPnL: Number(finiteNumber(source.realizedPnL ?? base.realizedPnL).toFixed(2)),
    todayPnL: Number(finiteNumber(source.todayPnL ?? base.todayPnL).toFixed(2)),
    todayPnLPercent: Number(finiteNumber(source.todayPnLPercent ?? base.todayPnLPercent).toFixed(2)),
    history,
    orders,
    orderHistory,
    cashDeposited,
    leaderboardEligible: source.leaderboardEligible === true && cashDeposited === 0,
  };
}
