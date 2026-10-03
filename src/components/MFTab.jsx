import React, { useState, useMemo } from 'react';
import { PieChart, TrendingUp, Shield, ChevronRight, Check, AlertCircle, Star, Zap, Target } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatINR0 } from '../lib/format.mjs';

const FUNDS = [
  {
    id: 'tf-nifty50',
    name: 'TradeFlow Nifty 50 Index',
    category: 'Index Fund',
    amc: 'TradeFlow AMC',
    risk: 'Moderate',
    riskScore: 3,
    nav: 142.35,
    return1y: 18.6,
    return3y: 14.8,
    return5y: 12.4,
    expenseRatio: 0.12,
    aum: '₹28,500 Cr',
    minSIP: 100,
    minLumpsum: 1000,
    desc: 'Mirrors the performance of Nifty 50 index with ultra-low expense ratio. Ideal for passive long-term investors.',
    tags: ['Low Cost', 'Diversified', 'Blue-chip'],
    color: 'var(--color-teal)',
    sigma: 0.14,
  },
  {
    id: 'tf-tech-growth',
    name: 'TradeFlow Tech Sector Growth',
    category: 'Equity Growth',
    amc: 'TradeFlow AMC',
    risk: 'High',
    riskScore: 5,
    nav: 386.72,
    return1y: 42.3,
    return3y: 26.4,
    return5y: 24.8,
    expenseRatio: 0.75,
    aum: '₹6,200 Cr',
    minSIP: 200,
    minLumpsum: 2500,
    desc: 'High-conviction fund targeting AI, semiconductor, and SaaS leaders. High risk, high return potential.',
    tags: ['AI/ML', 'High Growth', 'Thematic'],
    color: '#a78bfa',
    sigma: 0.32,
  },
  {
    id: 'tf-debt-conservative',
    name: 'TradeFlow Conservative Debt',
    category: 'Debt Fund',
    amc: 'TradeFlow AMC',
    risk: 'Low',
    riskScore: 1,
    nav: 31.18,
    return1y: 7.2,
    return3y: 6.5,
    return5y: 6.8,
    expenseRatio: 0.25,
    aum: '₹15,700 Cr',
    minSIP: 50,
    minLumpsum: 500,
    desc: 'Capital preservation fund investing in AAA-rated bonds and government securities. Steady, low volatility.',
    tags: ['Safe', 'Capital Preservation', 'Bonds'],
    color: '#34d399',
    sigma: 0.04,
  },
  {
    id: 'tf-balanced-advantage',
    name: 'TradeFlow Balanced Advantage',
    category: 'Hybrid Fund',
    amc: 'TradeFlow AMC',
    risk: 'Moderate',
    riskScore: 3,
    nav: 87.55,
    return1y: 22.1,
    return3y: 17.5,
    return5y: 15.2,
    expenseRatio: 0.48,
    aum: '₹11,400 Cr',
    minSIP: 150,
    minLumpsum: 1500,
    desc: 'Dynamically allocates between equity and debt based on market valuations. Best risk-adjusted returns.',
    tags: ['Dynamic', 'All-weather', 'Tax efficient'],
    color: '#fb923c',
    sigma: 0.18,
  },
];

const RISK_META = {
  Low: { label: 'Low Risk', icon: Shield, color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  Moderate: { label: 'Moderate', icon: Target, color: 'var(--color-teal)', bg: 'rgba(13,242,201,0.1)' },
  High: { label: 'High Risk', icon: Zap, color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
};

// Risk meter display
function RiskMeter({ score }) {
  return (
    <div className="risk-meter">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={`risk-pip ${i <= score ? 'active' : ''}`}
          style={{ backgroundColor: i <= score ? (score >= 4 ? '#f87171' : score >= 3 ? 'var(--color-teal)' : '#34d399') : undefined }}
        />
      ))}
    </div>
  );
}

// Custom recharts tooltip
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const fmt = (val) => formatINR0(val);
    return (
      <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', fontSize: '12px' }}>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '6px' }}>{label}</p>
        {payload.map(entry => (
          <p key={entry.name} style={{ color: entry.stroke, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
            {entry.name}: {fmt(entry.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

// NAV units calculator
function unitsFromBalance(amount, nav) {
  return (amount / nav).toFixed(3);
}

export default function MFTab({ portfolio, executeTrade }) {
  const [activeFundId, setActiveFundId] = useState('tf-nifty50');
  const [calcType, setCalcType] = useState('SIP');
  const [monthlyInvest, setMonthlyInvest] = useState(500);
  const [timePeriod, setTimePeriod] = useState(10);
  const [investSuccess, setInvestSuccess] = useState(null);
  const [activeReturnFilter, setActiveReturnFilter] = useState('1y');

  const activeFund = FUNDS.find(f => f.id === activeFundId) || FUNDS[0];
  const riskMeta = RISK_META[activeFund.risk];
  const RiskIcon = riskMeta.icon;

  const expectedReturn = activeFund[`return${activeReturnFilter.replace('y', '')}y`] || activeFund.return1y;

  const fmt = (val) => formatINR0(val);

  // SIP projection data
  const projectionData = useMemo(() => {
    const rate = (expectedReturn / 100) / 12;
    const data = [];

    for (let i = 1; i <= timePeriod; i++) {
      const m = i * 12;
      const invested = calcType === 'SIP' ? monthlyInvest * m : monthlyInvest * 10;
      const wealth = calcType === 'SIP'
        ? monthlyInvest * (((Math.pow(1 + rate, m) - 1) / rate) * (1 + rate))
        : (monthlyInvest * 10) * Math.pow(1 + (expectedReturn / 100), i);

      data.push({
        year: `Yr ${i}`,
        Invested: Math.round(invested),
        Wealth: Math.round(wealth),
      });
    }
    return data;
  }, [calcType, monthlyInvest, timePeriod, expectedReturn]);

  const finalData = projectionData[projectionData.length - 1] || { Invested: 0, Wealth: 0 };
  const estimatedReturns = finalData.Wealth - finalData.Invested;
  const investAmount = calcType === 'SIP' ? monthlyInvest : monthlyInvest * 10;
  const unitsAllocated = unitsFromBalance(investAmount, activeFund.nav);

  const handleInvest = () => {
    if (investAmount > portfolio.balance) {
      alert('Insufficient virtual cash balance for this investment.');
      return;
    }

    const success = executeTrade(activeFund.name, 'BUY', 1, investAmount, 'Mutual Fund');
    if (success) {
      setInvestSuccess({ fund: activeFund.name, amount: investAmount, units: unitsAllocated });
      setTimeout(() => setInvestSuccess(null), 5000);
    }
  };

  const returnKeys = [
    { key: '1y', label: '1Y' },
    { key: '3y', label: '3Y' },
    { key: '5y', label: '5Y' },
  ];

  return (
    <div className="mf-layout">
      {/* Success toast */}
      {investSuccess && (
        <div className="invest-success-toast">
          <Check size={16} style={{ color: 'var(--color-jade)' }} />
          <div>
            <strong>Investment Successful!</strong>
            <p style={{ fontSize: '12px', margin: 0, color: 'var(--color-text-secondary)' }}>
              {fmt(investSuccess.amount)} → {investSuccess.units} units of {investSuccess.fund}
            </p>
          </div>
        </div>
      )}

      <div className="mf-main-grid">
        {/* ========== LEFT: Fund Cards ========== */}
        <div className="mf-funds-col">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', margin: 0 }}>Top Mutual Funds</h3>
            <div className="mf-return-filter">
              {returnKeys.map(rk => (
                <button
                  key={rk.key}
                  className={`return-filter-btn ${activeReturnFilter === rk.key ? 'active' : ''}`}
                  onClick={() => setActiveReturnFilter(rk.key)}
                >
                  {rk.label}
                </button>
              ))}
            </div>
          </div>

          <div className="fund-cards-list">
            {FUNDS.map((fund) => {
              const isActive = activeFundId === fund.id;
              const fRisk = RISK_META[fund.risk];
              const FRiskIcon = fRisk.icon;
              const returnVal = fund[`return${activeReturnFilter.replace('y', '')}y`];

              return (
                <div
                  key={fund.id}
                  className={`fund-card ${isActive ? 'fund-card-active' : ''}`}
                  style={{ '--fund-color': fund.color }}
                  onClick={() => setActiveFundId(fund.id)}
                >
                  {/* Left accent */}
                  <div className="fund-card-accent" style={{ background: fund.color }} />

                  <div className="fund-card-body">
                    <div className="fund-card-top">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Category + risk */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span className="fund-category-tag" style={{ background: fRisk.bg, color: fRisk.color }}>
                            <FRiskIcon size={10} /> {fund.category}
                          </span>
                          <RiskMeter score={fund.riskScore} />
                        </div>
                        <div className="fund-name">{fund.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          NAV: <span className="mono-text" style={{ fontWeight: 600 }}>${fund.nav.toFixed(2)}</span>
                          &nbsp;·&nbsp;AUM: {fund.aum}
                        </div>
                      </div>

                      {/* Return */}
                      <div className="fund-return-block">
                        <div className="fund-return-val mono-text" style={{ color: fund.color }}>
                          +{returnVal}%
                        </div>
                        <div className="fund-return-period">{activeReturnFilter.toUpperCase()} Return</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="fund-tags">
                      {fund.tags.map(t => (
                        <span key={t} className="fund-tag">{t}</span>
                      ))}
                      <span className="fund-expense">ER: {fund.expenseRatio}%</span>
                    </div>
                  </div>

                  <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ========== RIGHT: SIP Simulator + Invest ========== */}
        <div className="mf-simulator-col">
          {/* Fund Detail Header */}
          <div className="glassy-card mf-fund-detail">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    className="fund-category-tag"
                    style={{ background: riskMeta.bg, color: riskMeta.color, display: 'inline-flex', gap: '4px', alignItems: 'center' }}
                  >
                    <RiskIcon size={10} /> {riskMeta.label}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Expense Ratio: {activeFund.expenseRatio}%</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '15px', margin: 0 }}>{activeFund.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                  {activeFund.desc}
                </p>
              </div>

              {/* NAV block */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>NAV</div>
                <div className="mono-text" style={{ fontSize: '20px', fontWeight: 700, color: activeFund.color }}>
                  ₹{activeFund.nav.toFixed(2)}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
                  {returnKeys.map(rk => {
                    const rv = activeFund[`return${rk.key.replace('y', '')}y`];
                    return (
                      <div key={rk.key} style={{ textAlign: 'center' }}>
                        <div className="mono-text trend-up" style={{ fontSize: '12px', fontWeight: 700 }}>+{rv}%</div>
                        <div style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>{rk.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* SIP Simulator */}
          <div className="glassy-card mf-sip-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={16} style={{ color: 'var(--color-teal)' }} />
                SIP Simulator
              </h3>
              <div className="mf-calc-tabs">
                <button
                  className={`mf-calc-tab ${calcType === 'SIP' ? 'active' : ''}`}
                  onClick={() => setCalcType('SIP')}
                >Monthly SIP</button>
                <button
                  className={`mf-calc-tab ${calcType === 'Lumpsum' ? 'active' : ''}`}
                  onClick={() => setCalcType('Lumpsum')}
                >Lumpsum</button>
              </div>
            </div>

            {/* Sliders */}
            <div className="sip-sliders">
              <div className="sip-slider-group">
                <div className="sip-slider-header">
                  <span className="form-label">{calcType === 'SIP' ? 'Monthly Investment' : 'One-Time Amount'}</span>
                  <span className="mono-text sip-slider-val" style={{ color: activeFund.color }}>
                    {fmt(calcType === 'SIP' ? monthlyInvest : monthlyInvest * 10)}
                  </span>
                </div>
                <input
                  type="range" min={50} max={5000} step={50}
                  className="sip-range-input"
                  value={monthlyInvest}
                  onChange={e => setMonthlyInvest(parseInt(e.target.value))}
                  style={{ '--accent-color': activeFund.color }}
                />
                <div className="sip-range-labels">
                  <span>₹50</span><span>₹50,000</span>
                </div>
              </div>

              <div className="sip-slider-group">
                <div className="sip-slider-header">
                  <span className="form-label">Time Period</span>
                  <span className="mono-text sip-slider-val" style={{ color: activeFund.color }}>{timePeriod} Yrs</span>
                </div>
                <input
                  type="range" min={1} max={30}
                  className="sip-range-input"
                  value={timePeriod}
                  onChange={e => setTimePeriod(parseInt(e.target.value))}
                  style={{ '--accent-color': activeFund.color }}
                />
                <div className="sip-range-labels"><span>1 yr</span><span>30 yrs</span></div>
              </div>

              {/* Expected return info */}
              <div className="sip-return-info">
                <AlertCircle size={12} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                <span>Using {activeReturnFilter.toUpperCase()} historical return: <strong style={{ color: activeFund.color }}>{expectedReturn}% p.a.</strong></span>
              </div>
            </div>

            {/* Projection Chart */}
            <div className="sip-chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectionData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeFund.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={activeFund.color} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-teal)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--color-teal)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="year" stroke="var(--color-text-muted)" fontSize={9} tick={{ fill: 'var(--color-text-muted)' }} />
                  <YAxis stroke="var(--color-text-muted)" fontSize={9} tick={{ fill: 'var(--color-text-muted)' }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Wealth" name="Projected Wealth" stroke={activeFund.color} fill="url(#wealthGrad)" strokeWidth={2.5} dot={false} />
                  <Area type="monotone" dataKey="Invested" name="Total Invested" stroke="var(--color-teal)" fill="url(#investedGrad)" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="sip-summary-grid">
              <div className="sip-summary-item">
                <span>Total Invested</span>
                <strong className="mono-text">{fmt(finalData.Invested)}</strong>
              </div>
              <div className="sip-summary-item">
                <span>Est. Returns</span>
                <strong className="mono-text trend-up">+{fmt(estimatedReturns)}</strong>
              </div>
              <div className="sip-summary-item highlighted" style={{ '--accent': activeFund.color }}>
                <span>Projected Wealth</span>
                <strong className="mono-text" style={{ color: activeFund.color }}>{fmt(finalData.Wealth)}</strong>
              </div>
            </div>
          </div>

          {/* Invest Button Card */}
          <div className="glassy-card mf-invest-card" style={{ '--fund-color': activeFund.color }}>
            <div className="mf-invest-details">
              <div className="mf-invest-stat">
                <span>Invest Amount</span>
                <strong className="mono-text">{fmt(investAmount)}</strong>
              </div>
              <div className="mf-invest-stat">
                <span>NAV</span>
                <strong className="mono-text">₹{activeFund.nav.toFixed(2)}</strong>
              </div>
              <div className="mf-invest-stat">
                <span>Units Allocated</span>
                <strong className="mono-text" style={{ color: activeFund.color }}>{unitsAllocated}</strong>
              </div>
              <div className="mf-invest-stat">
                <span>Available Cash</span>
                <strong className="mono-text">{fmt(portfolio.balance)}</strong>
              </div>
            </div>

            <button
              className="mf-invest-btn"
              style={{ background: `linear-gradient(135deg, ${activeFund.color}, var(--color-jade))` }}
              onClick={handleInvest}
              disabled={investAmount > portfolio.balance}
            >
              <TrendingUp size={16} />
              Invest {fmt(investAmount)} · Get {unitsAllocated} Units
            </button>

            {investAmount > portfolio.balance && (
              <p style={{ fontSize: '11px', color: '#f87171', textAlign: 'center', marginTop: '8px' }}>
                Insufficient balance. Need {fmt(investAmount - portfolio.balance)} more.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
