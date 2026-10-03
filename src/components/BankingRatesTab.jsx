import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Percent, 
  Calculator, 
  ArrowUpRight, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  ChevronRight, 
  Sliders, 
  RefreshCw,
  TrendingUp,
  Info
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const BANKING_PRODUCTS = [
  // High-Yield Savings
  {
    id: 'marcus-hysa',
    category: 'HYSA',
    institution: 'Marcus by Goldman Sachs',
    productName: 'Online High-Yield Savings',
    apy: 5.15,
    minDeposit: 0,
    term: 'No lock-in',
    insuredBy: 'FDIC / Sovereign Guaranteed',
    features: ['No monthly fees', 'Same-day transfers up to $100k', 'Daily compounding'],
    rating: 4.9,
    bestFor: 'Best Overall User Experience'
  },
  {
    id: 'ally-savings',
    category: 'HYSA',
    institution: 'Ally Bank',
    productName: 'High-Yield Online Savings',
    apy: 4.85,
    minDeposit: 0,
    term: 'No lock-in',
    insuredBy: 'FDIC Insured',
    features: ['Automated savings buckets', 'Round-up booster algorithms', '24/7 human support'],
    rating: 4.8,
    bestFor: 'Best for Goal-Oriented Savers'
  },
  {
    id: 'capital-one-360',
    category: 'HYSA',
    institution: 'Capital One',
    productName: '360 Performance Savings',
    apy: 4.75,
    minDeposit: 0,
    term: 'No lock-in',
    insuredBy: 'FDIC Insured',
    features: ['Physical branch access (Cafes)', 'No minimum deposit', 'Instant mobile check deposit'],
    rating: 4.7,
    bestFor: 'Best Hybrid Online/Branch'
  },

  // Certificates of Deposit (CDs)
  {
    id: 'cd-6m',
    category: 'CD',
    institution: 'Barclays Online',
    productName: '6-Month Term CD',
    apy: 5.30,
    minDeposit: 0,
    term: '6 Months',
    insuredBy: 'FDIC Insured',
    features: ['Guaranteed rate locked', 'No maintenance fees', 'Early withdrawal penalty applies'],
    rating: 4.9,
    bestFor: 'Best Short-Term Fixed Yield'
  },
  {
    id: 'cd-1y',
    category: 'CD',
    institution: 'Synchrony Bank',
    productName: '12-Month High Yield CD',
    apy: 5.10,
    minDeposit: 0,
    term: '1 Year',
    insuredBy: 'FDIC Insured',
    features: ['15-day rate guarantee', 'Compound interest credited monthly', 'Auto-renewal option'],
    rating: 4.8,
    bestFor: 'Best 1-Year Rate'
  },
  {
    id: 'cd-2y',
    category: 'CD',
    institution: 'Discover Bank',
    productName: '24-Month Fixed CD',
    apy: 4.75,
    minDeposit: 2500,
    term: '2 Years',
    insuredBy: 'FDIC Insured',
    features: ['Award-winning customer service', 'Predictable returns', 'Interest payout to external account'],
    rating: 4.7,
    bestFor: 'Locking Rates Through Rate Cycles'
  },
  {
    id: 'cd-jumbo',
    category: 'CD',
    institution: 'Sallie Mae Bank',
    productName: '5-Year Jumbo Deposit',
    apy: 4.65,
    minDeposit: 25000,
    term: '5 Years',
    insuredBy: 'FDIC Insured',
    features: ['Maximum long-term yield', 'Compounded daily', 'Tiered balance incentives'],
    rating: 4.6,
    bestFor: 'Best Long-Horizon Wealth Lock'
  },

  // Money Market & Checking
  {
    id: 'mma-vanguard',
    category: 'MMA',
    institution: 'Vanguard Cash Plus',
    productName: 'Federal Money Market Account',
    apy: 5.25,
    minDeposit: 3000,
    term: 'Liquid',
    insuredBy: 'SIPC / Treasury Backed',
    features: ['Backed by short-term US Treasuries', 'High liquidity', 'Check-writing privileges'],
    rating: 4.9,
    bestFor: 'Best Cash Preservation Yield'
  },
  {
    id: 'mma-fidelity',
    category: 'MMA',
    institution: 'Fidelity Investments',
    productName: 'Government Cash Reserves (SPAXX)',
    apy: 4.95,
    minDeposit: 0,
    term: 'Liquid',
    insuredBy: 'SIPC Insured',
    features: ['Automatic cash sweep for active traders', 'Debit card & ATM fee rebates', 'Direct trading access'],
    rating: 4.9,
    bestFor: 'Best for Active Traders'
  },

  // Mortgages & Lending
  {
    id: 'mortgage-30y',
    category: 'Mortgage',
    institution: 'Top National Benchmark',
    productName: '30-Year Fixed Conforming Mortgage',
    apy: 6.42,
    minDeposit: 20, // 20% down
    term: '30 Years',
    insuredBy: 'Fannie Mae / Freddie Mac',
    features: ['Unchanging principal & interest payment', 'No prepayment penalty', 'Standard 30-year amortization'],
    rating: 4.8,
    bestFor: 'Standard Home Financing'
  },
  {
    id: 'mortgage-15y',
    category: 'Mortgage',
    institution: 'Top National Benchmark',
    productName: '15-Year Fixed Home Loan',
    apy: 5.85,
    minDeposit: 20,
    term: '15 Years',
    insuredBy: 'Fannie Mae / Freddie Mac',
    features: ['Significantly lower lifetime interest', 'Accelerated equity buildup', 'Fixed monthly EMI'],
    rating: 4.9,
    bestFor: 'Lowest Total Borrowing Cost'
  }
];

export default function BankingRatesTab() {
  const [activeSubTab, setActiveSubTab] = useState('rates'); // 'rates' | 'compound-calc' | 'loan-calc'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('apy-desc');

  // ─── Calculator 1: Compound Interest State ─────────────────────────────────
  const [initialPrincipal, setInitialPrincipal] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(10000);
  const [annualReturnRate, setAnnualReturnRate] = useState(8.0);
  const [timeHorizonYears, setTimeHorizonYears] = useState(15);
  const [compoundFreq, setCompoundFreq] = useState(12); // 12 = monthly, 1 = annually, 365 = daily

  // ─── Calculator 2: Mortgage / Loan EMI State ──────────────────────────────
  const [loanPrincipal, setLoanPrincipal] = useState(3000000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState(20);

  // ─── Calculator 1: Calculations ───────────────────────────────────────────
  const compoundChartData = useMemo(() => {
    const data = [];
    let currentBalance = Number(initialPrincipal);
    let totalInvested = Number(initialPrincipal);
    const r = (annualReturnRate / 100) / compoundFreq;
    const months = timeHorizonYears * 12;

    for (let yr = 0; yr <= timeHorizonYears; yr++) {
      if (yr === 0) {
        data.push({
          year: `Yr 0`,
          balance: Math.round(currentBalance),
          invested: Math.round(totalInvested),
          interestEarned: 0
        });
        continue;
      }

      // Compound across 12 months for year yr
      for (let m = 1; m <= 12; m++) {
        currentBalance = (currentBalance + Number(monthlyContribution)) * (1 + (annualReturnRate / 100) / 12);
        totalInvested += Number(monthlyContribution);
      }

      data.push({
        year: `Yr ${yr}`,
        balance: Math.round(currentBalance),
        invested: Math.round(totalInvested),
        interestEarned: Math.round(currentBalance - totalInvested)
      });
    }

    return data;
  }, [initialPrincipal, monthlyContribution, annualReturnRate, timeHorizonYears, compoundFreq]);

  const finalCompoundValue = compoundChartData[compoundChartData.length - 1]?.balance || 0;
  const totalPrincipalInvested = compoundChartData[compoundChartData.length - 1]?.invested || 0;
  const totalInterestGained = Math.max(0, finalCompoundValue - totalPrincipalInvested);

  // ─── Calculator 2: Calculations ───────────────────────────────────────────
  const loanCalculations = useMemo(() => {
    const P = Number(loanPrincipal);
    const r = (Number(loanRate) / 12) / 100;
    const n = Number(loanTenureYears) * 12;

    if (P <= 0 || r <= 0 || n <= 0) {
      return { monthlyEmi: 0, totalPayment: 0, totalInterest: 0 };
    }

    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emi * n;
    const totalInt = totalPay - P;

    return {
      monthlyEmi: Math.round(emi),
      totalPayment: Math.round(totalPay),
      totalInterest: Math.round(totalInt),
      interestRatio: Math.round((totalInt / totalPay) * 100)
    };
  }, [loanPrincipal, loanRate, loanTenureYears]);

  // Product list filtering & sorting
  const filteredProducts = useMemo(() => {
    return BANKING_PRODUCTS.filter(p => {
      if (selectedCategory === 'ALL') return true;
      return p.category === selectedCategory;
    }).sort((a, b) => {
      if (sortBy === 'apy-desc') return b.apy - a.apy;
      if (sortBy === 'apy-asc') return a.apy - b.apy;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, sortBy]);

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
          <Building2 size={20} color="var(--color-jade)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-jade)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Yields & Rates Intelligence
          </span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, margin: '2px 0 8px', color: '#fff' }}>
          Banking Rates & Financial Calculators
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '720px', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Compare top high-yield savings accounts, fixed deposit CD rates, and mortgage benchmarks. Utilize our institutional-grade calculators to model exponential compounding and loan repayment schedules.
        </p>
      </div>

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveSubTab('rates')}
          className={`hover-glow ${activeSubTab === 'rates' ? 'active' : ''}`}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: activeSubTab === 'rates' ? '1px solid var(--color-jade)' : '1px solid transparent',
            background: activeSubTab === 'rates' ? 'rgba(93, 211, 148, 0.15)' : 'transparent',
            color: activeSubTab === 'rates' ? 'var(--color-jade)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Building2 size={16} /> Rates Comparison Engine
        </button>

        <button
          onClick={() => setActiveSubTab('compound-calc')}
          className={`hover-glow ${activeSubTab === 'compound-calc' ? 'active' : ''}`}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: activeSubTab === 'compound-calc' ? '1px solid var(--color-jade)' : '1px solid transparent',
            background: activeSubTab === 'compound-calc' ? 'rgba(93, 211, 148, 0.15)' : 'transparent',
            color: activeSubTab === 'compound-calc' ? 'var(--color-jade)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <TrendingUp size={16} /> Compound Interest Calculator
        </button>

        <button
          onClick={() => setActiveSubTab('loan-calc')}
          className={`hover-glow ${activeSubTab === 'loan-calc' ? 'active' : ''}`}
          style={{
            padding: '8px 18px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: activeSubTab === 'loan-calc' ? '1px solid var(--color-jade)' : '1px solid transparent',
            background: activeSubTab === 'loan-calc' ? 'rgba(93, 211, 148, 0.15)' : 'transparent',
            color: activeSubTab === 'loan-calc' ? 'var(--color-jade)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Calculator size={16} /> Mortgage & Loan EMI Calculator
        </button>
      </div>

      {/* ─── TAB 1: RATES COMPARISON ENGINE ───────────────────────────────── */}
      {activeSubTab === 'rates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['ALL', 'HYSA', 'CD', 'MMA', 'Mortgage'].map(cat => (
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
                    cursor: 'pointer'
                  }}
                >
                  {cat === 'ALL' ? 'All Products' : cat === 'HYSA' ? 'High-Yield Savings' : cat === 'CD' ? 'CDs / Fixed Deposits' : cat === 'MMA' ? 'Money Market' : 'Mortgages'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Sort by:</span>
              <select 
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  background: 'var(--color-surface)',
                  color: '#fff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              >
                <option value="apy-desc">Highest APY / Rate</option>
                <option value="apy-asc">Lowest Rate</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Product Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredProducts.map(prod => (
              <div 
                key={prod.id} 
                className="glassy-card hover-glow"
                style={{
                  padding: '20px 24px',
                  borderRadius: '12px',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
                  alignItems: 'center',
                  gap: '20px',
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-surface)'
                }}
              >
                {/* Institution & Product */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-jade)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {prod.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>•</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{prod.bestFor}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#fff', margin: '2px 0' }}>
                    {prod.institution}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    {prod.productName}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                    {prod.features.slice(0, 2).map((feat, i) => (
                      <span key={i} style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', color: 'var(--color-text-muted)' }}>
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* APY / Rate */}
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                    {prod.category === 'Mortgage' ? 'Benchmark Rate' : 'Annual Yield (APY)'}
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-jade)' }}>
                    {prod.apy.toFixed(2)}%
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                    {prod.term}
                  </span>
                </div>

                {/* Terms & Insurance */}
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                    Min. Deposit: <strong style={{ color: '#fff' }}>{prod.minDeposit === 0 ? '$0 / ₹0' : `₹${prod.minDeposit.toLocaleString('en-IN')}`}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-jade)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={14} /> {prod.insuredBy}
                  </div>
                </div>

                {/* Action & Rating */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 700, marginBottom: '8px' }}>
                    ★ {prod.rating} / 5.0
                  </div>
                  <button 
                    className="trade-btn secondary-btn hover-glow"
                    onClick={() => alert(`Simulated product selected: ${prod.institution} - ${prod.productName} at ${prod.apy}% APY.`)}
                    style={{ fontSize: '0.8rem', padding: '6px 14px', width: '100%' }}
                  >
                    Compare Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 2: COMPOUND INTEREST CALCULATOR ──────────────────────────── */}
      {activeSubTab === 'compound-calc' && (
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
          
          {/* Inputs Panel */}
          <div className="glassy-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff' }}>
              Calculator Inputs
            </h3>

            {/* Principal */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                INITIAL INVESTMENT (₹)
              </label>
              <input 
                type="number"
                value={initialPrincipal}
                onChange={e => setInitialPrincipal(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: '#fff',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>

            {/* Monthly Contribution */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                MONTHLY RECURRING ADDITION (₹)
              </label>
              <input 
                type="number"
                value={monthlyContribution}
                onChange={e => setMonthlyContribution(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: '#fff',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>

            {/* Annual Return % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  ESTIMATED ANNUAL RETURN (%)
                </label>
                <span style={{ color: 'var(--color-jade)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {annualReturnRate}%
                </span>
              </div>
              <input 
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={annualReturnRate}
                onChange={e => setAnnualReturnRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-jade)' }}
              />
            </div>

            {/* Time Horizon */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  TIME HORIZON (YEARS)
                </label>
                <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {timeHorizonYears} yrs
                </span>
              </div>
              <input 
                type="range"
                min="1"
                max="40"
                step="1"
                value={timeHorizonYears}
                onChange={e => setTimeHorizonYears(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-teal)' }}
              />
            </div>

            <div style={{ padding: '12px', background: 'rgba(93, 211, 148, 0.05)', borderRadius: '8px', border: '1px solid rgba(93, 211, 148, 0.15)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-jade)', fontWeight: 600 }}>Rule of 72 Insight:</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                At {annualReturnRate}% annual return, your money doubles approximately every {(72 / annualReturnRate).toFixed(1)} years!
              </p>
            </div>
          </div>

          {/* Results & Chart */}
          <div className="glassy-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid var(--color-jade)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>PROJECTED FINAL WEALTH</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-jade)', marginTop: '4px' }}>
                  ₹{finalCompoundValue.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid #64748b' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>TOTAL CASH INVESTED</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                  ₹{totalPrincipalInvested.toLocaleString('en-IN')}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid var(--color-teal)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>TOTAL COMPOUND INTEREST</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-teal)', marginTop: '4px' }}>
                  ₹{totalInterestGained.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Growth Curve Chart */}
            <div style={{ width: '100%', height: '280px', marginTop: '8px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={compoundChartData}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-jade)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-jade)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="year" stroke="#475569" fontSize={11} />
                  <YAxis stroke="#475569" fontSize={11} tickFormatter={v => `₹${(v/100000).toFixed(0)}L`} />
                  <Tooltip 
                    contentStyle={{ background: '#0B0E0D', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                    formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                  />
                  <Area type="monotone" dataKey="balance" stroke="var(--color-jade)" strokeWidth={2} fill="url(#colorBalance)" name="Total Wealth" />
                  <Area type="monotone" dataKey="invested" stroke="#94a3b8" strokeWidth={2} fill="url(#colorInvested)" name="Total Invested" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: MORTGAGE & LOAN EMI CALCULATOR ────────────────────────── */}
      {activeSubTab === 'loan-calc' && (
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
          
          {/* Inputs Panel */}
          <div className="glassy-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff' }}>
              Loan Parameters
            </h3>

            {/* Principal */}
            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                LOAN PRINCIPAL AMOUNT (₹)
              </label>
              <input 
                type="number"
                value={loanPrincipal}
                onChange={e => setLoanPrincipal(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: '#fff',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            </div>

            {/* Interest Rate */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  ANNUAL INTEREST RATE (%)
                </label>
                <span style={{ color: 'var(--color-rose)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {loanRate}%
                </span>
              </div>
              <input 
                type="range"
                min="3"
                max="18"
                step="0.1"
                value={loanRate}
                onChange={e => setLoanRate(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-rose)' }}
              />
            </div>

            {/* Loan Tenure */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                  TENURE (YEARS)
                </label>
                <span style={{ color: '#fff', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {loanTenureYears} Years
                </span>
              </div>
              <input 
                type="range"
                min="1"
                max="30"
                step="1"
                value={loanTenureYears}
                onChange={e => setLoanTenureYears(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-teal)' }}
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="glassy-card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                MONTHLY EQUATED INSTALLMENT (EMI)
              </span>
              <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-jade)', margin: '4px 0 20px' }}>
                ₹{loanCalculations.monthlyEmi.toLocaleString('en-IN')} <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>/ month</span>
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>TOTAL INTEREST PAYABLE</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-rose)', marginTop: '4px' }}>
                    ₹{loanCalculations.totalInterest.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>TOTAL PAYMENT (P + I)</span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    ₹{loanCalculations.totalPayment.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Progress Bar of Principal vs Interest */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-jade)' }}>Principal: {100 - loanCalculations.interestRatio}%</span>
                  <span style={{ color: 'var(--color-rose)' }}>Interest: {loanCalculations.interestRatio}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.06)', borderRadius: '5px', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${100 - loanCalculations.interestRatio}%`, background: 'var(--color-jade)' }} />
                  <div style={{ width: `${loanCalculations.interestRatio}%`, background: 'var(--color-rose)' }} />
                </div>
              </div>
            </div>

            <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-teal)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '4px' }}>
                <Info size={14} /> TradeFlow Mortgage Takeaway
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                Shortening your loan tenure from 30 years to 15 or 20 years typically cuts lifetime interest expense in half while building home equity at double the speed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
