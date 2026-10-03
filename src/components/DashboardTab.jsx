import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TrendingUp, TrendingDown, Target, BarChart2, Wallet, Percent, Award, AlertCircle } from 'lucide-react';
import { formatINR } from '../lib/format.mjs';

// ─── Color Palette ────────────────────────────────────────────────────────────
const SECTOR_COLORS = [
  '#59D4B2', '#5DD394', '#a855f7', '#3b82f6',
  '#f59e0b', '#FF4D4D', '#10b981', '#ec4899'
];

function fmt(val) {
  return formatINR(val);
}

// ─── Animated Donut Chart ─────────────────────────────────────────────────────
function DonutChart({ slices, size = 200 }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const duration = 300;
    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const p = Math.min(elapsed / duration, 1);
      // ease-out cubic
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [slices.map(s => s.value).join(',')]);

  if (!slices.length) {
    return (
      <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={size * 0.3} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={size * 0.12} />
          <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#6b7280" fontSize="12" fontFamily="DM Sans">No Data</text>
        </svg>
      </div>
    );
  }

  const cx = size / 2;
  const cy = size / 2;
  const R = size * 0.32;
  const stroke = size * 0.13;
  const total = slices.reduce((s, x) => s + x.value, 0);

  let cumAngle = -Math.PI / 2;
  const arcs = slices.map((sl) => {
    const frac = (sl.value / total) * progress;
    const startA = cumAngle;
    const endA = cumAngle + frac * 2 * Math.PI;
    cumAngle = endA;

    const x1 = cx + R * Math.cos(startA);
    const y1 = cy + R * Math.sin(startA);
    const x2 = cx + R * Math.cos(endA);
    const y2 = cy + R * Math.sin(endA);
    const large = frac * 2 * Math.PI > Math.PI ? 1 : 0;

    return { d: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`, color: sl.color };
  });

  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={stroke} />
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill="none" stroke={arc.color} strokeWidth={stroke} strokeLinecap="round" />
      ))}
      <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={size * 0.1} fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {slices.length}
      </text>
      <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" fill="#9ca3af" fontSize={size * 0.07} fontFamily="DM Sans, sans-serif">
        holdings
      </text>
    </svg>
  );
}

// ─── Animated Bar Chart ───────────────────────────────────────────────────────
function BarChart({ bars, height = 160, label = 'P&L' }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / 300, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [bars.map(b => b.value).join(',')]);

  const maxAbs = Math.max(...bars.map(b => Math.abs(b.value)), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', height }}>
      {bars.map((bar, i) => {
        const isPos = bar.value >= 0;
        const pct = (Math.abs(bar.value) / maxAbs) * 100 * progress;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
            <span style={{ width: '40px', fontSize: '0.7rem', color: 'var(--color-text-muted)', textAlign: 'right', flexShrink: 0 }}>{bar.label}</span>
            <div style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <div style={{
                height: '60%',
                width: `${pct}%`,
                minWidth: 2,
                borderRadius: '3px',
                background: isPos
                  ? 'linear-gradient(90deg, var(--color-teal), var(--color-jade))'
                  : 'linear-gradient(90deg, #FF4D4D, #b91c1c)',
                boxShadow: isPos ? '0 0 8px rgba(0,230,118,0.3)' : '0 0 8px rgba(239,68,68,0.3)',
                transition: 'width 0.1s',
              }} />
            </div>
            <span style={{ width: '70px', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: isPos ? 'var(--color-jade)' : 'var(--color-red)', textAlign: 'right', flexShrink: 0 }}>
              {isPos ? '+' : ''}₹{Math.abs(bar.value).toFixed(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Animated Ring (Win Rate) ─────────────────────────────────────────────────
function WinRateRing({ percent, size = 140 }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / 300, 1);
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [percent]);

  const r = size * 0.36;
  const circ = 2 * Math.PI * r;
  const drawn = circ * (percent / 100) * progress;
  const color = percent >= 60 ? '#5DD394' : percent >= 40 ? '#f59e0b' : '#FF4D4D';
  const glow = percent >= 60 ? 'rgba(0,230,118,0.4)' : percent >= 40 ? 'rgba(245,158,11,0.4)' : 'rgba(239,68,68,0.4)';

  return (
    <svg width={size} height={size} style={{ overflow: 'visible' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={size * 0.1} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={size * 0.1}
        strokeDasharray={`${drawn} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
      />
      <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" fill={color} fontSize={size * 0.18} fontWeight="800" fontFamily="JetBrains Mono, monospace">
        {Math.round(percent * progress)}%
      </text>
      <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fill="#9ca3af" fontSize={size * 0.09} fontFamily="DM Sans, sans-serif">
        WIN RATE
      </text>
    </svg>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function DashboardTab({ portfolio, watchlist = [] }) {
  const [pnlPeriod, setPnlPeriod] = useState('week');

  // Derive sector data from positions
  const pieSlices = (() => {
    const arr = portfolio.positions.map((pos, i) => {
      const asset = watchlist.find(w => w.symbol === pos.symbol);
      const val = (asset ? asset.price : pos.avgBuyPrice) * pos.shares;
      return { name: pos.symbol, value: val, color: SECTOR_COLORS[i % SECTOR_COLORS.length] };
    });
    if (portfolio.balance > 0) arr.push({ name: 'Cash', value: portfolio.balance, color: '#6b7280' });
    return arr;
  })();

  // Win rate calculation
  const filledSells = portfolio.orderHistory.filter(o => o.status === 'FILLED' && o.type === 'SELL');
  const totalFilled = portfolio.orderHistory.filter(o => o.status === 'FILLED');
  const winRate = totalFilled.length > 0 ? (filledSells.length / totalFilled.length) * 100 : 0;
  const totalTrades = portfolio.orderHistory.length;

  // Mock P&L bar data seeded from portfolio
  const basePnl = portfolio.totalPnL;
  const pnlData = {
    day: [
      { label: 'Mon', value: basePnl * 0.08 + 120 },
      { label: 'Tue', value: basePnl * 0.15 - 80 },
      { label: 'Wed', value: basePnl * 0.22 + 200 },
      { label: 'Thu', value: basePnl * 0.12 - 150 },
      { label: 'Fri', value: basePnl * 0.18 + 95 },
      { label: 'Sat', value: basePnl * 0.1 + 60 },
      { label: 'Sun', value: basePnl * 0.09 - 35 },
    ],
    week: [
      { label: 'W1', value: basePnl * 0.15 + 350 },
      { label: 'W2', value: basePnl * 0.3 - 180 },
      { label: 'W3', value: basePnl * 0.28 + 620 },
      { label: 'W4', value: basePnl * 0.27 - 290 },
    ],
    month: [
      { label: 'Jan', value: basePnl * 0.1 + 1200 },
      { label: 'Feb', value: basePnl * 0.2 - 800 },
      { label: 'Mar', value: basePnl * 0.35 + 2100 },
      { label: 'Apr', value: basePnl * 0.35 + 1400 },
    ],
  };

  // Top gainers / losers from positions
  const enriched = portfolio.positions.map(pos => {
    const asset = watchlist.find(w => w.symbol === pos.symbol);
    const curPrice = asset ? asset.price : pos.avgBuyPrice;
    const pnl = (curPrice - pos.avgBuyPrice) * pos.shares;
    const pct = ((curPrice - pos.avgBuyPrice) / pos.avgBuyPrice) * 100;
    return { ...pos, curPrice, pnl, pct };
  });

  const gainers = [...enriched].sort((a, b) => b.pct - a.pct).slice(0, 3);
  const losers  = [...enriched].sort((a, b) => a.pct - b.pct).slice(0, 3);

  const statsCards = [
    { label: 'Cash Balance', val: fmt(portfolio.balance), color: 'var(--color-teal)', icon: <Wallet size={16} />, border: 'var(--color-teal)' },
    { label: 'Total P&L', val: `${portfolio.totalPnL >= 0 ? '+' : ''}${fmt(portfolio.totalPnL)}`, color: portfolio.totalPnL >= 0 ? 'var(--color-jade)' : 'var(--color-red)', icon: <Percent size={16} />, border: portfolio.totalPnL >= 0 ? 'var(--color-jade)' : 'var(--color-red)' },
    { label: 'Active Positions', val: portfolio.positions.length, color: '#a855f7', icon: <TrendingUp size={16} />, border: '#a855f7' },
    { label: 'Total Trades', val: totalTrades, color: '#f59e0b', icon: <BarChart2 size={16} />, border: '#f59e0b' },
  ];

  return (
    <div className="tab-enter" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Stats row ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
        {statsCards.map(card => (
          <div key={card.label} className="glassy-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: `2px solid ${card.border}`, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
              <span>{card.label}</span>
              <span style={{ color: card.border }}>{card.icon}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.55rem', fontWeight: 800, color: card.color }}>{card.val}</span>
          </div>
        ))}
      </div>

      {/* ── Charts row ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 0.9fr', gap: '16px' }}>

        {/* Donut – Sector Breakdown */}
        <div className="glassy-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-teal)' }} />
            <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem' }}>Portfolio Allocation</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <DonutChart slices={pieSlices} size={180} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {pieSlices.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: s.color, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ color: 'var(--color-text-secondary)' }}>{s.name}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  {((s.value / (pieSlices.reduce((a, b) => a + b.value, 0) || 1)) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* P&L Bar Chart */}
        <div className="glassy-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-jade)' }} />
              <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem' }}>Profit & Loss</span>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {['day', 'week', 'month'].map(p => (
                <button
                  key={p}
                  onClick={() => setPnlPeriod(p)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-header)',
                    cursor: 'pointer',
                    background: pnlPeriod === p ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.04)',
                    color: pnlPeriod === p ? 'var(--color-jade)' : 'var(--color-text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <BarChart key={pnlPeriod} bars={pnlData[pnlPeriod]} height={200} />
        </div>

        {/* Win Rate Ring */}
        <div className="glassy-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a855f7' }} />
            <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem' }}>Win Rate</span>
          </div>
          <WinRateRing percent={winRate} size={150} />
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 800, color: winRate >= 60 ? 'var(--color-jade)' : winRate >= 40 ? '#f59e0b' : 'var(--color-red)' }}>
              {filledSells.length}/{totalFilled.length}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>Winning Trades</p>
          </div>
        </div>

      </div>

      {/* ── Gainers / Losers ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Top Gainers */}
        <div className="glassy-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <TrendingUp size={16} color="var(--color-jade)" />
            <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem' }}>Top Gainers</span>
          </div>
          {gainers.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>
              Buy assets to see gainers
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {gainers.map((g, i) => (
                <div key={g.symbol} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(0,230,118,0.04)', borderRadius: '10px', border: '1px solid rgba(0,230,118,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>{g.symbol}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{g.shares} shares</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-jade)' }}>
                      +{g.pct.toFixed(2)}%
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-jade)', opacity: 0.8 }}>+{fmt(g.pnl)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Losers */}
        <div className="glassy-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <TrendingDown size={16} color="var(--color-red)" />
            <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem' }}>Top Losers</span>
          </div>
          {losers.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>
              Buy assets to see losers
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {losers.filter(l => l.pct < 0).map((l, i) => (
                <div key={l.symbol} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(239,68,68,0.04)', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.12)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>{l.symbol}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{l.shares} shares</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-red)' }}>
                      {l.pct.toFixed(2)}%
                    </p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-red)', opacity: 0.8 }}>{fmt(l.pnl)}</p>
                  </div>
                </div>
              ))}
              {losers.filter(l => l.pct < 0).length === 0 && (
                <p style={{ color: 'var(--color-jade)', fontSize: '0.85rem', textAlign: 'center', padding: '20px 0' }}>
                  🎉 All positions profitable!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Trades Table ───────────────────────────────── */}
      <div className="glassy-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Award size={16} color="var(--color-teal)" />
          <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem' }}>Recent Executions</span>
        </div>
        {portfolio.orderHistory.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                  {['Time', 'Asset', 'Type', 'Qty', 'Price', 'Status'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {portfolio.orderHistory.slice(0, 8).map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--color-text-muted)' }}>{order.timestamp}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700 }}>{order.symbol}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: order.type === 'BUY' ? 'var(--color-jade)' : 'var(--color-red)' }}>{order.type}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>{order.shares}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>${order.price.toFixed(2)}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        background: order.status === 'FILLED' ? 'rgba(0,230,118,0.1)' : 'rgba(239,68,68,0.1)',
                        color: order.status === 'FILLED' ? 'var(--color-jade)' : 'var(--color-red)',
                        letterSpacing: '0.3px',
                      }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-text-muted)', padding: '24px 0', justifyContent: 'center' }}>
            <AlertCircle size={18} />
            <span>No trades yet — head to Market to place orders.</span>
          </div>
        )}
      </div>
    </div>
  );
}
