import { test, expect } from '@playwright/test';

test.describe('HomeServe 18-Step Golden Booking Journey', () => {

  test('Complete Customer-Provider-Technician-Admin Lifecycle', async ({ page }) => {
    // 1 & 2. Landing & Login
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText('Sign in');

    // Use fast demo evaluation button for Customer
    await page.click('button:has-text("Customer")');
    await page.waitForURL('**/customer/dashboard');
    await expect(page.locator('h1, h2')).toContainText(/Welcome back|Customer/i);

    // 3 & 4. Browse Services & Search
    await page.goto('/services');
    await expect(page.locator('h1')).toContainText('Home Services Catalog');

    // 5 & 6. Select Service & Open Booking Wizard
    const bookButtons = page.locator('button:has-text("Book Service")');
    await expect(bookButtons.first()).toBeVisible();
    await bookButtons.first().click();

    // Verify Wizard Modal Opens
    const wizardModal = page.locator('div[role="dialog"], .fixed');
    await expect(wizardModal.first()).toBeVisible();

    // Step 1 -> Step 2
    await page.click('button:has-text("Select Date & Slot")');

    // Step 2 -> Step 3
    await page.click('button:has-text("Add Address & Notes")');

    // Step 3 -> Step 4
    await page.click('button:has-text("Review Quotation")');

    // Step 4: Confirm Booking
    await page.click('button:has-text("Confirm Appointment")');

    // Wait for redirect to My Bookings
    await page.waitForURL('**/customer/bookings', { timeout: 10000 });
    await expect(page.locator('h2')).toContainText('Appointment Management');

    // Switch Role to Service Provider to inspect & dispatch
    await page.goto('/login');
    await page.click('button:has-text("Provider")');
    await page.waitForURL('**/provider/dashboard');

    // Inspect Job Requests
    await page.goto('/provider/bookings');
    await expect(page.locator('h2')).toContainText('Job Requests');

    // Switch Role to Technician Field App
    await page.goto('/login');
    await page.click('button:has-text("Technician")');
    await page.waitForURL('**/technician/dashboard');
    await expect(page.locator('h1, h2')).toContainText(/Technician|Assigned/i);

    // Switch Role to Super Admin Console
    await page.goto('/login');
    await page.click('button:has-text("Super Admin")');
    await page.waitForURL('**/admin/dashboard');
    await expect(page.locator('h2')).toContainText(/Performance|Admin/i);
  });

});
