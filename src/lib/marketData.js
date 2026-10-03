// StockShadow Market Data Layer
// ============================
// Multi-source real-time data with graceful fallback:
// 1. Yahoo Finance (via Vite proxy /api/yahoo, with CORS proxy fallbacks)
// 2. CoinGecko (crypto, no key, CORS-enabled)
// 3. Alpha Vantage (stocks/forex, free tier, optional key)
// 4. Realistic fallback walk

const ALPHA_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || '';

// Primary proxy endpoints
const PROXY_CANDIDATES = [
  '/api/yahoo', // Vite dev proxy
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url='
];

// Symbol mappings
const COINGECKO_MAP = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
  'DOGE': 'dogecoin',
  'ADA': 'cardano',
  'BNB': 'binancecoin',
  'BTC-USD': 'bitcoin',
  'ETH-USD': 'ethereum',
  'SOL-USD': 'solana',
  'DOGE-USD': 'dogecoin',
  'ADA-USD': 'cardano',
  'BNB-USD': 'binancecoin',
};

const YAHOO_MAP = {
  'AAPL': 'AAPL',
  'TSLA': 'TSLA',
  'NVDA': 'NVDA',
  'MSFT': 'MSFT',
  'AMZN': 'AMZN',
  'GOOGL': 'GOOGL',
  'META': 'META',
  'NFLX': 'NFLX',
  'EURUSD=X': 'EURUSD=X',
  'GBPUSD=X': 'GBPUSD=X',
  'USDJPY=X': 'USDJPY=X',
  'USDINR=X': 'USDINR=X',
  'GBPINR=X': 'GBPINR=X',
  'EURINR=X': 'EURINR=X',
  'JPYINR=X': 'JPYINR=X',
  'AUDUSD=X': 'AUDUSD=X',
  'USDCAD=X': 'USDCAD=X',
  'BTC-USD': 'BTC-USD',
  'ETH-USD': 'ETH-USD',
  'SOL-USD': 'SOL-USD',
  'DOGE-USD': 'DOGE-USD',
  'ADA-USD': 'ADA-USD',
  'BNB-USD': 'BNB-USD',
  'RELIANCE.NS': 'RELIANCE.NS',
  'TCS.NS': 'TCS.NS',
  'HDFCBANK.NS': 'HDFCBANK.NS',
  'INFY.NS': 'INFY.NS',
  'ICICIBANK.NS': 'ICICIBANK.NS',
  'HINDUNILVR.NS': 'HINDUNILVR.NS',
  'ITC.NS': 'ITC.NS',
  'SBIN.NS': 'SBIN.NS',
};

export function formatVolume(val) {
  if (!val) return 'N/A';
  if (val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
  if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
  if (val >= 1e3) return (val / 1e3).toFixed(1) + 'K';
  return val.toString();
}

async function fetchWithProxyFallback(yahooPath) {
  // 1. Try local Vite dev proxy first
  try {
    const res = await fetch(`/api/yahoo${yahooPath}`, { cache: 'no-store' });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Continue to external proxies
  }

  // 2. Try external proxies
  const directUrl = `https://query1.finance.yahoo.com${yahooPath}`;
  const externalProxies = [
    `https://corsproxy.io/?${encodeURIComponent(directUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`
  ];

  for (const proxyUrl of externalProxies) {
    try {
      const res = await fetch(proxyUrl, { cache: 'no-store' });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      // try next proxy
    }
  }
  return null;
}

// ─── Yahoo Finance Quote via v8 Chart Meta ─────────────────────────
export async function fetchSingleYahooQuote(symbol) {
  try {
    const data = await fetchWithProxyFallback(`/v8/finance/chart/${symbol}?interval=1d&range=1d`);
    const meta = data?.chart?.result?.[0]?.meta;
    if (!meta || meta.regularMarketPrice == null) return null;

    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose || price;
    const changePercent = meta.regularMarketChangePercent != null 
      ? meta.regularMarketChangePercent 
      : ((price - prevClose) / prevClose) * 100;

    return {
      price: price,
      changePercent: parseFloat(changePercent.toFixed(2)),
      volume: meta.regularMarketVolume ? formatVolume(meta.regularMarketVolume) : 'N/A',
      high: meta.regularMarketDayHigh || (price * 1.015),
      low: meta.regularMarketDayLow || (price * 0.985),
      prevClose: prevClose,
      source: 'yahoo',
    };
  } catch (e) {
    return null;
  }
}

export async function fetchYahooQuotes(symbols) {
  const out = {};
  const promises = symbols.map(async (s) => {
    const yahooSym = YAHOO_MAP[s] || s;
    const quote = await fetchSingleYahooQuote(yahooSym);
    if (quote) {
      out[s] = quote;
    }
  });

  await Promise.all(promises);
  return out;
}

// ─── Yahoo Chart History (OHLC) ─────────────────────────────────────
export async function fetchYahooChart(symbol, interval = '15m') {
  try {
    // First try 1d range for current day intraday
    let data = await fetchWithProxyFallback(`/v8/finance/chart/${symbol}?interval=${interval}&range=1d`);
    let result = data?.chart?.result?.[0];

    // If no timestamps (e.g. weekend or market closed), fetch 5d to get last active trading session
    if (!result?.timestamp || result.timestamp.length === 0) {
      data = await fetchWithProxyFallback(`/v8/finance/chart/${symbol}?interval=${interval}&range=5d`);
      result = data?.chart?.result?.[0];
    }

    if (!result || !result.timestamp) return null;

    const { timestamp, indicators } = result;
    const quote = indicators?.quote?.[0];
    if (!quote) return null;

    const validBars = [];
    for (let i = 0; i < timestamp.length; i++) {
      if (
        quote.open[i] != null &&
        quote.high[i] != null &&
        quote.low[i] != null &&
        quote.close[i] != null
      ) {
        validBars.push({
          time: timestamp[i],
          open: parseFloat(quote.open[i].toFixed(2)),
          high: parseFloat(quote.high[i].toFixed(2)),
          low: parseFloat(quote.low[i].toFixed(2)),
          close: parseFloat(quote.close[i].toFixed(2)),
        });
      }
    }

    // Keep the most recent 35-40 candles for a clean sparkline/overview
    return validBars.length > 40 ? validBars.slice(-40) : validBars;
  } catch (e) {
    console.warn('Yahoo chart fetch failed:', e.message);
    return null;
  }
}

// ─── CoinGecko Crypto ───────────────────────────────────────────────
export async function fetchCoinGeckoPrices(symbols) {
  const ids = symbols.map(s => COINGECKO_MAP[s]).filter(Boolean).join(',');
  if (!ids) return {};
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true`
    );
    if (!res.ok) throw new Error('CoinGecko error');
    const data = await res.json();
    const out = {};
    for (const [sym, id] of Object.entries(COINGECKO_MAP)) {
      if (data[id]) {
        out[sym] = {
          price: data[id].usd,
          changePercent: parseFloat((data[id].usd_24h_change || 0).toFixed(2)),
          volume: 'N/A',
          source: 'coingecko',
        };
      }
    }
    return out;
  } catch (e) {
    console.warn('CoinGecko failed:', e.message);
    return {};
  }
}

// ─── Alpha Vantage (stocks, requires key) ───────────────────────────
export async function fetchAlphaVantageQuote(symbol) {
  if (!ALPHA_KEY) return null;
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_KEY}`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    const q = data['Global Quote'];
    if (!q) return null;
    return {
      price: parseFloat(q['05. price']),
      changePercent: parseFloat(q['10. change percent'].replace('%', '')),
      volume: formatVolume(parseInt(q['06. volume'])),
      source: 'alphavantage',
    };
  } catch (e) {
    console.warn('Alpha Vantage failed:', e.message);
    return null;
  }
}

// ─── Unified fetch for a batch of symbols ───────────────────────────
export async function fetchLiveQuotes(symbols, typeMap = {}) {
  let results = {};

  // Try Yahoo first for all symbols (stocks, forex, crypto)
  try {
    const yh = await fetchYahooQuotes(symbols);
    results = { ...results, ...yh };
  } catch (e) {
    console.warn('Yahoo batch fetch failed:', e);
  }

  // Supplement missing crypto from CoinGecko
  const missingCrypto = symbols.filter(s => typeMap[s] === 'Crypto' && !results[s]);
  if (missingCrypto.length) {
    const cg = await fetchCoinGeckoPrices(missingCrypto);
    results = { ...results, ...cg };
  }

  return results;
}

// ─── Mock tick fallback (realistic random walk) ───────────────────────
export function mockTick(current, type = 'Stock') {
  const volatility =
    type === 'Crypto' ? 0.004 :
    type === 'Stock' ? 0.0015 :
    0.0004;
  const change = (Math.random() - 0.49) * volatility;
  return current * (1 + change);
}

// ─── Generate realistic mock OHLC fallback aligned to session ─────────
export function generateMockOHLC(basePrice, count = 30, intervalSec = 900) {
  const points = [];
  // Use last closed session time or recent hour
  const now = Math.floor(Date.now() / 1000);
  let currentPrice = basePrice * 0.99;
  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * intervalSec;
    const target = basePrice;
    currentPrice += (target - currentPrice) * 0.15 + (Math.random() - 0.49) * (basePrice * 0.003);
    const open = currentPrice;
    const close = open + (Math.random() - 0.5) * (basePrice * 0.002);
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.0015);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.0015);
    points.push({ 
      time, 
      open: parseFloat(open.toFixed(2)), 
      high: parseFloat(high.toFixed(2)), 
      low: parseFloat(low.toFixed(2)), 
      close: parseFloat(close.toFixed(2)) 
    });
    currentPrice = close;
  }
  return points;
}
