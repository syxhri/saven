export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth.js";
import QuickTrackBar from "@/components/QuickTrackBar";
import LogoIcon from "@/components/LogoIcon";

export const metadata = {
  title: "Saven ⚡ Platform Joki Tugas Modern & Transparan",
  description:
    "Platform joki tugas dua sisi paling terstruktur. Customer pesan tanpa akun, pantau tracking real-time, bayar dengan QRIS dinamis, dan unduh hasil tugas aman.",
  openGraph: {
    title: "Saven ⚡ Platform Joki Tugas Modern",
    description:
      "Tugas beres tanpa ribet: Tanpa akun, QRIS dinamis otomatis, tracking real-time, dan notifikasi langsung.",
    url: "/",
    siteName: "Saven",
    type: "website",
  },
};

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-16 py-6 sm:py-10 max-w-5xl mx-auto px-4">
      {/* ─── Hero Section: Asymmetric Split Grid ───────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border-3 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-10 md:p-12 shadow-neo-md dark:shadow-neo-dark-md animate-fade-in-up">
        {/* Soft background aura circles */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Headline & Action Cluster */}
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 dark:border-slate-700 bg-amber-300 dark:bg-amber-400/90 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-slate-950 shadow-neo-sm">
              <span className="h-2 w-2 rounded-full bg-slate-900 animate-ping" />
              <span>Saven v0.2 • Joki Tugas Modern</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Tugas Beres, Nilai Terjaga,{" "}
              <span className="inline-block rounded-xl border-2 border-slate-900 dark:border-slate-600 bg-primary-100 dark:bg-primary-950/70 px-2.5 py-0.5 text-primary-700 dark:text-primary-300 shadow-neo-sm">
                Tanpa Bikin Akun.
              </span>
            </h1>

            <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              Platform layanan akademik modern dengan alur kerja dua sisi yang transparan. Customer cukup isi form &amp; WhatsApp, pantau progres lewat halaman tracking real-time, bayar dengan QRIS dinamis, dan unduh file hasil tugas secara privat.
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/book"
                className="btn btn-primary text-sm sm:text-base py-3 px-6 font-black shadow-neo"
              >
                <span>Pesan Joki Tugas</span>
                <span>&rarr;</span>
              </Link>

              <Link
                href="/track"
                className="btn btn-secondary text-sm sm:text-base py-3 px-5 font-black shadow-neo"
              >
                <span>Lacak Pesanan</span>
              </Link>

              {user ? (
                <Link
                  href="/orders"
                  className="btn btn-secondary text-sm sm:text-base py-3 px-5 font-black text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400 shadow-neo"
                >
                  <span>Dashboard Penjoki ⚡</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="btn btn-secondary text-sm sm:text-base py-3 px-5 font-bold shadow-neo"
                >
                  <span>Masuk Penjoki</span>
                </Link>
              )}
            </div>

            {/* Trust Chips */}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-900/15 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Tanpa Registrasi Rumit
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-900/15 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                Live Status &amp; Push Notif
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-900/15 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                QRIS Otomatis &amp; Struk Digital
              </span>
            </div>
          </div>

          {/* Right Column: Live Interactive Tracking Mockup Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border-3 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-950 p-5 shadow-neo-lg dark:shadow-neo-dark-lg space-y-4">
              {/* Mockup Card Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-900/15 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-slate-900 bg-rose-400" />
                  <span className="h-3 w-3 rounded-full border-2 border-slate-900 bg-amber-400" />
                  <span className="h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
                </div>
                <div className="rounded-full border border-slate-900/20 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">
                  Tracking Preview
                </div>
              </div>

              {/* Order Identifier */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">Kode Pesanan</span>
                  <span className="rounded-md border border-slate-900/30 bg-primary-100 dark:bg-primary-950/70 px-2 py-0.5 text-xs font-black text-primary-700 dark:text-primary-300 font-mono">
                    #SVN-2026-X81
                  </span>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-white">
                  Makalah Metode Penelitian &amp; Analisis Data
                </p>
              </div>

              {/* Live Status Pill */}
              <div className="flex items-center justify-between rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-emerald-50 dark:bg-emerald-950/30 p-2.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                    Sedang Dikerjakan Penjoki
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                  Sisa 4 Jam
                </span>
              </div>

              {/* Mini Step Flow */}
              <div className="space-y-2 py-1 text-xs font-semibold">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white font-bold">✓</span>
                  <span>Form Terkirim &amp; Terverifikasi</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white font-bold">✓</span>
                  <span>Pembayaran QRIS Terkonfirmasi Lunas</span>
                </div>
                <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-black">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary-600 bg-primary-100 text-[10px]">●</span>
                  <span>Proses Pengerjaan Tugas (Aktif)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[10px]">○</span>
                  <span>Unduh File Hasil Tugas</span>
                </div>
              </div>

              {/* Receipt Preview Snippet */}
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-2.5 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Struk Pembayaran</p>
                  <p className="font-black text-slate-900 dark:text-white">Rp 75.000 (Lunas)</p>
                </div>
                <span className="rounded-lg border border-slate-900/20 bg-white dark:bg-slate-800 px-2 py-1 text-[10px] font-bold text-primary-600 dark:text-primary-400 shadow-neo-sm">
                  Struk Digital Siap Unduh
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Interactive Quick-Track Ribbon ─────────────────────────── */}
      <section className="rounded-3xl border-3 border-slate-900 dark:border-slate-700 bg-primary-600 p-6 sm:p-8 shadow-neo-md dark:shadow-neo-dark-md text-white space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Sudah Punya Pesanan? Lacak Sekarang
          </h2>
          <p className="text-xs sm:text-sm font-medium text-primary-100">
            Masukkan kode unik pesanan kamu untuk memantau status pengerjaan atau mengunduh struk dan file hasil.
          </p>
        </div>

        <QuickTrackBar />
      </section>

      {/* ─── Modern Bento Grid Architecture (3 Pillars) ────────────── */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-0.5 text-xs font-black uppercase text-slate-900 dark:text-white shadow-neo-sm">
            ✨ Fitur Unggulan
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Kenapa Menggunakan Saven?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
            Didesain khusus untuk mempermudah transaksi joki akademik tanpa drama, cepat, dan transparan.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Bento Card 1: Zero Account */}
          <div className="rounded-3xl border-3 border-slate-900 dark:border-slate-700 bg-violet-50/70 dark:bg-violet-950/20 p-6 space-y-4 shadow-neo dark:shadow-neo-dark hover:-translate-y-1 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-900 bg-violet-300 dark:bg-violet-800 text-violet-950 dark:text-violet-100 shadow-neo-sm font-black text-xl">
              ⚡
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Pesan Tanpa Akun
            </h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              Tidak perlu mengingat password atau registrasi rumit. Mahasiswa cukup memasukkan Nama &amp; WhatsApp, lalu sistem langsung menghasilkan halaman tracking privat.
            </p>
          </div>

          {/* Bento Card 2: QRIS & Struk */}
          <div className="rounded-3xl border-3 border-slate-900 dark:border-slate-700 bg-amber-50/70 dark:bg-amber-950/20 p-6 space-y-4 shadow-neo dark:shadow-neo-dark hover:-translate-y-1 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-300 dark:bg-amber-800 text-amber-950 dark:text-amber-100 shadow-neo-sm font-black text-xl">
              💳
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              QRIS Dinamis Otomatis
            </h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              QRIS langsung memuat nominal pesanan yang disepakati. Setelah lunas, pelanggan dapat mengunduh struk digital resmi berformat PNG/PDF dengan detail lengkap.
            </p>
          </div>

          {/* Bento Card 3: Secure Delivery */}
          <div className="rounded-3xl border-3 border-slate-900 dark:border-slate-700 bg-sky-50/70 dark:bg-sky-950/20 p-6 space-y-4 shadow-neo dark:shadow-neo-dark hover:-translate-y-1 transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-slate-900 bg-sky-300 dark:bg-sky-800 text-sky-950 dark:text-sky-100 shadow-neo-sm font-black text-xl">
              🛡️
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Privasi &amp; Auto-Expiry
            </h3>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
              File tugas disimpan di Cloud Storage terenkripsi dan otomatis dibersihkan oleh cron job setelah masa unduh selesai untuk menjaga kerahasiaan akademikmu.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Workflow: 4-Step Interactive Pipeline ──────────────────── */}
      <section className="rounded-3xl border-3 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-neo-md dark:shadow-neo-dark-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-900 dark:border-slate-700 bg-primary-100 dark:bg-primary-950/60 px-3 py-0.5 text-xs font-black uppercase text-primary-800 dark:text-primary-300 shadow-neo-sm">
            Alur Mudah
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Bagaimana Saven Bekerja?
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Step 1 */}
          <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-5 space-y-3 shadow-neo-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-slate-900 bg-primary-600 text-white font-black text-xs shadow-neo-sm">
              01
            </span>
            <h4 className="font-black text-slate-900 dark:text-white text-sm">
              Kirim Bahan Tugas
            </h4>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Pilih kategori jokian, isi instruksi, tanggal deadline, dan lampirkan file tugas.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-5 space-y-3 shadow-neo-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-400 text-slate-950 font-black text-xs shadow-neo-sm">
              02
            </span>
            <h4 className="font-black text-slate-900 dark:text-white text-sm">
              Deal Biaya &amp; QRIS
            </h4>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Penjoki mengkonfirmasi harga dan estimasi. Scan QRIS dinamis langsung dari layar.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-5 space-y-3 shadow-neo-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-slate-900 bg-sky-400 text-slate-950 font-black text-xs shadow-neo-sm">
              03
            </span>
            <h4 className="font-black text-slate-900 dark:text-white text-sm">
              Pantau Real-time
            </h4>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Cek progres pengerjaan di link tracking tanpa harus terus-menerus chat penjoki.
            </p>
          </div>

          {/* Step 4 */}
          <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-5 space-y-3 shadow-neo-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-slate-900 bg-emerald-400 text-slate-950 font-black text-xs shadow-neo-sm">
              04
            </span>
            <h4 className="font-black text-slate-900 dark:text-white text-sm">
              Unduh Hasil Tugas
            </h4>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
              Setelah pembayaran lunas dan tugas selesai, download file hasil pekerjaan secara instan.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Role Split: Dua Sisi Platform ─────────────────────────── */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* Sisi Mahasiswa */}
        <div className="rounded-3xl border-3 border-slate-900 dark:border-slate-700 bg-amber-50/60 dark:bg-amber-950/20 p-6 sm:p-8 space-y-5 shadow-neo dark:shadow-neo-dark">
          <div className="flex items-center gap-2">
            <span className="rounded-lg border-2 border-slate-900 bg-amber-300 px-2.5 py-0.5 text-xs font-black text-slate-950 shadow-neo-sm">
              UNTUK PELAJAR &amp; MAHASISWA
            </span>
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Deadline Menumpuk? Jangan Panik.
          </h3>

          <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Pesan joki tugas tanpa perlu ribet registrasi akun</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Bayar praktis menggunakan QRIS (BCA, Mandiri, GoPay, OVO, Dana)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Simpan struk pembayaran digital resmi kapan saja</span>
            </li>
          </ul>

          <Link
            href="/book"
            className="btn btn-secondary w-full py-2.5 text-xs sm:text-sm font-black shadow-neo"
          >
            Mulai Order Sekarang &rarr;
          </Link>
        </div>

        {/* Sisi Penjoki */}
        <div className="rounded-3xl border-3 border-slate-900 dark:border-slate-700 bg-primary-50/60 dark:bg-primary-950/20 p-6 sm:p-8 space-y-5 shadow-neo dark:shadow-neo-dark">
          <div className="flex items-center gap-2">
            <span className="rounded-lg border-2 border-slate-900 bg-primary-300 px-2.5 py-0.5 text-xs font-black text-slate-950 shadow-neo-sm">
              UNTUK PENJOKI PROFESIONAL
            </span>
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Kelola Ratusan Order Tanpa Chat Menumpuk.
          </h3>

          <ul className="space-y-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">✓</span>
              <span>Dashboard terpusat dengan filter status order &amp; deadline</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">✓</span>
              <span>Auto-generate QRIS berdasar nominal harga yang disepakati</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-600 font-bold">✓</span>
              <span>Web Push Notification langsung ke HP &amp; laptop saat ada orderan baru</span>
            </li>
          </ul>

          <Link
            href={user ? "/orders" : "/login"}
            className="btn btn-primary w-full py-2.5 text-xs sm:text-sm font-black shadow-neo"
          >
            {user ? "Buka Dashboard Penjoki \u2192" : "Login Sebagai Penjoki \u2192"}
          </Link>
        </div>
      </section>
    </div>
  );
}
