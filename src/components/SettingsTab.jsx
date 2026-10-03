import React, { useState, useEffect } from 'react';
import { User, Shield, ShieldAlert, ShieldCheck, RefreshCw, Zap, BookOpen, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { formatINR } from '../lib/format.mjs';

export default function SettingsTab({ 
  kycCompleted, 
  setKycCompleted, 
  resetPortfolio,
  portfolio,
  userDisplayName 
}) {
  const [kycStep, setKycStep] = useState(kycCompleted ? 4 : 1); // 1, 2, 3, 4 (completed)
  const [fullName, setFullName] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('');
  const [tradingExp, setTradingExp] = useState('');
  const [optionsKnowledge, setOptionsKnowledge] = useState('');
  
  const [showAmounts, setShowAmounts] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (kycCompleted) {
      setKycStep(4);
    }
  }, [kycCompleted]);

  useEffect(() => {
    setIsLightMode(document.documentElement.getAttribute('data-theme') === 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isLightMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsLightMode(!isLightMode);
  };

  // Calculate some stats
  const totalTradesCount = portfolio.orderHistory.length;
  const positionsCount = portfolio.positions.length;
  const netWorth = portfolio.balance + portfolio.positions.reduce((acc, pos) => acc + (pos.shares * pos.avgBuyPrice), 0);
  const STARTING_CASH = 8000000; // Must match STARTING_SIMULATED_CASH in src/lib/tradingGuards.mjs
  const netProfit = netWorth - STARTING_CASH;

  const handleNextStep = () => {
    if (kycStep === 1 && !fullName.trim()) {
      alert("Please enter your name to proceed.");
      return;
    }
    if (kycStep === 2 && !riskTolerance) {
      alert("Please select your risk tolerance.");
      return;
    }
    if (kycStep === 3) {
      if (!tradingExp || !optionsKnowledge) {
        alert("Please answer all questions before submitting.");
        return;
      }
      // KYC Successful!
      setKycCompleted(true);
      setKycStep(4);
      return;
    }
    setKycStep(kycStep + 1);
  };

  const handleResetKyc = () => {
    setKycCompleted(false);
    setKycStep(1);
    setFullName('');
    setRiskTolerance('');
    setTradingExp('');
    setOptionsKnowledge('');
  };

  const handleResetSim = () => {
    if (window.confirm("Are you sure you want to reset the simulator? Your cash will return to ₹80,00,000, and all orders and positions will be cleared.")) {
      resetPortfolio();
      handleResetKyc();
    }
  };

  const formatCurrency = (val) => {
    return formatINR(val);
  };

  return (
    <div className="tab-panel active">
      <div className="grid-container-2col">
        {/* Left Side: Stats and Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Profile overview card */}
          <div className="glassy-card hover-glow" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--color-teal), var(--color-st-patty))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '24px',
              fontWeight: 'bold'
            }}>
              {userDisplayName ? userDisplayName.charAt(0).toUpperCase() : <User />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px' }}>{userDisplayName || 'Guest Trader'}</h2>
                {kycCompleted ? (
                  <span className="badge-interactive" style={{ backgroundColor: 'rgba(93, 211, 148, 0.1)', color: 'var(--color-jade)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: '700' }}>
                    <ShieldCheck size={12} /> KYC VERIFIED
                  </span>
                ) : (
                  <span className="badge-interactive" style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)', color: 'var(--color-rose)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', fontWeight: '700' }}>
                    <ShieldAlert size={12} /> KYC UNVERIFIED
                  </span>
                )}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '2px' }}>
                Level 1 Paper Trader &bull; Virtual Simulator Account
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="glassy-card hover-glow" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px' }}>Simulated Account Stats</h3>
              <button 
                onClick={() => setShowAmounts(!showAmounts)} 
                aria-label={showAmounts ? 'Hide account amounts' : 'Show account amounts'}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
              >
                {showAmounts ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="hover-glow" style={{ background: 'var(--color-bg)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Net Profit/Loss</span>
                <div className={`mono-text ${netProfit >= 0 ? 'trend-up' : 'trend-down'}`} style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>
                  {showAmounts ? `${netProfit >= 0 ? '+' : ''}${formatCurrency(netProfit)}` : '****'}
                </div>
              </div>
              
              <div className="hover-glow" style={{ background: 'var(--color-bg)', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Total Trades</span>
                <div className="mono-text" style={{ fontSize: '18px', fontWeight: '700', marginTop: '4px' }}>
                  {totalTradesCount} executed
                </div>
              </div>
            </div>
          </div>

          {/* System Settings card */}
          <div className="glassy-card hover-glow" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px' }}>System Settings</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <div style={{ fontWeight: '500' }}>App Theme</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Toggle between light and dark mode</div>
              </div>
              <button 
                className="trade-btn secondary-btn hover-glow"
                onClick={toggleTheme}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isLightMode ? <Moon size={14} /> : <Sun size={14} />}
                {isLightMode ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                className="trade-btn secondary-btn hover-glow-red" 
                style={{ flex: 1, color: 'var(--color-rose)', borderColor: 'rgba(255, 77, 77, 0.2)' }}
                onClick={handleResetSim}
              >
                <RefreshCw size={14} /> Reset Simulator
              </button>
              
              {kycCompleted && (
                <button 
                  className="trade-btn secondary-btn hover-glow" 
                  style={{ flex: 1 }}
                  onClick={handleResetKyc}
                >
                  Reset KYC Status
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: KYC Quiz */}
        <div className="glassy-card hover-glow" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={18} style={{ color: 'var(--color-teal)' }} /> Futures & Options KYC Quiz
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '2px' }}>
              Unlock advanced F&O leverage, derivatives and complex contracts simulations.
            </p>
          </div>

          {/* Steps visual indicators */}
          {kycStep <= 3 && (
            <div className="kyc-step-container">
              <div className="kyc-progress-bar">
                <div className="kyc-progress-fill" style={{ width: `${((kycStep - 1) / 2) * 100}%` }}></div>
                <div className={`kyc-step-dot ${kycStep >= 1 ? 'active' : ''} ${kycStep > 1 ? 'completed' : ''}`}>1</div>
                <div className={`kyc-step-dot ${kycStep >= 2 ? 'active' : ''} ${kycStep > 2 ? 'completed' : ''}`}>2</div>
                <div className={`kyc-step-dot ${kycStep >= 3 ? 'active' : ''} ${kycStep > 3 ? 'completed' : ''}`}>3</div>
              </div>

              {/* Step 1: Info */}
              {kycStep === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Satoshi Nakamoto" 
                      className="form-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Simulated Country of Residence</label>
                    <select className="form-input form-select" defaultValue="US" aria-label="Simulated country of residence">
                      <option value="US">United States</option>
                      <option value="IN">India</option>
                      <option value="UK">United Kingdom</option>
                      <option value="DE">Germany</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 2: Risk Profile */}
              {kycStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span className="form-label" style={{ marginBottom: '6px' }}>Select Risk Profile:</span>
                  {[
                    { key: 'Conservative', desc: 'Focus on preserving capital (Index mutual funds, Blue-chip stocks)' },
                    { key: 'Moderate', desc: 'Balanced growth (Growth stocks, major cryptos)' },
                    { key: 'Aggressive', desc: 'High volatility, high reward (Leveraged futures, option chains)' }
                  ].map(item => (
                    <button 
                      key={item.key}
                      type="button"
                      className={`kyc-option-button ${riskTolerance === item.key ? 'selected' : ''}`}
                      onClick={() => setRiskTolerance(item.key)}
                    >
                      <strong style={{ display: 'block', marginBottom: '2px' }}>{item.key}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{item.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Step 3: Trading Experience Quiz */}
              {kycStep === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group">
                    <span className="form-label" style={{ marginBottom: '6px' }}>How long have you traded in simulators or live?</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { val: 'novice', label: 'Under 1 Year' },
                        { val: 'experienced', label: '1 - 3 Years' },
                        { val: 'professional', label: '3+ Years' }
                      ].map(o => (
                        <button 
                          key={o.val}
                          type="button"
                          className={`kyc-option-button ${tradingExp === o.val ? 'selected' : ''}`}
                          style={{ padding: '10px 14px' }}
                          onClick={() => setTradingExp(o.val)}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <span className="form-label" style={{ marginBottom: '6px' }}>What is leverage in futures trading?</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { val: 'wrong', label: 'A way to get free cash from the broker' },
                        { val: 'right', label: 'Borrowing capital to multiply position size & volatility risk' }
                      ].map(o => (
                        <button 
                          key={o.val}
                          type="button"
                          className={`kyc-option-button ${optionsKnowledge === o.val ? 'selected' : ''}`}
                          style={{ padding: '10px 14px' }}
                          onClick={() => setOptionsKnowledge(o.val)}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <button 
                className="trade-btn buy-btn" 
                style={{ width: '100%', marginTop: '10px' }}
                onClick={handleNextStep}
              >
                {kycStep === 3 ? "Submit KYC Verification" : "Continue to Next Step"}
              </button>
            </div>
          )}

          {/* KYC Approved Screen */}
          {(kycCompleted || kycStep === 4) && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px', padding: '30px 0', textAlign: 'center' }}>
              <div style={{ 
                width: '72px', 
                height: '72px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(93, 211, 148, 0.1)', 
                color: 'var(--color-jade)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <ShieldCheck size={40} />
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--color-text-primary)' }}>KYC Simulation Approved!</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '6px', maxWidth: '300px' }}>
                  Congratulations, you have unlocked options trading and leverages. You can now use the <strong>F&O</strong> tab!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
