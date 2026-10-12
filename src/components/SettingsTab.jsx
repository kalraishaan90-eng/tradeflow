import React, { useState, useEffect } from 'react';
import { 
  User, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  RefreshCw, 
  Zap, 
  BookOpen, 
  Eye, 
  EyeOff, 
  Moon, 
  Sun,
  Crown,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { formatINR } from '../lib/format.mjs';

export default function SettingsTab({ 
  kycCompleted, 
  setKycCompleted, 
  resetPortfolio,
  portfolio,
  userDisplayName,
  userPlan = 'free',
  onOpenUpgradeModal
}) {
  const [kycStep, setKycStep] = useState(kycCompleted ? 4 : 1);
  const [fullName, setFullName] = useState(userDisplayName || '');
  const [riskTolerance, setRiskTolerance] = useState('Moderate');
  const [tradingExp, setTradingExp] = useState('experienced');
  const [optionsKnowledge, setOptionsKnowledge] = useState('right');
  const [kycError, setKycError] = useState('');
  
  const [showAmounts, setShowAmounts] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (userDisplayName && !fullName) {
      setFullName(userDisplayName);
    }
  }, [userDisplayName]);

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
  const STARTING_CASH = 8000000;
  const netProfit = netWorth - STARTING_CASH;

  const handleNextStep = () => {
    setKycError('');
    if (kycStep === 1 && !fullName.trim()) {
      setKycError("Please enter your full name to proceed with verification.");
      return;
    }
    if (kycStep === 2 && !riskTolerance) {
      setKycError("Please select a simulated risk tolerance.");
      return;
    }
    if (kycStep === 3) {
      if (!tradingExp || !optionsKnowledge) {
        setKycError("Please answer all questions before submitting.");
        return;
      }
      // KYC Successful!
      setKycCompleted(true);
      setKycStep(4);
      return;
    }
    setKycStep(kycStep + 1);
  };

  const handlePrevStep = () => {
    setKycError('');
    if (kycStep > 1) {
      setKycStep(kycStep - 1);
    }
  };

  const handleExpressVerify = () => {
    setKycError('');
    setFullName(userDisplayName || 'Commerce Trader');
    setRiskTolerance('Aggressive');
    setTradingExp('experienced');
    setOptionsKnowledge('right');
    setKycCompleted(true);
    setKycStep(4);
  };

  const handleResetKyc = () => {
    setKycError('');
    setKycCompleted(false);
    setKycStep(1);
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
        {/* Left Side: Profile, Membership & Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Profile Overview Card */}
          <div className="glassy-card hover-glow" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(13, 242, 201, 0.1)', 
              color: 'var(--color-teal)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              border: '1px solid rgba(13, 242, 201, 0.2)'
            }}>
              <User size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--color-text-primary)', margin: 0 }}>
                  {userDisplayName || 'Guest Trader'}
                </h3>
                {kycCompleted ? (
                  <span className="badge-interactive" style={{ background: 'rgba(93, 211, 148, 0.15)', color: 'var(--color-jade)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={12} /> KYC VERIFIED
                  </span>
                ) : (
                  <span className="badge-interactive" style={{ background: 'rgba(255, 77, 77, 0.15)', color: 'var(--color-rose)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldAlert size={12} /> KYC UNVERIFIED
                  </span>
                )}
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                {userPlan.toUpperCase()} Trader · Verified Simulation Account
              </p>
            </div>
          </div>

          {/* Membership Tier Card (Flaw 4 & 5) */}
          <div className="glassy-card hover-glow" style={{ 
            background: userPlan === 'max' 
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(15, 23, 42, 0.8))'
              : userPlan === 'pro'
              ? 'linear-gradient(135deg, rgba(13, 242, 201, 0.1), rgba(15, 23, 42, 0.8))'
              : 'var(--color-card)',
            border: userPlan === 'max' ? '1px solid #f59e0b' : userPlan === 'pro' ? '1px solid var(--color-teal)' : '1px solid var(--color-border)',
            padding: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {userPlan === 'max' ? <Crown size={20} color="#f59e0b" /> : userPlan === 'pro' ? <Zap size={20} color="var(--color-teal)" /> : <Sparkles size={20} color="var(--color-text-secondary)" />}
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', margin: 0, color: '#fff' }}>
                  {userPlan.toUpperCase()} Membership
                </h3>
              </div>
              <span style={{ 
                fontSize: '0.72rem', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                background: userPlan === 'free' ? 'rgba(255,255,255,0.06)' : 'rgba(93,211,148,0.15)', 
                color: userPlan === 'free' ? 'var(--color-text-muted)' : 'var(--color-jade)', 
                fontWeight: 800 
              }}>
                ACTIVE
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              {userPlan === 'free' 
                ? 'Standard paper trading features enabled. Additional capital sheet is locked on Free Tier.' 
                : userPlan === 'pro'
                ? 'Pro Tier Active: Custom simulated deposits unlocked up to ₹2 Crore + Priority Gemini AI.'
                : 'Max Tier Active: Unlimited simulated deposits up to ₹5 Crore + Full Institutional derivatives.'}
            </p>

            <button
              onClick={onOpenUpgradeModal}
              className={`trade-btn ${userPlan === 'free' ? 'primary-btn hover-glow' : 'secondary-btn'}`}
              style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              {userPlan === 'free' ? <Zap size={16} /> : <Crown size={16} />}
              {userPlan === 'free' ? 'Buy Pro / Max Plan' : 'Manage Membership Tiers'}
            </button>
          </div>

          {/* Account Stats Grid */}
          <div className="glassy-card hover-glow" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', margin: 0 }}>Simulated Account Stats</h3>
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
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', margin: 0 }}>System Settings</h3>
            
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
                  Reset KYC
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: KYC Quiz & Fast Track Verification (Flaw 9) */}
        <div className="glassy-card hover-glow" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} style={{ color: 'var(--color-teal)' }} /> Futures & Options KYC Verification
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '4px' }}>
                  Mandatory regulatory simulation to unlock derivatives leverage & options chain trading.
                </p>
              </div>

              {!kycCompleted && (
                <button 
                  type="button"
                  className="trade-btn buy-btn hover-glow" 
                  style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={handleExpressVerify}
                >
                  <Zap size={14} /> Instant 1-Click Fast Track
                </button>
              )}
            </div>
          </div>

          {/* Inline Error Banner */}
          {kycError && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.3)', color: '#f87171', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{kycError}</span>
            </div>
          )}

          {/* Steps Visual Indicator */}
          {kycStep <= 3 && !kycCompleted && (
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
                      placeholder="e.g. Ishaan Kalra" 
                      className="form-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Simulated Jurisdiction</label>
                    <select className="form-input form-select" defaultValue="IN" aria-label="Simulated country of residence">
                      <option value="IN">India (NSE / BSE)</option>
                      <option value="US">United States (CBOE / CME)</option>
                      <option value="UK">United Kingdom</option>
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
                    { key: 'Moderate', desc: 'Balanced growth (Large-caps, balanced funds)' },
                    { key: 'Aggressive', desc: 'High volatility, high reward (Leveraged futures, options chains, fusion)' }
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
                    <span className="form-label" style={{ marginBottom: '6px' }}>How long have you traded in simulators or live markets?</span>
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
                    <span className="form-label" style={{ marginBottom: '6px' }}>What does leverage represent in derivatives trading?</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {[
                        { val: 'wrong', label: 'Guaranteed risk-free multiplier provided by the broker' },
                        { val: 'right', label: 'Borrowing exposure to amplify capital return and downside volatility' }
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

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                {kycStep > 1 && (
                  <button 
                    type="button"
                    className="trade-btn secondary-btn hover-glow" 
                    style={{ flex: 1 }}
                    onClick={handlePrevStep}
                  >
                    Back
                  </button>
                )}
                <button 
                  className="trade-btn buy-btn" 
                  style={{ flex: kycStep > 1 ? 2 : 1 }}
                  onClick={handleNextStep}
                >
                  {kycStep === 3 ? "Submit KYC Verification" : "Continue to Next Step"}
                </button>
              </div>
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
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--color-text-primary)' }}>KYC Simulation Approved & Active!</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '12px', marginTop: '6px', maxWidth: '320px', lineHeight: 1.5 }}>
                  Verified permanently in local & account storage. Full access unlocked for the <strong>F&O</strong> derivatives suite.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
