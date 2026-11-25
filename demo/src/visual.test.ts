import { test, expect } from '@playwright/test';

test('home page layout matches baseline', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('home-page.png', {
    fullPage: true,
    // Optional: allow tiny anti-aliasing differences (0 to 1)
    maxDiffPixelRatio: 0.01,
  });
});
