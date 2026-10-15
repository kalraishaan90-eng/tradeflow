import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const screenshotsDir = path.resolve(projectRoot, 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';
  let filePath = path.join(distDir, reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Error loading file');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 5088;
server.listen(PORT, '127.0.0.1', async () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Load initial page and set guest session
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'domcontentloaded', timeout: 15000 });

  await page.evaluate(() => {
    localStorage.setItem('stockshadow_tradeflow_is_guest', 'true');
    localStorage.setItem('stockshadow_tradeflow_plan_active', 'free');
    localStorage.setItem('stockshadow_tradeflow_kyc_active', 'true');
  });

  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2500));

  const navItems = [
    { name: 'Home', file: '01_home_tab.png' },
    { name: 'Market', file: '02_market_tab.png', setup: async () => {
      // Click first stock row to expand chart and trade station
      const row = (await page.$('.market-row')) || (await page.$('.asset-row'));
      if (row) await row.click();
      await new Promise(r => setTimeout(r, 1200));
    }},
    { name: 'Dashboard', file: '03_dashboard_tab.png' },
    { name: 'Leaderboard', file: '04_leaderboard_tab.png' },
    { name: 'AI Insights', file: '05_ai_insights_tab.png' },
    { name: 'Orders', file: '06_orders_tab.png' },
    { name: 'F&O', file: '07_fo_tab.png' },
    { name: 'Mutual Funds', file: '08_mutual_funds_tab.png' },
    { name: 'Finance Hub', file: '09_finance_hub_tab.png' },
    { name: 'Banking & Yields', file: '10_banking_rates_tab.png' },
    { name: 'Settings', file: '11_settings_tab.png' },
    { name: 'FAQ', file: '12_faq_tab.png' }
  ];

  for (const item of navItems) {
    console.log(`Capturing ${item.name}...`);
    await page.evaluate((label) => {
      const btns = Array.from(document.querySelectorAll('.sidebar-nav .nav-item'));
      const target = btns.find(b => b.textContent.trim().toLowerCase().startsWith(label.toLowerCase()));
      if (target) target.click();
    }, item.name);

    await new Promise(r => setTimeout(r, 1500));

    if (item.setup) {
      await item.setup();
    }

    const outPath = path.join(screenshotsDir, item.file);
    await page.screenshot({ path: outPath, fullPage: false });
  }

  // Also capture Subscription Modal
  console.log('Capturing Subscription Modal...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Upgrade') || b.textContent.includes('Plan'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(screenshotsDir, '13_subscription_modal.png'), fullPage: false });

  await browser.close();
  server.close();
  console.log('Screenshots capture complete!');
  process.exit(0);
});
