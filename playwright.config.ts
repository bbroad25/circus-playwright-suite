import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 60000,
  expect: { timeout: 10000 },
  testDir: './tests',
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [['html', { outputFolder: 'playwright-report', open: 'never' }]],
});
