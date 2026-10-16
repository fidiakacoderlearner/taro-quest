import { db } from './db.js';

async function clean() {
  const users = await db
    .prepare(`DELETE FROM users WHERE email LIKE '%@test.com' RETURNING id`)
    .all();
  const classes = await db
    .prepare(`DELETE FROM classes WHERE name LIKE 'Test %' RETURNING id`)
    .all();
  const sisaUser = await db.prepare(`SELECT count(*)::int AS n FROM users`).get();
  const sisaKelas = await db.prepare(`SELECT count(*)::int AS n FROM classes`).get();
  console.log(
    `[db:clean] Dihapus: ${users.length} user uji, ${classes.length} kelas uji. ` +
      `Sisa: ${sisaUser.n} user, ${sisaKelas.n} kelas.`
  );
}

clean()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[db:clean] GAGAL:', err.message);
    process.exit(1);
  });
