import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Tag, 
  Calculator, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle, 
  X,
  TrendingUp,
  Bookmark,
  Share2
} from 'lucide-react';

const DICTIONARY_DATA = [
  {
    id: 'sharpe-ratio',
    term: 'Sharpe Ratio',
    letter: 'S',
    category: 'Investing',
    difficulty: 'Intermediate',
    definition: 'A measure of risk-adjusted return developed by Nobel laureate William F. Sharpe. It quantifies how much excess return an investor receives for the extra volatility endured by holding a riskier asset rather than a risk-free asset.',
    keyTakeaways: [
      'The Sharpe ratio adjusts a portfolio’s past performance—or expected future performance—for the excess risk that was taken by the investor.',
      'A Sharpe ratio greater than 1.0 is generally considered good, greater than 2.0 is very good, and 3.0 or higher is considered excellent.',
      'A negative Sharpe ratio means the risk-free rate is greater than the portfolio’s return, or the portfolio is generating negative returns.'
    ],
    formula: 'Sharpe Ratio = (R_p - R_f) / σ_p',
    formulaExplanation: 'Where R_p = Return of portfolio, R_f = Risk-free rate (e.g. 10-year Treasury yield), and σ_p = Standard deviation of the portfolio’s excess return.',
    example: 'Suppose your paper trading portfolio returned 16% over the past year, the risk-free rate was 4%, and your portfolio volatility (standard deviation) was 8%. Your Sharpe ratio is (16% - 4%) / 8% = 1.50, demonstrating solid risk-adjusted compensation.',
    proTip: 'Compare Sharpe ratios only between similar asset classes or benchmarks with comparable timeframes to avoid false comparisons.',
    relatedTerms: ['Beta', 'Alpha', 'Standard Deviation', 'Treynor Ratio']
  },
  {
    id: 'pe-ratio',
    term: 'Price-to-Earnings (P/E) Ratio',
    letter: 'P',
    category: 'Valuation',
    difficulty: 'Beginner',
    definition: 'The ratio of a company’s share price to the company’s earnings per share (EPS). It is the most widely used metric for valuing companies and determining whether a stock is overvalued or undervalued relative to peers.',
    keyTakeaways: [
      'The P/E ratio shows how much investors are willing to pay per dollar of company earnings.',
      'Trailing P/E relies on past earnings over the trailing 12 months (TTM), whereas Forward P/E uses projected future earnings.',
      'A high P/E could mean the stock is overvalued, or that investors expect rapid earnings growth in the future.'
    ],
    formula: 'P/E Ratio = Market Value per Share / Earnings per Share (EPS)',
    formulaExplanation: 'EPS = (Net Income - Preferred Dividends) / End-of-period Shares Outstanding.',
    example: 'If Reliance Industries is trading at ₹2,840 per share and its annual EPS is ₹142, its P/E ratio is 2,840 / 142 = 20.0x. This means you are paying ₹20 for every ₹1 of profit.',
    proTip: 'Never evaluate P/E in a vacuum; always compare against historical averages and direct sector competitors.',
    relatedTerms: ['Earnings Per Share (EPS)', 'PEG Ratio', 'Price-to-Book (P/B)', 'EBITDA']
  },
  {
    id: 'black-scholes',
    term: 'Black-Scholes Model',
    letter: 'B',
    category: 'Options & F&O',
    difficulty: 'Advanced',
    definition: 'A renowned mathematical model used to determine the fair price or theoretical value of European call and put options based on six core market variables.',
    keyTakeaways: [
      'Developed in 1973 by Fischer Black, Myron Scholes, and Robert Merton, laying the foundation for modern financial engineering.',
      'Key inputs: current stock price, strike price, time to expiration, risk-free rate, and implied volatility (IV).',
      'Assumes stock prices follow a lognormal random walk with constant volatility and no transaction costs.'
    ],
    formula: 'C(S, t) = S_t * N(d1) - K * e^(-r(T-t)) * N(d2)',
    formulaExplanation: 'Where d1 = [ln(S/K) + (r + σ²/2)(T-t)] / [σ√(T-t)], and d2 = d1 - σ√(T-t). N(·) represents the standard normal cumulative distribution function.',
    example: 'An options trader notices that a 30-day Call on NIFTY is priced in the market at ₹180, while Black-Scholes calculates its fair mathematical value as ₹155. The option has high implied volatility, making selling covered premium attractive.',
    proTip: 'Real options trade on American-style execution and volatility smiles; use Black-Scholes as a theoretical baseline rather than an absolute rule.',
    relatedTerms: ['Greeks', 'Implied Volatility (IV)', 'Call Option', 'Put Option']
  },
  {
    id: 'compound-interest',
    term: 'Compound Interest',
    letter: 'C',
    category: 'Personal Finance',
    difficulty: 'Beginner',
    definition: 'Interest calculated on the initial principal, which also includes all the accumulated interest from previous periods on a deposit or loan. Often referred to by Albert Einstein as the "eighth wonder of the world".',
    keyTakeaways: [
      'Compound interest causes your wealth to grow exponentially rather than linearly.',
      'The frequency of compounding (daily, monthly, quarterly, annually) increases the effective annual yield.',
      'Works in your favor when saving and investing, but exponentially against you on credit card debt.'
    ],
    formula: 'A = P * (1 + r/n)^(n*t)',
    formulaExplanation: 'Where A = Final amount, P = Principal investment, r = Annual nominal interest rate (decimal), n = Compounding frequency per year, and t = Time in years.',
    example: 'Investing ₹1,00,000 at an 8% annual return compounded monthly for 20 years results in ₹4,92,680—nearly 5x your original capital without adding any extra deposits.',
    proTip: 'Harness the Rule of 72: Divide 72 by your expected annual return % to calculate the exact number of years needed to double your money.',
    relatedTerms: ['APY vs APR', 'Rule of 72', 'Time Value of Money', 'Dollar-Cost Averaging']
  },
  {
    id: 'bull-call-spread',
    term: 'Bull Call Spread',
    letter: 'B',
    category: 'Options & F&O',
    difficulty: 'Intermediate',
    definition: 'An options strategy that involves purchasing a call option with a lower strike price while simultaneously selling another call option with a higher strike price on the same underlying asset and expiration date.',
    keyTakeaways: [
      'Constructed to profit from moderate upside movement while capping maximum potential loss.',
      'The premium received from selling the higher strike call partially offsets the cost of buying the lower strike call.',
      'Both risk and reward are strictly defined and capped.'
    ],
    formula: 'Max Profit = (Strike Higher - Strike Lower - Net Premium Paid) * Lot Size',
    formulaExplanation: 'Max Loss is strictly limited to the Net Premium Paid upon initiating the trade.',
    example: 'Buy NIFTY 24800 Call for ₹140, Sell NIFTY 25000 Call for ₹50. Net debit paid is ₹90. If NIFTY closes at 25100 at expiry, your profit is (200 - 90) * 25 = ₹2,750 per lot.',
    proTip: 'Ideal for bullish setups when implied volatility is high, preventing excessive outlay on outright calls.',
    relatedTerms: ['Bear Put Spread', 'Straddle', 'Iron Condor', 'Delta']
  },
  {
    id: 'apy-vs-apr',
    term: 'APY vs. APR',
    letter: 'A',
    category: 'Banking',
    difficulty: 'Beginner',
    definition: 'Annual Percentage Yield (APY) accounts for compounding interest throughout the year, whereas Annual Percentage Rate (APR) reflects the simple annual rate charged or earned without factoring in compounding.',
    keyTakeaways: [
      'APY is always higher than or equal to APR if compounding happens more frequently than once a year.',
      'Banks market high APY on savings accounts and CDs to attract deposits, but cite APR on mortgages and credit cards to make borrowing costs appear lower.',
      'Always compare APY-to-APY when shopping for savings yields.'
    ],
    formula: 'APY = (1 + r/n)^n - 1',
    formulaExplanation: 'Where r = Nominal APR (decimal) and n = Number of compounding periods per year.',
    example: 'A savings account with a 5.00% APR compounding daily yields an effective APY of (1 + 0.05/365)^365 - 1 = 5.127%. That extra 0.13% adds meaningful returns over long holding periods.',
    proTip: 'When borrowing, pay attention to the compounding period—daily compounding on high-APR credit cards drastically speeds up debt accumulation.',
    relatedTerms: ['Compound Interest', 'High-Yield Savings Account', 'Certificates of Deposit', 'Yield']
  },
  {
    id: 'ebitda',
    term: 'EBITDA',
    letter: 'E',
    category: 'Valuation',
    difficulty: 'Intermediate',
    definition: 'Earnings Before Interest, Taxes, Depreciation, and Amortization. A widely accepted metric of core operating profitability that strips out non-operating expenses, capital structure decisions, and non-cash accounting charges.',
    keyTakeaways: [
      'Provides a clean view of the operational cash-generating capability of a business.',
      'Frequently used in leveraged buyout (LBO) analysis and Enterprise Value multiples (EV/EBITDA).',
      'Criticized by Warren Buffett because it ignores real capital expenditures required to maintain company equipment and assets.'
    ],
    formula: 'EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization',
    formulaExplanation: 'Alternatively: EBITDA = Operating Profit (EBIT) + Depreciation + Amortization.',
    example: 'A manufacturing firm reports Net Income of ₹50 Cr, Interest expense of ₹15 Cr, Taxes of ₹12 Cr, and Depreciation of ₹23 Cr. Its EBITDA is ₹100 Cr, reflecting strong core cash flow.',
    proTip: 'Always check Free Cash Flow alongside EBITDA to ensure depreciation isn’t concealing hefty mandatory equipment replacement costs.',
    relatedTerms: ['Operating Income (EBIT)', 'Free Cash Flow', 'Enterprise Value (EV)', 'Net Margin']
  },
  {
    id: 'yield-curve',
    term: 'Yield Curve',
    letter: 'Y',
    category: 'Macroeconomics',
    difficulty: 'Intermediate',
    definition: 'A line graph that plots interest rates (yields) of government bonds having equal credit quality but differing maturity dates, ranging from 1-month bills up to 30-year sovereign bonds.',
    keyTakeaways: [
      'Normal yield curve: Upward sloping, reflecting higher yields demanded for locking money away over longer durations.',
      'Inverted yield curve: Short-term yields exceed long-term yields. Historically, an inverted 2-year/10-year curve is one of the most reliable precursors of an economic recession.',
      'Flat yield curve: Indicates transition periods or economic uncertainty where investors anticipate central bank rate cuts.'
    ],
    formula: 'Yield Spread = Yield(10-Year Bond) - Yield(2-Year Bond)',
    formulaExplanation: 'When this spread drops below 0%, the yield curve is officially inverted.',
    example: 'When the US 2-year Treasury yield rose to 4.80% while the 10-year yield sat at 4.25%, the spread was -0.55%, signaling tight central bank liquidity and recession risk.',
    proTip: 'Watch when an inverted curve begins to rapidly un-invert or steepen—this often marks the moment the central bank is forced to slash interest rates to combat economic slowdown.',
    relatedTerms: ['Bonds', 'Monetary Policy', 'Federal Reserve', 'Inflation']
  },
  {
    id: 'dollar-cost-averaging',
    term: 'Dollar-Cost Averaging (DCA)',
    letter: 'D',
    category: 'Investing',
    difficulty: 'Beginner',
    definition: 'An investment strategy in which an investor divides up the total amount to be invested across periodic purchases of a target asset in an effort to reduce the impact of volatility on the overall purchase.',
    keyTakeaways: [
      'Eliminates the emotional burden of trying to time the absolute bottom or top of the market.',
      'Purchases more shares when prices are depressed and fewer shares when prices are elevated.',
      'Forms the foundation of Systematic Investment Plans (SIP) in mutual funds and index funds.'
    ],
    formula: 'Average Cost per Share = Total Capital Invested / Total Shares Accumulated',
    formulaExplanation: 'Calculated over all installment periods regardless of market fluctuation.',
    example: 'You invest ₹10,000 every month into an index ETF. In month 1 it trades at ₹100 (100 shares), month 2 at ₹80 (125 shares), and month 3 at ₹120 (83.3 shares). Your average cost is ₹97.29, lower than the current price of ₹120.',
    proTip: 'Automate your DCA transfers right after your paycheck arrives to enforce discipline and remove emotional bias.',
    relatedTerms: ['Systematic Investment Plan (SIP)', 'Lump Sum Investing', 'Volatility', 'Asset Allocation']
  },
  {
    id: 'margin-call',
    term: 'Margin Call',
    letter: 'M',
    category: 'Trading',
    difficulty: 'Intermediate',
    definition: 'A broker’s demand that an investor deposit additional cash or securities into their margin account to bring the account up to the minimum required maintenance margin.',
    keyTakeaways: [
      'Occurs when the value of the securities held in a margin account decreases below a predefined percentage.',
      'If the trader fails to deposit funds immediately, the broker has the legal right to liquidate open positions at market prices.',
      'Magnified by high leverage in futures, options, and CFD trading.'
    ],
    formula: 'Minimum Equity Required = Market Value of Securities * Maintenance Margin %',
    formulaExplanation: 'A margin call triggers whenever Current Account Equity < Minimum Equity Required.',
    example: 'You buy ₹5,00,000 worth of shares using ₹2,50,000 of your cash and ₹2,50,000 borrowed on margin with a 30% maintenance requirement. If the portfolio value drops to ₹3,20,000, your equity is ₹70,000 (21.8%), below the required 30% (₹96,000), triggering a margin call for ₹26,000.',
    proTip: 'Keep your margin utilization below 40% of available headroom to easily survive severe intraday flash crashes.',
    relatedTerms: ['Leverage', 'Short Selling', 'Maintenance Margin', 'Liquidation']
  },
  {
    id: 'free-cash-flow',
    term: 'Free Cash Flow (FCF)',
    letter: 'F',
    category: 'Valuation',
    difficulty: 'Intermediate',
    definition: 'The cash a company generates through its operations, subtracted by the cost of expenditures on capital assets (CapEx). It represents the discretionary cash available to repay creditors, distribute dividends, or repurchase shares.',
    keyTakeaways: [
      'Much harder for accounting gimmicks to manipulate than reported Net Income or accounting EPS.',
      'Positive, growing FCF is the hallmark of financially resilient blue-chip companies.',
      'Used as the foundational input for Discounted Cash Flow (DCF) valuation models.'
    ],
    formula: 'FCF = Operating Cash Flow - Capital Expenditures (CapEx)',
    formulaExplanation: 'Where Operating Cash Flow comes from the cash flow statement, and CapEx reflects purchases of property, plant, and equipment (PP&E).',
    example: 'A technology company brings in ₹1,200 Cr in cash from operations and spends ₹250 Cr on server infrastructure and hardware. Its Free Cash Flow is ₹950 Cr, available for share buybacks or R&D.',
    proTip: 'Look for companies with a high FCF conversion rate (FCF / Net Income > 100%), signaling pristine earnings quality.',
    relatedTerms: ['Operating Cash Flow', 'CapEx', 'DCF Valuation', 'Dividend Payout Ratio']
  },
  {
    id: 'beta',
    term: 'Beta (β)',
    letter: 'B',
    category: 'Investing',
    difficulty: 'Beginner',
    definition: 'A measure of a stock’s volatility in relation to the overall market benchmark (such as the S&P 500 or NIFTY 50).',
    keyTakeaways: [
      'A beta of 1.0 indicates that the stock moves directly in tandem with the broad market.',
      'A beta greater than 1.0 indicates higher volatility than the market (e.g. high-growth tech stocks).',
      'A beta less than 1.0 indicates lower volatility (e.g. consumer staples and utilities).'
    ],
    formula: 'Beta = Covariance(R_stock, R_market) / Variance(R_market)',
    formulaExplanation: 'Calculated using historical regression of daily or weekly percentage returns.',
    example: 'A high-beta EV company has a beta of 1.65. If the benchmark NIFTY 50 surges by 2%, the stock is statistically expected to climb by 3.3%. Conversely, if the index falls 2%, it may drop 3.3%.',
    proTip: 'Conservative portfolios should balance high-beta growth stocks with low-beta dividend aristocrats to dampen maximum portfolio drawdowns.',
    relatedTerms: ['Alpha', 'Volatility', 'Capital Asset Pricing Model (CAPM)', 'Standard Deviation']
  }
];

const CATEGORIES = [
  'All',
  'Investing',
  'Trading',
  'Options & F&O',
  'Valuation',
  'Macroeconomics',
  'Banking',
  'Personal Finance'
];

const ALPHABET = ['All', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

export default function DictionaryTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [activeTerm, setActiveTerm] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);

  // Term of the day is deterministic based on day
  const termOfTheDay = DICTIONARY_DATA[0];

  // Filtering logic
  const filteredTerms = useMemo(() => {
    return DICTIONARY_DATA.filter(item => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

      // Letter filter
      if (selectedLetter !== 'All') {
        if (selectedLetter === '#') {
          if (!/^[0-9]/.test(item.term)) return false;
        } else if (item.letter !== selectedLetter) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.term.toLowerCase().includes(q);
        const matchDef = item.definition.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        const matchFormula = item.formula?.toLowerCase().includes(q);
        return matchTitle || matchDef || matchCat || matchFormula;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedLetter]);

  return (
    <div className="tab-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', overflowY: 'auto', paddingBottom: '40px' }}>
      
      {/* Header Banner */}
      <div className="glassy-card" style={{
        background: 'linear-gradient(135deg, rgba(54, 124, 91, 0.2) 0%, rgba(11, 14, 13, 0.8) 100%)',
        border: '1px solid var(--color-teal-glow)',
        padding: '28px',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <BookOpen size={20} color="var(--color-jade)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-jade)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Financial Term Encyclopedia
            </span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, margin: '4px 0 10px', color: '#fff' }}>
            TradeFlow Financial Dictionary
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '680px', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Master the language of Wall Street, Dalal Street, and corporate finance. Explore rigorous definitions, formulas, real-world trading examples, and expert takeaways across thousands of concepts.
          </p>
        </div>
      </div>

      {/* Term of the Day Spotlight */}
      <div className="glassy-card hover-glow" style={{
        background: 'rgba(93, 211, 148, 0.04)',
        border: '1px solid rgba(93, 211, 148, 0.2)',
        padding: '24px',
        borderRadius: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={16} color="var(--color-jade)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-jade)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Featured Term of the Day
              </span>
              <span className="badge-interactive" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>
                {termOfTheDay.category}
              </span>
            </div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 8px' }}>
              {termOfTheDay.term}
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: '720px', lineHeight: 1.6 }}>
              {termOfTheDay.definition}
            </p>
          </div>

          <button 
            className="trade-btn primary-btn hover-glow"
            onClick={() => setActiveTerm(termOfTheDay)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.85rem' }}
          >
            Explore Deep Dive <ArrowRight size={16} />
          </button>
        </div>

        {/* Quick formula snippet */}
        {termOfTheDay.formula && (
          <div style={{
            marginTop: '16px',
            padding: '10px 16px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '8px',
            borderLeft: '3px solid var(--color-jade)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <Calculator size={16} color="var(--color-jade)" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--color-jade)', fontWeight: 600 }}>
              {termOfTheDay.formula}
            </span>
          </div>
        )}
      </div>

      {/* Search & Category Filter Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{
            flex: '1 1 320px',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '10px',
            padding: '0 14px',
            transition: 'border-color 0.2s'
          }}>
            <Search size={18} color="var(--color-text-muted)" style={{ marginRight: '8px' }} />
            <input 
              type="text"
              placeholder="Search financial terms, formulas, or concepts (e.g. Sharpe, P/E, Black-Scholes)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                padding: '12px 0',
                outline: 'none',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-body)'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: 4 }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`hover-glow ${selectedCategory === cat ? 'active' : ''}`}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: selectedCategory === cat ? '1px solid var(--color-jade)' : '1px solid var(--color-border)',
                background: selectedCategory === cat ? 'rgba(93, 211, 148, 0.15)' : 'var(--color-surface)',
                color: selectedCategory === cat ? 'var(--color-jade)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Alphabet Bar */}
        <div style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          padding: '8px 12px',
          background: 'var(--color-surface)',
          borderRadius: '10px',
          border: '1px solid var(--color-border)'
        }}>
          {ALPHABET.map(letter => {
            const isSelected = selectedLetter === letter;
            return (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                style={{
                  minWidth: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  border: 'none',
                  background: isSelected ? 'var(--color-jade)' : 'transparent',
                  color: isSelected ? '#000' : 'var(--color-text-secondary)',
                  fontWeight: isSelected ? 800 : 500,
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.15s'
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>
      </div>

      {/* Terms Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
            Showing <strong style={{ color: '#fff' }}>{filteredTerms.length}</strong> terms
            {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
            {selectedLetter !== 'All' ? ` starting with '${selectedLetter}'` : ''}
          </span>
        </div>

        {filteredTerms.length === 0 ? (
          <div className="glassy-card" style={{ textAlign: 'center', padding: '48px 20px' }}>
            <HelpCircle size={40} color="var(--color-text-muted)" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ color: '#fff', marginBottom: '6px' }}>No financial terms found</h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
              Try adjusting your search terms or clearing active filters.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '16px'
          }}>
            {filteredTerms.map(item => (
              <div 
                key={item.id}
                className="glassy-card hover-glow"
                onClick={() => setActiveTerm(item)}
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)',
                  transition: 'all 0.2s'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(54, 124, 91, 0.2)',
                      color: 'var(--color-jade)',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}>
                      {item.category}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      color: item.difficulty === 'Beginner' ? 'var(--color-jade)' : item.difficulty === 'Intermediate' ? '#f59e0b' : 'var(--color-rose)',
                      fontWeight: 600
                    }}>
                      {item.difficulty}
                    </span>
                  </div>

                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#fff', marginBottom: '8px' }}>
                    {item.term}
                  </h4>

                  <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.85rem',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.definition}
                  </p>
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.formula ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-jade)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                      <Calculator size={13} /> Formula available
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Concept Guide</span>
                  )}
                  <span style={{ color: 'var(--color-jade)', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Read Guide <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Expanded Modal View for Active Term */}
      {activeTerm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glassy-card" style={{
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid var(--color-jade-glow)',
            background: '#0B0E0D',
            position: 'relative'
          }}>
            {/* Close button */}
            <button 
              onClick={() => { setActiveTerm(null); setQuizAnswer(null); }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Content */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '4px',
                background: 'rgba(54, 124, 91, 0.25)',
                color: 'var(--color-jade)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {activeTerm.category}
              </span>
              <span style={{
                fontSize: '0.75rem',
                color: activeTerm.difficulty === 'Beginner' ? 'var(--color-jade)' : activeTerm.difficulty === 'Intermediate' ? '#f59e0b' : 'var(--color-rose)',
                fontWeight: 600
              }}>
                {activeTerm.difficulty}
              </span>
            </div>

            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#fff', margin: '4px 0 16px' }}>
              {activeTerm.term}
            </h2>

            <p style={{ color: 'var(--color-text-primary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {activeTerm.definition}
            </p>

            {/* Key Takeaways */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-jade)', fontSize: '0.95rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} /> Key Takeaways
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeTerm.keyTakeaways.map((point, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '10px', color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                    <span style={{ color: 'var(--color-jade)', fontWeight: 700 }}>•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Formula section if available */}
            {activeTerm.formula && (
              <div style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calculator size={16} color="var(--color-teal)" /> Mathematical Formula
                </h4>
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(54, 124, 91, 0.1)',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-jade)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  marginBottom: '8px'
                }}>
                  {activeTerm.formula}
                </div>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {activeTerm.formulaExplanation}
                </p>
              </div>
            )}

            {/* Practical Example */}
            <div style={{
              background: 'rgba(66, 148, 255, 0.05)',
              border: '1px solid rgba(66, 148, 255, 0.15)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#60a5fa', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={16} /> Real-World Example
              </h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
                {activeTerm.example}
              </p>
            </div>

            {/* Pro Tip */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.05)',
              border: '1px solid rgba(245, 158, 11, 0.15)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              marginBottom: '24px'
            }}>
              <Lightbulb size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#f59e0b', fontSize: '0.85rem' }}>Trader's Edge: </strong>
                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                  {activeTerm.proTip}
                </span>
              </div>
            </div>

            {/* Related Terms */}
            {activeTerm.relatedTerms && (
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Related Concepts:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {activeTerm.relatedTerms.map((rel, idx) => (
                    <span 
                      key={idx}
                      style={{
                        padding: '4px 10px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      {rel}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
