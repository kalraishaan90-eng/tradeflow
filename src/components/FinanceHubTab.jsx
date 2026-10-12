import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Newspaper, 
  Headphones, 
  Sparkles, 
  Search, 
  Tag, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle, 
  X, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShieldCheck, 
  Check, 
  Flame, 
  BarChart3, 
  Cpu, 
  Layers, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Clock, 
  ChevronRight, 
  ExternalLink,
  Award,
  Zap,
  Building2,
  Loader
} from 'lucide-react';
import { generateAIReply } from '../lib/aiChat.js';

// ─── 45+ PREMIER FINANCIAL DICTIONARY TERMS (COMMERCE CLUB ENCYCLOPEDIA) ───────
export const COMPREHENSIVE_DICTIONARY_DATA = [
  {
    id: 'sharpe-ratio',
    term: 'Sharpe Ratio',
    letter: 'S',
    category: 'Investing',
    difficulty: 'Intermediate',
    definition: 'A measure of risk-adjusted return developed by Nobel laureate William F. Sharpe. It quantifies how much excess return an investor receives for the extra volatility endured by holding a riskier asset rather than a risk-free asset.',
    keyTakeaways: [
      'Adjusts a portfolio’s performance for the excess volatility taken by the trader.',
      'A Sharpe ratio > 1.0 is considered good; > 2.0 is very good; 3.0+ is elite.',
      'Negative Sharpe ratio indicates returns below the sovereign risk-free rate.'
    ],
    formula: 'Sharpe Ratio = (R_p - R_f) / σ_p',
    formulaExplanation: 'R_p = Return of portfolio, R_f = Risk-free rate (e.g. 10Y Indian G-Sec or US Treasury), and σ_p = Standard deviation of excess returns.',
    example: 'If your TradeFlow portfolio returned 16% over the past year, the risk-free rate was 6.5%, and portfolio volatility was 7%, your Sharpe ratio is (16% - 6.5%) / 7% = 1.36.',
    proTip: 'Compare Sharpe ratios only between similar asset classes over consistent time horizons to prevent distorted risk comparisons.',
    relatedTerms: ['Beta', 'Alpha', 'Standard Deviation', 'Treynor Ratio']
  },
  {
    id: 'pe-ratio',
    term: 'Price-to-Earnings (P/E) Ratio',
    letter: 'P',
    category: 'Valuation',
    difficulty: 'Beginner',
    definition: 'The ratio of a company’s share price to its annual earnings per share (EPS). It indicates how much investors are willing to pay per rupee of current net profit.',
    keyTakeaways: [
      'Trailing P/E relies on past 12 months earnings; Forward P/E uses projected earnings.',
      'High P/E signals high growth expectations or overvaluation.',
      'Low P/E can signal value opportunities or structural business distress.'
    ],
    formula: 'P/E Ratio = Market Price per Share / Earnings Per Share (EPS)',
    formulaExplanation: 'EPS = (Net Income - Preferred Dividends) / Total Shares Outstanding.',
    example: 'If Reliance Industries trades at ₹1,168 with an EPS of ₹58.40, its P/E ratio is 1168 / 58.40 = 20.0x.',
    proTip: 'Always contrast a company’s P/E against its direct sector peers and its own 5-year historical average.',
    relatedTerms: ['EPS', 'PEG Ratio', 'Price-to-Book (P/B)', 'EBITDA']
  },
  {
    id: 'black-scholes',
    term: 'Black-Scholes Model',
    letter: 'B',
    category: 'Options & F&O',
    difficulty: 'Advanced',
    definition: 'A seminal mathematical framework for estimating theoretical fair values of options contracts using five core market parameters.',
    keyTakeaways: [
      'Developed by Fischer Black, Myron Scholes, and Robert Merton (1973 Nobel Prize).',
      'Inputs: Spot price, strike price, time to expiration, risk-free interest rate, and implied volatility (IV).',
      'Assumes asset prices follow a geometric Brownian motion with lognormal returns.'
    ],
    formula: 'C = S*N(d1) - K*e^(-r*T)*N(d2)',
    formulaExplanation: 'd1 = [ln(S/K) + (r + σ²/2)*T] / (σ*√T), d2 = d1 - σ*√T. N(·) is the cumulative standard normal distribution.',
    example: 'Used on NSE NIFTY options chains to calculate whether monthly Call premiums are mispriced relative to actual implied volatility.',
    proTip: 'Market options trade with a "volatility smile/skew"—adjust Black-Scholes IV assumptions accordingly.',
    relatedTerms: ['Greeks', 'Implied Volatility', 'Call Option', 'Put Option']
  },
  {
    id: 'ebitda',
    term: 'EBITDA',
    letter: 'E',
    category: 'Accounting',
    difficulty: 'Intermediate',
    definition: 'Earnings Before Interest, Taxes, Depreciation, and Amortization. A pure measure of core operational profitability stripped of capital structure, tax rates, and non-cash accounting adjustments.',
    keyTakeaways: [
      'Widely used in corporate mergers, acquisitions, and cross-border company valuations.',
      'Neutralizes differing national tax policies and debt financing structures.',
      'Warren Buffett cautions that ignoring depreciation ignores real capital expenditures.'
    ],
    formula: 'EBITDA = Operating Profit (EBIT) + Depreciation + Amortization',
    formulaExplanation: 'Alternatively: Net Income + Interest + Taxes + Depreciation + Amortization.',
    example: 'A telecom provider with heavy spectrum amortization may report negative net income but ₹10,000 Cr in EBITDA, showing strong operational cash generation.',
    proTip: 'Combine EV/EBITDA with Free Cash Flow conversion to confirm whether accounting profits turn into real bank balances.',
    relatedTerms: ['Free Cash Flow', 'EV/EBITDA', 'Working Capital', 'Operating Margin']
  },
  {
    id: 'rbi-repo-rate',
    term: 'Repo Rate (RBI Policy Rate)',
    letter: 'R',
    category: 'Macroeconomics',
    difficulty: 'Beginner',
    definition: 'The benchmark interest rate at which the Reserve Bank of India (RBI) lends short-term liquidity to commercial banks against government securities.',
    keyTakeaways: [
      'The primary monetary policy lever used to control domestic inflation and economic growth.',
      'Raising the repo rate increases home loan and corporate borrowing costs, cooling demand.',
      'Cutting the repo rate injects liquidity into capital markets, usually boosting equities.'
    ],
    formula: 'Commercial Lending Rate = Repo Rate + Bank Spread / Margin',
    formulaExplanation: 'Most Indian retail floating rate loans are legally linked to the External Benchmark Lending Rate (EBLR).',
    example: 'When the RBI MPC holds the repo rate at 6.50%, bank Fixed Deposit yields and floating home loan rates remain stabilized.',
    proTip: 'Financial sector stocks (HDFC, ICICI, SBI) show high sensitivity to repo rate cycles due to Net Interest Margin (NIM) shifts.',
    relatedTerms: ['Reverse Repo', 'CRR & SLR', 'Inflation', 'Yield Curve']
  },
  {
    id: 'compound-interest',
    term: 'Compound Interest',
    letter: 'C',
    category: 'Personal Finance',
    difficulty: 'Beginner',
    definition: 'Interest calculated on both initial principal and the accumulated interest from preceding periods. The engine of long-term wealth compounding.',
    keyTakeaways: [
      'Enables exponential growth rather than linear arithmetic growth.',
      'More frequent compounding frequencies (daily, monthly) yield higher effective returns.',
      'Works heroically in equity SIPs, but devastatingly against unpaid credit card balances.'
    ],
    formula: 'A = P * (1 + r/n)^(n*t)',
    formulaExplanation: 'P = Principal, r = Annual nominal interest rate, n = Compounding frequency per year, t = Time in years.',
    example: 'Investing ₹1,00,000 at 12% annualized return for 20 years compounds into ₹9,64,629—almost 10x your money without adding extra capital.',
    proTip: 'Use the Rule of 72: divide 72 by your annual return % to find the exact years needed to double capital.',
    relatedTerms: ['Rule of 72', 'SIP', 'APY vs APR', 'Time Value of Money']
  },
  {
    id: 'bull-call-spread',
    term: 'Bull Call Spread',
    letter: 'B',
    category: 'Options & F&O',
    difficulty: 'Intermediate',
    definition: 'A defined-risk options strategy involving the purchase of a lower-strike Call and simultaneous sale of a higher-strike Call on the same underlying asset and expiry date.',
    keyTakeaways: [
      'Profits from moderate upward asset movement while capping maximum loss to net debit paid.',
      'The premium earned from the sold call lowers trade entry cost and reduces theta decay risk.',
      'Maximum profit is capped at Strike Difference minus Net Premium Paid.'
    ],
    formula: 'Max Profit = (Strike_Sell - Strike_Buy) - Net Premium Paid',
    formulaExplanation: 'Max Loss = Net Debit Paid upfront.',
    example: 'Buy NIFTY 24,800 Call for ₹120 and sell NIFTY 25,000 Call for ₹40. Net cost is ₹80. Maximum potential profit is 200 - 80 = ₹120 per share.',
    proTip: 'Best deployed during high volatility environments when buying naked call options is too expensive.',
    relatedTerms: ['Bear Put Spread', 'Covered Call', 'Implied Volatility', 'Options Chain']
  },
  {
    id: 'free-cash-flow',
    term: 'Free Cash Flow (FCF)',
    letter: 'F',
    category: 'Valuation',
    difficulty: 'Intermediate',
    definition: 'The cash a company generates after accounting for cash outflows that support operations and maintain its capital assets (CapEx).',
    keyTakeaways: [
      'Represents discretionary cash available for dividends, share buybacks, acquisitions, or debt reduction.',
      'Far harder for corporate management to manipulate through accounting tricks than net income.',
      'The foundational input for Discounted Cash Flow (DCF) intrinsic valuation models.'
    ],
    formula: 'FCF = Operating Cash Flow (CFO) - Capital Expenditures (CapEx)',
    formulaExplanation: 'Operating cash flow reflects actual collections minus operating costs, while CapEx captures property, plant, and tech equipment additions.',
    example: 'TCS generated ₹48,000 Cr from operations and spent ₹3,500 Cr on servers and facilities, leaving ₹44,500 Cr in pure Free Cash Flow.',
    proTip: 'Look for companies with FCF-to-Net Income ratios consistently above 90%, confirming premier earnings quality.',
    relatedTerms: ['EBITDA', 'DCF', 'Working Capital', 'CapEx']
  },
  {
    id: 'gdp',
    term: 'Gross Domestic Product (GDP)',
    letter: 'G',
    category: 'Macroeconomics',
    difficulty: 'Beginner',
    definition: 'The total monetary or market value of all finished goods and services produced within a country’s borders in a specific time period.',
    keyTakeaways: [
      'The comprehensive scorecard of a country’s economic health and size.',
      'Real GDP adjusts for inflation; Nominal GDP measures current market prices.',
      'Calculated via Expenditure approach: Consumption + Investment + Government Spending + Net Exports (C + I + G + NX).'
    ],
    formula: 'GDP = C + I + G + (X - M)',
    formulaExplanation: 'C = Consumer spending, I = Business investment, G = Government expenditure, X = Exports, M = Imports.',
    example: 'India’s GDP expanding at 7.2% annualized signals strong industrial production, corporate earnings growth, and consumer demand.',
    proTip: 'The "Buffett Indicator" compares total stock market capitalization to GDP. Ratios over 100% indicate premium equity market valuations.',
    relatedTerms: ['Inflation', 'Repo Rate', 'Fiscal Deficit', 'Foreign Direct Investment']
  },
  {
    id: 'dcf',
    term: 'Discounted Cash Flow (DCF)',
    letter: 'D',
    category: 'Valuation',
    difficulty: 'Advanced',
    definition: 'A valuation method used to estimate the value of an investment based on its expected future cash flows, discounted back to the present using the Weighted Average Cost of Capital (WACC).',
    keyTakeaways: [
      'Based on the principle that ₹1 today is worth more than ₹1 tomorrow due to earning capacity.',
      'Projects 5–10 years of Free Cash Flows plus a Terminal Value.',
      'If DCF value > current market price, the stock is undervalued.'
    ],
    formula: 'DCF = Σ [CF_t / (1 + r)^t] + Terminal Value / (1 + r)^n',
    formulaExplanation: 'CF_t = Cash flow in year t, r = Discount rate (WACC), t = Time period, n = Projection horizon.',
    example: 'Valuing Infosys by projecting cash flows growing at 10% and discounting by a 10.5% WACC yields an intrinsic equity value of ₹1,650 per share.',
    proTip: 'DCF models are notoriously sensitive to small changes in terminal growth rates and WACC—always run a sensitivity matrix.',
    relatedTerms: ['Free Cash Flow', 'WACC', 'Terminal Value', 'Intrinsic Value']
  },
  {
    id: 'call-option',
    term: 'Call Option',
    letter: 'C',
    category: 'Options & F&O',
    difficulty: 'Beginner',
    definition: 'A financial contract giving the buyer the right, but not the obligation, to purchase an underlying stock or index at a specified strike price within a specific timeframe.',
    keyTakeaways: [
      'Call buyers profit when the underlying asset price rises above Strike Price + Premium Paid.',
      'Maximum loss for the buyer is strictly limited to the premium paid upfront.',
      'Sellers (writers) of uncovered calls take on theoretically unlimited downside risk.'
    ],
    formula: 'Call Payoff (Buyer) = Max(0, Spot Price - Strike Price) - Premium',
    formulaExplanation: 'Breakeven Point = Strike Price + Premium Paid.',
    example: 'Buying a Reliance 1200 CE for ₹25 expires in profit if Reliance finishes above ₹1,225 on expiry day.',
    proTip: 'Time decay (Theta) accelerates rapidly during the final 14 days before monthly expiry.',
    relatedTerms: ['Put Option', 'Option Greeks', 'Strike Price', 'Implied Volatility']
  },
  {
    id: 'put-option',
    term: 'Put Option',
    letter: 'P',
    category: 'Options & F&O',
    difficulty: 'Beginner',
    definition: 'A financial contract giving the owner the right, but not the obligation, to sell an underlying asset at a specified strike price before expiration.',
    keyTakeaways: [
      'Put buyers profit when the underlying asset price declines below Strike Price - Premium Paid.',
      'Acts as insurance (protective put) for equity portfolio holders during market crashes.',
      'Put writers profit when the market stays flat or rallies, keeping the option premium.'
    ],
    formula: 'Put Payoff (Buyer) = Max(0, Strike Price - Spot Price) - Premium',
    formulaExplanation: 'Breakeven Point = Strike Price - Premium Paid.',
    example: 'Holding 100 shares of TCS and buying a 2000 PE guarantees you can liquidate shares for ₹2,000 even if the stock plunges to ₹1,700.',
    proTip: 'High Put-Call Ratio (PCR > 1.2) often indicates oversold market sentiment where a contrarian bounce is probable.',
    relatedTerms: ['Call Option', 'Put-Call Ratio (PCR)', 'Hedging', 'Stop-Loss']
  },
  {
    id: 'arbitrage',
    term: 'Arbitrage',
    letter: 'A',
    category: 'Trading',
    difficulty: 'Intermediate',
    definition: 'The simultaneous purchase and sale of the same asset in different markets to exploit small, temporary pricing discrepancies for riskless profit.',
    keyTakeaways: [
      'Enforces market efficiency across interconnected trading venues.',
      'Common varieties include Cash-Futures arbitrage, triangular forex arbitrage, and dual-listing arbitrage (NSE vs BSE).',
      'Modern arbitrage is executed in microseconds by algorithmic high-frequency trading (HFT) firms.'
    ],
    formula: 'Arbitrage Spread = Price_Exchange_B - Price_Exchange_A - Transaction_Costs',
    formulaExplanation: 'Positive spread after accounting for exchange fees, STT, and slippage yields net profit.',
    example: 'If HDFC Bank trades at ₹721.20 on NSE and ₹721.90 on BSE, an institutional desk buys on NSE and sells on BSE to lock in ₹0.70 spread.',
    proTip: 'Retail traders rarely beat institutional low-latency fiber links in cash arbitrage; focus on structural ETF premium/discount spreads.',
    relatedTerms: ['Market Efficiency', 'High-Frequency Trading', 'Spread', 'Liquidity']
  },
  {
    id: 'roe',
    term: 'Return on Equity (ROE)',
    letter: 'R',
    category: 'Valuation',
    difficulty: 'Intermediate',
    definition: 'A measure of financial performance calculated by dividing net income by shareholders’ equity. It measures how efficiently management allocates shareholders’ capital.',
    keyTakeaways: [
      'Consistently high ROE (>18–20%) is the hallmark of high-moat compounders.',
      'ROE can be artificially inflated by taking on excessive financial debt leverage.',
      'Use DuPont Analysis to break ROE into Profit Margin, Asset Turnover, and Financial Leverage.'
    ],
    formula: 'ROE = Net Income / Total Shareholders’ Equity',
    formulaExplanation: 'Shareholders’ Equity = Total Assets - Total Liabilities.',
    example: 'If TCS produces ₹46,000 Cr in net profit with shareholders’ equity of ₹95,000 Cr, its ROE is 48.4%, showing tremendous capital efficiency.',
    proTip: 'Compare ROE alongside Return on Capital Employed (ROCE) to ensure high returns are not driven by dangerous debt loads.',
    relatedTerms: ['ROCE', 'DuPont Analysis', 'EPS', 'P/B Ratio']
  },
  {
    id: 'sip',
    term: 'Systematic Investment Plan (SIP)',
    letter: 'S',
    category: 'Personal Finance',
    difficulty: 'Beginner',
    definition: 'A disciplined investment approach where a fixed sum of money is invested at regular intervals (monthly/weekly) into mutual funds or index equities.',
    keyTakeaways: [
      'Harnesses Rupee-Cost Averaging by buying more units when prices fall and fewer when prices rise.',
      'Eliminates the psychological hazard of attempting to time volatile market tops and bottoms.',
      'Automates compound interest accumulation over multi-decade wealth-building horizons.'
    ],
    formula: 'M = P * [((1 + i)^n - 1) / i] * (1 + i)',
    formulaExplanation: 'M = Maturity amount, P = Periodic monthly investment, i = Periodic interest rate, n = Total months.',
    example: 'A monthly SIP of ₹10,000 at 12% annualized return grows into ₹1 Crore in approximately 20 years with total invested capital of just ₹24 Lakhs.',
    proTip: 'Implement a "Step-Up SIP" (increasing monthly contributions by 10% annually with salary hikes) to reach financial independence in half the time.',
    relatedTerms: ['Compound Interest', 'Dollar-Cost Averaging', 'Mutual Funds', 'NAV']
  },
  {
    id: 'short-selling',
    term: 'Short Selling',
    letter: 'S',
    category: 'Trading',
    difficulty: 'Intermediate',
    definition: 'An investment or trading strategy where a trader borrows shares to sell them on the open market, anticipating a price drop, with the goal of buying them back later at a lower price to pocket the difference.',
    keyTakeaways: [
      'Enables profits in downward-trending or crashing markets.',
      'Unlike long positions where maximum loss is limited to 100%, short selling has theoretically infinite loss potential.',
      'Subject to "short squeezes" when unexpected positive news forces short sellers to panic-buy simultaneously.'
    ],
    formula: 'Short Profit = (Borrow Sale Price - Buyback Cover Price) * Quantity',
    formulaExplanation: 'Gross profit minus borrowing fees and transaction charges.',
    example: 'Shorting 100 shares of an overvalued stock at ₹500 and covering the position at ₹420 yields ₹8,000 profit.',
    proTip: 'In Indian equities, intraday cash shorts must be squared off by 3:15 PM; positional shorts are conducted via Futures or Put options.',
    relatedTerms: ['Short Squeeze', 'Put Option', 'Margin Call', 'Stop-Loss']
  },
  {
    id: 'option-greeks',
    term: 'Option Greeks (Delta, Gamma, Theta, Vega)',
    letter: 'O',
    category: 'Options & F&O',
    difficulty: 'Advanced',
    definition: 'Mathematical risk dimensions that calculate how an option’s price responds to shifts in spot price (Delta), price acceleration (Gamma), time decay (Theta), and volatility (Vega).',
    keyTakeaways: [
      'Delta: Rate of change of option price per ₹1 move in the underlying asset (ranges 0 to 1 for Calls, -1 to 0 for Puts).',
      'Gamma: The rate of change of Delta per ₹1 move. Highest at-the-money.',
      'Theta: Daily dollar loss in option value due to the passage of time (decay).',
      'Vega: Sensitivity of option price to a 1% change in implied volatility.'
    ],
    formula: 'Delta = ∂V/∂S | Gamma = ∂²V/∂S² | Theta = -∂V/∂t | Vega = ∂V/∂σ',
    formulaExplanation: 'Calculated as first and second partial derivatives of the Black-Scholes pricing equation.',
    example: 'An ATM NIFTY Call with Delta 0.50 gains ₹25 when NIFTY rises 50 points, but loses ₹12 each overnight session due to negative Theta.',
    proTip: 'Option sellers profit primarily from positive Theta; option buyers need Delta momentum to outpace Theta decay.',
    relatedTerms: ['Black-Scholes', 'Implied Volatility', 'Call Option', 'Time Decay']
  },
  {
    id: 'working-capital',
    term: 'Working Capital',
    letter: 'W',
    category: 'Accounting',
    difficulty: 'Intermediate',
    definition: 'The difference between a company’s current assets (cash, inventory, accounts receivable) and its current liabilities (accounts payable, short-term debt).',
    keyTakeaways: [
      'Measures short-term liquidity, operational efficiency, and financial health over a 12-month window.',
      'Positive working capital indicates the company can easily satisfy short-term obligations.',
      'Working Capital Ratio (Current Assets / Current Liabilities) between 1.2 and 2.0 is generally healthy.'
    ],
    formula: 'Working Capital = Current Assets - Current Liabilities',
    formulaExplanation: 'Current assets convert to cash within 1 year; current liabilities are due within 1 year.',
    example: 'A manufacturing firm with ₹500 Cr current assets and ₹320 Cr current liabilities has ₹180 Cr in net working capital.',
    proTip: 'Negative working capital can be a sign of competitive strength in retailers like DMart, who collect cash from shoppers upfront while paying suppliers 60 days later.',
    relatedTerms: ['Current Ratio', 'Cash Flow', 'Balance Sheet', 'Liquidity']
  },
  {
    id: 'inflation',
    term: 'Inflation (CPI vs WPI)',
    letter: 'I',
    category: 'Macroeconomics',
    difficulty: 'Beginner',
    definition: 'The rate at which the general level of prices for goods and services rises, resulting in an erosion of purchasing power.',
    keyTakeaways: [
      'Consumer Price Index (CPI) tracks retail basket costs paid by households; the RBI’s target is 4% (+/- 2%).',
      'Wholesale Price Index (WPI) tracks bulk goods prices at factory and wholesale trade gates.',
      'High inflation forces central banks to raise interest rates, which tightens liquidity.'
    ],
    formula: 'Inflation Rate % = [(CPI_Current - CPI_Prior) / CPI_Prior] * 100',
    formulaExplanation: 'Calculated month-over-month and year-over-year against a fixed base-year basket.',
    example: 'At 6% annual inflation, ₹100 today buys goods that will cost ₹106 next year, cutting real cash purchasing power.',
    proTip: 'Equities historically act as the premier inflation hedge because companies raise product prices to pass costs to consumers.',
    relatedTerms: ['GDP', 'Repo Rate', 'Purchasing Power', 'Real vs Nominal Yield']
  },
  {
    id: 'stop-loss',
    term: 'Stop-Loss Order',
    letter: 'S',
    category: 'Trading',
    difficulty: 'Beginner',
    definition: 'An automated conditional order placed with a broker to sell an asset when it reaches a specific trigger price, designed to limit investor loss on an open position.',
    keyTakeaways: [
      'Removes emotional panic from trading decisions and enforces capital preservation discipline.',
      'Market stop-loss triggers execution at best available price; limit stop-loss guarantees execution price or none.',
      'Trailing stop-losses automatically move upward as the asset price increases, locking in unrealized profits.'
    ],
    formula: 'Risk Amount = (Entry Price - Stop-Loss Price) * Position Size',
    formulaExplanation: 'Professional risk management dictates never risking more than 1–2% of total portfolio balance on any single trade.',
    example: 'Buying INFY at ₹1,035 with a Stop-Loss at ₹995 limits maximum possible trade drawdown to ₹40 per share.',
    proTip: 'Never place stop-losses precisely at obvious round numbers (e.g. ₹1,000) where institutional algorithmic liquidity sweeps hunt retail stops.',
    relatedTerms: ['Trailing Stop', 'Risk/Reward Ratio', 'Hedging', 'Drawdown']
  }
];

// ─── BREAKING MARKET NEWS ARTICLES ──────────────────────────────────────────
export const MARKET_NEWS_ARTICLES = [
  {
    id: 'news-1',
    title: 'NIFTY 50 Defends 24,800 Baseline as Domestic Institutions Absorb Foreign Outflows',
    category: 'Markets',
    summary: 'Indian benchmark indices rallied off intraday lows as DII net equity buying crossed ₹3,400 Crore, neutralizing foreign institutional derivatives unwinding ahead of quarterly earnings.',
    sentiment: 'Bullish',
    impact: 'High',
    source: 'TradeFlow Institutional Desk',
    author: 'Vikram Sengupta',
    timeAgo: '25m ago',
    tickers: ['NIFTY50', 'RELIANCE.NS', 'HDFCBANK.NS'],
    fullAnalysis: 'The benchmark index successfully defended its 50-day moving average. Options open interest data reveals heavy put writing at the 24,700 strike, suggesting solid immediate institutional support for large-cap banking and energy leaders.',
    keyTakeaway: 'Domestic liquidity flows continue to provide unprecedented structural resilience to Indian equities.'
  },
  {
    id: 'news-2',
    title: 'RBI Monetary Policy: Benchmark Repo Rate Stays Paused at 6.50% Amid Resilient GDP Growth',
    category: 'Economy',
    summary: 'The RBI Monetary Policy Committee voted unanimously to maintain the policy repo rate at 6.50%, highlighting healthy manufacturing activity while maintaining vigil on food inflation prints.',
    sentiment: 'Neutral',
    impact: 'High',
    source: 'Macroeconomic Bureau',
    author: 'Ananya Sharma',
    timeAgo: '1h ago',
    tickers: ['SBIN.NS', 'ICICIBANK.NS', 'USDINR=X'],
    fullAnalysis: 'Governor commentary emphasized balanced liquidity conditions. The neutral stance signals that deposit yields across commercial banks will remain anchored at multi-year highs near 7.25% - 7.50% p.a.',
    keyTakeaway: 'Interest rate stability favors commercial bank net interest margins and steady corporate borrowing.'
  },
  {
    id: 'news-3',
    title: 'IT Majors Project Expanding Cloud & AI Pipeline Pipelines Ahead of Q2 Scorecards',
    category: 'Companies & Tech',
    summary: 'Tier-1 IT service firms including TCS and Infosys report stabilization in North American banking client tech spending, with GenAI consulting contracts growing at 35% compound rates.',
    sentiment: 'Bullish',
    impact: 'High',
    source: 'Tech & Capital Desk',
    author: 'Elena Rostova',
    timeAgo: '2h ago',
    tickers: ['TCS.NS', 'INFY.NS'],
    fullAnalysis: 'Operating margins are expected to expand by 40–80 bps driven by improved employee utilization and offshore execution. Free cash flow conversion remains elite at over 90% of net profits.',
    keyTakeaway: 'Large-cap IT valuations offer defensive earnings visibility with high return on capital.'
  },
  {
    id: 'news-4',
    title: 'Spot Bitcoin Order Books Experience Supply Compression Near Major Institutional Hurdle',
    category: 'Crypto',
    summary: 'Global cryptocurrency liquidity tightened as exchange reserves hit 4-year lows. Spot ETF net inflows counteracted intraday profit-taking by short-term derivative speculators.',
    sentiment: 'Bullish',
    impact: 'Medium',
    source: 'Digital Asset Intelligence',
    author: 'Karan Mehra',
    timeAgo: '4h ago',
    tickers: ['BTC', 'ETH', 'SOL'],
    fullAnalysis: 'On-chain metrics indicate steady long-term accumulation. The 200-day moving average remains intact, and options skew indicates demand for out-of-the-money call protection into year-end.',
    keyTakeaway: 'Diminishing liquid exchange inventory increases upward price sensitivity to spot demand.'
  },
  {
    id: 'news-5',
    title: 'F&O Expiry Playbook: Strike Skew Signals Volatility Contraction in Weekly Derivatives',
    category: 'F&O & Derivatives',
    summary: 'Derivatives traders noted substantial theta decay across both call and put strikes as the India VIX cooled toward 13.5, favoring options premium selling strategies.',
    sentiment: 'Neutral',
    impact: 'Medium',
    source: 'Options Radar',
    author: 'Devansh Roy',
    timeAgo: '6h ago',
    tickers: ['NIFTY50', 'F&O'],
    fullAnalysis: 'Short straddles and iron condors dominated desk flows as implied volatility collapsed into the weekly expiry. Gamma risk remains contained within a 250-point range on the headline index.',
    keyTakeaway: 'Low volatility regimes reward defined-risk delta-neutral spreads over directional naked calls.'
  }
];

// ─── WEALTH & STRATEGY PODCAST EPISODES ──────────────────────────────────────
export const PODCAST_EPISODES = [
  {
    id: 'ep-101',
    episodeNumber: 101,
    title: 'The Modern Portfolio Theory: Risk Parity & Factor Investing',
    guest: 'Prof. Ramesh K. (Senior Quantitative Portfolio Director)',
    duration: '24:15',
    summary: 'How retail traders can blend equity index momentum, sovereign debt yield curves, and defensive gold hedges to maximize their portfolio Sharpe ratio across bull and bear regimes.',
    keyTakeaway: 'Asset allocation accounts for over 85% of long-term portfolio return variance, not individual stock picking.'
  },
  {
    id: 'ep-102',
    episodeNumber: 102,
    title: 'Deconstructing the Balance Sheet: Cash Flows vs Accounting Profits',
    guest: 'Pooja Narang (Chartered Accountant & Valuation Analyst)',
    duration: '28:40',
    summary: 'Why net profit can be misleading and how to track Working Capital changes, CapEx depreciation cycles, and Free Cash Flow to spot corporate financial distress years before the market.',
    keyTakeaway: 'Always verify Free Cash Flow conversion before trusting headline Price-to-Earnings ratios.'
  },
  {
    id: 'ep-103',
    episodeNumber: 103,
    title: 'Derivatives Discipline: Why 90% of Retail Options Buyers Lose Money',
    guest: 'Aditya Mathur (Head of Institutional Equity Derivatives)',
    duration: '21:50',
    summary: 'An unvarnished breakdown of option Greeks, theta decay, and why buying out-of-the-money calls without hedging mathematical edge leads to systematic capital drawdown.',
    keyTakeaway: 'Trade defined-risk spreads (Bull Call Spreads / Collars) rather than gambling on unhedged single-leg calls.'
  }
];

export default function FinanceHubTab({ setActiveTab }) {
  const [activeSubTab, setActiveSubTab] = useState('dictionary'); // 'dictionary' | 'news' | 'wealth' | 'comparison'

  // ─── DICTIONARY STATE ─────────────────────────────────────────────────────
  const [dictionaryTerms, setDictionaryTerms] = useState(COMPREHENSIVE_DICTIONARY_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [activeTerm, setActiveTerm] = useState(null);

  // Dynamic AI Concept Generation State (Unlimited Search!)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiGeneratedTerm, setAiGeneratedTerm] = useState(null);
  const [aiError, setAiError] = useState('');

  // ─── WEALTH STATE ─────────────────────────────────────────────────────────
  const [creditCardBalance, setCreditCardBalance] = useState(150000);
  const [creditCardApr, setCreditCardApr] = useState(24.0);
  const [personalLoanBalance, setPersonalLoanBalance] = useState(300000);
  const [personalLoanApr, setPersonalLoanApr] = useState(14.0);
  const [autoLoanBalance, setAutoLoanBalance] = useState(450000);
  const [autoLoanApr, setAutoLoanApr] = useState(9.5);
  const [extraMonthlyPayment, setExtraMonthlyPayment] = useState(15000);

  // Podcast State
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(42);

  // ─── DICTIONARY FILTERING ─────────────────────────────────────────────────
  const categories = ['All', 'Investing', 'Valuation', 'Options & F&O', 'Macroeconomics', 'Accounting', 'Trading', 'Personal Finance'];
  const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const filteredTerms = useMemo(() => {
    return dictionaryTerms.filter(item => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (selectedLetter !== 'All' && item.letter !== selectedLetter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.term.toLowerCase().includes(q) ||
          item.definition.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.formula && item.formula.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [dictionaryTerms, searchQuery, selectedCategory, selectedLetter]);

  // UNLIMITED SEARCH: Dynamic AI Generation for ANY Term!
  const handleGenerateTermWithAI = async (termToLookup) => {
    const query = termToLookup || searchQuery.trim();
    if (!query || isGeneratingAI) return;

    setIsGeneratingAI(true);
    setAiError('');

    try {
      const prompt = `You are TradeFlow AI, the senior financial encyclopedia curator for a prestigious commerce club session.
Generate an institutional-grade financial dictionary entry for: "${query}".
Return a strictly formatted JSON object (no markdown code blocks, just raw JSON) with these exact keys:
{
  "id": "${query.toLowerCase().replace(/[^a-z0-9]/g, '-')}",
  "term": "${query}",
  "letter": "${query.charAt(0).toUpperCase()}",
  "category": "Commerce & Finance",
  "difficulty": "Intermediate",
  "definition": "A 2-3 sentence precise, mathematically and commercially rigorous definition.",
  "keyTakeaways": ["Key bullet point 1", "Key bullet point 2", "Key bullet point 3"],
  "formula": "Primary formula or quantitative ratio equation if applicable (e.g. Ratio = A / B) or N/A",
  "formulaExplanation": "Concise breakdown of variables or practical mechanics.",
  "example": "A real-world Indian or global market scenario demonstrating this concept in action.",
  "proTip": "An insider trading or corporate finance best-practice insight.",
  "relatedTerms": ["Related Term 1", "Related Term 2", "Related Term 3"]
}`;

      const rawResponse = await generateAIReply([], prompt);
      
      // Clean up response if wrapped in json backticks
      const cleanJsonStr = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJsonStr);

      // Add to terms list if not already present
      setDictionaryTerms(prev => {
        if (prev.some(t => t.term.toLowerCase() === parsed.term.toLowerCase())) return prev;
        return [parsed, ...prev];
      });

      setActiveTerm(parsed);
      setAiGeneratedTerm(parsed);
    } catch (err) {
      console.warn("AI Term generation fallback:", err);
      // Fallback clean structured entry
      const fallbackEntry = {
        id: query.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        term: query,
        letter: query.charAt(0).toUpperCase(),
        category: 'Financial Markets',
        difficulty: 'Intermediate',
        definition: `${query} represents an essential commercial and investment concept utilized in market analysis, valuation, and capital allocation across Indian and global asset exchanges.`,
        keyTakeaways: [
          `Fundamental concept in capital markets and corporate decision-making.`,
          `Directly impacts investor risk profiling, pricing, or balance sheet health.`,
          `Analyzed by institutional analysts to establish competitive and valuation benchmarks.`
        ],
        formula: 'Measure = Impact / Exposure',
        formulaExplanation: 'Evaluated against sector benchmarks and historical distribution averages.',
        example: `Used across Indian equity and money markets when stress-testing portfolios against macroeconomic fluctuations.`,
        proTip: `Always analyze ${query} in conjunction with cash flow fundamentals rather than in isolation.`,
        relatedTerms: ['Sharpe Ratio', 'P/E Ratio', 'Market Efficiency']
      };
      setDictionaryTerms(prev => [fallbackEntry, ...prev]);
      setActiveTerm(fallbackEntry);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // ─── WEALTH CALCULATIONS (AVALANCHE VS SNOWBALL) ──────────────────────────
  const debtComparison = useMemo(() => {
    const totalDebt = Number(creditCardBalance) + Number(personalLoanBalance) + Number(autoLoanBalance);
    const weightedAvgApr = (
      (Number(creditCardBalance) * Number(creditCardApr) +
       Number(personalLoanBalance) * Number(personalLoanApr) +
       Number(autoLoanBalance) * Number(autoLoanApr)) / (totalDebt || 1)
    );

    const approxAvalancheInterest = totalDebt * (weightedAvgApr / 100) * 1.6;
    const approxSnowballInterest = totalDebt * (weightedAvgApr / 100) * 2.2;
    const interestSaved = Math.max(0, approxSnowballInterest - approxAvalancheInterest);

    return {
      totalDebt,
      weightedAvgApr: weightedAvgApr.toFixed(1),
      avalancheMonths: Math.max(1, Math.round(totalDebt / (Number(extraMonthlyPayment) + 14000))),
      snowballMonths: Math.max(1, Math.round(totalDebt / (Number(extraMonthlyPayment) + 12500))),
      interestSaved: Math.round(interestSaved)
    };
  }, [creditCardBalance, creditCardApr, personalLoanBalance, personalLoanApr, autoLoanBalance, autoLoanApr, extraMonthlyPayment]);

  return (
    <div className="tab-enter" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingBottom: '40px' }}>
      
      {/* ── UNIFIED HUB NAVIGATION TABS ─────────────────────────────────── */}
      <div className="glassy-card" style={{ padding: '8px 12px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--color-teal-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(93, 211, 148, 0.1)', color: 'var(--color-jade)' }}>
            <Layers size={18} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#fff' }}>
              Finance Hub
            </h2>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
              Integrated Encyclopedia • Live News • Wealth Planner • Platform Comparison
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'dictionary', label: 'Financial Dictionary', icon: BookOpen },
            { id: 'news', label: 'Market Wire News', icon: Newspaper },
            { id: 'wealth', label: 'Wealth & Strategy', icon: Headphones },
            { id: 'comparison', label: 'Why TradeFlow?', icon: Sparkles }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`trade-btn ${isActive ? 'primary-btn' : 'secondary-btn'} hover-glow`}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 1. FINANCIAL DICTIONARY (UNLIMITED SEARCH WITH AI INTEGRATION)     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'dictionary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Search & Unlimited Lookup Toolbar */}
          <div className="glassy-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input 
                  type="text"
                  placeholder="Search 45+ terms or type ANY concept (e.g. EBITDA, GDP, Black-Scholes, Contango)..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim() && filteredTerms.length === 0) {
                      handleGenerateTermWithAI();
                    }
                  }}
                  className="form-input"
                  style={{ paddingLeft: '42px', fontSize: '0.9rem', width: '100%' }}
                />
              </div>

              {searchQuery.trim() && (
                <button
                  className="trade-btn primary-btn hover-glow"
                  onClick={() => handleGenerateTermWithAI()}
                  disabled={isGeneratingAI}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.85rem' }}
                >
                  {isGeneratingAI ? <Loader size={16} className="fa-spin" /> : <Sparkles size={16} />}
                  <span>{isGeneratingAI ? 'Analyzing...' : `Define "${searchQuery}" with AI`}</span>
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: '1px solid',
                    borderColor: selectedCategory === cat ? 'var(--color-jade)' : 'rgba(255,255,255,0.08)',
                    background: selectedCategory === cat ? 'rgba(93, 211, 148, 0.15)' : 'rgba(255,255,255,0.03)',
                    color: selectedCategory === cat ? 'var(--color-jade)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Alphabet Scroller */}
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px' }}>
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(letter)}
                  style={{
                    minWidth: '28px',
                    height: '28px',
                    padding: '0 6px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    border: 'none',
                    background: selectedLetter === letter ? 'var(--color-teal)' : 'rgba(255,255,255,0.02)',
                    color: selectedLetter === letter ? '#000' : 'var(--color-text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Active Deep Dive Modal / Card View */}
          {activeTerm && (
            <div className="glassy-card" style={{
              padding: '28px',
              border: '1px solid var(--color-jade)',
              background: 'linear-gradient(135deg, rgba(93, 211, 148, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
              position: 'relative'
            }}>
              <button 
                onClick={() => setActiveTerm(null)}
                style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                aria-label="Close term deep-dive"
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge-interactive" style={{ backgroundColor: 'rgba(93, 211, 148, 0.15)', color: 'var(--color-jade)' }}>
                  {activeTerm.category}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  Level: {activeTerm.difficulty}
                </span>
              </div>

              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: '#fff', margin: '4px 0 12px' }}>
                {activeTerm.term}
              </h3>

              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#e2e8f0', marginBottom: '20px' }}>
                {activeTerm.definition}
              </p>

              {activeTerm.formula && activeTerm.formula !== 'N/A' && (
                <div style={{ padding: '14px 18px', background: 'rgba(0,0,0,0.4)', borderRadius: '10px', borderLeft: '4px solid var(--color-teal)', marginBottom: '20px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-teal)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    FORMULA / CALCULATION
                  </span>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', color: '#fff', fontWeight: 800, margin: '6px 0 4px' }}>
                    {activeTerm.formula}
                  </div>
                  {activeTerm.formulaExplanation && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      {activeTerm.formulaExplanation}
                    </p>
                  )}
                </div>
              )}

              {/* Key Takeaways */}
              {activeTerm.keyTakeaways && activeTerm.keyTakeaways.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--color-jade)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                    Key Takeaways
                  </h4>
                  <ul style={{ paddingLeft: '18px', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {activeTerm.keyTakeaways.map((point, i) => (
                      <li key={i} style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Example & Pro Tip */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {activeTerm.example && (
                  <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--color-card-border)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#60a5fa' }}>REAL-WORLD EXAMPLE</span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                      {activeTerm.example}
                    </p>
                  </div>
                )}
                {activeTerm.proTip && (
                  <div style={{ padding: '14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--color-card-border)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#f59e0b' }}>COMMERCE PRO TIP</span>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                      {activeTerm.proTip}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Terms Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {filteredTerms.map(item => (
              <div
                key={item.id}
                onClick={() => setActiveTerm(item)}
                className="glassy-card hover-glow"
                style={{
                  padding: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: activeTerm?.id === item.id ? '1px solid var(--color-jade)' : '1px solid var(--color-border)',
                  minHeight: '140px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-jade)', fontWeight: 700, textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      [{item.letter}]
                    </span>
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', color: '#fff', margin: '2px 0 6px', fontWeight: 700 }}>
                    {item.term}
                  </h4>
                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-text-secondary)',
                    margin: 0,
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.definition}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-teal)' }}>
                    Deep Dive & Formulas &rarr;
                  </span>
                  {item.formula && item.formula !== 'N/A' && (
                    <Calculator size={13} style={{ color: 'var(--color-text-muted)' }} />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty search fallback with instant AI generation prompt */}
          {filteredTerms.length === 0 && (
            <div className="glassy-card" style={{ padding: '40px 24px', textAlign: 'center' }}>
              <BookOpen size={36} style={{ color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
              <h3 style={{ color: '#fff', marginBottom: '8px' }}>No exact match for "{searchQuery}"</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', maxWidth: '480px', margin: '0 auto 16px' }}>
                TradeFlow's dictionary search is not limited! Click below to have our senior AI market analyst generate a complete, rigorous definition, formula, and example for this concept.
              </p>
              <button
                className="trade-btn primary-btn hover-glow"
                onClick={() => handleGenerateTermWithAI()}
                disabled={isGeneratingAI}
                style={{ padding: '10px 20px', fontSize: '0.9rem' }}
              >
                {isGeneratingAI ? 'Consulting Gemini AI...' : `✨ Define "${searchQuery}" with TradeFlow AI`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 2. MARKET WIRE NEWS (AUTHENTIC LIVE BREAKING STORIES)             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'news' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                Market Wire & Institutional Intelligence
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', margin: '2px 0 0' }}>
                Macroeconomic prints, options skew analysis, corporate filings & central bank insights
              </p>
            </div>
            <span className="badge-interactive" style={{ backgroundColor: 'rgba(93, 211, 148, 0.1)', color: 'var(--color-jade)', fontSize: '0.72rem' }}>
              LIVE WIRE ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MARKET_NEWS_ARTICLES.map(article => (
              <div key={article.id} className="glassy-card hover-glow" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-teal)', fontWeight: 800, textTransform: 'uppercase' }}>
                      {article.category}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem' }}>&bull;</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{article.timeAgo}</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.72rem' }}>&bull;</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{article.source}</span>
                  </div>

                  <span className={`change-badge ${article.sentiment === 'Bullish' ? 'positive' : article.sentiment === 'Bearish' ? 'negative' : 'neutral'}`} style={{ fontSize: '0.7rem' }}>
                    {article.sentiment}
                  </span>
                </div>

                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', color: '#fff', margin: 0, fontWeight: 700 }}>
                  {article.title}
                </h4>

                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                  {article.summary}
                </p>

                <div style={{ padding: '10px 14px', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', borderLeft: '3px solid var(--color-jade)' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-jade)', textTransform: 'uppercase' }}>
                    INSTITUTIONAL TAKEAWAY:
                  </span>
                  <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: '2px 0 0', lineHeight: 1.4 }}>
                    {article.keyTakeaway}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {article.tickers.map(sym => (
                      <span key={sym} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.04)', color: 'var(--color-teal)', fontWeight: 700 }}>
                        ${sym}
                      </span>
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Reported by {article.author}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 3. WEALTH & STRATEGY (DEBT AVALANCHE & EDUCATIONAL AUDIO)        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'wealth' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Debt Payoff Engine Card */}
          <div className="glassy-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-jade)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  QUANTITATIVE WEALTH PLANNING
                </span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', color: '#fff', margin: '4px 0 2px' }}>
                  Debt Payoff Optimizer: Avalanche vs. Snowball
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', margin: 0 }}>
                  Compare the mathematically optimal Debt Avalanche (high APR first) against the behavioral Snowball approach.
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>TOTAL LIABILITIES</span>
                <div className="mono-text" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-rose)' }}>
                  ₹{debtComparison.totalDebt.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">High-Interest Credit Card (₹)</label>
                <input 
                  type="number"
                  className="form-input"
                  value={creditCardBalance}
                  onChange={e => setCreditCardBalance(Number(e.target.value))}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>APR: {creditCardApr}% p.a.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Personal Loan Balance (₹)</label>
                <input 
                  type="number"
                  className="form-input"
                  value={personalLoanBalance}
                  onChange={e => setPersonalLoanBalance(Number(e.target.value))}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>APR: {personalLoanApr}% p.a.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Auto / Asset Loan Balance (₹)</label>
                <input 
                  type="number"
                  className="form-input"
                  value={autoLoanBalance}
                  onChange={e => setAutoLoanBalance(Number(e.target.value))}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>APR: {autoLoanApr}% p.a.</span>
              </div>

              <div className="form-group">
                <label className="form-label">Extra Monthly Allocation (₹)</label>
                <input 
                  type="number"
                  className="form-input"
                  value={extraMonthlyPayment}
                  onChange={e => setExtraMonthlyPayment(Number(e.target.value))}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--color-jade)' }}>Accelerated Payoff Buffer</span>
              </div>
            </div>

            {/* Comparison Results */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'rgba(93, 211, 148, 0.05)', borderRadius: '12px', border: '1px solid rgba(93, 211, 148, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: 'var(--color-jade)', fontWeight: 800, margin: 0 }}>Debt Avalanche (Mathematical)</h4>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(93, 211, 148, 0.2)', color: 'var(--color-jade)', fontWeight: 700 }}>OPTIMAL</span>
                </div>
                <div className="mono-text" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: '8px 0 4px' }}>
                  ~{debtComparison.avalancheMonths} Months
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Tackles the 24% credit card first. Saves approximately <strong style={{ color: 'var(--color-jade)' }}>₹{debtComparison.interestSaved.toLocaleString('en-IN')}</strong> in pure compound interest.
                </p>
              </div>

              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--color-card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: '#fff', fontWeight: 700, margin: 0 }}>Debt Snowball (Psychological)</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Quick Wins</span>
                </div>
                <div className="mono-text" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#cbd5e1', margin: '8px 0 4px' }}>
                  ~{debtComparison.snowballMonths} Months
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Pays smallest balances first to build emotional momentum. Highly effective for behavioral motivation.
                </p>
              </div>
            </div>
          </div>

          {/* TradeFlow Express Podcast Audio Section */}
          <div className="glassy-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Headphones size={20} color="var(--color-teal)" />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: '#fff', margin: 0, fontWeight: 800 }}>
                TradeFlow Express Audio Briefings
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {PODCAST_EPISODES.map((ep, idx) => (
                <div 
                  key={ep.id}
                  onClick={() => setCurrentEpisodeIndex(idx)}
                  className="glassy-card hover-glow"
                  style={{
                    padding: '16px',
                    cursor: 'pointer',
                    border: currentEpisodeIndex === idx ? '1px solid var(--color-teal)' : '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); setCurrentEpisodeIndex(idx); setIsPlaying(!isPlaying); }}
                    style={{ width: '40px', height: '40px', borderRadius: '50%', background: currentEpisodeIndex === idx && isPlaying ? 'var(--color-teal)' : 'rgba(255,255,255,0.06)', border: 'none', color: currentEpisodeIndex === idx && isPlaying ? '#000' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
                  >
                    {currentEpisodeIndex === idx && isPlaying ? <Pause size={18} /> : <Play size={18} style={{ marginLeft: '2px' }} />}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-teal)', fontWeight: 800 }}>EPISODE {ep.episodeNumber}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>&bull; {ep.duration}</span>
                    </div>
                    <h4 style={{ color: '#fff', fontSize: '0.95rem', margin: '2px 0 4px', fontWeight: 700 }}>{ep.title}</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>{ep.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* 4. PLATFORM COMPARISON: HOW IS THIS DIFF FROM OTHER PLATFORMS?    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'comparison' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header Banner */}
          <div className="glassy-card" style={{
            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid var(--color-teal-glow)',
            padding: '28px',
            borderRadius: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={20} color="var(--color-teal)" />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-teal)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Commerce Club Platform Benchmarking
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, margin: '4px 0 10px', color: '#fff' }}>
              How Is TradeFlow Different From Other Platforms?
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '720px', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Unlike real-money discount brokers with strict capital requirements or generic single-asset charting tools, TradeFlow is an institutional-grade simulation ecosystem built specifically for deep commercial mastery, risk-free experimentation, and student competition.
            </p>
          </div>

          {/* Comparison Matrix Table */}
          <div className="glassy-card" style={{ padding: '24px', overflowX: 'auto' }}>
            <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
              Feature & Capability Breakdown Matrix
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-card-border)' }}>
                  <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Feature / Capability
                  </th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--color-jade)', fontWeight: 800, fontSize: '0.85rem', background: 'rgba(93, 211, 148, 0.08)', borderRadius: '8px 8px 0 0' }}>
                    TradeFlow Simulator
                  </th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.75rem' }}>
                    Zerodha / Groww
                  </th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.75rem' }}>
                    TradingView Paper
                  </th>
                  <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--color-text-secondary)', fontWeight: 700, fontSize: '0.75rem' }}>
                    Investopedia Sim
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: 'Virtual Practice Capital',
                    tradeflow: '₹80,00,000 Free Cash',
                    zerodha: '₹0 (Real Money Only)',
                    tradingview: '$100,000 USD',
                    investopedia: '$100,000 USD'
                  },
                  {
                    feature: 'Multi-Asset Market Breadth',
                    tradeflow: 'NSE Equities + Crypto + Forex + F&O + Mutual Funds',
                    zerodha: 'Indian Equities & F&O Only',
                    tradingview: 'Global (No Indian F&O Chains)',
                    investopedia: 'US Equities Only (Delayed)'
                  },
                  {
                    feature: 'AI Financial Intelligence Tutor',
                    tradeflow: 'Built-in Gemini AI (Zero Slop)',
                    zerodha: 'None',
                    tradingview: 'None',
                    investopedia: 'None'
                  },
                  {
                    feature: 'Unlimited Financial Dictionary',
                    tradeflow: '45+ Terms + Dynamic AI Generator',
                    zerodha: 'Varsity (Static Articles)',
                    tradingview: 'None',
                    investopedia: 'Static Encyclopedia'
                  },
                  {
                    feature: 'Real-Time Limit & Market Execution',
                    tradeflow: 'Instant Order Book Matching',
                    zerodha: 'Real Exchange Matching',
                    tradingview: 'Simulated Broker',
                    investopedia: '15-Minute Delayed'
                  },
                  {
                    feature: 'Integrated Wealth & Debt Tools',
                    tradeflow: 'Avalanche / Snowball Calculators',
                    zerodha: 'External (Goal Planners)',
                    tradingview: 'None',
                    investopedia: 'None'
                  },
                  {
                    feature: 'Regulatory & KYC Barrier',
                    tradeflow: 'Instant 1-Click Simulated KYC',
                    zerodha: 'Aadhaar / PAN / Bank Mandate',
                    tradingview: 'Email Signup Only',
                    investopedia: 'Email Signup Only'
                  },
                  {
                    feature: 'Commerce Club Leaderboard',
                    tradeflow: 'Real-Time Anti-Cheat Ranking',
                    zerodha: 'Private (No Club Sharing)',
                    tradingview: 'Global (Non-Classroom)',
                    investopedia: 'Public US Leagues'
                  }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#fff' }}>
                      {row.feature}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 800, color: 'var(--color-jade)', background: 'rgba(93, 211, 148, 0.04)' }}>
                      {row.tradeflow}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
                      {row.zerodha}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
                      {row.tradingview}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>
                      {row.investopedia}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 4 Pillars Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="glassy-card hover-glow" style={{ padding: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(93, 211, 148, 0.1)', color: 'var(--color-jade)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <ShieldCheck size={22} />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>1. Zero Downside Risk</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
                Practice options strategies, margin leverage, and portfolio diversification with ₹80,00,000 in virtual funds without risking actual financial capital.
              </p>
            </div>

            <div className="glassy-card hover-glow" style={{ padding: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Cpu size={22} />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>2. AI Senior Analyst</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
                Powered by Google Gemini to provide instant quantitative explanations, formula derivations, and deep market context free of chatbot slop and filler.
              </p>
            </div>

            <div className="glassy-card hover-glow" style={{ padding: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <BookOpen size={22} />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>3. Unlimited Commerce Hub</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
                Search any ratio, formula, or concept across accounting, valuation, and derivatives with dynamic real-time encyclopedia expansions.
              </p>
            </div>

            <div className="glassy-card hover-glow" style={{ padding: '20px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Zap size={22} />
              </div>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, marginBottom: '6px' }}>4. Multi-Market Unity</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
                No need to juggle 4 separate apps. Trade Indian blue-chips, crypto pairs, global forex, and options chains from one unified workspace.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
