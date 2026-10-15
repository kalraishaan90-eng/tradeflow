import React, { useState } from 'react';
import { Check, Zap, Crown, Shield, Sparkles, X, ArrowRight, Lock, Unlock } from 'lucide-react';

export default function SubscriptionModal({ isOpen, onClose, currentPlan, onSelectPlan }) {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan || 'free');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

  if (!isOpen) return null;

  const handleChoose = (planId) => {
    setSelectedPlan(planId);
    onSelectPlan(planId);
  };

  return (
    <div className="modal-overlay active" style={{ zIndex: 9999 }}>
      <div 
        className="modal-content glassy-card" 
        style={{ 
          maxWidth: '850px', 
          width: '95%', 
          padding: '28px',
          background: 'var(--color-surface)',
          backdropFilter: 'blur(30px) saturate(190%)',
          WebkitBackdropFilter: 'blur(30px) saturate(190%)',
          border: '1px solid var(--color-border)',
          borderRadius: '24px',
          boxShadow: 'var(--ios-shadow-lg), 0 0 40px rgba(128, 174, 232, 0.12), var(--ios-rim-light)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ 
                background: 'linear-gradient(135deg, var(--color-asparagus), var(--color-teal))', 
                color: '#121214', 
                fontSize: '0.72rem', 
                fontWeight: 800, 
                padding: '2px 8px', 
                borderRadius: '4px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                TradeFlow Membership
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--palette-cool-horizon)', fontWeight: 700 }}>
                Institutional Access
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '1.6rem', color: 'var(--color-text-primary)', margin: 0, fontWeight: 800 }}>
              Unlock TradeFlow Pro & Max
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0' }}>
              Inject custom simulated liquidity, unlock the additional money sheet & access institutional execution engines.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="close-modal-btn"
            style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 3 Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          
          {/* Free Tier */}
          <div 
            style={{ 
              borderRadius: '12px', 
              padding: '20px', 
              background: 'rgba(255,255,255,0.02)', 
              border: currentPlan === 'free' ? '2px solid var(--palette-cool-horizon)' : '1px solid rgba(243, 236, 224, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)', margin: 0, fontWeight: 700 }}>Free Starter</h3>
                {currentPlan === 'free' && (
                  <span style={{ fontSize: '0.68rem', padding: '2px 6px', background: 'rgba(128,174,232,0.15)', color: 'var(--palette-cool-horizon)', borderRadius: '4px', fontWeight: 700 }}>
                    CURRENT
                  </span>
                )}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span className="mono-text" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>₹0</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}> / forever</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Check size={14} color="var(--palette-cool-horizon)" /> ₹80 Lakhs starting capital
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Check size={14} color="var(--palette-cool-horizon)" /> Real-time market quotes
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                  <Lock size={14} color="var(--color-text-muted)" /> Additional money sheet locked
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                  <Lock size={14} color="var(--color-text-muted)" /> Standard AI queue
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('free')}
              disabled={currentPlan === 'free'}
              className="trade-btn secondary-btn"
              style={{ width: '100%', marginTop: '20px', padding: '8px', fontSize: '0.8rem', opacity: currentPlan === 'free' ? 0.6 : 1 }}
            >
              {currentPlan === 'free' ? 'Active Plan' : 'Select Free'}
            </button>
          </div>

          {/* Pro Tier (Popular) */}
          <div 
            style={{ 
              borderRadius: '12px', 
              padding: '20px', 
              background: 'linear-gradient(180deg, rgba(128, 174, 232, 0.08), rgba(255,255,255,0.02))', 
              border: currentPlan === 'pro' ? '2px solid var(--palette-cool-horizon)' : '1px solid rgba(128, 174, 232, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              boxShadow: '0 8px 24px rgba(128, 174, 232, 0.15)'
            }}
          >
            <div style={{ position: 'absolute', top: '-10px', right: '16px', background: 'linear-gradient(135deg, var(--palette-cool-horizon), #4D8BE0)', color: '#121214', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
              RECOMMENDED
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={16} color="var(--palette-cool-horizon)" /> TradeFlow Pro
                </h3>
                {currentPlan === 'pro' && (
                  <span style={{ fontSize: '0.68rem', padding: '2px 6px', background: 'rgba(128,174,232,0.2)', color: 'var(--palette-cool-horizon)', borderRadius: '4px', fontWeight: 700 }}>
                    ACTIVE
                  </span>
                )}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span className="mono-text" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-asparagus)' }}>₹499</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}> / month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  <Unlock size={14} color="var(--palette-cool-horizon)" /> <strong>Unlock Additional Money Sheet</strong>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Check size={14} color="var(--palette-cool-horizon)" /> Top up virtual funds up to ₹2 Crore
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Check size={14} color="var(--palette-cool-horizon)" /> Priority Gemini 2.5 Flash responses
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Check size={14} color="var(--palette-cool-horizon)" /> Pro Trader verified profile badge
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('pro')}
              className="trade-btn primary-btn hover-glow"
              style={{ width: '100%', marginTop: '20px', padding: '9px', fontSize: '0.82rem', fontWeight: 800 }}
            >
              {currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            </button>
          </div>

          {/* Max Tier */}
          <div 
            style={{ 
              borderRadius: '12px', 
              padding: '20px', 
              background: 'linear-gradient(180deg, rgba(245, 158, 11, 0.08), rgba(255,255,255,0.02))', 
              border: currentPlan === 'max' ? '2px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Crown size={16} color="#f59e0b" /> TradeFlow Max
                </h3>
                {currentPlan === 'max' && (
                  <span style={{ fontSize: '0.68rem', padding: '2px 6px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '4px', fontWeight: 700 }}>
                    ACTIVE
                  </span>
                )}
              </div>
              <div style={{ marginBottom: '16px' }}>
                <span className="mono-text" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b' }}>₹999</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}> / month</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                  <Unlock size={14} color="#f59e0b" /> <strong>Unlimited Additional Capital Injection</strong>
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Check size={14} color="#f59e0b" /> Top up virtual funds up to ₹5 Crore
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Check size={14} color="#f59e0b" /> Institutional Derivatives Greeks Matrix
                </li>
                <li style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Check size={14} color="#f59e0b" /> Max VIP gold badge & private leaderboards
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleChoose('max')}
              style={{
                width: '100%',
                marginTop: '20px',
                padding: '9px',
                fontSize: '0.82rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {currentPlan === 'max' ? 'Current Plan' : 'Upgrade to Max'}
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Simulation Environment · Immediate Instant Activation · Cancel or change tiers anytime
        </div>
      </div>
    </div>
  );
}
