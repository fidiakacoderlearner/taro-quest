import { execSync } from 'node:child_process';

/**
 * Bebaskan port yang dipakai E2E (API 5002, Vite 5174) dari proses lama.
 *
 * Alasan: Playwright menyalakan `webServer` SEBELUM `globalSetup`, jadi server
 * lama yang masih membaca `.env` versi sebelumnya bisa ikut terpakai
 * (`reuseExistingServer`). Bila `.env` sudah pindah database, test akan menulis
 * ke database yang salah. Script ini dijalankan lebih dulu (lihat `npm run e2e`)
 * supaya server E2E selalu dinyalakan ulang dengan `.env` terkini.
 */
const PORTS = [5002, 5174];

function pidsOnPortWin(port) {
  const out = execSync('netstat -ano -p tcp', { encoding: 'utf8' });
  const pids = new Set();
  for (const line of out.split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 5 || parts[3] !== 'LISTENING') continue;
    if (parts[1].endsWith(':' + port)) pids.add(parts[4]);
  }
  return [...pids];
}

function pidsOnPortPosix(port) {
  try {
    return execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' }).split(/\s+/).filter(Boolean);
  } catch {
    return [];
  }
}

function kill(pid) {
  try {
    if (process.platform === 'win32') execSync(`taskkill /PID ${pid} /F /T`, { stdio: 'ignore' });
    else process.kill(Number(pid), 'SIGKILL');
    return true;
  } catch {
    return false;
  }
}

let total = 0;
for (const port of PORTS) {
  const pids = process.platform === 'win32' ? pidsOnPortWin(port) : pidsOnPortPosix(port);
  if (!pids.length) {
    console.log(`[e2e] port ${port}: bebas`);
    continue;
  }
  for (const pid of pids) {
    const ok = kill(pid);
    console.log(`[e2e] port ${port}: PID ${pid} ${ok ? 'dimatikan' : 'GAGAL dimatikan'}`);
    if (ok) total++;
  }
}

if (total) {
  await new Promise((r) => setTimeout(r, 2000));
}
console.log(`[e2e] selesai membebaskan port (${total} proses dimatikan).`);
