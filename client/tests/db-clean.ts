import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/** Cari direktori root proyek (yang punya server/clean-db.js), apa pun cwd-nya. */
function findRoot() {
  const candidates = [
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd(), '..', '..'),
    process.cwd(),
  ];
  for (const c of candidates) {
    if (existsSync(path.join(c, 'server', 'clean-db.js'))) return c;
  }
  return path.resolve(process.cwd(), '..');
}

/** Host database yang akan dipakai E2E (dibaca dari .env, tanpa kredensial). */
export function dbHost() {
  try {
    const env = readFileSync(path.join(findRoot(), '.env'), 'utf8');
    const line = env.split(/\r?\n/).find((l) => l.trim().startsWith('DATABASE_URL='));
    if (!line) return '(DATABASE_URL tidak ada di .env)';
    const url = line.slice(line.indexOf('=') + 1).trim();
    return url.split('@')[1]?.split('/')[0] ?? '(host tidak terbaca)';
  } catch {
    return '(gagal membaca .env)';
  }
}

/**
 * Hapus data uji (user `*@test.com`, kelas `Test %`) lewat server/clean-db.js.
 * Dipakai sebelum (globalSetup) dan sesudah (globalTeardown) run E2E.
 */
export function cleanTestData() {
  try {
    const res = spawnSync(process.execPath, ['--env-file=../.env', 'clean-db.js'], {
      cwd: path.join(findRoot(), 'server'),
      encoding: 'utf8',
      timeout: 60000,
    });
    const out = `${res.stdout ?? ''}${res.stderr ?? ''}`.trim();
    const lines = out.split(/\r?\n/).filter((l) => l.includes('[db:clean]'));
    if (lines.length) console.log(lines.join('\n'));
    else if (out) console.log(out);
    if (res.status !== 0) console.warn('[db:clean] keluar dengan status ' + res.status);
  } catch (err) {
    console.warn('[db:clean] gagal dijalankan: ' + (err as Error).message);
  }
}
