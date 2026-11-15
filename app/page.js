export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCurrentUser } from "@/lib/auth.js";

export const metadata = {
  title: "Saven - Platform Joki Tugas",
  description:
    "Platform joki tugas mudah & terpercaya. Customer pesan tanpa akun, penjoki kelola orderan dengan QRIS & notifikasi langsung.",
  openGraph: {
    title: "Saven",
    description:
      "Pesan dan kelola jokian tugas dengan rapi: QRIS dinamis, tracking real-time, dan notifikasi langsung.",
    url: "https://Saven.app",
    siteName: "Saven",
    type: "website",
  },
};

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-slate-900 bg-white px-6 py-10 shadow-neo-md sm:px-10 sm:py-14 animate-fade-in-up dark:bg-slate-900 dark:border-slate-700 dark:shadow-neo-dark-md">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-[-3rem] h-52 w-52 rounded-full bg-sky-400/15 blur-3xl" />

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-primary-100 dark:bg-primary-950/70 dark:border-slate-700 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary-900 dark:text-primary-300 shadow-neo-sm dark:shadow-neo-dark-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Platform Joki Tugas Modern
          </div>

          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-5xl dark:text-white">
            Solusi Tugas Kuliah & Sekolah{" "}
            <span className="text-primary-600 dark:text-primary-400 underline decoration-wavy decoration-primary-400/60 underline-offset-4">
              Tanpa Ribet.
            </span>
          </h1>

          <p className="max-w-xl text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            Pesan joki tugas dengan cepat tanpa perlu daftar akun. Pantau status pengerjaan secara real-time dan download hasil pekerjaan secara aman.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/book"
              className="btn btn-primary flex items-center gap-2 text-sm font-bold"
            >
              <span>Order Sekarang</span>
              <span>&rarr;</span>
            </Link>
            <Link
              href="/track"
              className="btn btn-secondary text-sm font-bold"
            >
              Cek Status Order
            </Link>
            {user ? (
              <Link
                href="/orders"
                className="btn btn-secondary text-sm font-bold text-primary-700 dark:text-primary-300"
              >
                Dashboard Penjoki
              </Link>
            ) : (
              <Link
                href="/login"
                className="btn btn-secondary text-sm font-bold"
              >
                Login Penjoki
              </Link>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs font-bold text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Order tanpa akun (Nama & WA saja)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span>Notifikasi Push & Tracking Real-time</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>QRIS Pembayaran Dinamis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Info khusus Customer & Penjoki */}
      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-slate-900 bg-amber-50/60 dark:bg-amber-950/20 dark:border-slate-700 p-6 space-y-4 shadow-neo dark:shadow-neo-dark transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-md dark:hover:shadow-neo-dark-md">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-lg border-2 border-slate-900 bg-amber-200 dark:border-slate-700 dark:bg-amber-900/60 px-2.5 py-1 text-xs font-black text-amber-950 dark:text-amber-200">
              CUSTOMER
            </span>
            <h2 className="text-base font-black text-slate-900 dark:text-slate-50">
              Untuk Pemesan
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            <strong>Tidak perlu membuat akun atau login!</strong> Cukup pilih penjoki, isi nama dan nomor WhatsApp, lalu kamu akan mendapatkan <strong>Kode Order</strong> unik untuk memantau status dan mengunduh hasil.
          </p>
          <div className="flex gap-2 pt-1 flex-wrap">
            <Link href="/book" className="btn btn-primary text-xs">
              Buat Order Baru
            </Link>
            <Link href="/track" className="btn btn-secondary text-xs">
              Cek Status Order
            </Link>
            <Link href="/my-orders" className="btn btn-secondary text-xs">
              Riwayat Order
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-slate-900 bg-indigo-50/60 dark:bg-indigo-950/20 dark:border-slate-700 p-6 space-y-4 shadow-neo dark:shadow-neo-dark transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-md dark:hover:shadow-neo-dark-md">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-lg border-2 border-slate-900 bg-primary-200 dark:border-slate-700 dark:bg-primary-900/60 px-2.5 py-1 text-xs font-black text-primary-950 dark:text-primary-200">
              PENJOKI
            </span>
            <h2 className="text-base font-black text-slate-900 dark:text-slate-50">
              Untuk Penyedia Jasa
            </h2>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Daftarkan diri kamu sebagai penjoki untuk menerima pesanan masuk, menentukan harga, mengatur QRIS pembayaran, serta mengirimkan hasil pekerjaan langsung ke customer.
          </p>
          <div className="flex gap-2 pt-1">
            {user ? (
              <Link href="/orders" className="btn btn-primary text-xs">
                Masuk Dashboard Penjoki &rarr;
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn btn-primary text-xs">
                  Login Penjoki
                </Link>
                <Link href="/register" className="btn btn-secondary text-xs">
                  Daftar Penjoki Baru
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border-2 border-slate-900 bg-white dark:bg-slate-900 dark:border-slate-700 p-6 text-sm shadow-neo dark:shadow-neo-dark transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-md dark:hover:shadow-neo-dark-md">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 border-slate-900 bg-primary-100 text-xs font-black text-primary-900 shadow-neo-sm dark:border-slate-700 dark:bg-primary-900/50 dark:text-primary-200">
            01
          </span>
          <h3 className="mt-3 text-base font-black text-slate-900 dark:text-slate-50">
            Pilih Penjoki & Kategori
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Customer dapat memilih penjoki yang sesuai dengan bidang tugas atau mata kuliah yang dibutuhkan.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-slate-900 bg-white dark:bg-slate-900 dark:border-slate-700 p-6 text-sm shadow-neo dark:shadow-neo-dark transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-md dark:hover:shadow-neo-dark-md">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 border-slate-900 bg-primary-100 text-xs font-black text-primary-900 shadow-neo-sm dark:border-slate-700 dark:bg-primary-900/50 dark:text-primary-200">
            02
          </span>
          <h3 className="mt-3 text-base font-black text-slate-900 dark:text-slate-50">
            Status Clear & Notifikasi
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Dapatkan notifikasi Web Push langsung saat pesanan diterima, selesai dikerjakan, atau saat pembayaran dikonfirmasi.
          </p>
        </div>

        <div className="rounded-2xl border-2 border-slate-900 bg-white dark:bg-slate-900 dark:border-slate-700 p-6 text-sm shadow-neo dark:shadow-neo-dark transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-md dark:hover:shadow-neo-dark-md">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 border-slate-900 bg-primary-100 text-xs font-black text-primary-900 shadow-neo-sm dark:border-slate-700 dark:bg-primary-900/50 dark:text-primary-200">
            03
          </span>
          <h3 className="mt-3 text-base font-black text-slate-900 dark:text-slate-50">
            Aman & Pengiriman File Direct
          </h3>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            File hasil pekerjaan diunduh secara aman dan otomatis dibersihkan secara berkala demi keamanan data.
          </p>
        </div>
      </section>
    </div>
  );
}
