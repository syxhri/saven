"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TrackPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [recentOrders, setRecentOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("Saven_recent_orders") ||
        localStorage.getItem("jokiwi_recent_orders") ||
        "[]"
      );
      setRecentOrders(Array.isArray(saved) ? saved : []);
    } catch {}
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed.startsWith("OD") || trimmed.length < 5) {
      setError("Kode order tidak valid. Contoh: OD1A2B3C...");
      return;
    }
    router.push(`/track/${trimmed}`);
  }

  function clearHistory() {
    try {
      localStorage.removeItem("Saven_recent_orders");
      localStorage.removeItem("jokiwi_recent_orders");
      setRecentOrders([]);
    } catch {}
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Cek Status Order
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Masukkan kode order yang kamu dapat setelah memesan.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white dark:bg-slate-900 shadow-neo dark:shadow-neo-dark border-2 border-slate-900 dark:border-slate-700 p-6 space-y-4"
        >
          {error && (
            <p className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-lg border-2 border-rose-500">{error}</p>
          )}
          <div>
            <label htmlFor="order-code" className="label">Kode Order</label>
            <input
              id="order-code"
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(""); }}
              className="input font-mono uppercase"
              placeholder="OD1A2B3C..."
              required
              autoComplete="off"
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Cek Status
          </button>
        </form>

        {recentOrders.length > 0 && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-neo dark:shadow-neo-dark border-2 border-slate-900 dark:border-slate-700 overflow-hidden">
            <div className="px-4 py-3 border-b-2 border-slate-900 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Riwayat Order
              </span>
              <button onClick={clearHistory} className="text-xs font-bold text-rose-500 hover:text-rose-700">
                Hapus
              </button>
            </div>
            <div className="divide-y-2 divide-slate-900/10 dark:divide-slate-800">
              {[...recentOrders].reverse().map((item) => (
                <div key={item.orderCode} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.orderCode}
                    </p>
                    <p className="text-xs text-slate-500 font-medium truncate max-w-[180px] mt-0.5">
                      {item.taskName || "Order Joki"}
                    </p>
                  </div>
                  <Link
                    href={`/track/${item.orderCode}`}
                    className="flex-shrink-0 ml-3 btn btn-primary text-xs py-1 px-3"
                  >
                    Cek Status
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center space-y-2">
          <p className="text-xs text-gray-400">
            Belum pernah order?{" "}
            <Link href="/book" className="text-primary-600 hover:underline font-medium">
              Order sekarang
            </Link>
          </p>
          {recentOrders.length > 0 && (
            <p className="text-xs text-gray-400">
              <Link href="/my-orders" className="text-primary-600 hover:underline font-medium">
                Lihat semua riwayat order
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}