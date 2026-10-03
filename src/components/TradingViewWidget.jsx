import React, { useEffect, useRef, memo } from 'react';

export function getTradingViewSymbol(symbol) {
  if (!symbol) return 'NSE:ICICIBANK';
  if (symbol.endsWith('.NS')) {
    return `NSE:${symbol.replace('.NS', '')}`;
  }
  if (symbol.endsWith('.BO')) {
    return `BSE:${symbol.replace('.BO', '')}`;
  }
  if (symbol.includes('=X')) {
    const clean = symbol.replace('=X', '');
    if (clean.includes('INR')) return `FX_IDC:${clean}`;
    return `FX:${clean}`;
  }
  if (symbol === 'BTC-USD' || symbol === 'BTC') return 'BINANCE:BTCUSDT';
  if (symbol === 'ETH-USD' || symbol === 'ETH') return 'BINANCE:ETHUSDT';
  if (symbol === 'SOL-USD' || symbol === 'SOL') return 'BINANCE:SOLUSDT';
  if (symbol === 'DOGE-USD' || symbol === 'DOGE') return 'BINANCE:DOGEUSDT';
  if (symbol === 'ADA-USD' || symbol === 'ADA') return 'BINANCE:ADAUSDT';
  if (symbol === 'BNB-USD' || symbol === 'BNB') return 'BINANCE:BNBUSDT';
  return symbol;
}

function TradingViewWidget({ symbol, title, chartType = 'area', height = 370 }) {
  const containerRef = useRef(null);
  const tvSymbol = getTradingViewSymbol(symbol);
  const displayName = title || tvSymbol;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget
    container.innerHTML = '';

    const widgetDiv = document.createElement('div');
    widgetDiv.className = 'tradingview-widget-container__widget';
    widgetDiv.style.width = '100%';
    widgetDiv.style.height = `${height}px`;
    container.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        [displayName, `${tvSymbol}|1D`]
      ],
      chartOnly: false,
      width: '100%',
      height: height,
      locale: 'en',
      colorTheme: 'dark',
      autosize: false,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: 'right',
      scaleMode: 'Normal',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif',
      fontSize: '10',
      noTimeScale: false,
      valuesTracking: '1',
      changeMode: 'price-and-percent',
      chartType: chartType,
      headerFontSize: 'medium',
      backgroundColor: 'rgba(11, 15, 25, 0.5)',
      gridLineColor: 'rgba(255, 255, 255, 0.05)',
      widgetFontColor: 'rgba(255, 255, 255, 0.75)',
      upColor: '#22c55e',
      downColor: '#ef4444',
      dateRanges: [
        '1d|1',
        '5d|5',
        '1m|30',
        '3m|60',
        '12m|1D',
        '60m|1W',
        'all|1M'
      ]
    });

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [tvSymbol, displayName, chartType, height]);

  return (
    <div 
      className="tradingview-widget-container" 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        minHeight: `${height}px`, 
        borderRadius: '10px', 
        overflow: 'hidden',
        background: 'rgba(11, 15, 25, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}
    />
  );
}

export default memo(TradingViewWidget);
