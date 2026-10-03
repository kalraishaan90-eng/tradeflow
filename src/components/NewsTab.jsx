import React, { useState, useMemo } from 'react';
import { 
  Newspaper, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  ChevronRight, 
  ExternalLink, 
  Flame, 
  BarChart3, 
  ShieldAlert, 
  Cpu, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

const NEWS_ARTICLES = [
  {
    id: 'news-1',
    title: 'U.S. Stocks End Higher as Tech Rallies; S&P 500 Holds Key Moving Average',
    category: 'Markets',
    summary: 'Wall Street closed out a volatile trading week on a strong note, buoyed by institutional demand in semiconductor heavyweights and steady macroeconomic data.',
    sentiment: 'Bullish',
    impact: 'High',
    source: 'TradeFlow Markets Desk',
    author: 'Aaron Rennie',
    timeAgo: '1h ago',
    tickers: ['SPY', 'QQQ', 'NVDA', 'AAPL'],
    fullAnalysis: 'The benchmark index successfully defended its 50-day exponential moving average as trading volume surged into the closing bell. Options market skew indicates downside protection is becoming cheaper, favoring continued momentum for large-cap growth assets.',
    keyTakeaway: 'Institutional accumulation resumed ahead of upcoming quarterly CPI prints.'
  },
  {
    id: 'news-2',
    title: 'How Artificial Intelligence Infrastructure Is Reshaping Corporate Earnings Multiples',
    category: 'Companies & Tech',
    summary: 'Hyperscalers and semiconductor fabricators are seeing historic capital expenditure pipelines, causing Wall Street analysts to revise long-term DCF forecasts.',
    sentiment: 'Bullish',
    impact: 'High',
    source: 'TradeFlow Tech Intelligence',
    author: 'Elena Rostova',
    timeAgo: '3h ago',
    tickers: ['NVDA', 'MSFT', 'GOOGL', 'TSM'],
    fullAnalysis: 'Companies investing in next-gen compute clusters are projecting 30%+ free cash flow expansion over the next 3 fiscal years. Investors should watch power grid infrastructure and energy providers as tertiary beneficiaries.',
    keyTakeaway: 'Enterprise adoption is transitioning from experimental pilots into mission-critical production deployments.'
  },
  {
    id: 'news-3',
    title: 'Labor Market Dynamics: Job Additions Moderated in September While Wage Growth Stabilized',
    category: 'Economy',
    summary: 'Non-farm payroll additions rose by 142,000 last month, right in line with the central bank’s soft-landing roadmap as unemployment held steady at 4.1%.',
    sentiment: 'Neutral',
    impact: 'High',
    source: 'Macroeconomic Bureau',
    author: 'Diccon Hyatt',
    timeAgo: '5h ago',
    tickers: ['TLT', 'USDINR=X', 'DXY'],
    fullAnalysis: 'The moderation in wage growth removes imminent wage-push inflationary pressures, giving central bank policymakers leeway to continue lowering benchmark policy rates gradually rather than in emergency cuts.',
    keyTakeaway: 'The labor market remains resilient without overheating, supporting equity valuations.'
  },
  {
    id: 'news-4',
    title: 'Bitcoin Traverses Consolidation Range as Spot ETF Net Inflows Hit Multi-Week High',
    category: 'Crypto',
    summary: 'Sovereign and institutional asset managers injected over $450M into spot Bitcoin ETFs this week, countering sell pressure from short-term speculators.',
    sentiment: 'Bullish',
    impact: 'Medium',
    source: 'TradeFlow Crypto Radar',
    author: 'Siddharth Rao',
    timeAgo: '7h ago',
    tickers: ['BTC', 'ETH', 'SOL'],
    fullAnalysis: 'On-chain metrics show exchange reserves dipping to 4-year lows as long-term hodlers move coins into cold custody. The 200-day moving average remains solid institutional support.',
    keyTakeaway: 'Supply illiquidity is forming on spot order books, amplifying potential price appreciation upon volume spikes.'
  },
  {
    id: 'news-5',
    title: 'Best 1-Year CD Rates Settle at 5.10% APY as Savers Lock In Peak Yields',
    category: 'Personal Finance',
    summary: 'With central banks signaling gradual rate easing, financial planners are advising clients to lock in high fixed yields before deposit rates adjust downward.',
    sentiment: 'Neutral',
    impact: 'Medium',
    source: 'Banking & Yields Review',
    author: 'Chloe Vance',
    timeAgo: '9h ago',
    tickers: ['HYSA', 'CDs', 'Treasuries'],
    fullAnalysis: 'Yields on high-yield savings accounts fluctuate dynamically with the Fed/RBI benchmark, but Certificates of Deposit (CDs) guarantee returns across the entire contractual maturity.',
    keyTakeaway: 'Savers holding excess emergency funds in cash should consider laddering short-to-medium CDs.'
  },
  {
    id: 'news-6',
    title: 'Automotive Sector Faces Margin Compression Amid Electric Transition Headwinds',
    category: 'Companies & Tech',
    summary: 'Price cuts and extended inventory turnaround times continue to weigh on legacy automotive balance sheets, prompting dividend reassessments.',
    sentiment: 'Bearish',
    impact: 'Medium',
    source: 'Corporate Filings Watch',
    author: 'Marcus Vance',
    timeAgo: '12h ago',
    tickers: ['TSLA', 'F', 'GM', 'NKE'],
    fullAnalysis: 'Supply chain inventory levels in North America and Europe are at 18-month highs. Manufacturers offering heavy discount financing are seeing gross margins contract by 250-400 basis points.',
    keyTakeaway: 'Focus on automotive suppliers with diversified non-passenger revenue streams.'
  }
];

const CATEGORIES = ['All', 'Markets', 'Companies & Tech', 'Economy', 'Crypto', 'Personal Finance'];

export default function NewsTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedArticleId, setExpandedArticleId] = useState(null);

  const filteredNews = useMemo(() => {
    return NEWS_ARTICLES.filter(item => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.tickers.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="tab-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '40px' }}>
      
      {/* Top Banner */}
      <div className="glassy-card" style={{
        background: 'linear-gradient(135deg, rgba(54, 124, 91, 0.2) 0%, rgba(11, 14, 13, 0.8) 100%)',
        border: '1px solid var(--color-teal-glow)',
        padding: '24px 28px',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Newspaper size={20} color="var(--color-jade)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-jade)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Live Market Intelligence
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, margin: '2px 0 8px', color: '#fff' }}>
          Markets & Financial News Wire
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '720px', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Real-time reporting on global equity markets, macroeconomic policy, corporate earnings releases, and decentralized finance. Analyzed through an institutional trading lens.
        </p>
      </div>

      {/* Breaking News Ticker Strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 77, 77, 0.08)',
        border: '1px solid rgba(255, 77, 77, 0.2)',
        borderRadius: '10px',
        padding: '10px 16px',
        gap: '12px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--color-rose)',
          color: '#fff',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          <Flame size={12} /> Breaking Wire
        </div>
        <div style={{ color: '#fff', fontSize: '0.85rem', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          Federal Reserve policy committee minutes indicate inflation trajectory remains on path toward 2% target; rate cut expectations intact.
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Just now</span>
      </div>

      {/* Sentiment & Market Pulse Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Fear & Greed */}
        <div className="glassy-card hover-glow" style={{ padding: '16px 20px', background: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Investor Sentiment Pulse</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-jade)', fontWeight: 700 }}>GREED (68/100)</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden', marginTop: '8px' }}>
            <div style={{ width: '68%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, var(--color-jade))' }} />
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '8px', display: 'block' }}>
            Bullish momentum driven by tech & F&O call volumes.
          </span>
        </div>

        {/* Fed Probability */}
        <div className="glassy-card hover-glow" style={{ padding: '16px 20px', background: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Next Rate Cut Odds</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 700 }}>88.4% Likelihood</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
            -25 bps cut priced in
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
            CME FedWatch & futures consensus.
          </span>
        </div>

        {/* Market VIX */}
        <div className="glassy-card hover-glow" style={{ padding: '16px 20px', background: 'var(--color-surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>India VIX / Volatility</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-jade)', fontWeight: 700 }}>12.85 (-3.2%)</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-jade)', marginTop: '4px' }}>
            Low Volatility Regime
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
            Options premiums favorable for delta buyers.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
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
              {cat}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          padding: '0 12px',
          width: '260px'
        }}>
          <Search size={16} color="var(--color-text-muted)" style={{ marginRight: '8px' }} />
          <input 
            type="text"
            placeholder="Search news or ticker..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              padding: '8px 0',
              outline: 'none',
              fontSize: '0.85rem'
            }}
          />
        </div>
      </div>

      {/* News Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredNews.map(item => {
          const isExpanded = expandedArticleId === item.id;
          const isBull = item.sentiment === 'Bullish';
          const isBear = item.sentiment === 'Bearish';

          return (
            <div 
              key={item.id} 
              className="glassy-card hover-glow"
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              {/* Header meta */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(54, 124, 91, 0.2)',
                    color: 'var(--color-jade)',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {item.category}
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: isBull ? 'rgba(93, 211, 148, 0.15)' : isBear ? 'rgba(255, 77, 77, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                    color: isBull ? 'var(--color-jade)' : isBear ? 'var(--color-rose)' : 'var(--color-text-secondary)',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {isBull ? <TrendingUp size={12} /> : isBear ? <TrendingDown size={12} /> : null}
                    {item.sentiment}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  <span>{item.source} • {item.author}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {item.timeAgo}
                  </span>
                </div>
              </div>

              {/* Title & Summary */}
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff', lineHeight: 1.4, margin: '2px 0' }}>
                {item.title}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                {item.summary}
              </p>

              {/* Tickers & Expander */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Tickers:</span>
                  {item.tickers.map((t, idx) => (
                    <span 
                      key={idx}
                      style={{
                        padding: '2px 6px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-teal)'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => setExpandedArticleId(isExpanded ? null : item.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-jade)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {isExpanded ? 'Hide Analysis' : 'Full TradeFlow Analysis'}
                  <ChevronRight size={16} style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
              </div>

              {/* Expanded Analysis Drawer */}
              {isExpanded && (
                <div style={{
                  marginTop: '12px',
                  padding: '16px',
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: '8px',
                  borderLeft: '3px solid var(--color-jade)',
                  animation: 'tabFadeIn 250ms ease-out'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-jade)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    <BarChart3 size={15} /> Key Market Takeaway
                  </div>
                  <p style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, marginBottom: '8px' }}>
                    {item.keyTakeaway}
                  </p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                    {item.fullAnalysis}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
