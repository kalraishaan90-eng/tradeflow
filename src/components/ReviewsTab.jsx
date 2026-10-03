import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Star, 
  Check, 
  X, 
  SlidersHorizontal, 
  ExternalLink, 
  TrendingUp, 
  ShieldCheck, 
  Percent, 
  DollarSign, 
  Building2, 
  Zap, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';

const REVIEWS_DATA = [
  // Online Brokers
  {
    id: 'broker-tradeflow',
    name: 'TradeFlow Simulator Pro',
    category: 'Brokers',
    bestFor: 'Best Overall for Paper Trading & F&O Mastery',
    rating: 5.0,
    reviewCount: '15,400+ Traders',
    minDeposit: '₹0 (Free Simulator)',
    fees: '₹0 Commission (Simulated ₹80L Cash)',
    pros: [
      '₹80,00,000 risk-free virtual practice capital with realistic price walk fallback',
      'Advanced TradingView candlestick charts with technical indicators',
      'Integrated F&O derivatives chain with call/put strike analysis',
      'Instant AI market insights powered by Google Gemini'
    ],
    cons: [
      'Paper trading only; no live cash deposits accepted'
    ],
    verdict: 'TradeFlow delivers the ultimate institutional-grade practice environment for modern retail traders looking to master Indian & global markets with zero downside risk.',
    badge: 'EDITOR’S CHOICE'
  },
  {
    id: 'broker-ibkr',
    name: 'Interactive Brokers (IBKR)',
    category: 'Brokers',
    bestFor: 'Best for Advanced Global Multi-Asset Execution',
    rating: 4.8,
    reviewCount: '12,800+ Reviews',
    minDeposit: '$0 / ₹0',
    fees: '$0.005 per share / Low F&O tiering',
    pros: [
      'Access to 150+ global exchanges across 33 countries',
      'Industry-leading margin rates and automated order algorithms',
      'Professional Trader Workstation (TWS) desktop client'
    ],
    cons: [
      'Steep learning curve for absolute beginners',
      'Complex fee schedules on niche exotic derivatives'
    ],
    verdict: 'The gold standard for experienced international traders demanding deep liquidity and access to worldwide stocks, options, and bonds.',
    badge: 'BEST GLOBAL'
  },
  {
    id: 'broker-zerodha',
    name: 'Zerodha Kite',
    category: 'Brokers',
    bestFor: 'Best for Indian Equity Delivery & Discount Brokerage',
    rating: 4.7,
    reviewCount: '25,000+ Reviews',
    minDeposit: '₹200 Account Opening',
    fees: '₹0 Equity Delivery / ₹20 Flat F&O',
    pros: [
      'Pioneered discount broking in India with ultra-clean Kite UI',
      'Comprehensive educational portal (Varsity)',
      'Direct mutual fund investments with Coin at 0% commission'
    ],
    cons: [
      'Server downtime during extreme market opening gap events',
      'No US stock trading direct integration'
    ],
    verdict: 'The premier platform for Indian domestic equity investors and active intraday option sellers seeking low flat commissions.',
    badge: 'TOP INDIAN BROKER'
  },

  // Crypto Exchanges
  {
    id: 'crypto-coinbase',
    name: 'Coinbase Advanced',
    category: 'Crypto Exchanges',
    bestFor: 'Best for Regulatory Compliance & Security',
    rating: 4.7,
    reviewCount: '18,200+ Reviews',
    minDeposit: '$2 / ₹150',
    fees: '0.40% - 0.60% Maker/Taker',
    pros: [
      'Publicly traded US entity (NASDAQ: COIN) with audited balance sheets',
      'Top-tier cold storage custody and institutional security',
      'User-friendly beginner UI alongside professional charting tools'
    ],
    cons: [
      'Higher trading commissions than pure offshore exchanges'
    ],
    verdict: 'Unmatched peace of mind and institutional reliability for buying and holding Bitcoin, Ethereum, and major layer-1 assets.',
    badge: 'MOST TRUSTED'
  },
  {
    id: 'crypto-binance',
    name: 'Binance Global',
    category: 'Crypto Exchanges',
    bestFor: 'Best for Altcoin Variety & Deep Derivatives Liquidity',
    rating: 4.6,
    reviewCount: '34,000+ Reviews',
    minDeposit: '$10 / ₹800',
    fees: '0.10% standard (25% discount with BNB)',
    pros: [
      'Highest spot and perpetual futures volume globally',
      'Support for 350+ crypto tokens and staking pairs',
      'Extensive suite of algorithmic trading bots and P2P rails'
    ],
    cons: [
      'Restricted in certain strict regulatory jurisdictions'
    ],
    verdict: 'The powerhouse of crypto trading volume, unbeatable for active day traders hunting high altcoin liquidity.',
    badge: 'HIGHEST VOLUME'
  },

  // Robo-Advisors
  {
    id: 'robo-betterment',
    name: 'Betterment Core',
    category: 'Robo-Advisors',
    bestFor: 'Best Automated Goal Investing & Tax-Loss Harvesting',
    rating: 4.8,
    reviewCount: '9,400+ Reviews',
    minDeposit: '$0',
    fees: '0.25% annual management fee',
    pros: [
      'Automated daily tax-loss harvesting algorithm',
      'Custom asset allocation across diversified low-cost Vanguard ETFs',
      'Seamless retirement goal tracking and high-yield cash account'
    ],
    cons: [
      'Cannot purchase individual company stock picks'
    ],
    verdict: 'The premier hands-off wealth building solution for passive investors who want automated rebalancing and tax efficiency.',
    badge: 'BEST ROBO-ADVISOR'
  },
  {
    id: 'robo-wealthfront',
    name: 'Wealthfront Automated Investing',
    category: 'Robo-Advisors',
    bestFor: 'Best for Direct Indexing & Tech Professionals',
    rating: 4.7,
    reviewCount: '8,100+ Reviews',
    minDeposit: '$500',
    fees: '0.25% annual advisory fee',
    pros: [
      'US Direct Indexing for accounts over $100k for superior tax alpha',
      'High-yield automated cash sweep integration',
      'Smart Beta factor investing strategies'
    ],
    cons: [
      '$500 initial deposit required'
    ],
    verdict: 'Exceptional for disciplined savers seeking sophisticated algorithmic tax-loss harvesting and diversified global equity exposure.',
    badge: 'BEST DIRECT INDEXING'
  }
];

const CATEGORIES = ['All', 'Brokers', 'Crypto Exchanges', 'Robo-Advisors'];

export default function ReviewsTab() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedReview, setSelectedReview] = useState(null);

  const filteredReviews = useMemo(() => {
    return REVIEWS_DATA.filter(item => {
      if (selectedCategory === 'All') return true;
      return item.category === selectedCategory;
    });
  }, [selectedCategory]);

  return (
    <div className="tab-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '40px' }}>
      
      {/* Header Banner */}
      <div className="glassy-card" style={{
        background: 'linear-gradient(135deg, rgba(54, 124, 91, 0.2) 0%, rgba(11, 14, 13, 0.8) 100%)',
        border: '1px solid var(--color-teal-glow)',
        padding: '24px 28px',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Award size={20} color="var(--color-jade)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-jade)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Independent Testing & Buying Guides
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, margin: '2px 0 8px', color: '#fff' }}>
          TradeFlow Financial Product Reviews
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '720px', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Our research analysts stress-test platforms across usability, fee transparency, customer security, and execution speed. Unbiased rankings to help you pick the right broker, exchange, or wealth manager.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: selectedCategory === cat ? '1px solid var(--color-jade)' : '1px solid var(--color-border)',
              background: selectedCategory === cat ? 'rgba(93, 211, 148, 0.15)' : 'var(--color-surface)',
              color: selectedCategory === cat ? 'var(--color-jade)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {cat === 'All' ? 'All Reviews' : cat}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredReviews.map(item => (
          <div 
            key={item.id} 
            className="glassy-card hover-glow"
            style={{
              padding: '24px',
              borderRadius: '14px',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Top row: Badge, Name, Rating */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  {item.badge && (
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(93, 211, 148, 0.2)',
                      color: 'var(--color-jade)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em'
                    }}>
                      {item.badge}
                    </span>
                  )}
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.category}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', margin: '2px 0 4px' }}>
                  {item.name}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-jade)', fontWeight: 600 }}>
                  {item.bestFor}
                </span>
              </div>

              {/* Star Rating */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '1.1rem', fontWeight: 800, justifyContent: 'flex-end' }}>
                  <Star size={18} fill="#f59e0b" color="#f59e0b" />
                  <span>{item.rating.toFixed(1)}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>/ 5.0</span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{item.reviewCount}</span>
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              padding: '12px 16px',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>ACCOUNT MINIMUM</span>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>{item.minDeposit}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>TRADING / PLATFORM FEES</span>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--color-jade)', marginTop: '2px' }}>{item.fees}</div>
              </div>
            </div>

            {/* Pros & Cons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-jade)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <Check size={14} /> PROS
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {item.pros.map((p, idx) => (
                    <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '6px' }}>
                      <span style={{ color: 'var(--color-jade)' }}>✓</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-rose)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  <X size={14} /> CONS
                </span>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {item.cons.map((c, idx) => (
                    <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'flex', gap: '6px' }}>
                      <span style={{ color: 'var(--color-rose)' }}>✗</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Verdict */}
            <div style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: '8px',
              borderLeft: '3px solid var(--color-teal)'
            }}>
              <strong style={{ color: '#fff', fontSize: '0.8rem' }}>TradeFlow Verdict: </strong>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {item.verdict}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
