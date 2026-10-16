import { cleanTestData } from './db-clean';

/**
 * Setiap run E2E selesai (lulus maupun gagal), hapus data uji
 * (user `*@test.com`, kelas `Test %`) agar database tidak menumpuk sampah.
 * Kegagalan hanya dicetak sebagai peringatan — tidak menggagalkan run.
 */
export default async function globalTeardown() {
  cleanTestData();
}
