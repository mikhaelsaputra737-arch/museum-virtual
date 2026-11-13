# 🏛️ Museum Sejarah Gen Z — Perang Dunia I, Perang Dunia II & Sejarah Panjang Indonesia

Website museum virtual dengan **proyeksi 3D** (galeri kartu berputar, timeline interaktif, kartu efek tilt), dibangun dengan:

- **Next.js 16** (App Router) + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (New York style) + **lucide-react**
- **Framer Motion** (animasi scroll & transisi)
- **Prisma ORM** + **SQLite** (konten museum tersimpan di database & bisa diedit lewat Panel Kurator)

---

## 🚀 Cara Menjalankan di Komputer Anda

### Prasyarat

| Wajib | Keterangan |
|---|---|
| [Node.js 20+](https://nodejs.org) | Versi 20.9 atau lebih baru (disarankan Node 22 LTS) |
| [VS Code](https://code.visualstudio.com) | Editor kode |
| Ekstensi VS Code | **ESLint** (dbaeumer.vscode-eslint) & **Tailwind CSS IntelliSense** (bradlc.vscode-tailwindcss) |

> 💡 Alternatif: Anda juga bisa memakai [Bun](https://bun.sh) sebagai pengganti npm (lebih cepat).

### Langkah-langkah

1. **Ekstrak** file ZIP ini ke sebuah folder, lalu buka di VS Code:
   **File → Open Folder…** → pilih folder hasil ekstrak.

2. Buka terminal di VS Code (`` Ctrl+` `` / **Terminal → New Terminal**), lalu install dependencies:

   ```bash
   npm install
   ```

   (pengguna Bun: `bun install`)

3. Generate Prisma Client:

   ```bash
   npx prisma generate
   ```

   (pengguna Bun: `bunx prisma generate`)

4. Jalankan server development:

   ```bash
   npm run dev
   ```

   (pengguna Bun: `bun run dev`)

5. Buka **http://localhost:3000** di browser. Selesai! 🎉

> 📦 Database SQLite **sudah termasuk** di `db/custom.db` berisi seluruh konten museum (artefak, lini masa, era sejarah). Tidak perlu setup tambahan.

---

## 🗂️ Struktur Proyek & Panduan Edit

| Ingin mengubah… | File yang diedit |
|---|---|
| **Teks konten museum** (judul & deskripsi artefak, peristiwa, era) | `src/data/museum.ts` |
| **Susunan halaman utama** (urutan section) | `src/app/page.tsx` |
| **Judul tab browser & SEO** | `src/app/layout.tsx` |
| **Hero / bagian pembuka** | `src/components/museum/museum-hero.tsx` |
| **Galeri 3D berputar** (kecepatan, jumlah kartu, radius) | `src/components/museum/carousel-3d.tsx` |
| **Kartu efek 3D tilt** | `src/components/museum/tilt-card.tsx` |
| **Timeline interaktif** | `src/components/museum/timeline-3d.tsx` |
| **Ruang pamer perang (PD1/PD2)** | `src/components/museum/hall-section.tsx` |
| **Ruang sejarah Indonesia** | `src/components/museum/indonesia-hall.tsx` / `era-showcase.tsx` |
| **Dialog detail artefak** | `src/components/museum/artifact-dialog.tsx` |
| **Navbar / Footer** | `src/components/museum/museum-navbar.tsx` / `museum-footer.tsx` |
| **Panel Kurator** (form tambah/edit/hapus item) | `src/components/museum/curator/` |
| **Sumber referensi** | `src/components/museum/sources-section.tsx` |
| **Warna & tema global** | `src/app/globals.css` |
| **Skema database** | `prisma/schema.prisma` |
| **API konten museum** | `src/app/api/museum/` |

Setiap kali Anda menekan **Ctrl+S**, browser otomatis me-refresh (hot reload) dan menampilkan perubahan dalam hitungan detik. ✨

---

## 🖼️ Mengganti Gambar

Semua gambar ada di folder **`public/museum/`**.

- Cara termudah: taruh gambar baru (`.png`/`.jpg`) dengan **nama file yang sama** untuk mengganti gambar lama.
- Atau ubah path gambar di `src/data/museum.ts` / lewat Panel Kurator di website.

---

## 🗃️ Database (Prisma + SQLite)

- File database: **`db/custom.db`**
- Skema: **`prisma/schema.prisma`** (model: `Artifact`, `TimelineEvent`, `Era`)
- Setelah mengubah skema, jalankan:

  ```bash
  npm run db:push
  npx prisma generate
  ```

- Mengisi ulang data awal (seed):

  ```bash
  bun scripts/seed-museum.ts        # pengguna Bun
  npx tsx scripts/seed-museum.ts    # pengguna npm
  ```

---

## ✏️ Panel Kurator (Edit Langsung dari Website)

Klik ikon Mode Kurator di website, lalu masuk memakai kata sandi server untuk:

- ➕ Menambah artefak / peristiwa / era baru
- ✏️ Mengubah judul, deskripsi, tahun, gambar
- 🗑️ Menghapus item
- 🖥️ **Mengunggah gambar dari komputer** (PNG/JPG/WEBP/GIF, maks 5 MB) — lewat tombol "Pilih File dari PC"
- 🖼️ Memilih gambar galeri atau generate gambar AI

Semua perubahan tersimpan otomatis ke `db/custom.db`. Untuk mengaktifkannya, atur `CURATOR_PASSWORD` (minimal 16 karakter) dan `CURATOR_SESSION_SECRET` (minimal 32 karakter acak) di environment server. Tanpa konfigurasi ini, perubahan konten, unggahan, dan pembuatan gambar dinonaktifkan.

---

## 🌐 Menayangkan Website di VPS

Proyek ini memakai SQLite dan menyimpan gambar yang diunggah di disk, sehingga gunakan VPS dengan Docker dan penyimpanan persisten. Compose menjalankan Next.js di belakang Caddy; HTTPS akan dibuat otomatis setelah domain diarahkan ke alamat IP VPS.

1. Siapkan VPS Linux dengan Docker Engine dan Docker Compose, lalu arahkan DNS domain ke IP VPS (rekam A/AAAA).
2. Salin seluruh proyek ke VPS, termasuk `db/custom.db` dan folder `public/museum`. Jangan menyalin `.env` lokal.
3. Dari folder proyek, buat file konfigurasi:

   ```bash
   cp env.production.example .env.production
   ```

   Isi `SITE_DOMAIN` dengan domain Anda. Buat nilai rahasia terpisah untuk `CURATOR_PASSWORD` dan `CURATOR_SESSION_SECRET` (gunakan `openssl rand -base64 32` untuk masing-masing), lalu simpan hanya di `.env.production`.
4. Pastikan Docker dapat menulis database dan folder unggahan:

   ```bash
   mkdir -p public/museum/uploads public/museum/generated
   sudo chown -R 1001:1001 db public/museum/uploads public/museum/generated
   ```

5. Bangun dan jalankan:

   ```bash
   docker compose --env-file .env.production up -d --build
   ```

6. Buka `https://<domain-anda>`. Ikon Mode Kurator meminta kata sandi yang sudah ditetapkan.

SQLite dan gambar unggahan dipasang sebagai volume agar tetap ada setelah container diperbarui. Cadangkan folder `db` serta folder `public/museum/uploads` dan `public/museum/generated` secara berkala. Jangan mengubah `DATABASE_URL` ke penyimpanan sementara container.

> Situs belum online sampai VPS dan domain tersedia serta perintah di atas dijalankan. Jangan bagikan file `.env.production` atau rahasianya.

---

## 🤖 Fitur AI (Opsional)

Fitur **generate gambar AI** (`src/app/api/museum/generate-image`) membutuhkan kredensial Z.ai SDK. Tanpa kredensial tersebut, **seluruh fitur lain tetap berjalan normal** — Anda tetap bisa memakai gambar yang sudah tersedia di `public/museum/`.

---

## 🧰 Perintah Penting

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Jalankan server development (http://localhost:3000) |
| `npm run lint` | Cek kualitas kode (ESLint) |
| `npm run build` | Build versi production |
| `npm run db:push` | Sinkronkan skema Prisma ke database |
| `npm run db:generate` | Generate Prisma Client |

---

## 🛠️ Troubleshooting

| Masalah | Solusi |
|---|---|
| Port 3000 sudah dipakai | `npm run dev -- -p 3001` lalu buka http://localhost:3001 |
| Error database / tabel kosong | Pastikan `.env` berisi `DATABASE_URL=file:../db/custom.db`, lalu `npx prisma generate && npm run db:push` |
| Error `prisma` tidak dikenali | Jalankan `npx prisma generate` setelah `npm install` |
| Gambar tidak muncul | Cek nama file di `public/museum/` sama dengan yang dipakai di data/konten |
| Perubahan tidak tampil | Hard-refresh browser (`Ctrl+Shift+R`), cek terminal untuk error |

---

## 📄 Lisensi & Kredit

Konten disusun untuk keperluan edukasi sejarah. Gambar merupakan ilustrasi hasil generasi AI. Selamat belajar & menjelajah sejarah! 🕊️


---

## 🎮 Tampilan "Ruang Utama" (hero interaktif)

Halaman depan kini berupa aula museum 3D yang bisa dijelajahi:

| Kontrol | Fungsi |
|---|---|
| Joystick (kiri bawah) atau **A / D** (**← / →**) | Berjalan ke kiri / kanan |
| **W / S** | Melangkah maju / mundur di lantai aula |
| **E** (atau tombol *Masuk*) | Masuk ke ruang pamer saat avatar berada di depan dinding |
| Dok bawah | Beranda · Pameran · Koleksi · Kuis · Profil (Profil membuka Mode Kurator) |

File terkait: `src/components/museum/museum-hero.tsx` (logika), `src/components/museum/scene/*` (gambar adegan SVG),
`src/app/museum-scene.css` (seluruh gaya adegan + HUD), `museum-dock.tsx`, `museum-navbar.tsx`.
Font baru (Oswald, Permanent Marker) dimuat lewat `next/font/google` di `layout.tsx`.
