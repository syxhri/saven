"use client";

import Link from "next/link";
import LogoIcon from "./LogoIcon";

export default function Footer() {
  return (
    <footer className="w-full px-4 py-8">
      <div className="mx-auto max-w-5xl rounded-3xl border-3 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-neo-md dark:shadow-neo-dark-md space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Brand & Slogan */}
          <div className="space-y-1">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="transition-transform group-hover:scale-105 group-hover:-rotate-3">
                <LogoIcon size={28} className="h-7 w-7" />
              </span>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Saven
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-slate-900/20 bg-amber-300 dark:bg-amber-400 text-slate-950 shadow-neo-sm">
                ⚡ Joki
              </span>
            </Link>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 max-w-sm">
              Platform layanan akademik modern dua sisi: Tanpa akun, QRIS dinamis, dan tracking real-time.
            </p>
          </div>

          {/* Quick Nav Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <Link
              href="/book"
              className="rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-slate-700 dark:text-slate-200 shadow-neo-sm hover:-translate-y-0.5 hover:shadow-neo transition-all"
            >
              Pesan Joki
            </Link>
            <Link
              href="/track"
              className="rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-slate-700 dark:text-slate-200 shadow-neo-sm hover:-translate-y-0.5 hover:shadow-neo transition-all"
            >
              Lacak Pesanan
            </Link>
            <Link
              href="/orders"
              className="rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-primary-100 dark:bg-primary-950/60 px-3 py-1.5 text-primary-900 dark:text-primary-300 shadow-neo-sm hover:-translate-y-0.5 hover:shadow-neo transition-all"
            >
              Dashboard Penjoki
            </Link>
          </div>
        </div>

        {/* Bottom Line: Status & Creator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t-2 border-slate-900/10 dark:border-slate-800 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Semua Layanan Berjalan Normal</span>
          </div>

          <p className="text-center sm:text-right">
            Saven &bull; Dibuat oleh{" "}
            <Link
              href="https://github.com/syxhri/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 underline underline-offset-2"
            >
              @syxhri
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
