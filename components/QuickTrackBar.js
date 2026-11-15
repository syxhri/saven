"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function QuickTrackBar() {
  const [code, setCode] = useState("");
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    const clean = code.trim();
    if (!clean) return;
    router.push(`/track/${encodeURIComponent(clean)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-xl mx-auto"
    >
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Punya Kode Order? Contoh: SVN-8A91F..."
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-slate-700 rounded-2xl font-bold text-xs sm:text-sm shadow-neo dark:shadow-neo-dark focus:outline-none focus:border-primary-600 focus:shadow-neo-primary transition-all placeholder:text-slate-400"
        />
      </div>
      <button
        type="submit"
        className="btn btn-primary w-full sm:w-auto py-3 px-6 text-xs sm:text-sm whitespace-nowrap shadow-neo"
      >
        <span>Lacak Status</span>
        <span>⚡</span>
      </button>
    </form>
  );
}
