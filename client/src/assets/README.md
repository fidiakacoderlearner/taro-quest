# Aset / Assets

Taruh semua gambar dan ilustrasi kamu di folder ini. Nama file menentukan di mana
gambar dipakai (sistem otomatis memakainya kalau file ada):

| Nama file           | Dipakai untuk                          |
| ------------------- | -------------------------------------- |
| `bu-aza.webp`    | Avatar Bu Aza                       |
| `bu-zia.webp`    | Avatar Bu Zia                       |
| `peeling-machine.webp` | Ilustrasi mesin pengupas (label "Peeling Machine") |
| `washing-machine.webp` | Ilustrasi mesin pencuci (label "Washing Machine")  |
| `taro.webp`      | Ilustrasi talas: diagram alur eksplorasi, ikon **3 kartu utama** (Tentang/Eksplorasi/Evaluasi), hero landing, dan sumber favicon |
| `money-gross.webp`  | Ikon pendapatan kotor (diagram alur uang) |
| `money-discount.webp` | Ikon diskon (diagram alur uang) |
| `money-retribution.webp` | Ikon biaya retribusi (diagram alur uang) |
| `logo-kemendiktisaintek.webp` | Logo sponsor Kemendiktisaintek |
| `logo-unri.webp` | Logo sponsor UNRI (Universitas Riau) |
| `logo-dmgc.webp` | Logo sponsor DMGC |
| `login-bg.webp`     | Latar belakang halaman login & landing page (dirender buram + lapisan ungu oleh `PageBackground.jsx`) |

Favicon (di folder `client/public/`, bukan di sini):

| Nama file | Dipakai untuk |
| --------- | ------------- |
| `favicon.webp` | Favicon utama (tab browser) |
| `favicon-32.png` | Favicon 32×32 |
| `apple-touch-icon.png` | Ikon Apple touch (perangkat iOS) |

Catatan:
- `bu-aza.webp`, `bu-zia.webp`, dan `taro.webp` juga tampil di **hero landing
  page** (halaman publik sebelum login).
- Format yang didukung: `.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`, `.gif`, `.avif`.
- Browser memilih urutan **AVIF → WebP → PNG**, jadi taruh versi WebP untuk
  kompresi terbaik; simpan file asli di tempat aman di luar repo (folder `raw/`
  tidak ikut di-push).
- Kalau file tidak ada, aplikasi otomatis memakai placeholder emoji/gradasi, jadi
  website tetap berjalan dengan atau tanpa gambar.
- Ganti nama file sesuai nama aset yang kamu buat (cukup ikuti tabel di atas).

## Tentang file asli (resolusi penuh)

Semua aset disajikan sebagai `.webp` (kualitas 85–95%, **resolusi sama** dengan
aslinya). File PNG/SVG asli resolusi penuh disimpan di luar repo
(`taro-raw-backup.zip`) agar tidak ikut di-bundle maupun di-push. Jika perlu
mengedit aset, konversi ulang PNG → WebP dengan tool online (mis.
https://squoosh.app) kualitas 85–95% dan taruh hasilnya di folder ini.

> Dukungan gambar untuk ilustrasi mesin akan otomatis muncul begitu kamu
> menaruh `peeling-machine.webp` / `washing-machine.webp` — kode tempatnya sudah
> siap di `src/pages/Exploration.jsx` (`MachineCard`).
>
> Logo 3 card utama (Tentang/Eksplorasi/Evaluasi) memakai `taro.webp` yang sama
> (`asset: 'taro'` di `src/pages/Home.jsx` & `src/pages/Landing.jsx`), jadi tidak
> ada file `card-*.webp` lagi.
>
> Popup umpan balik benar/salah **tidak memakai gambar** — `QuizFeedbackModal.jsx`
> merender ikon SVG `CheckIcon` (hijau) / `CloseIcon` (merah) dari
> `src/components/icons.jsx`, jadi tidak ada file `popup-*.webp`.

## Audio

File suara ditaruh di subfolder `audio/` — lihat [`audio/README.md`](audio/README.md).
