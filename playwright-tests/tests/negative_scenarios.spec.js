import { test, expect } from '@playwright/test';

test.describe('Negative Scenarios & Route Protections', () => {

  test('Invalid Login Attempt', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'unregistered_random@example.com');
    await page.fill('input[type="password"]', 'WrongPassword123');
    await page.click('button[type="submit"]:has-text("Sign In")');

    // Verify error banner appears
    const errorBanner = page.locator('.bg-rose-50');
    await expect(errorBanner).toBeVisible();
    await expect(errorBanner).toContainText(/Incorrect|Invalid|failed/i);
  });

  test('Unauthorized Direct Route Access Protection', async ({ page }) => {
    // Attempt to access Super Admin dashboard without authentication
    await page.goto('/admin/dashboard');

    // Should redirect to /login
    await page.waitForURL('**/login');
    await expect(page.locator('h2')).toContainText('Sign in');
  });

});
