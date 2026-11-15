"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("Saven_recent_orders") ||
        localStorage.getItem("jokiwi_recent_orders") ||
        "[]"
      );
      setOrders(Array.isArray(saved) ? saved : []);
    } catch { setOrders([]); }
  }, []);

  function clearAll() {
    localStorage.removeItem("Saven_recent_orders");
    localStorage.removeItem("jokiwi_recent_orders");
    setOrders([]);
  }

  const filtered = useMemo(() => {
    let list = [...orders];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(o => o.orderCode?.toLowerCase().includes(q) || o.taskName?.toLowerCase().includes(q));
    }
    return sort === "oldest" ? list.reverse() : list;
  }, [orders, search, sort]);

  return (
    <div className="min-h-[70vh] px-4 py-8">
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Riwayat Orderan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Daftar orderan yang pernah kamu buat di perangkat ini.</p>
        </div>
        <div className="flex gap-2">
          <input type="search" placeholder="Cari kode atau nama tugas..." value={search} onChange={(e) => setSearch(e.target.value)} className="input flex-1 text-sm" />
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto text-sm pr-7">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </div>
        {orders.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 p-8 text-center shadow-neo dark:shadow-neo-dark">
            <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-3 text-sm text-slate-500 font-medium">Belum ada riwayat order di perangkat ini.</p>
            <Link href="/book" className="mt-4 btn btn-primary text-sm inline-flex">Buat Order Sekarang</Link>
          </div>
        ) : (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 shadow-neo dark:shadow-neo-dark overflow-hidden">
            <div className="px-4 py-3 border-b-2 border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{filtered.length} orderan</span>
              <button onClick={clearAll} className="text-xs font-bold text-rose-500 hover:text-rose-700">Hapus semua</button>
            </div>
            {filtered.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-slate-400">Tidak ada hasil untuk pencarian tersebut.</div>
            ) : (
              <div className="divide-y-2 divide-slate-900/10 dark:divide-slate-800">
                {filtered.map((item) => (
                  <div key={item.orderCode} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">{item.orderCode}</p>
                      <p className="text-xs text-slate-500 font-medium truncate max-w-[220px] mt-0.5">{item.taskName || "Orderan Joki"}</p>
                    </div>
                    <Link href={`/track/${item.orderCode}`} className="flex-shrink-0 ml-3 btn btn-primary text-xs py-1 px-3">
                      Cek Status
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex gap-3 flex-wrap">
          <Link href="/book" className="btn btn-primary text-xs">Buat Order Baru</Link>
          <Link href="/track" className="btn btn-secondary text-xs">Cek Status via Kode</Link>
        </div>
      </div>
    </div>
  );
}
