const { chromium } = require('@playwright/test');

const BASE_URL = 'https://homeserve-app.netlify.app';

async function testAllPages() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[Console Error] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => {
    errors.push(`[Page Crash] ${err.message}`);
  });

  const results = [];

  const visit = async (path, description, expectedSelector) => {
    try {
      console.log(`Testing: ${description} (${path})...`);
      const res = await page.goto(`${BASE_URL}${path}`, { waitUntil: 'networkidle', timeout: 15000 });
      const status = res ? res.status() : 'No response';
      
      let elementFound = true;
      if (expectedSelector) {
        try {
          await page.waitForSelector(expectedSelector, { timeout: 4000 });
        } catch {
          elementFound = false;
        }
      }

      const title = await page.title();
      results.push({
        path,
        description,
        status,
        elementFound,
        success: status === 200 && elementFound
      });
      console.log(`  -> Status: ${status}, Element found: ${elementFound}`);
    } catch (err) {
      console.error(`  -> Failed: ${err.message}`);
      results.push({
        path,
        description,
        error: err.message,
        success: false
      });
    }
  };

  console.log('=== PART 1: PUBLIC STOREFRONT ===');
  await visit('/', 'Home Page', 'text=HomeServe');
  await visit('/services', 'Services Directory', 'text=Home Services Catalog');
  await visit('/about', 'About Page', 'text=About HomeServe');
  await visit('/how-it-works', 'How It Works Page', 'text=How HomeServe Technologies Works');
  await visit('/login', 'Login Page', 'text=Sign In');
  await visit('/register', 'Register Page', 'input[type="password"]');

  console.log('\n=== PART 2: CUSTOMER ROLE & DASHBOARDS ===');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'customer@gmail.com');
  await page.fill('input[type="password"]', 'Password@123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  console.log('Current URL after customer login:', page.url());

  await visit('/customer/dashboard', 'Customer Dashboard', 'text=Total Bookings');
  await visit('/customer/bookings', 'Customer Bookings', 'text=Appointment Management');
  await visit('/customer/addresses', 'Customer Addresses', 'text=Saved Addresses');
  await visit('/customer/profile', 'Customer Profile', 'text=Personal Details');

  console.log('\n=== PART 3: SERVICE PROVIDER ROLE & DASHBOARDS ===');
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'provider@apexservices.com');
  await page.fill('input[type="password"]', 'Password@123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  console.log('Current URL after provider login:', page.url());

  await visit('/provider/dashboard', 'Provider Dashboard', 'text=Apex Home & Electrical Solutions');
  await visit('/provider/bookings', 'Provider Bookings', 'text=Job Requests & Scheduling');
  await visit('/provider/technicians', 'Provider Technicians', 'text=Field Operations Team');
  await visit('/provider/earnings', 'Provider Earnings', 'text=Financial Settlements & Payouts');
  await visit('/provider/availability', 'Provider Availability', 'text=Working Days & Shifts');

  console.log('\n=== PART 4: TECHNICIAN ROLE & FIELD APP ===');
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'technician@apexservices.com');
  await page.fill('input[type="password"]', 'Password@123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  console.log('Current URL after technician login:', page.url());

  await visit('/technician/dashboard', 'Technician Dashboard', 'text=Active Daily Schedule');
  await visit('/technician/history', 'Technician History', 'text=Completed Service Orders');

  console.log('\n=== PART 5: SUPER ADMIN ROLE & CONSOLE ===');
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[type="email"]', 'admin@homeservetech.com');
  await page.fill('input[type="password"]', 'Password@123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  console.log('Current URL after admin login:', page.url());

  await visit('/admin/dashboard', 'Super Admin Dashboard', 'text=System Performance & Financials');
  await visit('/admin/categories', 'Admin Categories', 'text=Dynamic Service Categories');
  await visit('/admin/providers', 'Admin Providers', 'text=Service Provider Registry');
  await visit('/admin/bookings', 'Admin Bookings', 'text=All Platform Service Orders');
  await visit('/admin/complaints', 'Admin Complaints', 'text=Customer Dispute Tickets');
  await visit('/admin/reports', 'Admin Reports', 'text=Platform Financial Audit & Revenue Ledger');

  console.log('\n=== FINAL SUMMARY OF LIVE TESTING ===');
  const failed = results.filter(r => !r.success);
  console.log(`Total Pages Tested: ${results.length}`);
  console.log(`Passed: ${results.length - failed.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed Pages Details:');
    failed.forEach(f => console.log(`- ${f.description} (${f.path}): error=${f.error || 'selector not found'}`));
  }

  if (errors.length > 0) {
    console.log('\nConsole/Page Errors:');
    errors.slice(0, 10).forEach(e => console.log(e));
  }

  await browser.close();
}

testAllPages().catch(err => console.error(err));
