import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  DollarSign, 
  Plus, 
  RotateCcw,
  BookOpen,
  Building2,
  Newspaper,
  Award,
  Headphones,
  Users2,
  Sparkles,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, YAxis } from 'recharts';

const MiniCandleChart = ({ data }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const candleWidth = 100 / (data.length - 1);
  
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      {data.slice(1).map((val, i) => {
        const prev = data[i];
        const isUp = val >= prev;
        const top = 100 - ((Math.max(val, prev) - min) / range) * 100;
        const bottom = 100 - ((Math.min(val, prev) - min) / range) * 100;
        const height = Math.max(bottom - top, 2); // min 2px height
        
        return (
          <rect
            key={i}
            x={i * candleWidth + (candleWidth * 0.1)}
            y={top}
            width={candleWidth * 0.8}
            height={height}
            fill={isUp ? 'var(--color-jade, #5DD394)' : 'var(--color-rose, #FF4D4D)'}
            rx={1}
          />
        );
      })}
    </svg>
  );
};

export default function HomeTab({ 
  portfolio, 
  watchlist, 
  setActiveTab, 
  setSelectedAssetSymbol,
  depositSimulatedCash
}) {
  const [depositAmount, setDepositAmount] = useState(10000);

  // Compute portfolio metrics
  const totalPositionsValue = portfolio.positions.reduce((acc, pos) => {
    const asset = watchlist.find(w => w.symbol === pos.symbol);
    const curPrice = asset ? asset.price : pos.avgBuyPrice;
    return acc + (curPrice * pos.shares);
  }, 0);

  const netWorth = portfolio.balance + totalPositionsValue;
  const todayPnL = portfolio.todayPnL;
  const todayPnLPercent = portfolio.todayPnLPercent;
  const isPositive = todayPnL >= 0;

  const handleDeposit = () => {
    depositSimulatedCash(Number(depositAmount));
    alert(`Successfully deposited virtual ₹${Number(depositAmount).toLocaleString('en-IN')}!`);
  };

  return (
    <div className="tab-panel active" style={{ animation: 'fadeIn 300ms ease-out forwards', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Grid: Portfolio Sparkline + Deposit Cash */}
      <div className="home-grid-top" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
        
        {/* Portfolio Value & Sparkline Card */}
        <div className="glassy-card hover-glow" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '260px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>NET PORTFOLIO VALUE</span>
              <span className={`change-badge ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {isPositive ? '+' : ''}{todayPnLPercent.toFixed(2)}%
              </span>
            </div>
            <h2 className="portfolio-value mono-text" style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', color: '#fff' }}>
              ₹{netWorth.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>
                Cash: <span className="mono-text" style={{ color: '#fff', fontWeight: '600' }}>₹{portfolio.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </span>
              <span style={{ color: 'var(--color-text-muted)' }}>
                Holdings Value: <span className="mono-text" style={{ color: '#fff', fontWeight: '600' }}>₹{totalPositionsValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </span>
            </div>
          </div>

          {/* Sparkline chart container */}
          <div style={{ width: '100%', height: '120px', marginTop: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolio.history}>
                <defs>
                  <linearGradient id="colorNetWorth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-teal)" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="var(--color-teal)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-teal)" 
                  fillOpacity={1} 
                  fill="url(#colorNetWorth)" 
                  strokeWidth={2}
                />
                <YAxis hide={true} domain={['dataMin - 100', 'dataMax + 100']} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Deposit Cash Widget */}
        <div className="glassy-card hover-glow" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.2rem', marginBottom: '8px', fontWeight: '800', color: '#fff' }}>
              Simulator Tools
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Top up your virtual account or trade assets on the market tab instantly.
            </p>
            
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label>ADD SIMULATED CASH (₹)</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <input 
                  type="number" 
                  className="form-input" 
                  value={depositAmount} 
                  onChange={(e) => setDepositAmount(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button className="trade-btn primary-btn" onClick={handleDeposit} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={16} /> Deposit
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="trade-btn secondary-btn hover-glow" onClick={() => { setSelectedAssetSymbol('BTC'); setActiveTab('market'); }} style={{ flex: 1 }}>
              Trade Markets
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Feature Hub (Investopedia Features Integration) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        {[
          { id: 'dictionary', label: 'Financial Dictionary', desc: 'A–Z terms, formulas & concepts', icon: BookOpen, color: 'var(--color-jade)' },
          { id: 'banking-rates', label: 'Banking & Yields', desc: 'Compare HYSA, CDs & calculators', icon: Building2, color: 'var(--color-teal)' },
          { id: 'news', label: 'Market Wire News', desc: 'Live breaking stories & analysis', icon: Newspaper, color: '#60a5fa' },
          { id: 'reviews', label: 'Product Reviews', desc: 'Best brokers, crypto & robos', icon: Award, color: '#f59e0b' },
          { id: 'wealth', label: 'Wealth & Podcast', desc: 'TradeFlow Express & debt planner', icon: Headphones, color: '#a78bfa' },
          { id: 'advisors', label: 'Advisor Council', desc: 'CFP & CFA market insights', icon: Users2, color: 'var(--color-jade)' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="glassy-card hover-glow"
              style={{
                padding: '16px',
                borderRadius: '12px',
                cursor: 'pointer',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
                <Icon size={20} />
              </div>
              <h4 style={{ fontSize: '0.95rem', color: '#fff', margin: 0, fontWeight: 700 }}>{item.label}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Two-Column Showcase: Term of the Day & Live Yields Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Term of the Day Card */}
        <div className="glassy-card hover-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--color-surface)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-jade)', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={14} /> FINANCIAL TERM OF THE DAY
              </span>
              <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(54, 124, 91, 0.2)', color: 'var(--color-jade)', fontWeight: 600 }}>
                Investing
              </span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', margin: '2px 0 8px' }}>
              Sharpe Ratio
            </h3>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '16px' }}>
              A measure of risk-adjusted return developed by Nobel laureate William F. Sharpe. It measures the excess return generated by an asset per unit of volatility endured.
            </p>

            <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: '3px solid var(--color-jade)', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--color-jade)', fontWeight: 700 }}>
                Sharpe Ratio = (R_p - R_f) / σ_p
              </span>
            </div>
          </div>

          <button 
            className="trade-btn secondary-btn hover-glow"
            onClick={() => setActiveTab('dictionary')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            Open A–Z Dictionary <ArrowRight size={16} />
          </button>
        </div>

        {/* Live Yield & Banking Rates Snapshot */}
        <div className="glassy-card hover-glow" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--color-surface)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={14} /> DAILY BANKING & YIELD RADAR
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Updated Today</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Marcus Online Savings (HYSA)</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>No lock-in • Daily compounding</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-jade)', fontSize: '1.1rem' }}>
                  5.15% APY
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>Barclays 6-Month Term CD</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Fixed deposit • Rate lock guarantee</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-jade)', fontSize: '1.1rem' }}>
                  5.30% APY
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>30-Year Fixed Mortgage Benchmark</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Conforming rate average</div>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--color-rose)', fontSize: '1.1rem' }}>
                  6.42% APR
                </div>
              </div>
            </div>
          </div>

          <button 
            className="trade-btn secondary-btn hover-glow"
            onClick={() => setActiveTab('banking-rates')}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem' }}
          >
            Compare Rates & Calculators <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Watchlist Section */}
      <div className="watchlist-section">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 className="section-title" style={{ fontFamily: 'var(--font-header)', fontWeight: '800', fontSize: '1.3rem' }}>Live Watchlist</h2>
            <span className="section-info" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Live simulated price tick fluctuations</span>
          </div>
          <button className="trade-btn secondary-btn hover-glow" onClick={() => setActiveTab('market')} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
            View All Markets
          </button>
        </div>

        <div className="watchlist-strip" style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
          {watchlist.map(asset => {
            const isAssetPositive = asset.changePercent >= 0;
            return (
              <div 
                key={asset.symbol} 
                className="watchlist-card hover-glow"
                onClick={() => {
                  setSelectedAssetSymbol(asset.symbol);
                  setActiveTab('market');
                }}
                style={{ 
                  background: 'var(--color-card)', 
                  border: '1px solid var(--color-card-border)',
                  borderRadius: '12px',
                  padding: '16px',
                  minWidth: '200px',
                  flex: '0 0 auto',
                  cursor: 'pointer',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div className="stock-symbol" style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>{asset.symbol}</div>
                    <div className="stock-name" style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>{asset.name}</div>
                  </div>
                  <span className={`change-badge ${isAssetPositive ? 'positive' : 'negative'}`} style={{ padding: '2px 6px', fontSize: '0.75rem' }}>
                    {isAssetPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="mono-text" style={{ fontWeight: '700', fontSize: '1.1rem', color: '#fff' }}>
                    ₹{asset.price.toLocaleString('en-IN', { minimumFractionDigits: asset.type === 'Forex' ? 4 : 2 })}
                  </span>
                  
                  {/* Mini-sparkline inside watchlist card */}
                  <div style={{ width: '60px', height: '24px' }}>
                    <MiniCandleChart data={asset.sparkline} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
