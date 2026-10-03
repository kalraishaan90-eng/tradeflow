import React, { useState, useMemo } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  Compass, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Sparkles,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

const PODCAST_EPISODES = [
  {
    id: 'ep-314',
    episodeNumber: 314,
    title: 'The Tokenization of Our Portfolios',
    guest: 'Dr. Alistair Finch (Head of Digital Assets, BlockBridge)',
    date: 'Sep 29, 2026',
    duration: '28:40',
    summary: 'How real-world assets (RWAs)—from US Treasuries to commercial real estate—are moving onto cryptographic ledgers, and what it means for retail liquidity and portfolio construction.',
    keyTakeaway: 'Tokenized money market funds offer 24/7 instant settlement without weekend banking friction.'
  },
  {
    id: 'ep-313',
    episodeNumber: 313,
    title: 'A World Built on Bonds: Navigating the Sovereign Debt Landscape',
    guest: 'Sarah Jenkins (Chief Fixed Income Strategist)',
    date: 'Sep 22, 2026',
    duration: '32:15',
    summary: 'A deep dive into bond market duration, the yield curve, and how central bank quantitative tightening impacts everything from mortgages to tech stock valuations.',
    keyTakeaway: 'Bond yields serve as the foundational hurdle rate for all corporate earnings valuations.'
  },
  {
    id: 'ep-312',
    episodeNumber: 312,
    title: 'Are We Too Focused on the Fed?',
    guest: 'Caleb Silver (Editor-in-Chief & Host)',
    date: 'Sep 14, 2026',
    duration: '25:10',
    summary: 'Why individual retail investors over-rotate portfolios based on Fed speaker remarks rather than focusing on low-cost compounding and earnings fundamentals.',
    keyTakeaway: 'Time in the market consistently beats timing interest rate pivot headlines.'
  }
];

export default function WealthTab() {
  const [activeSection, setActiveSection] = useState('podcast'); // 'podcast' | 'debt-payoff' | 'retirement'

  // ─── Podcast Player State ─────────────────────────────────────────────────
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(35); // percentage
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');

  const currentEp = PODCAST_EPISODES[currentEpisodeIndex];

  // ─── Debt Payoff State (Avalanche vs Snowball) ────────────────────────────
  const [creditCardBalance, setCreditCardBalance] = useState(150000);
  const [creditCardApr, setCreditCardApr] = useState(24.0);

  const [personalLoanBalance, setPersonalLoanBalance] = useState(300000);
  const [personalLoanApr, setPersonalLoanApr] = useState(14.0);

  const [autoLoanBalance, setAutoLoanBalance] = useState(450000);
  const [autoLoanApr, setAutoLoanApr] = useState(9.5);

  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState(15000);

  // Simplified payoff calculations for comparison
  const debtComparison = useMemo(() => {
    const totalDebt = Number(creditCardBalance) + Number(personalLoanBalance) + Number(autoLoanBalance);
    const weightedAvgApr = (
      (Number(creditCardBalance) * Number(creditCardApr) +
       Number(personalLoanBalance) * Number(personalLoanApr) +
       Number(autoLoanBalance) * Number(autoLoanApr)) / (totalDebt || 1)
    );

    // Avalanche prioritizes highest interest (Credit Card 24% -> Personal Loan 14% -> Auto 9.5%)
    // Saves significant interest
    const approxAvalancheInterest = totalDebt * (weightedAvgApr / 100) * 1.8;
    const approxSnowballInterest = totalDebt * (weightedAvgApr / 100) * 2.3;
    const interestSaved = Math.max(0, approxSnowballInterest - approxAvalancheInterest);

    return {
      totalDebt,
      weightedAvgApr: weightedAvgApr.toFixed(1),
      avalancheMonths: Math.round(totalDebt / (Number(extraMonthlyPayment) + 12000)),
      snowballMonths: Math.round(totalDebt / (Number(extraMonthlyPayment) + 11500)),
      interestSaved: Math.round(interestSaved)
    };
  }, [creditCardBalance, creditCardApr, personalLoanBalance, personalLoanApr, autoLoanBalance, autoLoanApr, extraMonthlyPayment]);

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
          <Compass size={20} color="var(--color-jade)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-jade)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Wealth Building & Multimedia Hub
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, margin: '2px 0 8px', color: '#fff' }}>
          Personal Finance & TradeFlow Express
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '720px', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Listen to weekly market insights on "The TradeFlow Express" podcast, optimize debt repayment through interactive Snowball vs. Avalanche strategies, and construct long-term retirement roadmaps.
        </p>
      </div>

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveSection('podcast')}
          className={`hover-glow ${activeSection === 'podcast' ? 'active' : ''}`}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: activeSection === 'podcast' ? '1px solid var(--color-jade)' : '1px solid transparent',
            background: activeSection === 'podcast' ? 'rgba(93, 211, 148, 0.15)' : 'transparent',
            color: activeSection === 'podcast' ? 'var(--color-jade)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Headphones size={16} /> TradeFlow Express Podcast
        </button>

        <button
          onClick={() => setActiveSection('debt-payoff')}
          className={`hover-glow ${activeSection === 'debt-payoff' ? 'active' : ''}`}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: activeSection === 'debt-payoff' ? '1px solid var(--color-jade)' : '1px solid transparent',
            background: activeSection === 'debt-payoff' ? 'rgba(93, 211, 148, 0.15)' : 'transparent',
            color: activeSection === 'debt-payoff' ? 'var(--color-jade)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Layers size={16} /> Debt Avalanche vs. Snowball
        </button>

        <button
          onClick={() => setActiveSection('retirement')}
          className={`hover-glow ${activeSection === 'retirement' ? 'active' : ''}`}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: activeSection === 'retirement' ? '1px solid var(--color-jade)' : '1px solid transparent',
            background: activeSection === 'retirement' ? 'rgba(93, 211, 148, 0.15)' : 'transparent',
            color: activeSection === 'retirement' ? 'var(--color-jade)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <TrendingUp size={16} /> Retirement & FIRE Roadmap
        </button>
      </div>

      {/* ─── SECTION 1: PODCAST PLAYER ────────────────────────────────────── */}
      {activeSection === 'podcast' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          
          {/* Main Interactive Audio Player Card */}
          <div className="glassy-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--color-surface)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  background: 'rgba(54, 124, 91, 0.25)',
                  color: 'var(--color-jade)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em'
                }}>
                  NOW PLAYING • EPISODE #{currentEp.episodeNumber}
                </span>

                <button 
                  onClick={() => {
                    const speeds = ['1.0x', '1.25x', '1.5x', '2.0x'];
                    const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
                    setPlaybackSpeed(next);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--color-border)',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {playbackSpeed}
                </button>
              </div>

              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', color: '#fff', margin: '4px 0 8px' }}>
                {currentEp.title}
              </h2>

              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                Featuring: <strong style={{ color: '#fff' }}>{currentEp.guest}</strong> • {currentEp.date}
              </p>

              <p style={{ color: 'var(--color-text-primary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
                {currentEp.summary}
              </p>
            </div>

            {/* Simulated Player Controls */}
            <div>
              {/* Progress Slider */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                  <span>09:45</span>
                  <span>{currentEp.duration}</span>
                </div>
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setPlayProgress((clickX / rect.width) * 100);
                  }}
                  style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', cursor: 'pointer', position: 'relative' }}
                >
                  <div style={{ width: `${playProgress}%`, height: '100%', background: 'var(--color-jade)', borderRadius: '4px' }} />
                </div>
              </div>

              {/* Control Buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px' }}>
                <button 
                  onClick={() => setCurrentEpisodeIndex((currentEpisodeIndex - 1 + PODCAST_EPISODES.length) % PODCAST_EPISODES.length)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                >
                  <SkipBack size={20} />
                </button>

                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: 'var(--color-jade)',
                    border: 'none',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 0 15px var(--color-jade-glow)'
                  }}
                >
                  {isPlaying ? <Pause size={24} fill="#000" /> : <Play size={24} fill="#000" style={{ marginLeft: '2px' }} />}
                </button>

                <button 
                  onClick={() => setCurrentEpisodeIndex((currentEpisodeIndex + 1) % PODCAST_EPISODES.length)}
                  style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                >
                  <SkipForward size={20} />
                </button>
              </div>

              <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', borderLeft: '3px solid var(--color-teal)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 700 }}>Episode Takeaway: </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{currentEp.keyTakeaway}</span>
              </div>
            </div>
          </div>

          {/* Episode List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff', marginBottom: '4px' }}>
              Recent Episodes
            </h3>

            {PODCAST_EPISODES.map((ep, idx) => {
              const isSelected = idx === currentEpisodeIndex;
              return (
                <div 
                  key={ep.id}
                  onClick={() => { setCurrentEpisodeIndex(idx); setIsPlaying(true); }}
                  className="glassy-card hover-glow"
                  style={{
                    padding: '16px 20px',
                    borderRadius: '10px',
                    border: isSelected ? '1px solid var(--color-jade)' : '1px solid var(--color-border)',
                    background: isSelected ? 'rgba(93, 211, 148, 0.08)' : 'var(--color-surface)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: isSelected ? 'var(--color-jade)' : 'var(--color-text-muted)', fontWeight: 700 }}>
                      EPISODE #{ep.episodeNumber}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{ep.duration}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: '#fff', margin: '2px 0 4px' }}>{ep.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {ep.guest}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── SECTION 2: DEBT AVALANCHE VS SNOWBALL ───────────────────────── */}
      {activeSection === 'debt-payoff' && (
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
          
          {/* Inputs Panel */}
          <div className="glassy-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff' }}>
              Your Outstanding Debts
            </h3>

            {/* Credit Card */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                <span>Credit Card Balance (₹)</span>
                <span style={{ color: 'var(--color-rose)' }}>{creditCardApr}% APR</span>
              </div>
              <input 
                type="number"
                value={creditCardBalance}
                onChange={e => setCreditCardBalance(e.target.value)}
                style={{ width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            {/* Personal Loan */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                <span>Personal Loan (₹)</span>
                <span style={{ color: '#f59e0b' }}>{personalLoanApr}% APR</span>
              </div>
              <input 
                type="number"
                value={personalLoanBalance}
                onChange={e => setPersonalLoanBalance(e.target.value)}
                style={{ width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            {/* Auto Loan */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                <span>Auto Loan (₹)</span>
                <span style={{ color: 'var(--color-teal)' }}>{autoLoanApr}% APR</span>
              </div>
              <input 
                type="number"
                value={autoLoanBalance}
                onChange={e => setAutoLoanBalance(e.target.value)}
                style={{ width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            {/* Extra Monthly Payment */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-jade)', display: 'block', marginBottom: '4px', fontWeight: 600 }}>
                EXTRA MONTHLY PAYOFF BUDGET (₹)
              </label>
              <input 
                type="number"
                value={extraMonthlyPayment}
                onChange={e => setExtraMonthlyPayment(e.target.value)}
                style={{ width: '100%', background: 'var(--color-surface)', border: '1px solid var(--color-jade)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          <div className="glassy-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              
              {/* Avalanche */}
              <div style={{
                background: 'rgba(93, 211, 148, 0.05)',
                border: '1px solid rgba(93, 211, 148, 0.3)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-jade)', fontWeight: 800, fontSize: '0.85rem' }}>
                  <Flame size={16} /> DEBT AVALANCHE (MATHEMATICALLY OPTIMAL)
                </div>
                <h4 style={{ color: '#fff', margin: '8px 0 12px', fontSize: '1.2rem' }}>Pay Highest APR First</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  Direct every extra rupee to your 24% credit card first, while paying minimums on the rest. Eliminates toxic high-interest debt fastest.
                </p>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-jade)', fontFamily: 'var(--font-mono)' }}>
                  ~{debtComparison.avalancheMonths} Months
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Estimated Debt-Free Date</span>
              </div>

              {/* Snowball */}
              <div style={{
                background: 'rgba(66, 148, 255, 0.05)',
                border: '1px solid rgba(66, 148, 255, 0.3)',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#60a5fa', fontWeight: 800, fontSize: '0.85rem' }}>
                  <Sparkles size={16} /> DEBT SNOWBALL (PSYCHOLOGICAL MOMENTUM)
                </div>
                <h4 style={{ color: '#fff', margin: '8px 0 12px', fontSize: '1.2rem' }}>Pay Smallest Balance First</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  Direct extra cash to the smallest dollar loan to eliminate accounts rapidly. Provides quick psychological wins to stay motivated.
                </p>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                  ~{debtComparison.snowballMonths} Months
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Estimated Debt-Free Date</span>
              </div>
            </div>

            {/* Savings Callout */}
            <div style={{
              padding: '16px 20px',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '10px',
              borderLeft: '4px solid var(--color-jade)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>INTEREST SAVINGS WITH AVALANCHE METHOD</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-jade)', fontFamily: 'var(--font-mono)' }}>
                  ₹{debtComparison.interestSaved.toLocaleString('en-IN')} Saved
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', maxWidth: '400px', margin: 0 }}>
                By attacking the 24% card balance first, you prevent compounding interest from draining your monthly cash flow.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── SECTION 3: RETIREMENT & FIRE ROADMAP ─────────────────────────── */}
      {activeSection === 'retirement' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Rule of 72 */}
          <div className="glassy-card hover-glow" style={{ padding: '24px', background: 'var(--color-surface)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-jade)', fontWeight: 800, textTransform: 'uppercase' }}>THE GOLDEN FORMULA</span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: '4px 0 8px' }}>
              The Rule of 72
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '14px' }}>
              Divide 72 by your compound annual return rate to calculate the exact time needed for your capital to double in purchasing power.
            </p>
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-jade)' }}>
              Years to Double = 72 / Annual Return %
            </div>
          </div>

          {/* 4% Rule */}
          <div className="glassy-card hover-glow" style={{ padding: '24px', background: 'var(--color-surface)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 800, textTransform: 'uppercase' }}>FIRE WITHDRAWAL</span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: '4px 0 8px' }}>
              The 4% Safe Withdrawal Rule
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '14px' }}>
              Derived from the Trinity Study: Withdrawing 4% of your total invested portfolio in year one (adjusted for inflation thereafter) carries a 95%+ probability of lasting 30+ years.
            </p>
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-teal)' }}>
              Target Corpus = 25 * Annual Living Expenses
            </div>
          </div>

          {/* 50/30/20 Budgeting */}
          <div className="glassy-card hover-glow" style={{ padding: '24px', background: 'var(--color-surface)' }}>
            <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase' }}>FOUNDATIONAL BUDGETING</span>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: '#fff', margin: '4px 0 8px' }}>
              The 50 / 30 / 20 Rule
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '14px' }}>
              Allocate 50% of after-tax income to essential Needs (rent, food, EMI), 30% to Wants (travel, hobbies), and a minimum of 20% strictly to Savings, Debt Payoff, and Market Investments.
            </p>
            <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#f59e0b' }}>
              50% Needs • 30% Wants • 20% Compounding
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
