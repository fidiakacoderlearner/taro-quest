import { test, expect } from '../fixtures';

test.describe('Landing page', () => {
  test('shows the intro, characters, and Enter button', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Machine Mystery').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Bu Aza').first()).toBeVisible();
    await expect(page.getByText('Bu Zia').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Masuk|Enter/i }).first()).toBeVisible();
  });

  test('Enter button leads to the login page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Masuk|Enter/i }).first().click();
    await page.waitForURL('/login', { timeout: 10000 });
    expect(page.url()).toContain('/login');
  });

  test('language toggle switches the landing copy', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'EN' }).click();
    await expect(page.getByRole('link', { name: /Enter/i }).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Machine Mystery').first()).toBeVisible();
  });
});
