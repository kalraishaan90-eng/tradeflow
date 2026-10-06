import React, { useState, useEffect, useRef } from 'react';
import { Brain, Cpu, MessageSquare, Newspaper, Send, ArrowRight, Activity, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

// ─── Animated Semicircle Gauge (Fear / Greed) ────────────────────────────────
function SentimentGauge({ value, size = 180 }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;
    const tick = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / 500, 1);
      // ease-out cubic
      setProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value]);

  const cx = size / 2;
  const cy = size * 0.75;
  const R = size * 0.4;
  const strokeW = size * 0.12;

  const circ = Math.PI * R;
  const drawn = circ * (value / 100) * progress;

  // Color mapping based on value
  const color = value <= 25 ? '#FF4D4D' : value <= 45 ? '#f59e0b' : value <= 55 ? '#9ca3af' : value <= 75 ? '#5DD394' : '#59D4B2';
  const label = value <= 25 ? 'EXTREME FEAR' : value <= 45 ? 'FEAR' : value <= 55 ? 'NEUTRAL' : value <= 75 ? 'GREED' : 'EXTREME GREED';

  return (
    <div style={{ position: 'relative', width: size, height: size * 0.8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size * 0.8} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF4D4D" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="65%" stopColor="#5DD394" />
            <stop offset="100%" stopColor="#59D4B2" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={strokeW}
          strokeDasharray={`${drawn} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.1s' }}
        />
        {/* Indicator dot */}
        {(() => {
          const angle = Math.PI - (Math.PI * (value / 100) * progress);
          const dx = cx + (R - strokeW * 0.5) * Math.cos(angle);
          const dy = cy - (R - strokeW * 0.5) * Math.sin(angle);
          return (
            <circle cx={dx} cy={dy} r={strokeW * 0.4} fill="#fff" style={{ filter: `drop-shadow(0 0 4px ${color})` }} />
          );
        })()}
      </svg>
      <div style={{ position: 'absolute', bottom: '0px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2.2rem', fontWeight: 800, color: color }}>
          {Math.round(value * progress)}
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-secondary)', letterSpacing: '1px' }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Main AI Insights Tab Component ──────────────────────────────────────────
export default function AIInsightsTab({ watchlist, setActiveTab, setSelectedAssetSymbol }) {
  const [chatInput, setChatInput] = useState('');
  const [activeModel, setActiveModel] = useState('Gemini 3.5 Flash');
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', content: "Hello! I'm your TradeFlow AI assistant, powered by Gemini. Ask me about markets, trading strategies, financial concepts, or rate comparisons." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendChat = async () => {
    if (!chatInput.trim() || isTyping) return;
    const userMsg = chatInput.trim();
    const priorHistory = chatHistory;
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsTyping(true);
    try {
      const { generateAIReply, getActiveModelName } = await import('../lib/aiChat');
      const aiResponse = await generateAIReply(priorHistory, userMsg);
      setActiveModel(getActiveModelName());
      setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      console.error('Gemini request failed:', error);
      const errorMessage = error?.message || 'I could not reach the AI model. Check your connection or API key and try again.';
      setChatHistory(prev => [...prev, { role: 'ai', content: errorMessage }]);
    } finally {
      setIsTyping(false);
    }
  };

  const aiSignals = [
    { symbol: 'AAPL', action: 'BUY', confidence: 92, reason: 'RSI oversold (28), strong bullish divergence on 4H chart. Volume increasing on up-ticks.', impact: 'High', type: 'Stock' },
    { symbol: 'BTC', action: 'STRONG BUY', confidence: 95, reason: 'MACD bullish crossover on daily timeframes. Institutional accumulation patterns detected near $65k support.', impact: 'High', type: 'Crypto' },
    { symbol: 'EUR/USD', action: 'SELL', confidence: 78, reason: 'Approaching major liquidity sweep resistance at 1.0900. Stochastic overbought.', impact: 'Medium', type: 'Forex' },
    { symbol: 'NVDA', action: 'HOLD', confidence: 65, reason: 'Consolidating in a tight range. Bollinger bands squeezing, indicating an imminent volatile breakout.', impact: 'Medium', type: 'Stock' }
  ];

  const newsFeed = [
    { source: 'MarketWatch', time: '12m ago', title: 'Tech sector sees unexpected surge in afternoon trading volume.', sentiment: 'Positive' },
    { source: 'CryptoInsider', time: '45m ago', title: 'Major exchange regulatory concerns spark minor sell-off in altcoins.', sentiment: 'Negative' },
    { source: 'Fed Update', time: '2h ago', title: 'Interest rates to remain steady, causing bond yields to stabilize.', sentiment: 'Neutral' },
    { source: 'TradeFlow AI', time: '3h ago', title: 'Unusual options activity detected in TSLA put contracts expiring this Friday.', sentiment: 'Negative' }
  ];

  return (
    <div className="tab-enter" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>

      {/* Top Row: Gauge & AI Chat */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', minHeight: '380px', flexShrink: 0 }}>

        {/* Left Col: Sentiment & Model Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glassy-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', alignSelf: 'flex-start' }}>
              <Brain size={18} color="var(--color-teal)" />
              <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '1.05rem' }}>Market Sentiment</span>
            </div>
            <SentimentGauge value={72} size={220} />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '16px', lineHeight: 1.5 }}>
              Calculated using live order book imbalances, news sentiment NLP, and volatility indices.
            </p>
          </div>

          <div className="glassy-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Cpu size={18} color="#a855f7" />
              <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem' }}>Model Status</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Model</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>{activeModel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Connection</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-jade)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RefreshCw size={10} /> On demand
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Chat scope</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>General purpose</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: AI Chat Interface */}
        <div className="glassy-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-card-border)', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={16} color="#fff" />
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem' }}>TradeFlow AI Assistant</p>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Powered by Gemini</p>
              </div>
            </div>
            <span className="badge-interactive" style={{ background: 'rgba(13,242,201,0.1)', color: 'var(--color-teal)' }}>On demand</span>
          </div>

          {/* Chat Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {chatHistory.map((msg, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
                  borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '12px',
                  background: msg.role === 'user' ? 'var(--color-teal)' : 'rgba(255,255,255,0.05)',
                  color: msg.role === 'user' ? '#000' : '#fff',
                  border: msg.role === 'ai' ? '1px solid var(--color-card-border)' : 'none',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap'
                }}>
                  {msg.content}{msg.link && <> <a href={msg.link} target="_blank" rel="noreferrer" style={{ color: 'var(--color-teal)' }}>Open Firebase AI Logic setup</a></>}
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '4px', padding: '0 4px' }}>
                  {msg.role === 'user' ? 'You' : 'Gemini AI'}
                </span>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ padding: '12px 16px', borderRadius: '12px', borderBottomLeftRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--color-card-border)', display: 'flex', gap: '4px' }}>
                  <span style={{ animation: 'shimmer 1s infinite', width: '6px', height: '6px', background: 'var(--color-teal)', borderRadius: '50%' }}></span>
                  <span style={{ animation: 'shimmer 1s infinite 0.2s', width: '6px', height: '6px', background: 'var(--color-teal)', borderRadius: '50%' }}></span>
                  <span style={{ animation: 'shimmer 1s infinite 0.4s', width: '6px', height: '6px', background: 'var(--color-teal)', borderRadius: '50%' }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div style={{ padding: '16px', borderTop: '1px solid var(--color-card-border)', background: 'rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-card-border)', borderRadius: '12px', padding: '4px 8px 4px 16px' }}>
              <input
                type="text"
                placeholder="Ask about AAPL technicals, portfolio strategy..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '0.9rem', outline: 'none', padding: '10px 0' }}
              />
              <button
                onClick={handleSendChat}
                style={{ background: chatInput.trim() ? 'var(--color-teal)' : 'rgba(255,255,255,0.1)', color: chatInput.trim() ? '#000' : 'var(--color-text-muted)', border: 'none', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: chatInput.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: AI Signals & News */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', flexShrink: 0 }}>

        {/* AI Actionable Signals */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="var(--color-jade)" />
            <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem' }}>AI Actionable Signals</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '8px' }}>
            {aiSignals.map((sig, i) => {
              const isBuy = sig.action.includes('BUY');
              const isHold = sig.action === 'HOLD';
              const badgeBg = isBuy ? 'rgba(0,230,118,0.1)' : isHold ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.1)';
              const badgeCol = isBuy ? 'var(--color-jade)' : isHold ? 'var(--color-text-muted)' : 'var(--color-red)';

              return (
                <div key={i} className={`glassy-card insight-card ${isBuy ? 'buy' : isHold ? '' : 'sell'}`} style={{ padding: '16px', cursor: 'pointer' }} onClick={() => { setSelectedAssetSymbol(sig.symbol); setActiveTab('market'); }}>
                  <div className="insight-card-header" style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.1rem' }}>{sig.symbol}</span>
                      <span className="badge-interactive" style={{ background: badgeBg, color: badgeCol }}>
                        {sig.action}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>Confidence</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-teal)' }}>{sig.confidence}%</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>AI says: </span>
                    {sig.reason}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* News Feed with Sentiment Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Newspaper size={16} color="var(--color-text-primary)" />
            <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem' }}>Sentiment News Feed</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '8px' }}>
            {newsFeed.map((news, i) => {
              const isPos = news.sentiment === 'Positive';
              const isNeu = news.sentiment === 'Neutral';
              return (
                <div key={i} className="glassy-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {news.source} • {news.time}
                    </span>
                    <span className="badge-interactive" style={{
                      fontSize: '0.65rem', padding: '2px 8px',
                      background: isPos ? 'rgba(0,230,118,0.1)' : isNeu ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.1)',
                      color: isPos ? 'var(--color-jade)' : isNeu ? 'var(--color-text-muted)' : 'var(--color-red)'
                    }}>
                      {isPos ? '+' : isNeu ? '' : '-'} {news.sentiment.toUpperCase()}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
                    {news.title}
                  </h4>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
