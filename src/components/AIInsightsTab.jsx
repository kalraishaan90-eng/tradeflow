import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Cpu, 
  MessageSquare, 
  Newspaper, 
  Send, 
  Plus, 
  Trash2, 
  Activity, 
  Sparkles, 
  Bot, 
  User as UserIcon, 
  RefreshCw, 
  Clock, 
  PanelLeftClose, 
  PanelLeftOpen,
  ArrowRight
} from 'lucide-react';

const AI_SESSIONS_STORAGE_KEY = 'stockshadow_ai_chat_sessions_v2';

const DEFAULT_WELCOME_MSG = {
  role: 'ai',
  content: "Hello! I am your TradeFlow AI quantitative assistant powered by Gemini. Ask me about portfolio optimization, derivatives & fusion options, macro trends, or individual stock setups."
};

const INITIAL_SESSIONS = [
  {
    id: 'session-fusion',
    title: 'Exploring Fusion Options & Derivatives',
    createdAt: Date.now() - 3600000,
    messages: [
      { role: 'user', content: 'What is a fusion option and how does it work?' },
      { 
        role: 'ai', 
        content: `### Quantitative Analysis: Fusion Options & Hybrid Derivatives\n\nIn quantitative derivatives engineering, a **Fusion Option** (often structured as a multi-asset hybrid or correlation basket option) is an advanced contract whose payoff depends simultaneously on the co-dependence and volatility cross-product of two or more distinct underlying asset classes (e.g., Equity + Currency, or Equity + Commodity).\n\n#### 1. Core Mechanics\n* **Underlying Vector:** Tracks a vector $\\mathbf{S}_t = (S_1, S_2, \\dots, S_n)$ with an empirical correlation matrix $\\mathbf{\\Sigma}$.\n* **Standard Payoff Topology:**\n  $$\\text{Payoff} = \\max\\left(0, \\sum_{i=1}^n w_i S_{i,T} - K\\right) \\quad \\text{or} \\quad \\max\\left(0, S_{1,T} - \\beta S_{2,T} - K\\right)$$\n* **Implied Correlation Edge:** Pricing relies on Margrabe exchange option formulas and copula models to capture non-linear correlation smiles.\n\n#### 2. Practical Application in TradeFlow\n* **Covered Equity-FX Collar:** Fusing Indian large-caps (Reliance/TCS) with USD/INR futures to hedge rupee fluctuations while harvesting option premium.\n* **Delta-Neutral Dispersion:** Fusing long ATM tech calls with short out-of-the-money index puts.` 
      }
    ]
  },
  {
    id: 'session-reliance',
    title: 'Reliance Industries Market Thesis',
    createdAt: Date.now() - 86400000,
    messages: [
      { role: 'user', content: 'What is the current technical and macro outlook for Reliance Industries?' },
      { 
        role: 'ai', 
        content: `### Reliance Industries (RELIANCE.NS) Analysis\n\n* **Capital Expenditure Cycle:** Ongoing transition from legacy refining into green energy gigafactories and 5G enterprise monetization.\n* **Key Multiples:** Trades at resilient EV/EBITDA valuations, with Retail & Jio representing expanding margins.\n* **Actionable Stance:** Core foundational holding for long-term compounders with strong support near institutional 200-day moving averages.` 
      }
    ]
  }
];

function loadSavedSessions() {
  try {
    const raw = localStorage.getItem(AI_SESSIONS_STORAGE_KEY);
    if (!raw) return INITIAL_SESSIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SESSIONS;
  } catch {
    return INITIAL_SESSIONS;
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(AI_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.warn('Failed to save AI sessions to localStorage:', err);
  }
}

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

  const color = value <= 25 ? 'var(--color-falu-red)' : value <= 45 ? 'var(--color-poppy)' : value <= 55 ? 'var(--color-dutch-white)' : value <= 75 ? 'var(--color-asparagus)' : 'var(--color-mint)';
  const label = value <= 25 ? 'EXTREME FEAR' : value <= 45 ? 'FEAR' : value <= 55 ? 'NEUTRAL' : value <= 75 ? 'GREED' : 'EXTREME GREED';

  return (
    <div style={{ position: 'relative', width: size, height: size * 0.8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size * 0.8} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5B0015" />
            <stop offset="25%" stopColor="#FF453A" />
            <stop offset="50%" stopColor="#F3ECE0" />
            <stop offset="75%" stopColor="#80AEE8" />
            <stop offset="100%" stopColor="#2E4B2F" />
          </linearGradient>
        </defs>
        <path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeW}
          strokeLinecap="round"
        />
        <path
          d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={strokeW}
          strokeDasharray={`${drawn} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.1s' }}
        />
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

export default function AIInsightsTab({ watchlist, setActiveTab, setSelectedAssetSymbol }) {
  const [sessions, setSessions] = useState(() => loadSavedSessions());
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const list = loadSavedSessions();
    return list[0]?.id || 'session-fusion';
  });
  const [chatInput, setChatInput] = useState('');
  const [activeModel, setActiveModel] = useState('Gemini 2.5 Flash');
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  const chatEndRef = useRef(null);

  // Sync sessions to localStorage
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // Active session
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0] || {
    id: 'default',
    title: 'New Conversation',
    createdAt: Date.now(),
    messages: [DEFAULT_WELCOME_MSG]
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession.messages, isTyping]);

  const handleCreateNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession = {
      id: newId,
      title: 'New Conversation',
      createdAt: Date.now(),
      messages: [DEFAULT_WELCOME_MSG]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (e, idToDelete) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      // Just reset the single session
      handleCreateNewChat();
      return;
    }
    const filtered = sessions.filter(s => s.id !== idToDelete);
    setSessions(filtered);
    if (activeSessionId === idToDelete) {
      setActiveSessionId(filtered[0]?.id || '');
    }
  };

  const handleSendChat = async (overridePrompt) => {
    const textToSend = typeof overridePrompt === 'string' ? overridePrompt : chatInput;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = textToSend.trim();
    setChatInput('');

    // Append user message immediately
    const updatedMessages = [...activeSession.messages, { role: 'user', content: userMsg }];
    
    // Auto-update title if it's default
    let updatedTitle = activeSession.title;
    if (activeSession.title === 'New Conversation' || activeSession.title === 'TradeFlow AI Conversation') {
      updatedTitle = userMsg.length > 35 ? `${userMsg.slice(0, 32)}...` : userMsg;
    }

    setSessions(prev => prev.map(s => {
      if (s.id === activeSession.id) {
        return {
          ...s,
          title: updatedTitle,
          messages: updatedMessages
        };
      }
      return s;
    }));

    setIsTyping(true);

    try {
      const { generateAIReply, getActiveModelName } = await import('../lib/aiChat');
      const aiResponse = await generateAIReply(updatedMessages, userMsg);
      setActiveModel(getActiveModelName());

      setSessions(prev => prev.map(s => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            messages: [...s.messages, { role: 'ai', content: aiResponse }]
          };
        }
        return s;
      }));
    } catch (error) {
      console.error('Gemini request failed:', error);
      const errorMessage = error?.message || 'I could not reach the AI model. Check your connection or API key.';
      setSessions(prev => prev.map(s => {
        if (s.id === activeSession.id) {
          return {
            ...s,
            messages: [...s.messages, { role: 'ai', content: errorMessage }]
          };
        }
        return s;
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedPrompts = [
    'Explain the Fusion option and cross-asset payoff',
    'Technical setup for Reliance Industries & TCS',
    'How do SIP rupee-cost averaging returns compound?',
    'What is Delta, Gamma, Theta in F&O options?'
  ];

  const aiSignals = React.useMemo(() => {
    if (!watchlist || watchlist.length === 0) return [];
    return watchlist.slice(0, 4).map(asset => {
      const isUp = asset.changePercent >= 0;
      const mag = Math.abs(asset.changePercent);
      const action = mag > 2 ? (isUp ? 'STRONG BUY' : 'OVERSOLD BUY') : (isUp ? 'BUY' : 'CAUTION / HOLD');
      const confidence = Math.min(96, Math.max(72, Math.round(75 + mag * 5)));
      const reason = isUp 
        ? `Momentum breakout: +${mag.toFixed(2)}% intraday. Bullish moving average alignment with volume accumulation.`
        : `Mean-reversion setup: Intraday pullback testing psychological support. Volatility contraction detected.`;
      return {
        symbol: asset.symbol,
        action,
        confidence,
        reason,
        impact: mag > 1.5 ? 'High' : 'Medium',
        type: asset.type
      };
    });
  }, [watchlist]);

  const newsFeed = [
    { source: 'RBI Wire', time: '18m ago', title: 'Monetary Policy Committee holds benchmark Repo Rate at 6.50%; liquidity remains neutral.', sentiment: 'Neutral' },
    { source: 'NSE Institutional Radar', time: '42m ago', title: 'DII net equity inflows outpace FII derivatives selling across large-cap indices.', sentiment: 'Bullish' },
    { source: 'Financial Express', time: '1h ago', title: 'Corporate earnings preview: IT & private banking majors report resilient net interest margins.', sentiment: 'Positive' },
    { source: 'Crypto Desk', time: '3h ago', title: 'Spot Bitcoin reserves on spot order books test multi-week lows as accumulation holds.', sentiment: 'Bullish' }
  ];

  return (
    <div className="tab-enter" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto' }}>

      {/* Top Main Section: Sentiment Gauge + Claude/ChatGPT Style AI Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', minHeight: '520px', flexShrink: 0 }}>

        {/* Left Column: Market Sentiment & System Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glassy-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', alignSelf: 'flex-start' }}>
              <Brain size={18} color="var(--color-teal)" />
              <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '1.05rem' }}>Market Sentiment</span>
            </div>
            <SentimentGauge value={72} size={210} />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '16px', lineHeight: 1.5 }}>
              Aggregated from live order books, institutional block deals & sentiment NLP.
            </p>
          </div>

          <div className="glassy-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Cpu size={18} color="#a855f7" />
              <span style={{ fontFamily: 'var(--font-header)', fontWeight: 800, fontSize: '0.95rem' }}>Active Engine</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Model</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#fff' }}>{activeModel}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Memory</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-jade)' }}>Persistent Storage</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Status</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-teal)' }}>Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Claude / ChatGPT Style Interface with Left Chats & Tasks Sidebar */}
        <div className="glassy-card" style={{ display: 'flex', padding: 0, overflow: 'hidden', minHeight: '520px', border: '1px solid var(--color-card-border)' }}>
          
          {/* ChatGPT/Claude Session History Sidebar (Flaw 9) */}
          {showSidebar && (
            <div style={{ 
              width: '240px', 
              borderRight: '1px solid rgba(255,255,255,0.08)', 
              background: 'rgba(10, 15, 25, 0.7)', 
              display: 'flex', 
              flexDirection: 'column',
              flexShrink: 0
            }}>
              {/* + New Chat Button */}
              <div style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={handleCreateNewChat}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                >
                  <Plus size={16} />
                  <span>+ New Chat</span>
                </button>
              </div>

              {/* Chats and tasks Header */}
              <div style={{ padding: '10px 16px 4px', fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Chats and tasks
              </div>

              {/* Chat Session List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
                {sessions.map(s => {
                  const isActive = s.id === activeSession.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setActiveSessionId(s.id)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        marginBottom: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: isActive ? 'rgba(128, 174, 232, 0.16)' : 'transparent',
                        color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        borderLeft: isActive ? '3px solid var(--color-asparagus)' : '3px solid transparent',
                        fontSize: '0.8rem',
                        transition: 'background 0.15s'
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                        <MessageSquare size={13} style={{ flexShrink: 0, color: isActive ? 'var(--color-asparagus)' : 'var(--color-text-muted)' }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {s.title}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(e, s.id)}
                        title="Delete chat"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-text-muted)',
                          padding: '2px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          opacity: isActive ? 1 : 0.4
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Bottom storage note */}
              <div style={{ padding: '8px 12px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={12} /> Auto-preserved across tabs
              </div>
            </div>
          )}

          {/* Active Chat Main Panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Header */}
            <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--color-card-border)', background: 'rgba(0,0,0,0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  title="Toggle chats sidebar"
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                >
                  {showSidebar ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                </button>

                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={14} color="#fff" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#fff', fontWeight: 800 }}>{activeSession.title}</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{activeModel}</span>
                </div>
              </div>

              <span className="badge-interactive" style={{ background: 'rgba(13,242,201,0.1)', color: 'var(--color-teal)', fontSize: '0.72rem' }}>
                Active Session
              </span>
            </div>

            {/* Chat Messages Stream */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeSession.messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '12px',
                    borderBottomLeftRadius: msg.role === 'ai' ? '4px' : '12px',
                    background: msg.role === 'user' ? 'var(--color-teal)' : 'rgba(255,255,255,0.05)',
                    color: msg.role === 'user' ? '#000' : '#fff',
                    border: msg.role === 'ai' ? '1px solid var(--color-card-border)' : 'none',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    boxShadow: msg.role === 'user' ? '0 2px 10px rgba(13,242,201,0.2)' : 'none'
                  }}>
                    {msg.content}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '4px', padding: '0 4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {msg.role === 'user' ? <UserIcon size={10} /> : <Bot size={10} />}
                    {msg.role === 'user' ? 'You' : activeModel}
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

            {/* Quick Suggested Prompt Chips */}
            <div style={{ padding: '8px 16px', display: 'flex', gap: '8px', overflowX: 'auto', background: 'rgba(0,0,0,0.1)' }}>
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(p)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.73rem',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--color-teal)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Bottom Input Field */}
            <div style={{ padding: '14px 16px', borderTop: '1px solid var(--color-card-border)', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--color-card-border)', borderRadius: '12px', padding: '4px 8px 4px 16px' }}>
                <input
                  type="text"
                  placeholder="Ask about fusion options, market technicals, portfolio strategy..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendChat()}
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '0.88rem', outline: 'none', padding: '10px 0' }}
                />
                <button
                  onClick={() => handleSendChat()}
                  disabled={!chatInput.trim() || isTyping}
                  style={{
                    background: chatInput.trim() ? 'var(--color-teal)' : 'rgba(255,255,255,0.1)',
                    color: chatInput.trim() ? '#000' : 'var(--color-text-muted)',
                    border: 'none',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: chatInput.trim() && !isTyping ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Row: AI Signals & News Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', flexShrink: 0 }}>
        {/* Actionable Signals */}
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

        {/* Sentiment News Feed */}
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
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
