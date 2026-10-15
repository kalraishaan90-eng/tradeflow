import puppeteer from 'puppeteer-core';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5005', { waitUntil: 'networkidle0' });

  // 1. Auth screen
  const guestBtn = await page.$('.auth-btn--guest');
  if (guestBtn) {
    console.log('Capturing auth screen on port 5005...');
    await page.screenshot({ path: 'screenshots/00_auth_new.png' });
    await guestBtn.click();
    await new Promise(r => setTimeout(r, 1200));
  }

  // 2. Home tab
  console.log('Capturing home tab...');
  await page.screenshot({ path: 'screenshots/01_home_new.png' });

  // 3. Market tab
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('.nav-item'));
    const btn = buttons.find(b => b.textContent.includes('Market'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  console.log('Capturing market tab...');
  await page.screenshot({ path: 'screenshots/02_market_new.png' });

  // Expand first asset row in Market
  await page.evaluate(() => {
    const row = document.querySelector('.market-row');
    if (row) row.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  console.log('Capturing market tab expanded...');
  await page.screenshot({ path: 'screenshots/02b_market_expanded.png' });

  // 4. Dashboard tab
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('.nav-item'));
    const btn = buttons.find(b => b.textContent.includes('Dashboard'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  console.log('Capturing dashboard tab...');
  await page.screenshot({ path: 'screenshots/03_dashboard_new.png' });

  // 5. Subscription Modal (open it)
  await page.evaluate(() => {
    const crownBtn = document.querySelector('.trade-btn.hover-glow');
    if (crownBtn) crownBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  console.log('Capturing subscription modal...');
  await page.screenshot({ path: 'screenshots/05_subscription_modal.png' });

  await browser.close();
  console.log('Finished capturing all TradeFlow screenshots!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
