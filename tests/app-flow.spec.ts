import { test, expect } from '@playwright/test';

test.describe('Circus App Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('wallet_connected', 'true');
      localStorage.setItem('phantom_pubkey', 'FakeSolanaPublicKey123');
      window.solana = {
        isPhantom: true,
        publicKey: { toString: () => 'FakePubKey123' },
        connect: async () => ({ publicKey: 'FakePubKey123' }),
        on: () => {},
      };
    });

    await page.goto('https://app.circus.fun/');
  });

  test('loads homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Circus/);
  });

  test('navigates to Tokens tab', async ({ page }) => {
    await page.getByRole('link', { name: /Tokens/i }).click();
    await expect(page).toHaveURL(/.*tokens/);
  });

  test('navigates to Swap tab', async ({ page }) => {
    await page.getByRole('link', { name: /Swap/i }).click();
    await expect(page).toHaveURL(/.*swap/);
  });

  test('clicks Stake Now and Select Wallet', async ({ page }) => {
    await page.getByRole('button', { name: /Stake Now/i }).click();
    await page.getByRole('button', { name: /Select Wallet/i }).click();
    await expect(page.getByText(/Connect Wallet/i)).toBeVisible();
  });

  test('simulates wallet connection via localStorage', async ({ page }) => {
    await page.goto('https://app.circus.fun/');
    await page.getByRole('button', { name: /Stake Now/i }).click();
    const connectedText = page.locator('text=Connected');
    await expect(connectedText).toBeVisible();
  });
});
