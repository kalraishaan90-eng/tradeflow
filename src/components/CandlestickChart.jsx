import { useEffect, useRef, useState } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

export default function CandlestickChart({ data }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');

  // Listen to data-theme attribute changes for real-time chart theme synchronization
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      setIsDark(dark);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !data?.length) return;

    // Theme color tokens
    const textColor = isDark ? 'rgba(243, 236, 224, 0.75)' : '#5C4B52';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(74, 21, 33, 0.05)';
    const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(74, 21, 33, 0.08)';
    const crosshairColor = isDark ? 'rgba(128, 174, 232, 0.45)' : 'rgba(59, 118, 196, 0.45)';

    // Determine precision dynamically to accommodate low-value cryptos (e.g. ADA, DOGE) and forex pips
    const sorted = [...data].sort((a, b) => a.time - b.time);
    const unique = sorted.filter((d, idx) => idx === 0 || d.time > sorted[idx - 1].time);
    const minVal = unique.reduce((min, d) => Math.min(min, d.low ?? d.close), Infinity);
    const precision = minVal < 1 ? 4 : minVal < 10 ? 3 : 2;
    const minMove = minVal < 1 ? 0.0001 : minVal < 10 ? 0.001 : 0.01;

    // Detect if timeframe is intraday (minutes) or daily/weekly so date labels are clean
    const isIntraday = unique.length > 1 && (unique[1].time - unique[0].time) < 86400;

    const chart = createChart(container, {
      width: container.clientWidth || 600,
      height: container.clientHeight || 420,
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'DM Sans', sans-serif",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      timeScale: {
        timeVisible: isIntraday,
        secondsVisible: false,
        borderColor,
        rightOffset: 6,
        barSpacing: 10,
        minBarSpacing: 1,
      },
      rightPriceScale: {
        borderColor,
        textColor,
        autoScale: true,
      },
      crosshair: {
        vertLine: { color: crosshairColor, width: 1, style: 2 },
        horzLine: { color: crosshairColor, width: 1, style: 2 },
      },
      handleScroll: true,
      handleScale: true,
    });
    chartRef.current = chart;

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: true,
      borderColor: '#10B981',
      borderUpColor: '#10B981',
      borderDownColor: '#EF4444',
      wickVisible: true,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
      priceFormat: {
        type: 'price',
        precision,
        minMove,
      },
    });
    seriesRef.current = series;

    series.setData(unique);
    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container && chartRef.current === chart) {
          const { width, height } = entry.contentRect;
          if (width > 0) {
            chart.applyOptions({ 
              width, 
              height: height > 100 ? height : (container.clientHeight || 420) 
            });
            chart.timeScale().fitContent();
          }
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      if (chartRef.current === chart) chartRef.current = null;
      if (seriesRef.current === series) seriesRef.current = null;
    };
  }, [data, isDark]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '420px',
        background: 'transparent',
      }}
    />
  );
}
