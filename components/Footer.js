"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-2 border-slate-900/10 dark:border-slate-800 py-6 text-center text-slate-600 dark:text-slate-400">
      <p className="text-xs font-medium">
        Saven &bull; Dibuat oleh{" "}
        <Link
          href="https://github.com/syxhri/"
          className="font-bold text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 underline underline-offset-2"
        >
          @syxhri
        </Link>
      </p>
    </footer>
  );
}
