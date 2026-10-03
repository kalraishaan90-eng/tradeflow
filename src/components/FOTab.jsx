import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Zap, Calendar, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { formatINR } from '../lib/format.mjs';

// --- Expiry Date Scroll Wheel ---
function ExpiryScrollWheel({ expiries, selected, onSelect }) {
  const containerRef = useRef(null);
  const itemHeight = 44;

  const selectedIndex = expiries.indexOf(selected);

  const scroll = (dir) => {
    const next = Math.max(0, Math.min(expiries.length - 1, selectedIndex + dir));
    onSelect(expiries[next]);
  };

  return (
    <div className="expiry-wheel">
      <button className="expiry-arrow" onClick={() => scroll(-1)} disabled={selectedIndex === 0}>
        <ChevronLeft size={16} />
      </button>

      <div className="expiry-wheel-viewport" ref={containerRef}>
        <div className="expiry-wheel-track">
          {expiries.map((exp, i) => (
            <div
              key={exp}
              className={`expiry-item ${selected === exp ? 'selected' : i === selectedIndex - 1 || i === selectedIndex + 1 ? 'adjacent' : 'distant'}`}
              onClick={() => onSelect(exp)}
            >
              {exp}
            </div>
          ))}
        </div>
      </div>

      <button className="expiry-arrow" onClick={() => scroll(1)} disabled={selectedIndex === expiries.length - 1}>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}

// Greeks card widget
function GreeksDisplay({ greeks }) {
  const greekItems = [
    { key: 'delta', label: 'Δ Delta', desc: 'Price sensitivity', color: 'var(--color-teal)' },
    { key: 'gamma', label: 'Γ Gamma', desc: 'Delta rate of change', color: 'var(--color-jade)' },
    { key: 'theta', label: 'Θ Theta', desc: 'Time decay (per day)', color: 'var(--color-rose, #ff4d4d)' },
    { key: 'vega', label: 'ν Vega', desc: 'Volatility sensitivity', color: '#a78bfa' },
    { key: 'rho', label: 'ρ Rho', desc: 'Interest rate effect', color: '#fb923c' },
  ];

  return (
    <div className="greeks-grid">
      {greekItems.map(g => (
        <div key={g.key} className="greek-card" style={{ '--greek-color': g.color }}>
          <div className="greek-label" style={{ color: g.color }}>{g.label}</div>
          <div className="greek-value mono-text">{greeks[g.key]?.toFixed(4) ?? '--'}</div>
          <div className="greek-desc">{g.desc}</div>
        </div>
      ))}
    </div>
  );
}

// Compute option greeks from Black-Scholes approximation
function computeGreeks(S, K, T, r = 0.05, sigma = 0.25, type = 'CALL') {
  if (T <= 0) return { delta: 0, gamma: 0, theta: 0, vega: 0, rho: 0 };

  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const cdf = (x) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989422820 * Math.exp(-0.5 * x * x);
    const poly = t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
    return x >= 0 ? 1 - d * poly : d * poly;
  };
  const pdf = (x) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

  const Nd1 = cdf(d1);
  const Nd2 = cdf(d2);
  const nPDFd1 = pdf(d1);

  const delta = type === 'CALL' ? Nd1 : Nd1 - 1;
  const gamma = nPDFd1 / (S * sigma * sqrtT);
  const theta = (type === 'CALL'
    ? (-(S * nPDFd1 * sigma) / (2 * sqrtT)) - r * K * Math.exp(-r * T) * Nd2
    : (-(S * nPDFd1 * sigma) / (2 * sqrtT)) + r * K * Math.exp(-r * T) * (1 - Nd2)
  ) / 365;
  const vega = S * nPDFd1 * sqrtT / 100;
  const rho = (type === 'CALL'
    ? K * T * Math.exp(-r * T) * Nd2
    : -K * T * Math.exp(-r * T) * (1 - Nd2)
  ) / 100;

  return { delta, gamma, theta, vega, rho };
}

// Compute option premium (Black-Scholes)
function computePremium(S, K, T, r = 0.05, sigma = 0.25, type = 'CALL') {
  if (T <= 0) return Math.max(type === 'CALL' ? S - K : K - S, 0);

  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  const cdf = (x) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989422820 * Math.exp(-0.5 * x * x);
    const poly = t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
    return x >= 0 ? 1 - d * poly : d * poly;
  };

  if (type === 'CALL') {
    return S * cdf(d1) - K * Math.exp(-r * T) * cdf(d2);
  } else {
    return K * Math.exp(-r * T) * cdf(-d2) - S * cdf(-d1);
  }
}

// Generate expiry dates (next 6 monthly expiries)
function generateExpiries() {
  const expiries = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i + 1, 0); // last day of each month
    // Find last Thursday
    const day = d.getDay();
    const offset = day >= 4 ? day - 4 : 7 - (4 - day);
    d.setDate(d.getDate() - offset);
    expiries.push(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }));
  }
  return expiries;
}

export default function FOTab({ kycCompleted, watchlist, portfolio, executeTrade, setActiveTab }) {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [selectedExpiry, setSelectedExpiry] = useState(null);
  const [selectedStrike, setSelectedStrike] = useState(null);
  const [selectedOptionType, setSelectedOptionType] = useState('CALL');
  const [showGreeks, setShowGreeks] = useState(true);
  const [hoveredStrike, setHoveredStrike] = useState(null);
  const [tradeFeedback, setTradeFeedback] = useState('');

  const expiries = generateExpiries();

  useEffect(() => {
    if (!selectedExpiry) setSelectedExpiry(expiries[0]);
  }, []);

  const activeAsset = watchlist.find(w => w.symbol === selectedAsset) || watchlist[0];

  const fmt = (val) => formatINR(val);

  // Strike price range calculation
  const strikePriceRange = activeAsset ? (() => {
    const base = Math.round(activeAsset.price);
    const step = activeAsset.type === 'Crypto' ? 500 : activeAsset.type === 'Stock' ? 10 : 1;
    return [-4, -3, -2, -1, 0, 1, 2, 3, 4].map(i => base + i * step);
  })() : [];

  // Time to expiry in years (simulated — each monthly expiry is ~1–6 months away)
  const expiryIndex = expiries.indexOf(selectedExpiry);
  const T = Math.max(0.01, (expiryIndex + 1) / 12);
  const S = activeAsset?.price || 100;
  const sigma = activeAsset?.type === 'Crypto' ? 0.65 : activeAsset?.type === 'Stock' ? 0.28 : 0.12;

  // Greeks for selected strike
  const greeks = selectedStrike
    ? computeGreeks(S, selectedStrike, T, 0.05, sigma, selectedOptionType)
    : computeGreeks(S, S, T, 0.05, sigma, selectedOptionType);

  const handleBuyOption = (strike, type) => {
    const premium = computePremium(S, strike, T, 0.05, sigma, type);
    const optionSymbol = `${activeAsset.symbol}-${strike}-${type}`;

    if (premium > portfolio.balance) {
      setTradeFeedback('Insufficient buying power for this option premium.');
      return;
    }

    const success = executeTrade(optionSymbol, 'BUY', 1, premium, 'Option Premium');
    if (success) {
      setTradeFeedback(`Bought ${type} option ${optionSymbol} for ${fmt(premium)}.`);
    }
  };

  // Render Lock screen if KYC not done
  if (!kycCompleted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div className="glassy-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '450px', textAlign: 'center', padding: '40px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255, 77, 77, 0.1)', color: '#ff4d4d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldAlert size={36} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px' }}>F&amp;O Trading Locked</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '8px', lineHeight: 1.6 }}>
              Complete the simulator trading quiz in your Profile to unlock derivatives trading.
            </p>
          </div>
          <button className="trade-btn buy-btn" style={{ width: '100%' }} onClick={() => setActiveTab('settings')}>
            Go to KYC Questionnaire
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fo-layout">
      {/* Top Controls Bar */}
      <div className="fo-controls-bar glassy-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={20} style={{ color: 'var(--color-jade)' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', margin: 0 }}>
            F&amp;O Derivatives Simulator
          </h2>
        </div>

        <div className="fo-top-controls">
          {/* Asset Selector */}
          <div className="fo-control-group">
            <label className="fo-control-label">Underlying</label>
            <select
              className="form-input form-select"
              style={{ width: '120px', padding: '8px 12px', fontSize: '13px' }}
              value={selectedAsset}
              onChange={e => setSelectedAsset(e.target.value)}
            >
              {watchlist.filter(w => w.type !== 'Forex').map(w => (
                <option key={w.symbol} value={w.symbol}>{w.symbol}</option>
              ))}
            </select>
          </div>

          {/* Live Price */}
          <div className="fo-price-ticker">
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Spot Price</span>
            <span className="mono-text fo-spot-price">
              {fmt(activeAsset?.price || 0)}
            </span>
          </div>

          {/* Greeks toggle */}
          <button
            className={`greeks-toggle-btn ${showGreeks ? 'active' : ''}`}
            onClick={() => setShowGreeks(!showGreeks)}
          >
            <Info size={14} /> Greeks
          </button>
        </div>
      </div>

      {tradeFeedback && (
        <div role="status" style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(13,242,201,0.08)', color: 'var(--color-teal)' }}>
          {tradeFeedback}
        </div>
      )}

      {/* Expiry Selector */}
      <div className="glassy-card expiry-selector-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
          <Calendar size={16} style={{ color: 'var(--color-teal)' }} />
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '14px' }}>
            Expiry Date
          </span>
        </div>
        <ExpiryScrollWheel
          expiries={expiries}
          selected={selectedExpiry}
          onSelect={setSelectedExpiry}
        />
        <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
          T = {(T * 365).toFixed(0)} days to expiry · IV: {(sigma * 100).toFixed(0)}%
        </div>
      </div>

      {/* Main Body: Options Chain + Greeks */}
      <div className="fo-main-grid">
        {/* Options Chain Table */}
        <div className="glassy-card fo-chain-card">
          <div className="fo-chain-header">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', margin: 0 }}>Options Chain</h3>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {selectedExpiry} expiry · Click to buy
            </span>
          </div>

          <div className="options-chain-table-wrapper">
            <table className="options-chain-table">
              <thead>
                <tr>
                  {/* CE Headers */}
                  <th className="ce-col">CE Delta</th>
                  <th className="ce-col">CE Theta</th>
                  <th className="ce-col chain-premium-ce">CE Premium</th>
                  {/* Strike */}
                  <th className="strike-col">Strike</th>
                  {/* PE Headers */}
                  <th className="pe-col chain-premium-pe">PE Premium</th>
                  <th className="pe-col">PE Theta</th>
                  <th className="pe-col">PE Delta</th>
                </tr>
              </thead>
              <tbody>
                {strikePriceRange.map((strike) => {
                  const ceGreeks = computeGreeks(S, strike, T, 0.05, sigma, 'CALL');
                  const peGreeks = computeGreeks(S, strike, T, 0.05, sigma, 'PUT');
                  const cePremium = computePremium(S, strike, T, 0.05, sigma, 'CALL');
                  const pePremium = computePremium(S, strike, T, 0.05, sigma, 'PUT');
                  const isATM = strike === Math.round(S / (activeAsset?.type === 'Crypto' ? 500 : 10)) * (activeAsset?.type === 'Crypto' ? 500 : 10);
                  const isHovered = hoveredStrike === strike;
                  const isSelected = selectedStrike === strike;

                  return (
                    <tr
                      key={strike}
                      className={`chain-row ${isATM ? 'atm-row' : ''} ${isSelected ? 'selected-row' : ''} ${isHovered ? 'hovered-row' : ''}`}
                      onMouseEnter={() => setHoveredStrike(strike)}
                      onMouseLeave={() => setHoveredStrike(null)}
                      onClick={() => {
                        setSelectedStrike(strike);
                        setSelectedOptionType(strike < S ? 'PUT' : 'CALL');
                      }}
                    >
                      {/* CE Side */}
                      <td className="ce-col mono-text chain-greek">{ceGreeks.delta.toFixed(3)}</td>
                      <td className="ce-col mono-text chain-greek theta-val">{ceGreeks.theta.toFixed(4)}</td>
                      <td className="ce-col chain-premium-ce">
                        <button
                          className="chain-premium-btn ce-btn"
                          onClick={(e) => { e.stopPropagation(); handleBuyOption(strike, 'CALL'); }}
                        >
                          <span className="mono-text">{fmt(cePremium)}</span>
                          <span className="chain-btn-label">Buy CE</span>
                        </button>
                      </td>

                      {/* Strike */}
                      <td className="strike-col">
                        <div className={`chain-strike-badge ${isATM ? 'atm-badge' : ''}`}>
                          <span className="mono-text">{strike.toLocaleString()}</span>
                          {isATM && <span className="atm-label">ATM</span>}
                        </div>
                      </td>

                      {/* PE Side */}
                      <td className="pe-col chain-premium-pe">
                        <button
                          className="chain-premium-btn pe-btn"
                          onClick={(e) => { e.stopPropagation(); handleBuyOption(strike, 'PUT'); }}
                        >
                          <span className="chain-btn-label">Buy PE</span>
                          <span className="mono-text">{fmt(pePremium)}</span>
                        </button>
                      </td>
                      <td className="pe-col mono-text chain-greek theta-val">{peGreeks.theta.toFixed(4)}</td>
                      <td className="pe-col mono-text chain-greek">{peGreeks.delta.toFixed(3)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Greeks Panel */}
        {showGreeks && (
          <div className="fo-greeks-panel glassy-card">
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', margin: 0 }}>
                Greeks Analysis
              </h3>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                {selectedStrike ? `Strike: ${selectedStrike.toLocaleString()} · ${selectedOptionType}` : 'Select a strike to view'}
              </p>

              {/* Option type toggle */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  className={`greeks-type-btn ${selectedOptionType === 'CALL' ? 'active-call' : ''}`}
                  onClick={() => setSelectedOptionType('CALL')}
                >CALL</button>
                <button
                  className={`greeks-type-btn ${selectedOptionType === 'PUT' ? 'active-put' : ''}`}
                  onClick={() => setSelectedOptionType('PUT')}
                >PUT</button>
              </div>
            </div>

            <GreeksDisplay greeks={greeks} />

            {/* Theoretical premium */}
            <div className="greeks-premium-display">
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '12px' }}>Theoretical Premium</span>
              <span className="mono-text" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-teal)' }}>
                {fmt(computePremium(S, selectedStrike || S, T, 0.05, sigma, selectedOptionType))}
              </span>
            </div>

            {/* Buy button */}
            <button
              className={`trade-btn ${selectedOptionType === 'CALL' ? 'buy-btn' : 'sell-btn'}`}
              style={{ width: '100%', marginTop: '12px', fontSize: '13px', padding: '12px' }}
              onClick={() => selectedStrike && handleBuyOption(selectedStrike, selectedOptionType)}
            >
              Buy {selectedOptionType} @ {selectedStrike ? selectedStrike.toLocaleString() : 'Select Strike'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
