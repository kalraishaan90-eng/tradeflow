import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Loader, 
  Zap, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Sliders, 
  Maximize2,
  DollarSign
} from 'lucide-react';
import { fetchYahooQuotes, fetchYahooChart, formatVolume, generateMockOHLC } from '../lib/marketData.js';

const CandlestickChart = lazy(() => import('./CandlestickChart.jsx'));

// Market assets config with expanded Indian blue-chip & growth companies (Flaw 8)
const MARKET_ASSETS_CONFIG = {
  stocks: {
    'RELIANCE.NS': { name: 'Reliance Industries', defaultPrice: 1167.70, volume: '16.7M', defaultHigh: 1183.90, defaultLow: 1160.80, defaultChange: -1.63, prevClose: 1187.00 },
    'TCS.NS': { name: 'Tata Consultancy Services', defaultPrice: 2075.00, volume: '3.4M', defaultHigh: 2093.90, defaultLow: 2045.10, defaultChange: 1.19, prevClose: 2050.60 },
    'HDFCBANK.NS': { name: 'HDFC Bank', defaultPrice: 721.20, volume: '37.1M', defaultHigh: 721.30, defaultLow: 707.10, defaultChange: 1.76, prevClose: 708.70 },
    'INFY.NS': { name: 'Infosys Ltd.', defaultPrice: 1035.00, volume: '15.1M', defaultHigh: 1035.00, defaultLow: 999.15, defaultChange: 4.11, prevClose: 994.10 },
    'ICICIBANK.NS': { name: 'ICICI Bank', defaultPrice: 1310.60, volume: '13.0M', defaultHigh: 1329.90, defaultLow: 1308.40, defaultChange: -0.84, prevClose: 1321.70 },
    'HINDUNILVR.NS': { name: 'Hindustan Unilever', defaultPrice: 1836.00, volume: '1.3M', defaultHigh: 1873.60, defaultLow: 1826.90, defaultChange: -2.29, prevClose: 1879.10 },
    'ITC.NS': { name: 'ITC Ltd.', defaultPrice: 255.90, volume: '16.4M', defaultHigh: 262.70, defaultLow: 254.65, defaultChange: -2.61, prevClose: 262.75 },
    'SBIN.NS': { name: 'State Bank of India', defaultPrice: 954.10, volume: '7.4M', defaultHigh: 965.40, defaultLow: 945.80, defaultChange: -0.56, prevClose: 959.50 },
    'BHARTIARTL.NS': { name: 'Bharti Airtel', defaultPrice: 1645.50, volume: '8.2M', defaultHigh: 1658.00, defaultLow: 1632.00, defaultChange: 0.85, prevClose: 1631.60 },
    'LT.NS': { name: 'Larsen & Toubro', defaultPrice: 3620.00, volume: '2.8M', defaultHigh: 3645.00, defaultLow: 3585.00, defaultChange: 1.42, prevClose: 3569.30 },
    'TATAMOTORS.NS': { name: 'Tata Motors', defaultPrice: 925.30, volume: '14.5M', defaultHigh: 938.00, defaultLow: 918.50, defaultChange: -0.72, prevClose: 932.00 },
    'SUNPHARMA.NS': { name: 'Sun Pharma', defaultPrice: 1890.00, volume: '3.1M', defaultHigh: 1905.00, defaultLow: 1872.00, defaultChange: 0.45, prevClose: 1881.50 },
    'BAJFINANCE.NS': { name: 'Bajaj Finance', defaultPrice: 7150.00, volume: '1.9M', defaultHigh: 7240.00, defaultLow: 7110.00, defaultChange: -1.15, prevClose: 7233.00 },
    'ASIANPAINT.NS': { name: 'Asian Paints', defaultPrice: 2840.00, volume: '2.4M', defaultHigh: 2865.00, defaultLow: 2820.00, defaultChange: 0.32, prevClose: 2831.00 },
    'MARUTI.NS': { name: 'Maruti Suzuki', defaultPrice: 12480.00, volume: '0.8M', defaultHigh: 12560.00, defaultLow: 12340.00, defaultChange: 1.05, prevClose: 12350.00 },
    'TITAN.NS': { name: 'Titan Company', defaultPrice: 3450.00, volume: '1.5M', defaultHigh: 3485.00, defaultLow: 3430.00, defaultChange: -0.38, prevClose: 3463.00 },
    'M&M.NS': { name: 'Mahindra & Mahindra', defaultPrice: 3080.00, volume: '4.1M', defaultHigh: 3110.00, defaultLow: 3040.00, defaultChange: 2.15, prevClose: 3015.00 },
    'ADANIENT.NS': { name: 'Adani Enterprises', defaultPrice: 2960.00, volume: '5.3M', defaultHigh: 3015.00, defaultLow: 2940.00, defaultChange: -1.40, prevClose: 3002.00 },
    'WIPRO.NS': { name: 'Wipro Ltd.', defaultPrice: 540.20, volume: '9.8M', defaultHigh: 546.00, defaultLow: 536.00, defaultChange: 0.65, prevClose: 536.70 },
    'ZOMATO.NS': { name: 'Zomato Ltd.', defaultPrice: 275.40, volume: '38.5M', defaultHigh: 281.50, defaultLow: 268.00, defaultChange: 3.20, prevClose: 266.85 },
    'JIOFIN.NS': { name: 'Jio Financial Services', defaultPrice: 335.60, volume: '21.0M', defaultHigh: 341.00, defaultLow: 331.00, defaultChange: 1.80, prevClose: 329.65 },
    'NTPC.NS': { name: 'NTPC Ltd.', defaultPrice: 412.50, volume: '11.2M', defaultHigh: 416.80, defaultLow: 409.20, defaultChange: 0.90, prevClose: 408.80 }
  },
  forex: {
    'USDINR=X': { name: 'USD / INR', defaultPrice: 96.30, volume: '2.5 pips', defaultHigh: 96.35, defaultLow: 96.25, defaultChange: -0.01, prevClose: 96.31 },
    'GBPINR=X': { name: 'GBP / INR', defaultPrice: 127.51, volume: '3.2 pips', defaultHigh: 127.70, defaultLow: 127.10, defaultChange: 0.37, prevClose: 127.04 },
    'EURINR=X': { name: 'EUR / INR', defaultPrice: 108.35, volume: '2.8 pips', defaultHigh: 108.50, defaultLow: 108.10, defaultChange: 0.02, prevClose: 108.32 },
    'JPYINR=X': { name: 'JPY / INR', defaultPrice: 0.6340, volume: '1.8 pips', defaultHigh: 0.6370, defaultLow: 0.6310, defaultChange: -0.15, prevClose: 0.6350 },
    'EURUSD=X': { name: 'EUR / USD', defaultPrice: 1.1257, volume: '1.2 pips', defaultHigh: 1.1288, defaultLow: 1.1225, defaultChange: 0.11, prevClose: 1.1244 },
    'GBPUSD=X': { name: 'GBP / USD', defaultPrice: 1.3240, volume: '1.8 pips', defaultHigh: 1.3256, defaultLow: 1.3183, defaultChange: 0.35, prevClose: 1.3193 }
  },
  crypto: {
    'BTC-USD': { name: 'Bitcoin USD', defaultPrice: 84516.00, volume: '42.0B', defaultHigh: 84713.00, defaultLow: 84434.00, defaultChange: -2.44, prevClose: 86632.00 },
    'ETH-USD': { name: 'Ethereum USD', defaultPrice: 2673.70, volume: '18.0B', defaultHigh: 2682.00, defaultLow: 2665.00, defaultChange: -2.48, prevClose: 2741.80 },
    'SOL-USD': { name: 'Solana USD', defaultPrice: 119.00, volume: '4.2B', defaultHigh: 119.38, defaultLow: 118.56, defaultChange: -3.60, prevClose: 123.40 },
    'DOGE-USD': { name: 'Dogecoin USD', defaultPrice: 0.1650, volume: '1.2B', defaultHigh: 0.1680, defaultLow: 0.1610, defaultChange: -1.20, prevClose: 0.1670 },
    'ADA-USD': { name: 'Cardano USD', defaultPrice: 0.4250, volume: '420M', defaultHigh: 0.4320, defaultLow: 0.4180, defaultChange: -0.85, prevClose: 0.4285 },
    'BNB-USD': { name: 'BNB USD', defaultPrice: 625.00, volume: '1.8B', defaultHigh: 630.00, defaultLow: 618.00, defaultChange: -1.10, prevClose: 632.00 }
  }
};

function mapToSimSymbol(symbol) {
  if (symbol === 'BTC-USD') return 'BTC';
  if (symbol === 'ETH-USD') return 'ETH';
  if (symbol === 'SOL-USD') return 'SOL';
  if (symbol === 'DOGE-USD') return 'DOGE';
  if (symbol === 'ADA-USD') return 'ADA';
  if (symbol === 'BNB-USD') return 'BNB';
  return symbol;
}

export default function MarketTab({ 
  watchlist, 
  portfolio, 
  executeTrade,
  selectedAssetSymbol,
  setSelectedAssetSymbol
}) {
  const [marketFilter, setMarketFilter] = useState('stocks'); // 'stocks', 'forex', 'crypto'
  const [sortBy, setSortBy] = useState('gainers'); // 'gainers', 'losers', 'volume'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSymbol, setExpandedSymbol] = useState('RELIANCE.NS'); // default expand first
  const [chartTimeframe, setChartTimeframe] = useState('3mo'); // '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | 'max'
  
  // Market quotes prices in component state
  const [prices, setPrices] = useState(() => {
    const initial = {};
    Object.keys(MARKET_ASSETS_CONFIG).forEach(cat => {
      Object.keys(MARKET_ASSETS_CONFIG[cat]).forEach(symbol => {
        const item = MARKET_ASSETS_CONFIG[cat][symbol];
        initial[symbol] = {
          price: item.defaultPrice,
          change: item.defaultChange !== undefined ? item.defaultChange : 0.0,
          volume: item.volume,
          spread: cat === 'forex' ? (1.0 + Math.random() * 1.5).toFixed(1) + ' pips' : '0.0 pips',
          high: item.defaultHigh || (item.defaultPrice * 1.015),
          low: item.defaultLow || (item.defaultPrice * 0.985),
          prevClose: item.prevClose || item.defaultPrice,
          lastTickTime: 0
        };
      });
    });
    return initial;
  });

  const [tickChanges, setTickChanges] = useState({});

  // Deep Historical Candlestick Chart state (Flaw 6)
  const [historicalData, setHistoricalData] = useState({});
  const [loadingCharts, setLoadingCharts] = useState({});

  // Inline Order Execution State (Flaw 3: right alongside the graph!)
  const [orderSide, setOrderSide] = useState('BUY'); // 'BUY' | 'SELL'
  const [orderStyle, setOrderStyle] = useState('Market'); // 'Market' | 'Limit'
  const [sharesInput, setSharesInput] = useState(10);
  const [limitPrice, setLimitPrice] = useState('');
  const [tradeToast, setTradeToast] = useState(null);

  // Tabs ref
  const tabsRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({});

  useEffect(() => {
    if (tabsRef.current) {
      const activeBtn = tabsRef.current.querySelector('.m-filter-btn.active');
      if (activeBtn) {
        setUnderlineStyle({
          left: `${activeBtn.offsetLeft}px`,
          width: `${activeBtn.offsetWidth}px`
        });
      }
    }
  }, [marketFilter]);

  // If selectedAssetSymbol changed externally (e.g. from Home watchlist or AI signal), auto-expand
  useEffect(() => {
    if (selectedAssetSymbol) {
      let found = null;
      Object.keys(MARKET_ASSETS_CONFIG).forEach(cat => {
        Object.keys(MARKET_ASSETS_CONFIG[cat]).forEach(sym => {
          if (sym === selectedAssetSymbol || mapToSimSymbol(sym) === selectedAssetSymbol) {
            found = { sym, cat };
          }
        });
      });
      if (found) {
        setMarketFilter(found.cat);
        setExpandedSymbol(found.sym);
        loadDeepChart(found.sym, chartTimeframe);
      }
    }
  }, [selectedAssetSymbol]);

  // Live stream quotes from Yahoo Finance
  useEffect(() => {
    let isMounted = true;
    const fetchQuotes = async () => {
      const symbolsList = [];
      Object.keys(MARKET_ASSETS_CONFIG).forEach(cat => {
        Object.keys(MARKET_ASSETS_CONFIG[cat]).forEach(symbol => {
          symbolsList.push(symbol);
        });
      });

      try {
        const quotes = await fetchYahooQuotes(symbolsList);
        if (!isMounted) return;

        if (quotes && Object.keys(quotes).length > 0) {
          const nextTickChanges = {};
          setPrices(prev => {
            const next = { ...prev };
            Object.keys(quotes).forEach(symbol => {
              const q = quotes[symbol];
              if (!q || q.price == null) return;
              const prevItem = prev[symbol];
              if (prevItem) {
                if (q.price > prevItem.price) nextTickChanges[symbol] = 'up';
                else if (q.price < prevItem.price) nextTickChanges[symbol] = 'down';
              }
              next[symbol] = {
                ...prevItem,
                price: q.price,
                change: q.changePercent,
                volume: q.volume !== 'N/A' ? q.volume : (prevItem?.volume || 'N/A'),
                high: q.high || (prevItem?.high || q.price * 1.015),
                low: q.low || (prevItem?.low || q.price * 0.985),
                prevClose: q.prevClose || (prevItem?.prevClose || q.price),
                lastTickTime: Date.now()
              };
            });
            return next;
          });
          setTickChanges(nextTickChanges);
        }
      } catch (err) {
        console.warn('Quotes stream glitch:', err);
      }
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch maximum depth chart data (Flaw 6)
  const loadDeepChart = async (symbol, range) => {
    setLoadingCharts(prev => ({ ...prev, [symbol]: true }));
    try {
      const ohlc = await fetchYahooChart(symbol, range);
      if (ohlc && ohlc.length >= 5) {
        setHistoricalData(prev => ({ ...prev, [symbol]: ohlc }));
      } else {
        const base = prices[symbol]?.price || 100;
        const count = range === '1d' ? 78 : range === '5d' ? 120 : range === '1mo' ? 30 : range === '3mo' ? 85 : range === '6mo' ? 130 : 250;
        const intervalSec = (range === '1d' || range === '5d') ? 900 : 86400;
        setHistoricalData(prev => ({ ...prev, [symbol]: generateMockOHLC(base, count, intervalSec) }));
      }
    } catch (err) {
      const base = prices[symbol]?.price || 100;
      const count = range === '1d' ? 78 : range === '5d' ? 120 : range === '1mo' ? 30 : range === '3mo' ? 85 : range === '6mo' ? 130 : 250;
      const intervalSec = (range === '1d' || range === '5d') ? 900 : 86400;
      setHistoricalData(prev => ({ ...prev, [symbol]: generateMockOHLC(base, count, intervalSec) }));
    } finally {
      setLoadingCharts(prev => ({ ...prev, [symbol]: false }));
    }
  };

  // Toggle row accordion and ensure max chart data is loaded
  const toggleRow = (symbol) => {
    if (expandedSymbol === symbol) {
      setExpandedSymbol(null);
      return;
    }
    setExpandedSymbol(symbol);
    if (setSelectedAssetSymbol) {
      setSelectedAssetSymbol(mapToSimSymbol(symbol));
    }
    loadDeepChart(symbol, chartTimeframe);
  };

  // Timeframe change handler
  const handleTimeframeChange = (tf) => {
    setChartTimeframe(tf);
    if (expandedSymbol) {
      loadDeepChart(expandedSymbol, tf);
    }
  };

  // Initial load for default expanded symbol
  useEffect(() => {
    if (expandedSymbol && !historicalData[expandedSymbol]) {
      loadDeepChart(expandedSymbol, chartTimeframe);
    }
  }, [expandedSymbol]);

  // Sort and filter logic
  const getSortedAndFilteredAssets = () => {
    const config = MARKET_ASSETS_CONFIG[marketFilter] || {};
    let list = Object.keys(config).map(symbol => ({
      symbol,
      name: config[symbol].name,
      ...prices[symbol]
    }));

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => 
        a.symbol.toLowerCase().includes(q) || 
        a.name.toLowerCase().includes(q) ||
        mapToSimSymbol(a.symbol).toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'gainers') return b.change - a.change;
      if (sortBy === 'losers') return a.change - b.change;
      if (sortBy === 'volume') {
        const getVal = (str) => {
          if (!str || str === 'N/A') return 0;
          const parsed = parseFloat(str);
          if (str.endsWith('B')) return parsed * 1e9;
          if (str.endsWith('M')) return parsed * 1e6;
          if (str.endsWith('K')) return parsed * 1e3;
          return parsed;
        };
        return getVal(b.volume) - getVal(a.volume);
      }
      return 0;
    });

    return list;
  };

  // Instant execution handler directly inside the graph area (Flaw 3)
  const handleExecuteInlineTrade = (symbol) => {
    const simSymbol = mapToSimSymbol(symbol);
    const assetPrice = prices[symbol]?.price || 100;
    const executionPrice = orderStyle === 'Limit' ? (Number(limitPrice) || assetPrice) : assetPrice;
    const qty = Math.floor(Number(sharesInput));

    if (qty <= 0) {
      alert("Please enter a positive whole number quantity.");
      return;
    }

    const success = executeTrade(simSymbol, orderSide, qty, executionPrice, orderStyle);
    if (success) {
      setTradeToast({
        symbol: simSymbol,
        side: orderSide,
        qty,
        price: executionPrice,
        style: orderStyle
      });
      setTimeout(() => setTradeToast(null), 4500);
    }
  };

  const assetsToRender = getSortedAndFilteredAssets();

  // Timeframe labels
  const timeframes = [
    { key: '1d', label: '1D' },
    { key: '5d', label: '5D' },
    { key: '1mo', label: '1M' },
    { key: '3mo', label: '3M' },
    { key: '6mo', label: '6M' },
    { key: '1y', label: '1Y' },
    { key: 'max', label: 'MAX' },
  ];

  return (
    <div className="market-layout">
      {/* Toast Notification */}
      {tradeToast && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'rgba(24, 24, 29, 0.92)',
          backdropFilter: 'blur(28px) saturate(200%)',
          WebkitBackdropFilter: 'blur(28px) saturate(200%)',
          border: '1px solid rgba(243, 236, 224, 0.15)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.65), 0 0 24px rgba(128, 174, 232, 0.15), inset 0 1px 0 rgba(255,255,255,0.12)',
          borderRadius: '9999px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: tradeToast.side === 'BUY' ? 'rgba(46, 75, 47, 0.35)' : 'rgba(91, 0, 21, 0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={18} color={tradeToast.side === 'BUY' ? 'var(--color-jade)' : 'var(--color-rose)'} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
              Simulated {tradeToast.side} Filled!
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              {tradeToast.qty} shares of {tradeToast.symbol} @ ₹{tradeToast.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      )}

      {/* Header Search and Category Filters */}
      <div className="market-header-controls glassy-card">
        {/* Search */}
        <div className="market-search-wrapper">
          <Search className="market-search-icon" />
          <input 
            type="text" 
            placeholder="Search 25+ companies, forex pairs or cryptos..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tab Filters */}
        <div className="market-filter-container">
          <div className="market-filter-tabs" ref={tabsRef}>
            <button 
              className={`m-filter-btn ${marketFilter === 'stocks' ? 'active' : ''}`}
              onClick={() => { setMarketFilter('stocks'); setExpandedSymbol(null); }}
            >
              Indian Stocks ({Object.keys(MARKET_ASSETS_CONFIG.stocks).length})
            </button>
            <button 
              className={`m-filter-btn ${marketFilter === 'forex' ? 'active' : ''}`}
              onClick={() => { setMarketFilter('forex'); setExpandedSymbol(null); }}
            >
              Forex ({Object.keys(MARKET_ASSETS_CONFIG.forex).length})
            </button>
            <button 
              className={`m-filter-btn ${marketFilter === 'crypto' ? 'active' : ''}`}
              onClick={() => { setMarketFilter('crypto'); setExpandedSymbol(null); }}
            >
              Crypto ({Object.keys(MARKET_ASSETS_CONFIG.crypto).length})
            </button>
            <div className="market-tab-underline" style={underlineStyle}></div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="market-sort-controls">
          <span className="sort-label">SORT BY:</span>
          <div className="market-sort-options">
            <button 
              className={`market-sort-btn ${sortBy === 'gainers' ? 'active' : ''}`}
              onClick={() => setSortBy('gainers')}
            >
              <TrendingUp size={14} /> Gainers
            </button>
            <button 
              className={`market-sort-btn ${sortBy === 'losers' ? 'active' : ''}`}
              onClick={() => setSortBy('losers')}
            >
              <TrendingDown size={14} /> Losers
            </button>
            <button 
              className={`market-sort-btn ${sortBy === 'volume' ? 'active' : ''}`}
              onClick={() => setSortBy('volume')}
            >
              <Activity size={14} /> Volume
            </button>
          </div>
        </div>
      </div>

      {/* Asset Rows Container */}
      <div className="market-list-card glassy-card">
        {/* Table Header */}
        <div className="market-list-header">
          <div className="m-col">Ticker / Asset</div>
          <div className="m-col">Company Name</div>
          <div className="m-col text-right">Live Price (INR)</div>
          <div className="m-col text-right">24h Change</div>
          <div className="m-col text-right">{marketFilter === 'forex' ? 'Spread' : 'Volume'}</div>
          <div className="m-col text-right">Actions</div>
        </div>

        {/* List items */}
        <div className="market-list-rows">
          {assetsToRender.length > 0 ? (
            assetsToRender.map(asset => {
              const isExpanded = expandedSymbol === asset.symbol;
              const isPositive = asset.change >= 0;
              const tickState = tickChanges[asset.symbol];
              const arrow = isPositive ? '▲' : '▼';
              const badgeClass = isPositive ? 'positive' : 'negative';
              
              const chartData = historicalData[asset.symbol] || [];
              const isLoadingChart = loadingCharts[asset.symbol];
              const simSymbol = mapToSimSymbol(asset.symbol);

              // Position status for this asset
              const heldPosition = portfolio.positions.find(p => p.symbol === simSymbol);
              const heldShares = heldPosition?.shares || 0;
              const avgBuy = heldPosition?.avgBuyPrice || 0;
              const positionPnL = heldShares > 0 ? (asset.price - avgBuy) * heldShares : 0;

              // Cost calculations for the active trade panel
              const effPrice = orderStyle === 'Limit' ? (Number(limitPrice) || asset.price) : asset.price;
              const currentTotalCost = Number(sharesInput) * effPrice;
              const projectedBalance = orderSide === 'BUY' 
                ? (portfolio.balance - currentTotalCost)
                : (portfolio.balance + currentTotalCost);

              return (
                <div 
                  key={asset.symbol} 
                  className={`market-row-wrapper ${isExpanded ? 'expanded' : ''} row-fade-in`}
                >
                  {/* Collapsed clickable row */}
                  <div className="market-row" onClick={() => toggleRow(asset.symbol)}>
                    <div className="m-col m-col-asset" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800 }}>{simSymbol}</span>
                      {heldShares > 0 && (
                        <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: 'rgba(93,211,148,0.15)', color: 'var(--color-jade)', fontWeight: 700 }}>
                          {heldShares} owned
                        </span>
                      )}
                    </div>
                    <div className="m-col m-col-name">{asset.name}</div>
                    <div className={`m-col m-col-price text-right text-mono ${tickState === 'up' ? 'tick-up' : tickState === 'down' ? 'tick-down' : ''}`}>
                      {asset.symbol.includes('JPY') || asset.symbol.includes('INR') 
                        ? `₹${asset.price.toFixed(2)}` 
                        : (asset.price > 1000 ? `₹${asset.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : `₹${asset.price.toFixed(4)}`)}
                    </div>
                    <div className="m-col m-col-change">
                      <span className={`change-badge ${badgeClass}`}>
                        <span>{arrow}</span> <span>{Math.abs(asset.change).toFixed(2)}%</span>
                      </span>
                    </div>
                    <div className="m-col m-col-extra spread-val text-right">
                      {marketFilter === 'forex' ? asset.spread : asset.volume}
                    </div>
                    <div className="m-col text-right" onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <button 
                          className="trade-btn buy-btn" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setOrderSide('BUY');
                            if (!isExpanded) toggleRow(asset.symbol);
                          }}
                          style={{ padding: '5px 12px', fontSize: '0.75rem', fontWeight: 800 }}
                        >
                          BUY
                        </button>
                        <button 
                          className="trade-btn" 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setOrderSide('SELL');
                            if (!isExpanded) toggleRow(asset.symbol);
                          }}
                          style={{ padding: '5px 12px', fontSize: '0.75rem', fontWeight: 800, background: 'rgba(91, 0, 21, 0.35)', color: '#FF6B6B', border: '1px solid rgba(255, 69, 58, 0.35)', borderRadius: '6px' }}
                        >
                          SELL
                        </button>
                        <span style={{ color: 'var(--color-text-muted)', marginLeft: '4px' }}>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* UNIFIED PRO TRADING TERMINAL: GRAPH + BUYING STATION SIDE-BY-SIDE */}
                  {isExpanded && (
                    <div className="market-row-expanded" style={{ padding: '20px', background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(330px, 1fr)', 
                        gap: '20px', 
                        alignItems: 'stretch' 
                      }}>
                        
                        {/* ================= LEFT: COMPLETE CANDLESTICK GRAPH ================= */}
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                          
                          {/* Asset Header + Timeframe Buttons */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                                  {asset.name}
                                </h3>
                                <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(128, 174, 232, 0.14)', color: 'var(--palette-cool-horizon)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                                  {asset.symbol}
                                </span>
                              </div>
                              <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '0.8rem' }}>
                                <span className="mono-text" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                                  ₹{asset.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                                <span className={`change-badge ${badgeClass}`} style={{ fontSize: '0.75rem', padding: '1px 6px' }}>
                                  {arrow} {Math.abs(asset.change).toFixed(2)}%
                                </span>
                              </div>
                            </div>

                            {/* Max Range Timeframe Selector */}
                            <div style={{ display: 'flex', gap: '4px', background: 'var(--color-bg)', padding: '3px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                              {timeframes.map(tf => (
                                <button
                                  key={tf.key}
                                  onClick={() => handleTimeframeChange(tf.key)}
                                  style={{
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: chartTimeframe === tf.key ? 'var(--color-accent)' : 'transparent',
                                    color: chartTimeframe === tf.key ? '#FFFFFF' : 'var(--color-text-secondary)',
                                    fontWeight: 700,
                                    fontSize: '0.72rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                  }}
                                >
                                  {tf.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Stat Pills Strip */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(95px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                            <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block' }}>24h High</span>
                              <span className="mono-text" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>₹{asset.high?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block' }}>24h Low</span>
                              <span className="mono-text" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>₹{asset.low?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block' }}>Prev Close</span>
                              <span className="mono-text" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>₹{asset.prevClose?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                              <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', display: 'block' }}>Volume</span>
                              <span className="mono-text" style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{asset.volume}</span>
                            </div>
                            {heldShares > 0 && (
                              <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'var(--color-bullish-subtle)', border: '1px solid var(--color-bullish)' }}>
                                <span style={{ fontSize: '0.68rem', color: 'var(--color-bullish)', display: 'block' }}>Holding P&L</span>
                                <span className="mono-text" style={{ fontSize: '0.82rem', fontWeight: 700, color: positionPnL >= 0 ? 'var(--color-bullish)' : 'var(--color-bearish)' }}>
                                  {positionPnL >= 0 ? '+' : ''}₹{positionPnL.toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Candlestick Canvas Container */}
                          <div style={{ flex: 1, minHeight: '440px', width: '100%', borderRadius: '12px', overflow: 'hidden', background: 'var(--color-surface)', border: '1px solid var(--color-border)', position: 'relative', padding: '12px', boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.02)' }}>
                            {chartData.length > 0 ? (
                              <Suspense fallback={<div style={{ display: 'grid', placeItems: 'center', height: '420px', color: 'var(--color-text-muted)' }}>Mounting Candlesticks…</div>}>
                                <CandlestickChart data={chartData} />
                              </Suspense>
                            ) : isLoadingChart ? (
                              <div style={{ display: 'grid', placeItems: 'center', height: '420px', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                                <Loader size={20} className="fa-spin" style={{ color: 'var(--color-teal)' }} /> Loading maximum historical bars…
                              </div>
                            ) : (
                              <div style={{ display: 'grid', placeItems: 'center', height: '420px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                Real-time chart syncing…
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ================= RIGHT: BUY/SELL TERMINAL ================= */}
                        <div style={{
                          background: 'var(--color-surface)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: orderSide === 'BUY' ? '1px solid rgba(46, 75, 47, 0.3)' : '1px solid rgba(91, 0, 21, 0.3)',
                          borderRadius: '16px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: orderSide === 'BUY' ? '0 10px 30px rgba(46, 75, 47, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)' : '0 10px 30px rgba(91, 0, 21, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                          transition: 'border 0.2s, box-shadow 0.2s'
                        }}>
                          <div>
                            {/* Terminal Top Badge */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', color: orderSide === 'BUY' ? 'var(--color-bullish)' : 'var(--color-bearish)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Zap size={14} /> Live Order Execution
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                                T+0 Paper Fill
                              </span>
                            </div>

                            {/* BUY / SELL Toggle Switches */}
                            <div style={{ display: 'flex', gap: '8px', padding: '4px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '10px', marginBottom: '16px' }}>
                              <button
                                type="button"
                                onClick={() => setOrderSide('BUY')}
                                style={{
                                  flex: 1,
                                  padding: '10px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  letterSpacing: '0.5px',
                                  background: orderSide === 'BUY' ? 'linear-gradient(135deg, var(--color-bullish-dark), var(--color-bullish))' : 'transparent',
                                  color: orderSide === 'BUY' ? '#FFFFFF' : 'var(--color-text-secondary)',
                                  boxShadow: orderSide === 'BUY' ? '0 4px 14px rgba(46, 75, 47, 0.25)' : 'none',
                                  transition: 'all 0.2s'
                                }}
                              >
                                BUY {simSymbol}
                              </button>
                              <button
                                type="button"
                                onClick={() => setOrderSide('SELL')}
                                style={{
                                  flex: 1,
                                  padding: '10px',
                                  borderRadius: '8px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  letterSpacing: '0.5px',
                                  background: orderSide === 'SELL' ? 'linear-gradient(135deg, var(--palette-deep-cabernet), var(--palette-night-bordeaux))' : 'transparent',
                                  color: orderSide === 'SELL' ? '#FFFFFF' : 'var(--color-text-secondary)',
                                  boxShadow: orderSide === 'SELL' ? '0 4px 14px rgba(91, 0, 21, 0.25)' : 'none',
                                  transition: 'all 0.2s'
                                }}
                              >
                                SELL {simSymbol}
                              </button>
                            </div>

                            {/* Order Type Selector: Market / Limit */}
                            <div style={{ marginBottom: '14px' }}>
                              <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                                Execution Mode
                              </label>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  type="button"
                                  onClick={() => setOrderStyle('Market')}
                                  style={{
                                    flex: 1,
                                    padding: '7px',
                                    borderRadius: '6px',
                                    border: '1px solid',
                                    borderColor: orderStyle === 'Market' ? 'var(--color-accent)' : 'var(--color-border)',
                                    background: orderStyle === 'Market' ? 'var(--color-accent-subtle)' : 'var(--color-bg)',
                                    color: orderStyle === 'Market' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Market Order
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOrderStyle('Limit');
                                    if (!limitPrice) setLimitPrice(asset.price);
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: '7px',
                                    borderRadius: '6px',
                                    border: '1px solid',
                                    borderColor: orderStyle === 'Limit' ? 'var(--color-accent)' : 'var(--color-border)',
                                    background: orderStyle === 'Limit' ? 'var(--color-accent-subtle)' : 'var(--color-bg)',
                                    color: orderStyle === 'Limit' ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                                    fontSize: '0.78rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Limit Order
                                </button>
                              </div>
                            </div>

                            {/* Limit Price Input if selected */}
                            {orderStyle === 'Limit' && (
                              <div style={{ marginBottom: '14px' }}>
                                <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                                  Target Limit Price (INR)
                                </label>
                                <input
                                  type="number"
                                  className="form-input"
                                  value={limitPrice}
                                  onChange={e => setLimitPrice(e.target.value)}
                                  step="any"
                                  min="0.01"
                                  style={{ width: '100%', fontSize: '0.85rem' }}
                                />
                              </div>
                            )}

                            {/* Shares Quantity Input + Quick Stepper Chips */}
                            <div style={{ marginBottom: '14px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <label style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                                  Quantity (Shares)
                                </label>
                                {orderSide === 'SELL' && (
                                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                                    Held: <strong style={{ color: 'var(--color-text-primary)' }}>{heldShares}</strong>
                                  </span>
                                )}
                              </div>
                              <input
                                type="number"
                                className="form-input"
                                value={sharesInput}
                                onChange={e => setSharesInput(e.target.value)}
                                min="1"
                                max={orderSide === 'SELL' ? (heldShares || 1) : 100000}
                                style={{ width: '100%', fontSize: '0.9rem', fontWeight: 700 }}
                              />

                              {/* Stepper Buttons */}
                              <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                                {[1, 5, 10, 50].map(n => (
                                  <button
                                    key={n}
                                    type="button"
                                    onClick={() => setSharesInput(n)}
                                    style={{
                                      flex: 1,
                                      padding: '4px',
                                      borderRadius: '6px',
                                      background: 'var(--color-bg)',
                                      border: '1px solid var(--color-border)',
                                      color: 'var(--color-text-primary)',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    +{n}
                                  </button>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (orderSide === 'SELL') {
                                      setSharesInput(Math.max(1, heldShares));
                                    } else {
                                      const maxCanAfford = Math.max(1, Math.floor(portfolio.balance / (effPrice || 1)));
                                      setSharesInput(maxCanAfford);
                                    }
                                  }}
                                  style={{
                                    flex: 1.2,
                                    padding: '4px',
                                    borderRadius: '6px',
                                    background: 'var(--color-accent-subtle)',
                                    border: '1px solid var(--color-accent)',
                                    color: 'var(--color-accent)',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                  }}
                                >
                                  MAX
                                </button>
                              </div>
                            </div>

                            {/* Warning for SELL when 0 shares held */}
                            {orderSide === 'SELL' && heldShares <= 0 && (
                              <div style={{ padding: '10px', borderRadius: '8px', background: 'var(--color-bearish-subtle)', border: '1px solid var(--color-bearish)', color: 'var(--color-bearish)', fontSize: '0.75rem', marginBottom: '12px', lineHeight: 1.4 }}>
                                You currently hold 0 shares of {simSymbol}. Switch to BUY mode to take a position.
                              </div>
                            )}

                            {/* Live Financial Breakdown */}
                            <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                                <span>Execution Unit Price:</span>
                                <span className="mono-text" style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>₹{effPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                                <span>Simulated Available Cash:</span>
                                <span className="mono-text" style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>₹{portfolio.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--color-border)', paddingTop: '8px', fontWeight: 800 }}>
                                <span style={{ color: 'var(--color-text-primary)' }}>{orderSide === 'BUY' ? 'Total Required Outlay:' : 'Estimated Proceeds:'}</span>
                                <span className="mono-text" style={{ color: orderSide === 'BUY' ? 'var(--color-bullish)' : 'var(--color-accent)', fontSize: '0.95rem' }}>
                                  ₹{currentTotalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                <span>Projected Post-Trade Balance:</span>
                                <span className="mono-text" style={{ color: projectedBalance < 0 ? 'var(--color-bearish)' : 'var(--color-text-primary)' }}>
                                  ₹{projectedBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <button
                            type="button"
                            onClick={() => handleExecuteInlineTrade(asset.symbol)}
                            disabled={
                              orderSide === 'SELL' 
                                ? (heldShares < Number(sharesInput) || Number(sharesInput) <= 0)
                                : (currentTotalCost > portfolio.balance || Number(sharesInput) <= 0)
                            }
                            style={{
                              width: '100%',
                              padding: '12px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: (orderSide === 'SELL' ? (heldShares < Number(sharesInput) || Number(sharesInput) <= 0) : (currentTotalCost > portfolio.balance || Number(sharesInput) <= 0)) ? 'not-allowed' : 'pointer',
                              opacity: (orderSide === 'SELL' ? (heldShares < Number(sharesInput) || Number(sharesInput) <= 0) : (currentTotalCost > portfolio.balance || Number(sharesInput) <= 0)) ? 0.45 : 1,
                              background: orderSide === 'BUY' 
                                ? 'linear-gradient(135deg, var(--palette-evergreen-forest), #34C759)' 
                                : 'linear-gradient(135deg, var(--palette-deep-cabernet), var(--palette-night-bordeaux))',
                              color: '#FFFFFF',
                              fontWeight: 800,
                              fontSize: '0.9rem',
                              letterSpacing: '0.5px',
                              borderRadius: '12px',
                              boxShadow: orderSide === 'BUY' 
                                ? '0 4px 20px rgba(52, 199, 89, 0.4), inset 0 1px 0 rgba(255,255,255,0.15)' 
                                : '0 4px 20px rgba(91, 0, 21, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                              transition: 'all 0.2s'
                            }}
                          >
                            Execute Simulated {orderSide} ({sharesInput} Shares)
                          </button>
                        </div>

                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No market ticker matches "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
