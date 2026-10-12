import React, { useState, useMemo } from 'react';
import { PieChart, TrendingUp, Shield, ChevronRight, Check, AlertCircle, Star, Zap, Target, Award, Users, Layers, Briefcase } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatINR0 } from '../lib/format.mjs';

export const REAL_MUTUAL_FUNDS = [
  {
    id: 'sbi-nifty50',
    name: 'SBI Nifty 50 Index Fund Direct-Growth',
    category: 'Index Fund',
    amc: 'SBI Mutual Fund',
    manager: 'Raviprakash Sharma',
    risk: 'Moderate',
    riskScore: 3,
    nav: 248.60,
    return1y: 22.4,
    return3y: 15.6,
    return5y: 14.8,
    expenseRatio: 0.18,
    aum: '₹38,450 Cr',
    minSIP: 500,
    minLumpsum: 1000,
    desc: 'Replicates the Nifty 50 Index benchmark with ultra-low tracking error and institutional cost efficiency. Ideal bedrock for long-term passive equity compounding.',
    tags: ['Nifty 50', 'Large Cap', 'Ultra-Low Cost'],
    color: 'var(--color-teal)',
    sigma: 0.13,
    staffPick: true,
    benchmark: 'NIFTY 50 Total Returns Index',
    holdings: [
      { name: 'HDFC Bank Ltd.', weight: '11.8%' },
      { name: 'Reliance Industries Ltd.', weight: '9.6%' },
      { name: 'ICICI Bank Ltd.', weight: '8.1%' },
      { name: 'Infosys Ltd.', weight: '5.9%' },
      { name: 'ITC Ltd.', weight: '4.4%' }
    ]
  },
  {
    id: 'ppfas-flexicap',
    name: 'Parag Parikh Flexi Cap Fund Direct-Growth',
    category: 'Flexi Cap Fund',
    amc: 'PPFAS Mutual Fund',
    manager: 'Rajeev Thakkar & Raunak Onkar',
    risk: 'Moderate',
    riskScore: 4,
    nav: 84.15,
    return1y: 28.5,
    return3y: 21.2,
    return5y: 20.8,
    expenseRatio: 0.62,
    aum: '₹76,200 Cr',
    minSIP: 1000,
    minLumpsum: 1000,
    desc: 'Unconstrained value-oriented fund investing across Indian large, mid, and small caps alongside global US technology leaders (Alphabet, Microsoft, Meta).',
    tags: ['Staff Top Pick', 'Global Hedging', 'Value Alpha'],
    color: '#a78bfa',
    sigma: 0.15,
    staffPick: true,
    benchmark: 'NIFTY 500 Total Returns Index',
    holdings: [
      { name: 'HDFC Bank Ltd.', weight: '7.8%' },
      { name: 'Bajaj Holdings & Inv.', weight: '7.1%' },
      { name: 'ITC Ltd.', weight: '6.5%' },
      { name: 'Alphabet Inc. (Google)', weight: '5.2%' },
      { name: 'Microsoft Corp.', weight: '4.8%' }
    ]
  },
  {
    id: 'hdfc-midcap',
    name: 'HDFC Mid-Cap Opportunities Fund Direct-Growth',
    category: 'Mid Cap Fund',
    amc: 'HDFC Mutual Fund',
    manager: 'Chirag Setalvad',
    risk: 'High',
    riskScore: 5,
    nav: 198.40,
    return1y: 39.1,
    return3y: 29.4,
    return5y: 25.6,
    expenseRatio: 0.74,
    aum: '₹69,800 Cr',
    minSIP: 500,
    minLumpsum: 2000,
    desc: 'India’s flagship mid-cap fund focusing on scalable market champions with strong return on capital employed (ROCE) and high operating cash flows.',
    tags: ['Mid-Cap Leader', 'High Alpha', 'Wealth Multiplier'],
    color: '#fb923c',
    sigma: 0.18,
    staffPick: true,
    benchmark: 'NIFTY Midcap 150 TRI',
    holdings: [
      { name: 'Indian Hotels Co.', weight: '4.2%' },
      { name: 'Tata Communications', weight: '3.8%' },
      { name: 'Max Financial Services', weight: '3.5%' },
      { name: 'Federal Bank Ltd.', weight: '3.2%' },
      { name: 'Coforge Ltd.', weight: '3.0%' }
    ]
  },
  {
    id: 'nippon-smallcap',
    name: 'Nippon India Small Cap Fund Direct-Growth',
    category: 'Small Cap Fund',
    amc: 'Nippon Life India AMC',
    manager: 'Samir Rachh',
    risk: 'High',
    riskScore: 5,
    nav: 172.50,
    return1y: 42.8,
    return3y: 31.8,
    return5y: 29.2,
    expenseRatio: 0.68,
    aum: '₹58,400 Cr',
    minSIP: 500,
    minLumpsum: 2500,
    desc: 'Premier small-cap fund with proven track record of spotting emerging multibaggers in industrial engineering, chemicals, and consumption.',
    tags: ['Multibagger Alpha', 'High Growth', 'Deep Diversification'],
    color: '#f87171',
    sigma: 0.22,
    staffPick: false,
    benchmark: 'NIFTY Smallcap 250 TRI',
    holdings: [
      { name: 'Tube Investments of India', weight: '3.1%' },
      { name: 'HDFC Bank Ltd.', weight: '2.8%' },
      { name: 'Apar Industries Ltd.', weight: '2.5%' },
      { name: 'KPIT Technologies', weight: '2.3%' },
      { name: 'Tejas Networks', weight: '2.1%' }
    ]
  },
  {
    id: 'icici-equity-debt',
    name: 'ICICI Prudential Equity & Debt Fund Direct-Growth',
    category: 'Aggressive Hybrid',
    amc: 'ICICI Prudential AMC',
    manager: 'Sankaran Naren',
    risk: 'Moderate',
    riskScore: 3,
    nav: 342.10,
    return1y: 27.2,
    return3y: 20.1,
    return5y: 18.4,
    expenseRatio: 0.82,
    aum: '₹39,500 Cr',
    minSIP: 500,
    minLumpsum: 1000,
    desc: 'Dynamically balances equity upside (65-80%) with sovereign & AAA debt hedge (20-35%). Legendary counter-cyclical asset allocation strategy.',
    tags: ['All-Weather', 'Hybrid Shield', 'Counter-Cyclical'],
    color: '#34d399',
    sigma: 0.12,
    staffPick: true,
    benchmark: 'CRISIL Hybrid 35+65 Aggressive Index',
    holdings: [
      { name: 'ICICI Bank Ltd.', weight: '7.2%' },
      { name: 'Bharti Airtel Ltd.', weight: '6.8%' },
      { name: 'NTPC Ltd.', weight: '5.4%' },
      { name: 'GOI Sovereign 7.18% 2033', weight: '4.5%' },
      { name: 'Reliance Industries', weight: '4.2%' }
    ]
  },
  {
    id: 'tata-digital',
    name: 'Tata Digital India Fund Direct-Growth',
    category: 'Thematic Tech',
    amc: 'Tata Mutual Fund',
    manager: 'Meeta Shetty',
    risk: 'High',
    riskScore: 5,
    nav: 52.40,
    return1y: 33.6,
    return3y: 22.5,
    return5y: 24.1,
    expenseRatio: 0.38,
    aum: '₹11,200 Cr',
    minSIP: 500,
    minLumpsum: 1000,
    desc: 'Targeted thematic exposure to India’s leading software exporters, AI platforms, semiconductor engineering, and digital payment infrastructure.',
    tags: ['Tech & AI', 'Dollar Earning', 'Thematic'],
    color: '#38bdf8',
    sigma: 0.20,
    staffPick: false,
    benchmark: 'BSE Teck Total Returns Index',
    holdings: [
      { name: 'Infosys Ltd.', weight: '15.2%' },
      { name: 'Tata Consultancy Services', weight: '12.8%' },
      { name: 'HCL Technologies', weight: '9.4%' },
      { name: 'Tech Mahindra Ltd.', weight: '7.1%' },
      { name: 'Persistent Systems', weight: '5.5%' }
    ]
  },
  {
    id: 'absl-corporate-bond',
    name: 'Aditya Birla Sun Life Corporate Bond Fund Direct-Growth',
    category: 'Corporate Debt',
    amc: 'Aditya Birla Sun Life AMC',
    manager: 'Kaustubh Gupta',
    risk: 'Low',
    riskScore: 1,
    nav: 105.80,
    return1y: 8.1,
    return3y: 7.2,
    return5y: 7.5,
    expenseRatio: 0.32,
    aum: '₹24,100 Cr',
    minSIP: 500,
    minLumpsum: 1000,
    desc: 'Ultra-safe capital preservation vehicle holding strictly 100% AAA-rated public sector undertakings, banking debt, and Indian Sovereign G-Secs.',
    tags: ['Zero Default', 'AAA Safety', 'Capital Preservation'],
    color: '#10b981',
    sigma: 0.04,
    staffPick: false,
    benchmark: 'NIFTY Corporate Bond Index',
    holdings: [
      { name: 'NABARD AAA Bonds', weight: '8.5%' },
      { name: 'REC Ltd. AAA Bonds', weight: '7.9%' },
      { name: 'HDFC Bank Ltd. CD', weight: '7.2%' },
      { name: 'GOI Sovereign 7.26% 2033', weight: '12.0%' },
      { name: 'Power Finance Corp AAA', weight: '6.4%' }
    ]
  }
];

const RISK_META = {
  Low: { label: 'Low Risk', icon: Shield, color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  Moderate: { label: 'Moderate', icon: Target, color: 'var(--color-teal)', bg: 'rgba(13,242,201,0.1)' },
  High: { label: 'High Risk', icon: Zap, color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
};

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

function unitsFromBalance(amount, nav) {
  return (amount / nav).toFixed(3);
}

export default function MFTab({ portfolio, executeTrade }) {
  const [activeFundId, setActiveFundId] = useState('sbi-nifty50');
  const [calcType, setCalcType] = useState('SIP');
  // Initial monthly investment set within realistic ₹500 - ₹50,000 range
  const [monthlyInvest, setMonthlyInvest] = useState(5000);
  const [timePeriod, setTimePeriod] = useState(10);
  const [investSuccess, setInvestSuccess] = useState(null);
  const [activeReturnFilter, setActiveReturnFilter] = useState('1y');
  // Staff Mode vs All Funds Mode toggle (Flaw 10)
  const [staffModeOnly, setStaffModeOnly] = useState(false);

  const displayedFunds = useMemo(() => {
    if (staffModeOnly) {
      return REAL_MUTUAL_FUNDS.filter(f => f.staffPick);
    }
    return REAL_MUTUAL_FUNDS;
  }, [staffModeOnly]);

  const activeFund = displayedFunds.find(f => f.id === activeFundId) || displayedFunds[0] || REAL_MUTUAL_FUNDS[0];
  const riskMeta = RISK_META[activeFund.risk] || RISK_META.Moderate;
  const RiskIcon = riskMeta.icon;

  const expectedReturn = activeFund[`return${activeReturnFilter.replace('y', '')}y`] || activeFund.return1y;
  const fmt = (val) => formatINR0(val);

  // SIP projection calculations
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
      alert('Insufficient virtual cash balance for this mutual fund investment.');
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
            <strong>Investment Confirmed!</strong>
            <p style={{ fontSize: '12px', margin: 0, color: 'var(--color-text-secondary)' }}>
              {fmt(investSuccess.amount)} allocated → {investSuccess.units} units of {investSuccess.fund}
            </p>
          </div>
        </div>
      )}

      <div className="mf-main-grid">
        {/* ========== LEFT: Real AMC Fund Cards ========== */}
        <div className="mf-funds-col">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', margin: 0 }}>
                Real Indian Mutual Funds
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>AMFI & SEBI Real Fund Universe</span>
            </div>

            {/* Mode & Return Filters */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Staff Mode Toggle (Flaw 10) */}
              <button
                className={`return-filter-btn ${staffModeOnly ? 'active' : ''}`}
                onClick={() => setStaffModeOnly(!staffModeOnly)}
                title="Toggle verified staff picks with institutional ratings"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', borderColor: staffModeOnly ? 'var(--color-teal)' : undefined }}
              >
                <Award size={12} style={{ color: staffModeOnly ? 'var(--color-teal)' : undefined }} />
                <span>Staff Picks {staffModeOnly ? 'ON' : 'OFF'}</span>
              </button>

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
          </div>

          <div className="fund-cards-list">
            {displayedFunds.map((fund) => {
              const isActive = activeFundId === fund.id;
              const fRisk = RISK_META[fund.risk] || RISK_META.Moderate;
              const FRiskIcon = fRisk.icon;
              const returnVal = fund[`return${activeReturnFilter.replace('y', '')}y`];

              return (
                <div
                  key={fund.id}
                  className={`fund-card ${isActive ? 'fund-card-active' : ''}`}
                  style={{ '--fund-color': fund.color }}
                  onClick={() => setActiveFundId(fund.id)}
                >
                  <div className="fund-card-accent" style={{ background: fund.color }} />

                  <div className="fund-card-body">
                    <div className="fund-card-top">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span className="fund-category-tag" style={{ background: fRisk.bg, color: fRisk.color }}>
                            <FRiskIcon size={10} /> {fund.category}
                          </span>
                          {fund.staffPick && (
                            <span style={{ fontSize: '10px', background: 'rgba(93,211,148,0.15)', color: 'var(--color-jade)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                              <Star size={10} /> Staff Pick
                            </span>
                          )}
                          <RiskMeter score={fund.riskScore} />
                        </div>
                        <div className="fund-name">{fund.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          AMC: <strong style={{ color: 'var(--color-text-secondary)' }}>{fund.amc}</strong> · NAV: <span className="mono-text" style={{ fontWeight: 600, color: '#fff' }}>₹{fund.nav.toFixed(2)}</span>
                          &nbsp;·&nbsp;AUM: {fund.aum}
                        </div>
                      </div>

                      <div className="fund-return-block">
                        <div className="fund-return-val mono-text" style={{ color: fund.color }}>
                          +{returnVal}%
                        </div>
                        <div className="fund-return-period">{activeReturnFilter.toUpperCase()} CAGR</div>
                      </div>
                    </div>

                    <div className="fund-tags">
                      {fund.tags.map(t => (
                        <span key={t} className="fund-tag">{t}</span>
                      ))}
                      <span className="fund-expense">Exp Ratio: {fund.expenseRatio}%</span>
                    </div>
                  </div>

                  <ChevronRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ========== RIGHT: Fund Detail + Real Analytics & SIP Simulator ========== */}
        <div className="mf-simulator-col">
          {/* Fund Detail Header with Real Institutional Data */}
          <div className="glassy-card mf-fund-detail">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span
                    className="fund-category-tag"
                    style={{ background: riskMeta.bg, color: riskMeta.color, display: 'inline-flex', gap: '4px', alignItems: 'center' }}
                  >
                    <RiskIcon size={10} /> {riskMeta.label}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>AMC: <strong style={{ color: '#fff' }}>{activeFund.amc}</strong></span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Manager: <strong style={{ color: '#fff' }}>{activeFund.manager}</strong></span>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Expense Ratio: {activeFund.expenseRatio}%</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', margin: 0, color: '#fff' }}>{activeFund.name}</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                  {activeFund.desc}
                </p>

                {/* Real Holdings Breakdown (Flaw 10) */}
                <div style={{ marginTop: '12px', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Briefcase size={12} /> Top 5 Portfolio Holdings ({activeFund.benchmark})
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {activeFund.holdings.map((h, i) => (
                      <span key={i} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', color: 'var(--color-text-primary)' }}>
                        {h.name} <strong style={{ color: activeFund.color }}>{h.weight}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* NAV block */}
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>CURRENT NAV</div>
                <div className="mono-text" style={{ fontSize: '22px', fontWeight: 800, color: activeFund.color }}>
                  ₹{activeFund.nav.toFixed(2)}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
                  {returnKeys.map(rk => {
                    const rv = activeFund[`return${rk.key.replace('y', '')}y`];
                    return (
                      <div key={rk.key} style={{ textAlign: 'center' }}>
                        <div className="mono-text trend-up" style={{ fontSize: '12px', fontWeight: 700 }}>+{rv}%</div>
                        <div style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>{rk.label} CAGR</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* SIP Simulator (Flaw 2: fixed slider to 50k) */}
          <div className="glassy-card mf-sip-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={16} style={{ color: 'var(--color-teal)' }} />
                Compounding SIP Calculator
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
                  <span className="form-label">{calcType === 'SIP' ? 'Monthly SIP Investment' : 'One-Time Lumpsum Investment'}</span>
                  <span className="mono-text sip-slider-val" style={{ color: activeFund.color }}>
                    {fmt(calcType === 'SIP' ? monthlyInvest : monthlyInvest * 10)}
                  </span>
                </div>
                {/* FIXED SLIDER: min 500, max 50000, step 500 so it actually reaches ₹50,000 as displayed */}
                <input
                  type="range"
                  min={500}
                  max={50000}
                  step={500}
                  className="sip-range-input"
                  value={monthlyInvest}
                  onChange={e => setMonthlyInvest(parseInt(e.target.value))}
                  style={{ '--accent-color': activeFund.color }}
                />
                <div className="sip-range-labels">
                  <span>₹500</span>
                  <span>₹25,000</span>
                  <span>₹50,000</span>
                </div>
              </div>

              <div className="sip-slider-group">
                <div className="sip-slider-header">
                  <span className="form-label">Investment Horizon</span>
                  <span className="mono-text sip-slider-val" style={{ color: activeFund.color }}>{timePeriod} Years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  className="sip-range-input"
                  value={timePeriod}
                  onChange={e => setTimePeriod(parseInt(e.target.value))}
                  style={{ '--accent-color': activeFund.color }}
                />
                <div className="sip-range-labels">
                  <span>1 yr</span>
                  <span>15 yrs</span>
                  <span>30 yrs</span>
                </div>
              </div>

              <div className="sip-return-info">
                <AlertCircle size={12} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
                <span>Simulating based on historical {activeReturnFilter.toUpperCase()} CAGR: <strong style={{ color: activeFund.color }}>{expectedReturn}% p.a.</strong></span>
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
                <span>Est. Capital Gains</span>
                <strong className="mono-text trend-up">+{fmt(estimatedReturns)}</strong>
              </div>
              <div className="sip-summary-item highlighted" style={{ '--accent': activeFund.color }}>
                <span>Final Projected Corpus</span>
                <strong className="mono-text" style={{ color: activeFund.color }}>{fmt(finalData.Wealth)}</strong>
              </div>
            </div>
          </div>

          {/* Invest Button Card */}
          <div className="glassy-card mf-invest-card" style={{ '--fund-color': activeFund.color }}>
            <div className="mf-invest-details">
              <div className="mf-invest-stat">
                <span>Allocation Amount</span>
                <strong className="mono-text">{fmt(investAmount)}</strong>
              </div>
              <div className="mf-invest-stat">
                <span>Current NAV</span>
                <strong className="mono-text">₹{activeFund.nav.toFixed(2)}</strong>
              </div>
              <div className="mf-invest-stat">
                <span>Units Credited</span>
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
              Confirm {calcType} Investment · {fmt(investAmount)} ({unitsAllocated} Units)
            </button>

            {investAmount > portfolio.balance && (
              <p style={{ fontSize: '11px', color: '#f87171', textAlign: 'center', marginTop: '8px' }}>
                Insufficient virtual cash. Need {fmt(investAmount - portfolio.balance)} more.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
