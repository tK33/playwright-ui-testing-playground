import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 60 * 1000, // Her test için varsayılan zaman aşımı (60sn)
  expect: {
    timeout: 10 * 1000, // Assertion'lar için bekleme süresini 5sn'den 10sn'ye çıkardık
  },
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* CI ortamında 2 worker ile paralel çalıştırarak hızı optimize ediyoruz */
  workers: process.env.CI ? 1 : 2,
  /* CI üzerinde raporun otomatik açılıp süreci kilitlemesini önlüyoruz */
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    actionTimeout: 15 * 1000, // Aksiyon zaman aşımı (15sn)
    navigationTimeout: 30 * 1000, // Sayfa yükleme zaman aşımı (30sn)
    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions: {
      /* slowMo sadece yerel koşumda çalışır, CI'da sıfırlanır */
      slowMo: process.env.CI ? 0 : 200,
    },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});