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
    await page.waitForLoadState('networkidle');
  });

  test('loads homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Circus/);
    await expect(page.locator('text=Stake Now')).toBeVisible();
  });

  test('navigates to Tokens tab', async ({ page }) => {
    const tokensTab = page.getByRole('link', { name: /Tokens/i });
    await tokensTab.waitFor({ state: 'visible' });
    await tokensTab.click();
    await expect(page).toHaveURL(/.*tokens/);
  });

  test('navigates to Swap tab', async ({ page }) => {
    const swapTab = page.getByRole('link', { name: /Swap/i });
    await swapTab.waitFor({ state: 'visible' });
    await swapTab.click();
    await expect(page).toHaveURL(/.*swap/);
  });

  test('clicks Stake Now and Select Wallet', async ({ page }) => {
    const stakeBtn = page.getByRole('button', { name: /Stake Now/i });
    await stakeBtn.waitFor({ state: 'visible' });
    await stakeBtn.click();

    const selectWalletBtn = page.getByRole('button', { name: /Select Wallet/i });
    await selectWalletBtn.waitFor({ state: 'visible' });
    await selectWalletBtn.click();

    const walletModal = page.getByText(/Connect Wallet/i, { exact: false });
    await expect(walletModal).toBeVisible();
  });

  test('simulates wallet connection via localStorage', async ({ page }) => {
    const stakeBtn = page.getByRole('button', { name: /Stake Now/i });
    await stakeBtn.waitFor({ state: 'visible' });
    await stakeBtn.click();

    const connectedText = page.locator('text=Connected');
    await expect(connectedText).toBeVisible();
  });
});
