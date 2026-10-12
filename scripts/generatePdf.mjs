import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const screenshotsDir = path.resolve(projectRoot, 'screenshots');
const outputPdfPath = path.resolve(projectRoot, 'StockShadow_TradeFlow_Overview.pdf');

// Read an image and encode to base64 for self-contained HTML
function getBase64Image(filename) {
  const filePath = path.join(screenshotsDir, filename);
  if (!fs.existsSync(filePath)) return '';
  const bitmap = fs.readFileSync(filePath);
  return `data:image/png;base64,${bitmap.toString('base64')}`;
}

const tabsData = [
  {
    title: '1. Home Tab — Portfolio Command Center',
    badge: 'Overview & Net Worth',
    file: '01_home_tab.png',
    writeup: `
      <p>The <strong>Home Tab</strong> serves as the trader's command headquarters, displaying the active simulated net worth, 24-hour P&L metrics, and historical performance curves. It aggregates overall equity value across cash balances and open market holdings in real time.</p>
      <ul>
        <li><strong>Real-Time Net Worth:</strong> Displays live equity fluctuations calculated directly from real and simulated market quotes.</li>
        <li><strong>Simulated Cash Sheet:</strong> Includes the deposit drawer for topping up practice capital, which is now protected with a frosted lock card for Free members and fully unlocked for Pro and Max subscribers.</li>
        <li><strong>Persistent State:</strong> Account info, virtual balances, and allocations are permanently saved in local storage and synced to Firestore, preventing unwanted balance resets on browser refreshes.</li>
      </ul>
    `
  },
  {
    title: '2. Market Tab — Unified Order Station & Advanced Charts',
    badge: 'Trading & Technicals',
    file: '02_market_tab.png',
    writeup: `
      <p>The <strong>Market Tab</strong> is the core trading terminal, now rebuilt with 22+ top Indian equities (Reliance, TCS, HDFC Bank, Infosys, Bharti Airtel, L&T, Tata Motors, Sun Pharma, Zomato, and more) plus indices, crypto, and forex pairs.</p>
      <ul>
        <li><strong>Integrated Order Execution Station:</strong> Replaces the old bottom-of-page placement with a modern, high-tech neon execution panel situated right beside the Candlestick Chart in the expanded asset view.</li>
        <li><strong>Dual Order Types:</strong> Execute instant <em>Market</em> orders or precise <em>Limit</em> orders with automated order matching against live market movements.</li>
        <li><strong>Full Timeframe History:</strong> Features comprehensive timeframe selectors (<code>1D</code>, <code>5D</code>, <code>1M</code>, <code>6M</code>, <code>1Y</code>, <code>MAX</code>) that load deep historical candlestick data without artificial bar truncations.</li>
      </ul>
    `
  },
  {
    title: '3. Dashboard Tab — Analytics & Asset Allocation',
    badge: 'Portfolio Breakdown',
    file: '03_dashboard_tab.png',
    writeup: `
      <p>The <strong>Dashboard Tab</strong> provides institutional-grade portfolio visualization and risk analytics, breaking down user capital into actionable visual insights.</p>
      <ul>
        <li><strong>Asset Allocation Doughnut:</strong> Real-time breakdown of capital distribution across equities, derivatives, cash, and mutual funds.</li>
        <li><strong>Holding Concentration Metrics:</strong> Highlights top exposures to prevent over-leverage or single-stock vulnerability.</li>
        <li><strong>Performance Velocity:</strong> Tracks cumulative simulated returns and realized vs. unrealized gains over trading sessions.</li>
      </ul>
    `
  },
  {
    title: '4. Leaderboard Tab — Competitive Ranking & Verifications',
    badge: 'Community & Ranks',
    file: '04_leaderboard_tab.png',
    writeup: `
      <p>The <strong>Leaderboard Tab</strong> introduces a competitive paper-trading arena where traders benchmark their strategy performance against peers.</p>
      <ul>
        <li><strong>Fair Play Verification:</strong> Only organic trading accounts that have not deposited unranked top-up capital remain eligible for the public leaderboard.</li>
        <li><strong>ROI & Win-Rate Standings:</strong> Displays top performers ranked by percentage return on simulated capital with verified badges.</li>
        <li><strong>Traders Showcase:</strong> Transparent views of trading style, consistency score, and portfolio milestones.</li>
      </ul>
    `
  },
  {
    title: '5. AI Insights Tab — Claude/ChatGPT-Style Quantitative Assistant',
    badge: 'AI Copilot & Strategy',
    file: '05_ai_insights_tab.png',
    writeup: `
      <p>The <strong>AI Insights Tab</strong> features an autonomous quantitative trading assistant with a complete Claude/ChatGPT-style left sidebar interface.</p>
      <ul>
        <li><strong>Persistent Session Sidebar:</strong> Includes a "Chats and tasks" history drawer with a <code>+ New Chat</code> button. All previous prompts and conversation threads are saved permanently in local storage and never disappear when switching tabs or refreshing.</li>
        <li><strong>Deep Quantitative Knowledge:</strong> Pre-programmed with specialized algorithmic knowledge on complex topics like <em>fusion options</em>, delta/gamma hedging, candlestick patterns, and SIP compounding.</li>
        <li><strong>1-Click Technical Prompts:</strong> Fast prompt chips for immediate technical breakdowns of watchlist symbols.</li>
      </ul>
    `
  },
  {
    title: '6. Orders Tab — Active Positions & Execution Book',
    badge: 'Order Management',
    file: '06_orders_tab.png',
    writeup: `
      <p>The <strong>Orders Tab</strong> maintains an audit log of all pending limit orders, filled market orders, and historical trade logs.</p>
      <ul>
        <li><strong>Open Limit Orders:</strong> Real-time view of unexecuted orders with 1-click cancellation that immediately unreserves practice funds.</li>
        <li><strong>Filled Order History:</strong> Timestamped execution history detailing executed quantities, filled prices, and realized profits/losses.</li>
        <li><strong>Share Retention:</strong> Purchased shares (e.g. Reliance, TCS) are safely recorded and reflected across positions without disappearing on page reload.</li>
      </ul>
    `
  },
  {
    title: '7. Futures & Options (F&O) Tab — Derivatives Terminal',
    badge: 'Derivatives & Greeks',
    file: '07_fo_tab.png',
    writeup: `
      <p>The <strong>F&O Tab</strong> provides a simulated derivatives trading floor designed for index options (NIFTY, BANKNIFTY) and high-liquidity stock contracts.</p>
      <ul>
        <li><strong>Option Chain Matrix:</strong> Live calls and puts option chain with strike prices, premiums, implied volatility (IV), and open interest (OI).</li>
        <li><strong>Option Greeks Calculator:</strong> Real-time estimation of Delta, Gamma, Theta, and Vega to help traders master time-decay dynamics.</li>
        <li><strong>KYC-Gated Access:</strong> Requires simulated 1-click KYC compliance verification, which persists permanently across sessions without disruptive browser alerts.</li>
      </ul>
    `
  },
  {
    title: '8. Mutual Funds Tab — Authentic AMCs & Staff Picks',
    badge: 'Wealth & SIP',
    file: '08_mutual_funds_tab.png',
    writeup: `
      <p>The <strong>Mutual Funds Tab</strong> has been overhauled to replace mock AMCs with genuine Indian Asset Management Companies and verified scheme data.</p>
      <ul>
        <li><strong>Genuine AMCs:</strong> Features verified schemes like SBI Nifty 50 Index Fund, Parag Parikh Flexi Cap Fund, HDFC Mid-Cap Opportunities, Nippon India Small Cap, and ICICI Prudential Equity & Debt.</li>
        <li><strong>50k Fixed Slider:</strong> Corrected the monthly SIP slider range from 5k to ₹50,000 (<code>min={500}</code>, <code>max={50000}</code>), perfectly aligned with the visual labels.</li>
        <li><strong>Deep Fund Transparency:</strong> Displays authentic NAVs in Rupee (<code>₹</code>) denominations, 3Y/5Y CAGR returns, fund managers, expense ratios, benchmarks, and top 5 portfolio holdings.</li>
        <li><strong>Staff Picks Mode:</strong> A dedicated toggle showcasing handpicked high-conviction funds across risk appetites.</li>
      </ul>
    `
  },
  {
    title: '9. Finance Hub Tab — Financial Academy & Market News',
    badge: 'Education & Research',
    file: '09_finance_hub_tab.png',
    writeup: `
      <p>The <strong>Finance Hub Tab</strong> combines learning resources and real-time market awareness for developing traders.</p>
      <ul>
        <li><strong>Interactive Financial Dictionary:</strong> Comprehensive glossary covering trading terminology, technical indicators, and derivatives concepts.</li>
        <li><strong>Curated Market Feeds:</strong> Live news and macroeconomic updates categorized by sector and sentiment.</li>
        <li><strong>Wealth Building Calculators:</strong> Compound interest and long-term capital appreciation calculators for systematic wealth planning.</li>
      </ul>
    `
  },
  {
    title: '10. Banking & Yields Tab — Fixed Income & Treasury Rates',
    badge: 'Fixed Income & Macro',
    file: '10_banking_rates_tab.png',
    writeup: `
      <p>The <strong>Banking & Yields Tab</strong> provides institutional macro data across banking deposits and sovereign debt.</p>
      <ul>
        <li><strong>FD & Savings Yields:</strong> Comparison matrix of fixed deposit interest rates across major public and private Indian banks.</li>
        <li><strong>Sovereign Yield Curves:</strong> Tracking of 10-year government bond yields, repo rate benchmarks, and inflation gauges.</li>
        <li><strong>Cash Equivalent Insights:</strong> Helps paper traders compare active stock market risk premiums against risk-free treasury yields.</li>
      </ul>
    `
  },
  {
    title: '11. Settings Tab — Account Security & Tier Management',
    badge: 'Preferences & KYC',
    file: '11_settings_tab.png',
    writeup: `
      <p>The <strong>Settings Tab</strong> delivers complete control over account credentials, identity compliance, and simulator preferences.</p>
      <ul>
        <li><strong>Permanent KYC Verification:</strong> 1-click simulated KYC approval with instant visual status indicators that never reset on refresh.</li>
        <li><strong>Membership Tier Card:</strong> Displays active subscription tier (Free, Pro, Max) with a direct "Buy Pro / Max Plan" upgrade button.</li>
        <li><strong>Clean Experience:</strong> Elimination of disruptive browser alerts in favor of elegant, non-intrusive inline status banners.</li>
      </ul>
    `
  },
  {
    title: '12. FAQ Tab — Knowledge Base & Simulator Guide',
    badge: 'Help & Documentation',
    file: '12_faq_tab.png',
    writeup: `
      <p>The <strong>FAQ Tab</strong> acts as the official user manual for TradeFlow, resolving common queries regarding simulator mechanics.</p>
      <ul>
        <li><strong>Platform Rules:</strong> Transparent explanation of virtual practice cash limits, ranking eligibility, and order types.</li>
        <li><strong>Pricing & Tiers:</strong> Clarification of features included in Free vs. Pro and Max memberships.</li>
        <li><strong>Troubleshooting:</strong> Guidance on clearing local state, managing sessions, and trading during market hours.</li>
      </ul>
    `
  },
  {
    title: '13. Subscription Modal — Pro & Max Membership Tiers',
    badge: 'Premium Membership',
    file: '13_subscription_modal.png',
    writeup: `
      <p>The <strong>Subscription Modal</strong> unlocks advanced platform privileges, offering transparent pricing tiers tailored for serious market practitioners.</p>
      <ul>
        <li><strong>Free Plan (Active):</strong> ₹80M starting practice cash, standard market data, basic AI prompts, and community leaderboard access.</li>
        <li><strong>Pro Plan (₹499/mo):</strong> Unlocks the Additional Money Sheet to inject custom practice cash, advanced technical charts, priority AI queries, and custom watchlists.</li>
        <li><strong>Max Plan (₹999/mo):</strong> Complete unlimited paper capital injections, instant F&O Greeks access, dedicated quantitative AI sessions, and zero-latency market feeds.</li>
      </ul>
    `
  }
];

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>StockShadow TradeFlow — Platform Overview & Tab Guide</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #0b0f17;
      color: #e2e8f0;
      line-height: 1.6;
      font-size: 13px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .cover-page {
      padding: 60px 40px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      background: radial-gradient(circle at 80% 20%, rgba(0, 240, 255, 0.12) 0%, transparent 60%),
                  radial-gradient(circle at 20% 80%, rgba(93, 211, 148, 0.08) 0%, transparent 60%),
                  #0b0f17;
      page-break-after: always;
    }

    .cover-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 9999px;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid rgba(0, 240, 255, 0.3);
      color: #38bdf8;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 24px;
      width: fit-content;
    }

    .cover-title {
      font-size: 44px;
      font-weight: 800;
      letter-spacing: -1.5px;
      line-height: 1.15;
      color: #ffffff;
      margin-bottom: 12px;
    }

    .cover-title span {
      background: linear-gradient(135deg, #00f0ff 0%, #7000ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .cover-subtitle {
      font-size: 18px;
      color: #94a3b8;
      max-width: 680px;
      margin-bottom: 40px;
      font-weight: 400;
    }

    .cover-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      max-width: 720px;
      margin-bottom: 48px;
    }

    .stat-card {
      background: rgba(22, 28, 41, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 20px;
    }

    .stat-value {
      font-size: 26px;
      font-weight: 800;
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .cover-footer {
      margin-top: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      color: #64748b;
      font-size: 11px;
    }

    /* Tab Page Styles */
    .tab-section {
      padding: 40px;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      min-height: 100vh;
      background: #0b0f17;
    }

    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
    }

    .tab-title {
      font-size: 22px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.5px;
    }

    .tab-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(0, 240, 255, 0.1);
      border: 1px solid rgba(0, 240, 255, 0.25);
      color: #38bdf8;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tab-text {
      color: #94a3b8;
      font-size: 12.5px;
      line-height: 1.6;
      margin-bottom: 18px;
    }

    .tab-text p {
      margin-bottom: 8px;
    }

    .tab-text ul {
      margin-left: 20px;
      margin-bottom: 8px;
    }

    .tab-text li {
      margin-bottom: 4px;
    }

    .tab-text strong {
      color: #e2e8f0;
    }

    .tab-text code {
      font-family: 'JetBrains Mono', monospace;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      color: #38bdf8;
    }

    .screenshot-container {
      background: #101622;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 10px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
      margin-top: auto;
      margin-bottom: 10px;
      text-align: center;
    }

    .screenshot-container img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .tab-page-number {
      text-align: right;
      color: #475569;
      font-size: 10px;
      font-family: 'JetBrains Mono', monospace;
      margin-top: 10px;
    }
  </style>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover-page">
    <div class="cover-badge">Official Architecture & Tab Guide</div>
    <h1 class="cover-title">Trade<span>Flow</span> Simulator</h1>
    <p class="cover-subtitle">
      A high-fidelity institutional paper trading and wealth analytics platform. Complete feature walk-through, visual tab index, and architectural overview.
    </p>

    <div class="cover-stats">
      <div class="stat-card">
        <div class="stat-value">13 Views</div>
        <div class="stat-label">Tabs & Modals</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">22+ Stocks</div>
        <div class="stat-label">Indian Equities</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">100% Persisted</div>
        <div class="stat-label">Zero Refresh Wipe</div>
      </div>
    </div>

    <div class="cover-footer">
      <span>StockShadow / TradeFlow Core Engine v2.0</span>
      <span>Generated: October 2026</span>
    </div>
  </div>

  <!-- Tab Pages -->
  ${tabsData.map((tab, idx) => {
    const base64Img = getBase64Image(tab.file);
    return `
      <div class="tab-section">
        <div class="tab-header">
          <h2 class="tab-title">${tab.title}</h2>
          <span class="tab-badge">${tab.badge}</span>
        </div>
        <div class="tab-text">
          ${tab.writeup}
        </div>
        ${base64Img ? `
          <div class="screenshot-container">
            <img src="${base64Img}" alt="${tab.title}" />
          </div>
        ` : ''}
        <div class="tab-page-number">Page ${idx + 2} of ${tabsData.length + 1}</div>
      </div>
    `;
  }).join('')}

</body>
</html>
`;

async function generatePdf() {
  console.log('Generating PDF from tab screenshots and writeup...');
  const tempHtmlPath = path.resolve(projectRoot, 'temp_report.html');
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf-8');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  await page.pdf({
    path: outputPdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '10mm',
      bottom: '10mm',
      left: '10mm',
      right: '10mm'
    }
  });

  await browser.close();
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  console.log(`PDF successfully generated at: ${outputPdfPath}`);
}

generatePdf().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
