import React, { useState } from 'react';
import { 
  Users2, 
  Briefcase, 
  Award, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  Send,
  HelpCircle,
  BookOpen
} from 'lucide-react';

const ADVISOR_COUNCIL = [
  {
    name: 'Dr. Vikram Malhotra, CFA',
    title: 'Senior Portfolio Strategist & F&O Risk Analyst',
    experience: '18+ Years Institutional Experience',
    specialty: 'Quantitative Hedging & Derivatives',
    bio: 'Former head of index arbitrage at Mumbai Capital, specializes in volatility modeling, Delta-neutral option strategies, and institutional trade execution.',
    initials: 'VM'
  },
  {
    name: 'Ananya Deshmukh, CFP®',
    title: 'Principal Wealth Planner',
    experience: '14+ Years Wealth Advisory',
    specialty: 'Retirement Structuring & Tax Alpha',
    bio: 'Author of "Compounding Freedom", advisor to high-net-worth family offices on cross-border tax treaties, estate planning, and debt elimination.',
    initials: 'AD'
  },
  {
    name: 'Marcus Sterling, CMT',
    title: 'Chartered Market Technician',
    experience: '12+ Years Technical Research',
    specialty: 'Multi-Timeframe Price Action & Volume Profile',
    bio: 'Frequent commentator on international currency flows, Treasury bond yields, and algorithmic breakout patterns across global macro cycles.',
    initials: 'MS'
  }
];

const ADVISOR_FAQS = [
  {
    q: 'How should an early-career investor allocate capital between stocks and safe fixed income?',
    author: 'Ananya Deshmukh, CFP®',
    answer: 'A solid baseline is (110 - Your Age) in equity index funds and growth stocks, with the remainder in high-yield liquid instruments or short-duration fixed deposits. Automate your monthly contributions to capture market dips via Dollar-Cost Averaging.'
  },
  {
    q: 'When should a trader consider options hedging instead of simple stop-loss orders?',
    author: 'Dr. Vikram Malhotra, CFA',
    answer: 'Stop-losses are vulnerable to overnight gap-downs where the market opens below your stop price. Buying protective out-of-the-money puts establishes an immutable floor against catastrophic gap risk, particularly over earnings reports or central bank rate decisions.'
  },
  {
    q: 'What is the most common mistake made by new financial advisors managing client portfolios?',
    author: 'Marcus Sterling, CMT',
    answer: 'Over-trading and reacting to intraday noise. The greatest value an advisor provides is behavioral coaching—preventing clients from panicking and liquidating equities at market bottoms during inevitable macroeconomic corrections.'
  }
];

export default function AdvisorTab() {
  const [userQuestion, setUserQuestion] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setUserQuestion('');
    }, 2000);
  };

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
          <Briefcase size={20} color="var(--color-jade)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-jade)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Professional Practice & Advisory Network
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, margin: '2px 0 8px', color: '#fff' }}>
          TradeFlow for Advisors & Advisory Council
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '720px', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Insights, practice management strategies, and professional standards curated by our certified advisory board. Bridging the gap between institutional wealth management and individual retail execution.
        </p>
      </div>

      {/* Advisory Council Profiles */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ShieldCheck size={18} color="var(--color-jade)" />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: 0 }}>
            TradeFlow Advisory Council
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {ADVISOR_COUNCIL.map((adv, idx) => (
            <div 
              key={idx}
              className="glassy-card hover-glow"
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-teal), var(--color-jade))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 800,
                    color: '#000',
                    fontSize: '1rem',
                    flexShrink: 0
                  }}>
                    {adv.initials}
                  </div>
                  <div>
                    <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: '0 0 2px' }}>{adv.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-jade)', fontWeight: 600 }}>{adv.title}</span>
                  </div>
                </div>

                <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                  <strong>Specialty: </strong> {adv.specialty} • {adv.experience}
                </div>

                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                  {adv.bio}
                </p>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Verified Council Member</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-jade)', fontWeight: 600 }}>Active Contributor</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advisory Q&A Corner */}
      <div className="glassy-card" style={{ padding: '28px', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={18} color="var(--color-teal)" />
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: 0 }}>
            Council Insights & Expert Q&A
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {ADVISOR_FAQS.map((item, idx) => (
            <div 
              key={idx}
              style={{
                padding: '20px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '10px',
                borderLeft: '4px solid var(--color-jade)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ color: '#fff', fontSize: '1rem', margin: 0, lineHeight: 1.4 }}>
                  Q: {item.q}
                </h4>
              </div>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '8px' }}>
                {item.answer}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-jade)', fontWeight: 600 }}>
                Answered by {item.author}
              </span>
            </div>
          ))}
        </div>

        {/* Submit Question Box */}
        <div style={{
          marginTop: '12px',
          padding: '20px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '10px',
          border: '1px solid var(--color-border)'
        }}>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '6px' }}>
            Submit a Question to the TradeFlow Advisory Council
          </h4>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginBottom: '14px' }}>
            Have a question on risk parity, derivatives modeling, or tax-advantaged portfolio design? Our CFP®s and CFAs review selected submissions weekly.
          </p>

          <form onSubmit={handleSubmitQuestion} style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text"
              placeholder="Ask an investing or portfolio construction question..."
              value={userQuestion}
              onChange={e => setUserQuestion(e.target.value)}
              style={{
                flex: 1,
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            />
            <button 
              type="submit" 
              className="trade-btn primary-btn hover-glow"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <Send size={15} /> Submit
            </button>
          </form>

          {submitted && (
            <div style={{ marginTop: '10px', color: 'var(--color-jade)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} /> Question received! Our council will review it for upcoming publications.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
