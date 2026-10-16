# Setup Database Neon (Taro Quest)

Panduan singkat membuat database PostgreSQL baru (gratis) di Neon untuk project
ini. Database **terpisah** dari project Cassava Village.

## 1. Buat akun & project Neon

1. Buka https://neon.tech lalu **Sign up** (bisa pakai akun GitHub/Google).
2. Klik **Create project**.
3. Isi:
   - **Project name**: `taro-quest`
   - **Database name**: `taro_quest`
   - **Region**: **Asia Pacific (Singapore)** — `ap-southeast-1` (dekat dengan
     Vercel region `sin1`).
4. Klik **Create project**.

## 2. Ambil connection string (pooled)

1. Buka **Dashboard → Connection Details**.
2. Pastikan **Connection pooling** aktif (tombol/opsi **Pooled connection**).
3. Pilih **Node.js** atau tab **Connection string**.
4. Salin string yang berbentuk seperti:

   ```
   postgresql://USER:PASSWORD@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/taro_quest?sslmode=require
   ```

5. Tambahkan `&channel_binding=require` bila diminta. Untuk menghilangkan
   peringatan SSL `pg` v8.23+, pastikan query berisi `sslmode=verify-full`
   (ganti `sslmode=require` bila perlu).

## 3. Isi file `.env`

Edit `.env` di root project Taro Quest:

```
DATABASE_URL=postgresql://USER:PASSWORD@ep-xxxx-pooler.ap-southeast-1.aws.neon.tech/taro_quest?sslmode=verify-full
JWT_SECRET=<sudah terisi otomatis>
```

> Jangan pernah commit `.env`. File `.env` sudah masuk `.gitignore`.

## 4. Inisialisasi schema + seed

Dari root project:

```bash
npm run init-db
```

Perintah ini akan membuat seluruh tabel, lalu mengisi data demo:

| Peran | Email | Password |
| ----- | ----- | -------- |
| Guru  | `teacher@taroquest.com` | `teacher123` |
| Siswa | `student@taroquest.com` | `student123` |
| Siswa | `budi@taroquest.com` | `budi123` |
| Siswa | `siti@taroquest.com` | `siti123` |

Kelas demo: **XI-A** dengan kode **`DEMOAB`**.

## 5. Jalankan

```bash
npm run dev
```

- Server API: http://localhost:5002
- Web (client): http://localhost:5174

## 6. Deploy ke Vercel (opsional)

1. `npx vercel login`
2. `npx vercel env add DATABASE_URL production` (paste connection string pooled)
3. `npx vercel env add JWT_SECRET production` (paste secret)
4. `npx vercel --prod`
5. Setelah deploy, jalankan sekali dari lokal: `npm run init-db` (dengan
   `DATABASE_URL` Neon yang sama di `.env`) untuk memastikan schema terbaru.
