const SYSTEM_INSTRUCTION = `You are TradeFlow AI, the senior financial intelligence tutor and quantitative market analyst for TradeFlow Paper Trading Simulator (built for the Commerce Club).

STRICT ANTI-SLOP & QUALITY DIRECTIVES:
1. NO PREAMBLE OR CONVERSATIONAL FILLER: Never start with "Certainly!", "Great question!", "I'd be glad to help", or "Sure thing". Answer the user's specific question directly in the very first sentence.
2. ZERO DISCLAIMER REPETITION: Do NOT include robotic disclaimers such as "I am an AI, not a financial advisor" or "Investing involves risk, please consult a CFP". Assume the user is an ambitious commerce/finance student practicing on a virtual paper simulator.
3. HIGH COMMERCIAL & QUANTITATIVE DEPTH: Explain real mechanisms, financial formulas, balance sheet dynamics, valuation multiples (P/E, EV/EBITDA, DCF), Indian market context (NSE, NIFTY 50, RBI Repo, SEBI regulations) where relevant, and options mechanics (Greeks, Black-Scholes, strike skew).
4. STRUCTURED & CONCISE: Use bold headings, bullet points, and clean mathematical notation for formulas. Be punchy, incisive, and intellectually rigorous.`;

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-flash-latest'
];

let currentActiveModel = 'Gemini 2.5 Flash';

export function getActiveModelName() {
  return currentActiveModel;
}

function getSmartFallbackReply(userMessage) {
  const q = (userMessage || '').toLowerCase();

  if (q.includes('fusion') || q.includes('hybrid option')) {
    return `### Quantitative Analysis: Fusion Options & Hybrid Derivatives

In quantitative derivatives engineering, a **Fusion Option** (often structured as a multi-asset hybrid or correlation basket option) is an advanced contract whose payoff depends simultaneously on the co-dependence and volatility cross-product of two or more distinct underlying asset classes (e.g., Equity + Currency, or Equity + Commodity).

#### 1. Core Mechanics
* **Underlying Vector:** Rather than a single scalar asset $S_t$, the payoff tracks a vector $\\mathbf{S}_t = (S_1, S_2, \\dots, S_n)$ with an empirical correlation matrix $\\mathbf{\\Sigma}$.
* **Standard Payoff Topology:**
  $$\\text{Payoff} = \\max\\left(0, \\sum_{i=1}^n w_i S_{i,T} - K\\right) \\quad \\text{or} \\quad \\max\\left(0, S_{1,T} - \\beta S_{2,T} - K\\right)$$
* **Implied Correlation Edge:** Pricing relies on Black-Scholes extended with Margrabe's exchange option formula or cross-asset copula simulations to capture non-linear correlation smiles.

#### 2. Practical Application in TradeFlow
* **Covered Equity-FX Collar:** Fusing Indian large-caps (like Reliance or Infosys) with USD/INR futures to neutralize rupee devaluation while harvesting option premiums.
* **Delta-Neutral Volatility Arbitrage:** Fusing long ATM call options on high-beta tech with short out-of-the-money index puts to exploit sector dispersion.
* **Risk Management:** Fusion contracts achieve lower net premium costs than purchasing standalone independent options due to diversification discount ($1 + \\rho < 2$).`;
  }

  if (q.includes('reliance') || q.includes('tcs') || q.includes('stock')) {
    return `### Market Structure & Large-Cap Strategic Overview

* **Reliance Industries (RELIANCE.NS):** Trades as an integrated conglomerate play spanning O2C (refining margins), Retail, and Digital Services (Jio). High cash flow reinvestment into 5G expansion and clean energy gigafactories. Key benchmark heavyweight driving Nifty 50 directional bias.
* **TCS (TCS.NS):** The benchmark for Indian IT service exports. High Return on Equity (>45%) and virtually debt-free balance sheet. Revenue growth is closely tied to North American and European BFSI tech budgets and generative AI migration.
* **Portfolio Positioning Strategy:** In volatile macro cycles, pair defensive cash-flow generators (TCS, HDFC Bank) with cyclical growth engines (L&T, Tata Motors) to optimize Sharpe ratio.`;
  }

  if (q.includes('mutual fund') || q.includes('sip') || q.includes('nav')) {
    return `### Mutual Fund Compounding & Capital Allocation

* **SIP Mechanics (Rupee-Cost Averaging):** By committing fixed capital at periodic intervals, investors mathematically accumulate more units during market drawdowns ($NAV_t \\downarrow$) and fewer units at cyclical peaks ($NAV_t \\uparrow$).
* **Mathematical Corpus Formula:**
  $$A = P \\cdot \\left[\\frac{(1 + r)^n - 1}{r}\\right] \\cdot (1 + r)$$
  Where $P$ is monthly contribution, $r$ is monthly effective rate, and $n$ is total months.
* **Active Alpha vs Indexing:** Index funds (like SBI Nifty 50) ensure zero fund-manager key-man risk with ultra-low expense ratios (~0.18%). Flexi-cap and mid-cap funds (like Parag Parikh and HDFC Mid-Cap) target excess risk-adjusted alpha through active stock picking and global diversification.`;
  }

  if (q.includes('f&o') || q.includes('option') || q.includes('greeks') || q.includes('put') || q.includes('call')) {
    return `### Derivatives & Options Greeks Framework

1. **Delta ($\\Delta$):** Rate of change of option price per ₹1 move in the underlying asset. (0 to +1 for Calls, 0 to -1 for Puts).
2. **Gamma ($\\Gamma$):** Acceleration of Delta. Highest for At-The-Money (ATM) options nearing expiration.
3. **Theta ($\\Theta$):** Mathematical time decay. Option sellers collect Theta; option buyers must overcome negative Theta daily.
4. **Vega ($\\nu$):** Sensitivity to a 1% shift in Implied Volatility (IV). Crucial around earnings announcements and RBI monetary policy meetings.
5. **Execution Principle:** Never buy far OTM options blindly without an identifiable volatility expansion or momentum catalyst.`;
  }

  return `### Quantitative Intelligence Summary

* **Execution Focus:** Market depth, liquidity spreads, and discipline in position sizing are the determinants of positive expected value ($+EV$) in trading.
* **Capital Preservation:** Never risk more than 1–2% of total virtual buying power on any single speculative derivative trade.
* **Active Simulated Tools:** Use TradeFlow's live candlestick charts, Limit orders to mitigate slippage, and the integrated SIP compounding engine to stress-test your hypotheses.`;
}

export async function generateAIReply(history = [], userMessage = '') {
  const trimmed = userMessage.trim();

  // If no API key configured, use comprehensive quantitative fallback
  if (!GEMINI_API_KEY) {
    return getSmartFallbackReply(trimmed);
  }

  const firstUserMessage = history.findIndex(message => message.role === 'user');
  const rawHistory = history
    .slice(firstUserMessage < 0 ? history.length : firstUserMessage)
    .filter(message => message.content && (message.role === 'user' || message.role === 'ai' || message.role === 'model'))
    .slice(-20);

  const formattedTurns = [];
  for (const msg of rawHistory) {
    const role = msg.role === 'user' ? 'user' : 'model';
    if (formattedTurns.length > 0 && formattedTurns[formattedTurns.length - 1].role === role) {
      formattedTurns[formattedTurns.length - 1].parts[0].text += `\n${msg.content.slice(0, 4000)}`;
    } else {
      formattedTurns.push({
        role,
        parts: [{ text: msg.content.slice(0, 4000) }]
      });
    }
  }

  if (formattedTurns.length > 0 && formattedTurns[formattedTurns.length - 1].role === 'user') {
    formattedTurns[formattedTurns.length - 1].parts[0].text += `\n${trimmed}`;
  } else {
    formattedTurns.push({
      role: 'user',
      parts: [{ text: trimmed }]
    });
  }

  const payload = {
    contents: formattedTurns,
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048
    }
  };

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text && text.trim()) {
        currentActiveModel = model === 'gemini-2.5-flash' ? 'Gemini 2.5 Flash' : model;
        return text;
      }
    } catch (err) {
      // try next model
    }
  }

  // Graceful fallback to built-in quantitative intelligence if external service is unreachable
  return getSmartFallbackReply(trimmed);
}
