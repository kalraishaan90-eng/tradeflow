import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, TrendingDown, Activity, ChevronDown, ChevronUp, Loader } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';
import { fetchYahooQuotes, fetchYahooChart, formatVolume } from '../lib/marketData.js';

const TradingViewWidget = lazy(() => import('./TradingViewWidget.jsx'));
const TradingViewCandleChart = lazy(() => import('./TradingViewCandleChart.jsx'));

// Market assets config
const MARKET_ASSETS_CONFIG = {
  stocks: {
    'RELIANCE.NS': { name: 'Reliance Industries', defaultPrice: 1167.70, volume: '16.7M', defaultHigh: 1183.90, defaultLow: 1160.80, defaultChange: -1.63, prevClose: 1187.00 },
    'TCS.NS': { name: 'Tata Consultancy Services', defaultPrice: 2075.00, volume: '3.4M', defaultHigh: 2093.90, defaultLow: 2045.10, defaultChange: 1.19, prevClose: 2050.60 },
    'HDFCBANK.NS': { name: 'HDFC Bank', defaultPrice: 721.20, volume: '37.1M', defaultHigh: 721.30, defaultLow: 707.10, defaultChange: 1.76, prevClose: 708.70 },
    'INFY.NS': { name: 'Infosys Ltd.', defaultPrice: 1035.00, volume: '15.1M', defaultHigh: 1035.00, defaultLow: 999.15, defaultChange: 4.11, prevClose: 994.10 },
    'ICICIBANK.NS': { name: 'ICICI Bank', defaultPrice: 1310.60, volume: '13.0M', defaultHigh: 1329.90, defaultLow: 1308.40, defaultChange: -0.84, prevClose: 1321.70 },
    'HINDUNILVR.NS': { name: 'Hindustan Unilever', defaultPrice: 1836.00, volume: '1.3M', defaultHigh: 1873.60, defaultLow: 1826.90, defaultChange: -2.29, prevClose: 1879.10 },
    'ITC.NS': { name: 'ITC Ltd.', defaultPrice: 255.90, volume: '16.4M', defaultHigh: 262.70, defaultLow: 254.65, defaultChange: -2.61, prevClose: 262.75 },
    'SBIN.NS': { name: 'State Bank of India', defaultPrice: 954.10, volume: '7.4M', defaultHigh: 965.40, defaultLow: 945.80, defaultChange: -0.56, prevClose: 959.50 }
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

// Maps Yahoo Finance symbol to Simulator symbol
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
  const [expandedSymbol, setExpandedSymbol] = useState(null);
  
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

  const [tickChanges, setTickChanges] = useState({}); // symbol -> 'up' or 'down'

  // Expandable Mini Chart state
  const [chartMode, setChartMode] = useState({}); // symbol -> 'overview' | 'candles'
  const [historicalData, setHistoricalData] = useState({}); // symbol -> array of prices
  const [loadingCharts, setLoadingCharts] = useState({}); // symbol -> bool

  // Trading Modal state
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeSymbol, setTradeSymbol] = useState('');
  const [tradeType, setTradeType] = useState('BUY'); // 'BUY' or 'SELL'
  const [sharesInput, setSharesInput] = useState(10);
  const [orderStyle, setOrderStyle] = useState('Market'); // 'Market' or 'Limit'
  const [limitPrice, setLimitPrice] = useState('');

  // Setup tab underline positions
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

  // Live stream quotes from Yahoo Finance (via Vite proxy /api/yahoo, with CORS fallbacks)
  useEffect(() => {
    let isMounted = true;
    const fetchQuotes = async () => {
      const symbolsList = [];
      Object.keys(MARKET_ASSETS_CONFIG).forEach(cat => {
        Object.keys(MARKET_ASSETS_CONFIG[cat]).forEach(symbol => {
          symbolsList.push(symbol);
        });
      });

      let success = false;
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
                if (q.price > prevItem.price) {
                  nextTickChanges[symbol] = 'up';
                } else if (q.price < prevItem.price) {
                  nextTickChanges[symbol] = 'down';
                }
              }

              next[symbol] = {
                ...prevItem,
                price: q.price,
                change: q.changePercent,
                volume: q.volume !== 'N/A' ? q.volume : (prevItem?.volume || 'N/A'),
                high: q.high || (q.price * 1.015),
                low: q.low || (q.price * 0.985),
                prevClose: q.prevClose || prevItem?.prevClose || q.price,
              };
            });
            return next;
          });

          setTickChanges(nextTickChanges);
          success = true;
          setTimeout(() => {
            if (isMounted) setTickChanges({});
          }, 800);
        }
      } catch (err) {
        console.warn('Quote fetch failed, applying simulation tick:', err);
      }

      if (!success) {
        runMockTicks();
      }
    };

    const runMockTicks = () => {
      setPrices(prev => {
        const next = { ...prev };
        const nextTickChanges = {};
        const categories = ['stocks', 'forex', 'crypto'];
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        const symbols = Object.keys(MARKET_ASSETS_CONFIG[randomCat]);
        const numToTick = Math.min(symbols.length, Math.floor(Math.random() * 2) + 1);

        for (let i = 0; i < numToTick; i++) {
          const symbol = symbols[Math.floor(Math.random() * symbols.length)];
          const item = next[symbol];
          if (!item) continue;

          const oldPrice = item.price;
          const tick = (Math.random() - 0.49) * 0.003; // micro tick
          const newPrice = oldPrice * (1 + tick);

          nextTickChanges[symbol] = tick > 0 ? 'up' : 'down';
          next[symbol] = {
            ...item,
            price: parseFloat(newPrice.toFixed(randomCat === 'forex' ? 4 : 2)),
            change: parseFloat((item.change + (tick * 10)).toFixed(2)),
            spread: randomCat === 'forex' 
              ? (parseFloat(item.spread) + (Math.random() - 0.5) * 0.2).toFixed(1) + ' pips' 
              : item.spread
          };

          if (parseFloat(next[symbol].spread) < 0.4) next[symbol].spread = '0.5 pips';
        }

        setTimeout(() => {
          if (isMounted) setTickChanges({});
        }, 800);
        return next;
      });
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 8000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Fetch real OHLC chart data
  const fetchChartData = async (symbol) => {
    try {
      const ohlc = await fetchYahooChart(symbol, '15m');
      if (ohlc && ohlc.length >= 5) return ohlc;
      return null;
    } catch (err) {
      console.error('Chart fetch failed, using fallback', err);
      return null;
    }
  };

  // Generate fallback OHLC from base price
  const generateFallbackOHLC = (symbol) => {
    const current = prices[symbol];
    let defaultConfig = null;
    for (const cat of Object.keys(MARKET_ASSETS_CONFIG)) {
      if (MARKET_ASSETS_CONFIG[cat][symbol]) {
        defaultConfig = MARKET_ASSETS_CONFIG[cat][symbol];
        break;
      }
    }
    const basePrice = current ? current.price : (defaultConfig ? defaultConfig.defaultPrice : 100);
    const chg = current ? current.change : 0;
    const count = 30;
    const points = [];
    const startPrice = basePrice / (1 + (chg / 100));
    
    const now = Math.floor(Date.now() / 1000);
    let currentPrice = startPrice;

    for (let i = 0; i < count; i++) {
      const time = now - (count - i) * 900;
      const ratio = i / (count - 1);
      const targetPrice = startPrice + (basePrice - startPrice) * ratio;
      
      currentPrice += (targetPrice - currentPrice) * 0.2 + (Math.random() - 0.49) * (basePrice * 0.004);
      
      const open = currentPrice;
      const close = open + (Math.random() - 0.5) * (basePrice * 0.003);
      const high = Math.max(open, close) + Math.random() * (basePrice * 0.002);
      const low = Math.min(open, close) - Math.random() * (basePrice * 0.002);

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
  };

  // Handle accordion row click and fetch historical chart
  const toggleRow = async (symbol) => {
    if (expandedSymbol === symbol) {
      setExpandedSymbol(null);
      return;
    }

    setExpandedSymbol(symbol);

    if (historicalData[symbol]) return; // already loaded

    setLoadingCharts(prev => ({ ...prev, [symbol]: true }));
    try {
      const chartData = await fetchChartData(symbol);
      if (chartData) {
        setHistoricalData(prev => ({ ...prev, [symbol]: chartData }));
      } else {
        setHistoricalData(prev => ({ ...prev, [symbol]: generateFallbackOHLC(symbol) }));
      }
    } finally {
      setLoadingCharts(prev => ({ ...prev, [symbol]: false }));
    }
  };

  // Sort and filter logic
  const getSortedAndFilteredAssets = () => {
    const config = MARKET_ASSETS_CONFIG[marketFilter];
    let list = Object.keys(config).map(symbol => ({
      symbol,
      name: config[symbol].name,
      ...prices[symbol]
    }));

    // Filter by search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => 
        a.symbol.toLowerCase().includes(q) || 
        a.name.toLowerCase().includes(q) ||
        mapToSimSymbol(a.symbol).toLowerCase().includes(q)
      );
    }

    // Sort
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

  const formatVolume = (val) => {
    if (val >= 1e9) return (val / 1e9).toFixed(1) + 'B';
    if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
    if (val >= 1e3) return (val / 1e3).toFixed(1) + 'K';
    return val.toString();
  };

  const handleOpenTradeModal = (symbol, side) => {
    setTradeSymbol(symbol);
    setTradeType(side);
    setSharesInput(10);
    setOrderStyle('Market');
    setLimitPrice(prices[symbol]?.price || 100);
    setShowTradeModal(true);
  };

  const handleExecuteTrade = (e) => {
    e.preventDefault();
    const simSymbol = mapToSimSymbol(tradeSymbol);
    const executionPrice = orderStyle === 'Limit' ? Number(limitPrice) : prices[tradeSymbol].price;

    const success = executeTrade(
      simSymbol, 
      tradeType, 
      Number(sharesInput), 
      executionPrice, 
      orderStyle
    );

    if (success) {
      setShowTradeModal(false);
    }
  };

  const assetsToRender = getSortedAndFilteredAssets();
  const currentAssetPrice = prices[tradeSymbol]?.price || 0;
  const totalCost = Number(sharesInput) * (orderStyle === 'Limit' ? Number(limitPrice) : currentAssetPrice);

  return (
    <div className="market-layout">
      {/* Search and Filters bar */}
      <div className="market-header-controls glassy-card">
        
        {/* Search input */}
        <div className="market-search-wrapper">
          <Search className="market-search-icon" />
          <input 
            type="text" 
            placeholder="Search ticker, name or pair..." 
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
              Stocks
            </button>
            <button 
              className={`m-filter-btn ${marketFilter === 'forex' ? 'active' : ''}`}
              onClick={() => { setMarketFilter('forex'); setExpandedSymbol(null); }}
            >
              Forex
            </button>
            <button 
              className={`m-filter-btn ${marketFilter === 'crypto' ? 'active' : ''}`}
              onClick={() => { setMarketFilter('crypto'); setExpandedSymbol(null); }}
            >
              Crypto
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

      {/* Asset rows container */}
      <div className="market-list-card glassy-card">
        {/* Header grid */}
        <div className="market-list-header">
          <div className="m-col">Asset</div>
          <div className="m-col">Name</div>
          <div className="m-col text-right">Price (INR)</div>
          <div className="m-col text-right">24h Change</div>
          <div className="m-col text-right">{marketFilter === 'forex' ? 'Spread' : 'Volume'}</div>
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
              
              // Chart data
              const chartData = historicalData[asset.symbol] || [];
              const isLoadingChart = loadingCharts[asset.symbol];

              // Limit trading to configured simulator assets (Indian stocks, crypto, forex)
              const simSymbol = mapToSimSymbol(asset.symbol);
              const canTrade = true; // All listed assets are tradeable in the simulator
              const isIndianStock = asset.symbol.endsWith('.NS') || asset.symbol.endsWith('.BO');
              const activeMode = chartMode[asset.symbol] || (isIndianStock ? 'candles' : 'overview');

              return (
                <div 
                  key={asset.symbol} 
                  className={`market-row-wrapper ${isExpanded ? 'expanded' : ''} row-fade-in`}
                  style={{ animationDelay: '50ms' }}
                >
                  {/* Standard Row clickable area */}
                  <div className="market-row" onClick={() => toggleRow(asset.symbol)}>
                    <div className="m-col m-col-asset">{mapToSimSymbol(asset.symbol)}</div>
                    <div className="m-col m-col-name">{asset.name}</div>
                    <div className={`m-col m-col-price text-right text-mono ${tickState === 'up' ? 'tick-up' : tickState === 'down' ? 'tick-down' : ''}`}>
                      {asset.symbol.includes('JPY') || asset.symbol.includes('INR') 
                        ? asset.price.toFixed(2) 
                        : (asset.price > 1000 ? asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : asset.price.toFixed(4))}
                    </div>
                    <div className="m-col m-col-change">
                      <span className={`change-badge ${badgeClass}`}>
                        <span>{arrow}</span> <span>{Math.abs(asset.change).toFixed(2)}%</span>
                      </span>
                    </div>
                    <div className="m-col m-col-extra spread-val text-right">
                      {marketFilter === 'forex' ? asset.spread : asset.volume}
                    </div>
                  </div>

                  {/* Expanded Mini Chart View */}
                  <div className="market-row-expanded">
                    <div className="expanded-chart-container">
                      {/* Top Header & Controls */}
                      <div className="mini-chart-details">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div className="mini-chart-title" style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                              {asset.name}
                            </div>
                            <span style={{ 
                              fontSize: '0.72rem', 
                              padding: '2px 8px', 
                              borderRadius: '4px', 
                              background: 'rgba(255,255,255,0.06)', 
                              color: 'var(--color-text-secondary)', 
                              fontFamily: 'var(--font-mono)' 
                            }}>
                              {asset.symbol}
                            </span>
                          </div>

                          {/* Chart Mode Controls + Trade Action Buttons */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', padding: '3px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setChartMode(prev => ({ ...prev, [asset.symbol]: 'overview' })); }}
                                style={{
                                  padding: '5px 12px',
                                  fontSize: '0.75rem',
                                  fontWeight: '700',
                                  borderRadius: '4px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  background: activeMode === 'overview' ? 'var(--color-teal)' : 'transparent',
                                  color: activeMode === 'overview' ? '#000' : 'var(--color-text-secondary)',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                TradingView
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setChartMode(prev => ({ ...prev, [asset.symbol]: 'candles' })); }}
                                style={{
                                  padding: '5px 12px',
                                  fontSize: '0.75rem',
                                  fontWeight: '700',
                                  borderRadius: '4px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  background: activeMode === 'candles' ? 'var(--color-teal)' : 'transparent',
                                  color: activeMode === 'candles' ? '#000' : 'var(--color-text-secondary)',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                Candlesticks
                              </button>
                            </div>

                            {canTrade ? (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                  className="m-action-btn buy" 
                                  onClick={(e) => { e.stopPropagation(); handleOpenTradeModal(asset.symbol, 'BUY'); }}
                                  style={{ width: '80px', padding: '6px 12px' }}
                                >
                                  BUY
                                </button>
                                <button 
                                  className="m-action-btn buy" 
                                  onClick={(e) => { e.stopPropagation(); handleOpenTradeModal(asset.symbol, 'SELL'); }}
                                  style={{ width: '80px', padding: '6px 12px', background: 'linear-gradient(135deg, var(--color-red), #b91c1c)', color: '#fff', boxShadow: '0 4px 10px var(--color-red-glow)' }}
                                >
                                  SELL
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        {/* Stats items */}
                        <div className="mini-chart-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
                          <div className="m-stat-item">
                            <span className="m-stat-label">Daily High</span>
                            <span className="m-stat-value">₹{asset.high?.toLocaleString('en-IN', { minimumFractionDigits: marketFilter === 'forex' ? 4 : 2 })}</span>
                          </div>
                          <div className="m-stat-item">
                            <span className="m-stat-label">Daily Low</span>
                            <span className="m-stat-value">₹{asset.low?.toLocaleString('en-IN', { minimumFractionDigits: marketFilter === 'forex' ? 4 : 2 })}</span>
                          </div>
                          <div className="m-stat-item">
                            <span className="m-stat-label">Prev Close</span>
                            <span className="m-stat-value">₹{asset.prevClose?.toLocaleString('en-IN', { minimumFractionDigits: marketFilter === 'forex' ? 4 : 2 })}</span>
                          </div>
                          <div className="m-stat-item">
                            <span className="m-stat-label">Volume / Cap</span>
                            <span className="m-stat-value">{marketFilter === 'forex' ? 'Liquidity: High' : asset.volume}</span>
                          </div>
                          <div className="m-stat-item">
                            <span className="m-stat-label">Type</span>
                            <span className="m-stat-value" style={{ textTransform: 'capitalize' }}>{marketFilter}</span>
                          </div>
                        </div>
                      </div>

                      {/* Sparkline / Chart Canvas Wrapper */}
                      <div className="mini-chart-canvas-wrapper" style={{ minHeight: '380px', marginTop: '6px' }}>
                        {(() => {
                          const isIndianStock = asset.symbol.endsWith('.NS') || asset.symbol.endsWith('.BO');
                          const activeMode = chartMode[asset.symbol] || (isIndianStock ? 'candles' : 'overview');

                          if (activeMode === 'overview') {
                            return (
                              <Suspense fallback={<div style={{ display: 'grid', placeItems: 'center', height: '380px', color: 'var(--color-text-muted)' }}>Loading TradingView Chart…</div>}>
                                <TradingViewWidget symbol={asset.symbol} title={asset.name} assetType={marketFilter} height={380} />
                              </Suspense>
                            );
                          }

                          return (
                            <div style={{ height: '340px', width: '100%', borderRadius: '8px', overflow: 'hidden', background: 'rgba(11, 15, 25, 0.4)', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', padding: '10px' }}>
                              {chartData.length > 0 ? (
                                <Suspense fallback={<div style={{ display: 'grid', placeItems: 'center', height: '320px', color: 'var(--color-text-muted)' }}>Preparing chart…</div>}>
                                  <TradingViewCandleChart data={chartData} />
                                </Suspense>
                              ) : isLoadingChart ? (
                                <div style={{ display: 'grid', placeItems: 'center', height: '320px', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                                  <Loader size={18} className="fa-spin" style={{ color: 'var(--color-teal)' }} /> Loading live candlestick history…
                                </div>
                              ) : (
                                <div style={{ display: 'grid', placeItems: 'center', height: '320px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                                  Unable to load live quotes history.
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
              No matches found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>

      {/* Trade Execution Modal Dialog */}
      {showTradeModal && (
        <div className={`modal-overlay active ${tradeType === 'SELL' ? 'sell-mode' : ''}`}>
          <div className="modal-content glassy-card" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Execute Simulator {tradeType} Order</h3>
              <button className="close-modal-btn" onClick={() => setShowTradeModal(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleExecuteTrade}>
              <div className="modal-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-card-border)' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>ASSET</span>
                    <h4 style={{ color: '#fff', fontWeight: '800' }}>{mapToSimSymbol(tradeSymbol)}</h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>MARKET PRICE</span>
                    <h4 className="mono-text" style={{ color: 'var(--color-teal)', fontWeight: '800' }}>
                      ₹{currentAssetPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h4>
                  </div>
                </div>

                {/* Order Style */}
                <div className="form-group">
                  <label>ORDER TYPE</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button 
                      type="button" 
                      className={`trade-btn ${orderStyle === 'Market' ? 'primary-btn' : 'secondary-btn'}`}
                      onClick={() => setOrderStyle('Market')}
                      style={{ flex: 1, padding: '8px' }}
                    >
                      Market
                    </button>
                    <button 
                      type="button" 
                      className={`trade-btn ${orderStyle === 'Limit' ? 'primary-btn' : 'secondary-btn'}`}
                      onClick={() => setOrderStyle('Limit')}
                      style={{ flex: 1, padding: '8px' }}
                    >
                      Limit
                    </button>
                  </div>
                </div>

                {/* Limit Price if Limit order */}
                {orderStyle === 'Limit' && (
                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label>LIMIT TRIGGER PRICE (INR)</label>
                    <input 
                      type="number" 
                      className="form-input"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      step="any"
                      min="0.01"
                      required={orderStyle === 'Limit'}
                      style={{ marginTop: '6px' }}
                    />
                  </div>
                )}

                {/* Shares quantity */}
                <div className="form-group" style={{ marginTop: '12px' }}>
                  <label>QUANTITY / CONTRACTS</label>
                  <input 
                    type="number" 
                    className="form-input"
                    value={sharesInput}
                    onChange={(e) => setSharesInput(e.target.value)}
                    min="1"
                    step="1"
                    required
                    style={{ marginTop: '6px' }}
                  />
                </div>

                {/* Summary cost */}
                <div className="trade-cost-summary" style={{ marginTop: '20px' }}>
                  <div className="summary-row">
                    <span>Available Cash:</span>
                    <span className="mono-text">₹{portfolio.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {tradeType === 'SELL' && (
                    <div className="summary-row">
                      <span>Held Holdings:</span>
                      <span className="mono-text">
                        {(portfolio.positions.find(p => p.symbol === mapToSimSymbol(tradeSymbol))?.shares || 0)} shares
                      </span>
                    </div>
                  )}
                  <div className="summary-row" style={{ fontWeight: '800', borderTop: '1px dashed rgba(255,255,255,0.05)', paddingTop: '10px', marginTop: '10px' }}>
                    <span>Estimated Cost:</span>
                    <span className="mono-text" style={{ color: 'var(--color-teal)' }}>
                      ₹{totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="modal-cancel-btn" onClick={() => setShowTradeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-execute-btn">
                  Confirm Simulated {tradeType}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
