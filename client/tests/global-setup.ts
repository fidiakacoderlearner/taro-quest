import { cleanTestData, dbHost } from './db-clean';

/**
 * Sebelum test jalan:
 * 1. Cetak host database yang akan ditulis (dibaca dari `.env`) supaya selalu
 *    sadar E2E menulis ke database mana.
 * 2. Bersihkan sisa data uji dari run sebelumnya yang mungkin mati mendadak.
 */
export default async function globalSetup() {
  const host = dbHost();
  console.log('[e2e] DATABASE_URL host: ' + host);
  if (!/localhost|127\.0\.0\.1/.test(host)) {
    console.log('[e2e] PERINGATAN: database remote. E2E akan MENULIS lalu MENGHAPUS data uji di sini.');
  }
  cleanTestData();
}
