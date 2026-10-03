import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, ShieldAlert, Zap, Send, MessageCircle, Loader } from 'lucide-react';

const faqs = [
  {
    category: "Getting Started",
    icon: <BookOpen size={18} style={{ color: 'var(--color-jade)' }}/>,
    items: [
      {
        q: "What is TradeFlow Simulator?",
        a: "TradeFlow is a premier paper trading and financial intelligence platform designed to let you practice trading stocks, forex, options, cryptocurrencies, and mutual funds using simulated virtual money. It helps you build strategies without risking real capital."
      },
      {
        q: "How much starting virtual cash do I get?",
        a: "Every new user starts with ₹80,00,000 in virtual cash. You can reset this balance at any time from the Settings tab if you want to start over."
      },
      {
        q: "Are the prices real?",
        a: "We pull live price data for all major assets using public APIs. However, if the API limits are reached, the system will automatically fall back to a realistic simulated price walk so your trading experience is never interrupted."
      }
    ]
  },
  {
    category: "Trading Features",
    icon: <Zap size={18} style={{ color: 'var(--color-teal)' }}/>,
    items: [
      {
        q: "How do I buy or short an asset?",
        a: "Navigate to the Market tab, click on any asset, and use the Buy/Sell buttons. You can choose between Market orders (executes immediately) or Limit orders (executes when the price hits your target)."
      },
      {
        q: "Why is the F&O (Futures & Options) tab locked?",
        a: "Derivatives are highly volatile. To unlock F&O trading, you must complete the short KYC Verification in the Settings tab to prove you understand the risks of options trading."
      },
      {
        q: "How does the Leaderboard work?",
        a: "The Global Leaderboard ranks all users based on their total Net Worth (Cash + Value of all Open Positions). It updates in real-time. If an admin flags your account for exploiting the simulator, you will be hidden from the leaderboard."
      }
    ]
  },
  {
    category: "Account & Settings",
    icon: <ShieldAlert size={18} style={{ color: 'var(--color-rose)' }}/>,
    items: [
      {
        q: "How do I reset my portfolio?",
        a: "Go to the Settings tab, scroll to 'System Settings', and click 'Reset Simulator'. This will wipe all your open positions, order history, and reset your cash balance back to ₹80,00,000."
      },
      {
        q: "How do I change my display name?",
        a: "Your display name is automatically pulled from the Google or GitHub account you used to log in. To change it, you must update your profile name on your respective provider's account."
      }
    ]
  }
];

export default function FAQTab() {
  const [openIndex, setOpenIndex] = useState(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);

  const toggleFaq = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  const handleAskQuestion = () => {
    if (!customQuestion.trim()) return;
    setIsAsking(true);
    setCustomAnswer('');
    
    setTimeout(() => {
      const q = customQuestion.toLowerCase();
      let answer = '';
      
      if (q.includes('fee') || q.includes('cost') || q.includes('charge')) {
        answer = 'TradeFlow Simulator is completely free to use! There are no fees, commissions, or hidden charges. All trades are executed with virtual money, so you can practice without any financial risk.';
      } else if (q.includes('real money') || q.includes('live') || q.includes('actual')) {
        answer = 'No, TradeFlow is a paper trading simulator only. You cannot trade with real money on this platform. It is designed purely for learning and practicing trading strategies with virtual funds.';
      } else if (q.includes('api') || q.includes('data') || q.includes('price')) {
        answer = 'We use live market data from public financial APIs (Yahoo Finance). When API limits are reached, the system seamlessly falls back to a realistic simulated price engine so your experience is never interrupted.';
      } else if (q.includes('mobile') || q.includes('phone') || q.includes('app')) {
        answer = 'TradeFlow is a progressive web app that works on any device with a browser. While there is no native mobile app yet, the web interface is fully responsive and optimized for mobile use.';
      } else if (q.includes('delete') || q.includes('account') || q.includes('remove')) {
        answer = 'To reset your account, go to Settings > System Settings > Reset Simulator. This will clear all positions, orders, and reset your balance to ₹80,00,000. For complete account deletion, please contact support.';
      } else {
        answer = `Great question! While I don't have a specific answer for "${customQuestion}" in my knowledge base, I recommend checking the FAQ categories above or reaching out to the TradeFlow community. You can also explore the AI Insights and Dictionary tabs for comprehensive market learning.`;
      }
      
      setCustomAnswer(answer);
      setIsAsking(false);
    }, 1500);
  };

  return (
    <div className="tab-panel active" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ padding: '12px', background: 'rgba(54, 124, 91, 0.1)', borderRadius: '12px', color: 'var(--color-teal)' }}>
          <HelpCircle size={32} />
        </div>
        <div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', margin: 0 }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>Everything you need to know about TradeFlow Simulator.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {faqs.map((category, catIndex) => (
          <div key={catIndex}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              {category.icon}
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--color-text-primary)' }}>
                {category.category}
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {category.items.map((item, itemIndex) => {
                const globalIndex = `${catIndex}-${itemIndex}`;
                const isOpen = openIndex === globalIndex;
                return (
                  <div 
                    key={globalIndex} 
                    className="glassy-card" 
                    style={{ 
                      padding: '0', 
                      overflow: 'hidden',
                      border: isOpen ? '1px solid var(--color-teal)' : '1px solid var(--color-border)',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    <button 
                      onClick={() => toggleFaq(globalIndex)}
                      style={{ 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '16px 20px', 
                        background: 'transparent', 
                        border: 'none', 
                        color: 'var(--color-text-primary)', 
                        fontSize: '15px', 
                        fontWeight: '600', 
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {item.q}
                      {isOpen ? <ChevronUp size={18} style={{ color: 'var(--color-teal)' }}/> : <ChevronDown size={18} style={{ color: 'var(--color-text-muted)' }}/>}
                    </button>
                    
                    {isOpen && (
                      <div style={{ padding: '0 20px 20px 20px', color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Ask Custom Question */}
      <div className="glassy-card" style={{ marginTop: '16px', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ padding: '10px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: '12px', color: '#a855f7' }}>
            <MessageCircle size={22} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', margin: 0 }}>Can't find your answer?</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px', marginTop: '2px' }}>Ask our AI assistant anything about TradeFlow</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: customAnswer ? '20px' : '0' }}>
          <div style={{ 
            flex: 1, display: 'flex', alignItems: 'center', 
            background: 'rgba(255,255,255,0.03)', 
            border: '1px solid var(--color-border)', 
            borderRadius: '12px', 
            padding: '4px 4px 4px 16px',
            transition: 'border-color 0.2s'
          }}>
            <input
              type="text"
              placeholder="Type your question here..."
              value={customQuestion}
              onChange={e => setCustomQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskQuestion()}
              style={{ 
                flex: 1, background: 'transparent', border: 'none', 
                color: 'var(--color-text-primary)', fontSize: '14px', 
                outline: 'none', padding: '10px 0',
                fontFamily: 'var(--font-body)'
              }}
            />
            <button
              onClick={handleAskQuestion}
              disabled={!customQuestion.trim() || isAsking}
              style={{
                background: customQuestion.trim() ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(255,255,255,0.05)',
                color: customQuestion.trim() ? '#fff' : 'var(--color-text-muted)',
                border: 'none',
                width: '40px', height: '40px',
                borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: customQuestion.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                flexShrink: 0
              }}
            >
              {isAsking ? <Loader size={16} className="fa-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
        
        {customAnswer && (
          <div style={{
            background: 'rgba(168, 85, 247, 0.05)',
            border: '1px solid rgba(168, 85, 247, 0.15)',
            borderRadius: '12px',
            padding: '16px 20px',
            animation: 'tabFadeIn 300ms ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageCircle size={12} color="#fff" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#a855f7' }}>AI Assistant</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
              {customAnswer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
