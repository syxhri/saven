# Saven ⚡

> **Platform Dua Sisi untuk Joki Tugas & Layanan Akademik**  
> Didesain dengan perpaduan gaya **Modern Minimalism, Playful, dan Soft Neobrutalism** — bersih, berkarakter, responsif, dan nyaman di mata.

[![Framework](https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Styling](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Deploy](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## 🌟 Tentang Saven

**Saven** menghubungkan customer (pemesan jasa joki tugas) dengan penjoki terpercaya secara langsung tanpa hambatan:

- **Bagi Customer:**
  - **Pesan Instan Tanpa Perlu Bikin Akun** — Cukup masukkan nama, nomor WhatsApp, deskripsi tugas, dan deadline.
  - **Live Tracking & Real-Time Status** — Pantau perkembangan pengerjaan tugas secara langsung melalui kode unik (contoh: `OD1A2B3C`).
  - **QRIS Dinamis Otomatis** — Pembayaran praktis dengan QRIS yang otomatis meng-generate nominal sesuai harga yang ditentukan penjoki.
  - **Notifikasi Web Push** — Notifikasi real-time langsung di browser saat pesanan diterima, selesai dikerjakan, atau ada pengingat pembayaran.
  - **Unduh Struk & Hasil Aman** — Hasil tugas siap diunduh dengan proteksi auto-cleanup berkala demi privasi.

- **Bagi Penjoki (Penyedia Jasa):**
  - **Dashboard Manajemen Lengkap** — Kelola pesanan masuk: terima/tolak, atur harga, estimasi waktu, hingga upload file hasil tugas.
  - **QRIS Generator & Pengingat Bayar** — Fitur pengingat bayar otomatis via WhatsApp dan Web Push.
  - **Statistik & Laporan Finansial** — Rekapitulasi pendapatan, status lunas/belum lunas, dan pembagian kategori tugas.

---

## 🎨 Design System: Modern Playful Neobrutalism

Saven mengadopsi estetika unik yang menggabungkan:
1. **Modern Minimalism**: Kanvas luas, tipografi yang jelas dan bersih, ruang bernafas yang lega, serta warna latar belakang *warm off-white* (`#FAF9F5`) yang sangat nyaman di mata.
2. **Playful Geometric**: Sudut melengkung yang ramah (`rounded-2xl` & `rounded-xl`), pil-pil status berbentuk stiker, dan transisi interaktif.
3. **Soft Neobrutalism**: Garis solid 2px (`border-slate-900`) dipadukan dengan bayangan tegas (*hard offset shadow* `shadow-neo`) dan feedback fisik saat tombol ditekan.

---

## 🚀 Panduan Deploy ke Vercel (Lewat Website Vercel)

Saven sudah dioptimalkan dan siap 100% untuk langsung dideploy melalui website [Vercel](https://vercel.com).

### Langkah-langkah Deploy:

1. **Login ke Vercel**:
   - Buka [vercel.com](https://vercel.com) dan login menggunakan akun GitHub kamu.

2. **Import Repository**:
   - Klik tombol **"Add New..."** &rarr; pilih **"Project"**.
   - Pilih repository **`saven`** dari daftar GitHub kamu lalu klik **"Import"**.

3. **Pengaturan Project**:
   - **Framework Preset**: Vercel otomatis mendeteksi **Next.js**.
   - **Root Directory**: Biarkan default `./`.
   - **Build Command**: `next build` (default).
   - **Output Directory**: `.next` (default).

4. **Konfigurasi Environment Variables**:
   Pada bagian **"Environment Variables"**, tambahkan variabel berikut (bisa dilihat juga di file `.env.example`):

   | Nama Variabel | Keterangan / Contoh Nilai |
   |---|---|
   | `APP_URL` | URL domain Vercel kamu (contoh: `https://saven.vercel.app`) |
   | `JWT_SECRET` | String acak yang aman untuk token autentikasi penjoki |
   | `POSTGRES_URL` | Connection string PostgreSQL (dari Supabase / Neon / dsb) |
   | `SUPABASE_URL` | URL project Supabase kamu |
   | `SUPABASE_SERVICE_KEY` | Service role key Supabase |
   | `SUPABASE_BUCKET` | Nama bucket storage file tugas (contoh: `order-results`) |
   | `VAPID_PUBLIC_KEY` | Public key untuk Web Push Notification |
   | `VAPID_PRIVATE_KEY` | Private key untuk Web Push Notification |
   | `VAPID_MAILTO` | Email kontak VAPID (contoh: `mailto:admin@domain.com`) |
   | `KV_REST_API_URL` | REST API URL dari Upstash Redis |
   | `KV_REST_API_TOKEN` | Token dari Upstash Redis |
   | `CRON_SECRET` | Secret token untuk mengamankan Vercel Cron jobs |

5. **Deploy!**:
   - Klik tombol **"Deploy"**.
   - Tunggu proses build selesai (~1-2 menit).
   - Website Saven kamu langsung live dan siap digunakan!

> 💡 **Fitur Vercel Cron Otomatis**:  
> File `vercel.json` telah dikonfigurasi otomatis untuk menjalankan tugas cron berkala:
> - `/api/cron/cleanup-files`: Membersihkan file unduhan kedaluwarsa setiap 5 menit.
> - `/api/cron/payment-reminder`: Mengirim notifikasi pengingat pembayaran setiap 30 menit.

---

## 💻 Menjalankan di Komputer Lokal (Local Development)

### 1. Clone & Masuk Direktori
```bash
git clone https://github.com/syxhri/saven.git
cd saven
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Buat File Environment
Salin template konfigurasi:
```bash
cp .env.example .env
```
Isi nilai-nilai variabel di dalam `.env` sesuai kredensial database dan layanan kamu.

### 4. Jalankan Server Dev
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 📂 Struktur Proyek

```
saven/
├── app/                  # Next.js 14 App Router
│   ├── api/              # REST API & Cron Webhooks
│   ├── book/             # Halaman Pemesanan Joki (Customer)
│   ├── track/            # Halaman Tracking Real-Time & Download Struk
│   ├── orders/           # Dashboard Penjoki (List Orderan)
│   ├── order/[id]/       # Detail Orderan & Aksi Penjoki
│   ├── profile/          # Profil Penjoki & Pengaturan QRIS
│   ├── layout.js         # Root Layout & Theme Provider
│   └── page.js           # Landing Page Saven
├── components/           # Komponen UI (Navbar, Struk, Badge, Form)
├── lib/                  # Helper Database, Autentikasi, Notifikasi, QRIS
├── public/               # Logo SVG, Favicon, Service Worker
│   └── images/           # Logo Saven (Mode Normal, Dark, Flat)
├── styles/               # Tailwind & Global Styles
└── vercel.json           # Konfigurasi Vercel Crons
```

---

## 📄 Lisensi

Didistribusikan di bawah lisensi MIT. Dibuat dengan dedikasi oleh [@syxhri](https://github.com/syxhri).
