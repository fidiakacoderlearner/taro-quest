import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/specs',
  globalSetup: './tests/global-setup',
  globalTeardown: './tests/global-teardown',
  timeout: 120000,
  retries: 1,
  use: {
    baseURL: 'http://localhost:5174',
    headless: true,
    viewport: { width: 1440, height: 900 },
    locale: 'id-ID',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
  },
  webServer: [
    {
      command: 'cd .. && npm run start',
      port: 5002,
      // Sengaja false: server API membaca .env (database) saat start. Bila server
      // lama dibiarkan terpakai, test bisa menulis ke database yang salah
      // (mis. produksi). Lebih baik gagal keras — jalankan `npm run e2e` di root
      // yang membebaskan port dulu.
      reuseExistingServer: false,
      timeout: 30000,
    },
    {
      // Cukup Vite: server API sudah disediakan entri di atas, dan
      // vite.config.js sudah mem-proxy /api ke port 5002. Bila memakai
      // `cd .. && npm run dev`, server API kedua ikut dinyalakan di port
      // yang sama sehingga selalu gagal EADDRINUSE.
      command: 'npm run dev',
      port: 5174,
      reuseExistingServer: true,
      timeout: 30000,
    },
  ],
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  reporter: [['list'], ['html', { open: 'never' }]],
});
