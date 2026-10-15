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
  'BHARTIARTL.NS': 'BHARTIARTL.NS',
  'LT.NS': 'LT.NS',
  'TATAMOTORS.NS': 'TATAMOTORS.NS',
  'SUNPHARMA.NS': 'SUNPHARMA.NS',
  'BAJFINANCE.NS': 'BAJFINANCE.NS',
  'ASIANPAINT.NS': 'ASIANPAINT.NS',
  'MARUTI.NS': 'MARUTI.NS',
  'TITAN.NS': 'TITAN.NS',
  'M&M.NS': 'M&M.NS',
  'ADANIENT.NS': 'ADANIENT.NS',
  'WIPRO.NS': 'WIPRO.NS',
  'ZOMATO.NS': 'ZOMATO.NS',
  'JIOFIN.NS': 'JIOFIN.NS',
  'NTPC.NS': 'NTPC.NS',
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
    const res = await fetch(`/api/yahoo${yahooPath}`, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Continue to external proxies
  }

  // 2. Try external proxies with fast timeouts
  const directUrl = `https://query1.finance.yahoo.com${yahooPath}`;
  const externalProxies = [
    `https://corsproxy.io/?${encodeURIComponent(directUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(directUrl)}`
  ];

  for (const proxyUrl of externalProxies) {
    try {
      const res = await fetch(proxyUrl, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
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
export async function fetchYahooChart(symbol, range = '3mo', interval = null) {
  try {
    const yahooSym = YAHOO_MAP[symbol] || symbol;

    // Professional timeframe-to-interval mapping matching Yahoo Finance & TradingView
    let queryInterval = interval;
    if (!queryInterval) {
      if (range === '1d') queryInterval = '5m';
      else if (range === '5d') queryInterval = '15m';
      else if (range === '1mo') queryInterval = '1d';
      else if (range === '3mo') queryInterval = '1d';
      else if (range === '6mo') queryInterval = '1d';
      else if (range === '1y') queryInterval = '1d';
      else if (range === 'max') queryInterval = '1wk';
      else queryInterval = '1d';
    }

    let data = await fetchWithProxyFallback(`/v8/finance/chart/${yahooSym}?interval=${queryInterval}&range=${range}`);
    let result = data?.chart?.result?.[0];

    // If no timestamps, fallback to 1y with 1d interval
    if (!result?.timestamp || result.timestamp.length === 0) {
      data = await fetchWithProxyFallback(`/v8/finance/chart/${yahooSym}?interval=1d&range=1y`);
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
        const rawOpen = quote.open[i];
        const rawHigh = quote.high[i];
        const rawLow = quote.low[i];
        const rawClose = quote.close[i];

        // Dynamic precision preserving micro-cap crypto (ADA, XRP) and forex pips
        const ref = rawClose || rawOpen;
        const decimals = ref < 1 ? 4 : ref < 10 ? 3 : 2;

        validBars.push({
          time: timestamp[i],
          open: Number(rawOpen.toFixed(decimals)),
          high: Number(rawHigh.toFixed(decimals)),
          low: Number(rawLow.toFixed(decimals)),
          close: Number(rawClose.toFixed(decimals)),
        });
      }
    }

    // Return the complete real-time dataset for the requested timeframe
    return validBars.length > 0 ? validBars : null;
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

export function generateMockOHLC(basePrice, count = 40, intervalSec = 900) {
  const points = [];
  const now = Math.floor(Date.now() / 1000);
  const decimals = basePrice < 1 ? 4 : basePrice < 10 ? 3 : 2;

  // Realistic market volatility depending on asset tier
  const volFactor = basePrice < 1 ? 0.016 : basePrice < 50 ? 0.009 : 0.005;
  let currentPrice = basePrice * (0.98 + (Math.random() - 0.5) * 0.02);

  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * intervalSec;
    // Mean-reversion pull towards current basePrice so mock data stays anchored to live price
    const pull = (basePrice - currentPrice) * 0.08;
    const step = (Math.random() - 0.49) * (basePrice * volFactor);
    currentPrice += pull + step;

    const open = currentPrice;
    // Minimum candle height so candles never collapse into zero-thickness flat lines
    const minHeight = Math.max(Math.pow(10, -decimals), basePrice * 0.001);
    const bodyDelta = (Math.random() - 0.49) * (basePrice * volFactor * 0.95);
    const close = Math.abs(bodyDelta) < minHeight 
      ? open + (bodyDelta >= 0 ? minHeight : -minHeight)
      : open + bodyDelta;

    const wickTop = Math.random() * (basePrice * volFactor * 0.5) + minHeight * 0.5;
    const wickBottom = Math.random() * (basePrice * volFactor * 0.5) + minHeight * 0.5;

    const high = Math.max(open, close) + wickTop;
    const low = Math.max(0.0001, Math.min(open, close) - wickBottom);

    points.push({ 
      time, 
      open: Number(open.toFixed(decimals)), 
      high: Number(high.toFixed(decimals)), 
      low: Number(low.toFixed(decimals)), 
      close: Number(close.toFixed(decimals)) 
    });
    currentPrice = close;
  }
  return points;
}
