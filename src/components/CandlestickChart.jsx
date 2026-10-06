import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

export default function CandlestickChart({ data }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !data?.length) return;

    const chart = createChart(container, {
      width: container.clientWidth || 600,
      height: container.clientHeight || 220,
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: 'rgba(255,255,255,0.45)',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: 'rgba(255,255,255,0.04)' },
        horzLines: { color: 'rgba(255,255,255,0.04)' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(255,255,255,0.06)',
      },
      rightPriceScale: {
        borderVisible: false,
        textColor: 'rgba(255,255,255,0.4)',
      },
      crosshair: {
        vertLine: { color: 'rgba(93,211,148,0.3)' },
        horzLine: { color: 'rgba(93,211,148,0.3)' },
      },
      handleScroll: true,
      handleScale: true,
    });
    chartRef.current = chart;

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#5DD394',
      downColor: '#FF4D4D',
      borderVisible: false,
      wickUpColor: '#5DD394',
      wickDownColor: '#FF4D4D',
    });
    const sorted = [...data].sort((a, b) => a.time - b.time);
    const unique = sorted.filter((d, idx) => idx === 0 || d.time > sorted[idx - 1].time);
    series.setData(unique);
    chart.timeScale().fitContent();

    const handleResize = () => {
      if (containerRef.current && chartRef.current === chart) {
        chart.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
      if (chartRef.current === chart) chartRef.current = null;
    };
  }, [data]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '220px', background: 'transparent' }} />;
}
