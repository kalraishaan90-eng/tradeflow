import { normalizePortfolio, STARTING_SIMULATED_CASH } from './tradingGuards.mjs';

const STORAGE_PREFIX = 'stockshadow_tradeflow';

export function getStorageKey(subKey, userId = 'active') {
  const safeId = typeof userId === 'string' && userId.length > 0 ? userId : 'active';
  return `${STORAGE_PREFIX}_${subKey}_${safeId}`;
}

export function loadStoredPortfolio(userIdOrFallback, maybeFallback) {
  let userId = 'active';
  let fallback = null;

  if (typeof userIdOrFallback === 'string') {
    userId = userIdOrFallback;
    fallback = maybeFallback || null;
  } else if (userIdOrFallback && typeof userIdOrFallback === 'object') {
    fallback = userIdOrFallback;
  }

  try {
    const raw = localStorage.getItem(getStorageKey('portfolio', userId));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return normalizePortfolio(parsed, fallback);
  } catch (err) {
    console.warn('Failed to parse portfolio from localStorage:', err);
    return fallback;
  }
}

export function saveStoredPortfolio(userIdOrPortfolio, maybePortfolio, maybeFallback) {
  let userId = 'active';
  let portfolio = null;
  let fallback = maybeFallback;

  if (typeof userIdOrPortfolio === 'string') {
    userId = userIdOrPortfolio;
    portfolio = maybePortfolio;
  } else if (userIdOrPortfolio && typeof userIdOrPortfolio === 'object') {
    portfolio = userIdOrPortfolio;
  }

  if (!portfolio) return;

  try {
    const normalized = normalizePortfolio(portfolio, fallback);
    localStorage.setItem(getStorageKey('portfolio', userId), JSON.stringify(normalized));
  } catch (err) {
    console.warn('Failed to save portfolio to localStorage:', err);
  }
}

export function loadStoredKyc(userId = 'active') {
  const safeId = typeof userId === 'string' ? userId : 'active';
  try {
    const raw = localStorage.getItem(getStorageKey('kyc', safeId));
    return raw === 'true';
  } catch {
    return false;
  }
}

export function saveStoredKyc(userIdOrStatus, maybeStatus) {
  let safeId = 'active';
  let status = false;

  if (typeof userIdOrStatus === 'boolean') {
    status = userIdOrStatus;
  } else if (typeof userIdOrStatus === 'string') {
    safeId = userIdOrStatus;
    status = !!maybeStatus;
  }

  try {
    localStorage.setItem(getStorageKey('kyc', safeId), status ? 'true' : 'false');
  } catch (err) {
    console.warn('Failed to save KYC to localStorage:', err);
  }
}

export function loadStoredPlan(userId = 'active') {
  const safeId = typeof userId === 'string' ? userId : 'active';
  try {
    const raw = localStorage.getItem(getStorageKey('plan', safeId));
    if (raw === 'pro' || raw === 'max') return raw;
    return 'free';
  } catch {
    return 'free';
  }
}

export function saveStoredPlan(userIdOrPlan, maybePlan) {
  let safeId = 'active';
  let plan = 'free';

  if (typeof userIdOrPlan === 'string' && (userIdOrPlan === 'free' || userIdOrPlan === 'pro' || userIdOrPlan === 'max')) {
    plan = userIdOrPlan;
  } else if (typeof userIdOrPlan === 'string') {
    safeId = userIdOrPlan;
    plan = maybePlan || 'free';
  }

  try {
    localStorage.setItem(getStorageKey('plan', safeId), plan || 'free');
  } catch (err) {
    console.warn('Failed to save plan to localStorage:', err);
  }
}

export function loadStoredGuestStatus() {
  try {
    return localStorage.getItem(`${STORAGE_PREFIX}_is_guest`) === 'true';
  } catch {
    return false;
  }
}

export function saveStoredGuestStatus(isGuest) {
  try {
    if (isGuest) {
      localStorage.setItem(`${STORAGE_PREFIX}_is_guest`, 'true');
    } else {
      localStorage.removeItem(`${STORAGE_PREFIX}_is_guest`);
    }
  } catch (err) {
    console.warn('Failed to save guest status to localStorage:', err);
  }
}

export const loadStoredGuestSession = loadStoredGuestStatus;
export const saveStoredGuestSession = saveStoredGuestStatus;
