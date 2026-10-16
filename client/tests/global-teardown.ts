import { spawnSync } from 'node:child_process';
import path from 'node:path';

/**
 * Dijalankan Playwright setiap selesai test (lulus/gagal): bersihkan data uji
 * (user `*@test.com`, kelas `Test %`) dari database lewat server/clean-db.js.
 * Kegagalan pembersihan hanya dicetak sebagai peringatan — tidak menggagalkan run.
 */
export default async function globalTeardown() {
  try {
    const cwd = path.resolve(process.cwd(), '../server');
    const res = spawnSync(process.execPath, ['--env-file=../.env', 'clean-db.js'], {
      cwd,
      encoding: 'utf8',
      timeout: 60000,
    });
    const out = `${res.stdout || ''}${res.stderr || ''}`.trim();
    if (out) console.log(out);
    if (res.status !== 0) console.warn('[db:clean] selesai dengan status ' + res.status);
  } catch (err) {
    console.warn('[db:clean] gagal dijalankan:', err.message);
  }
}
