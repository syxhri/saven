"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function CategoryTable({ categoriesWithStats }) {
  const [items, setItems] = useState(categoriesWithStats);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);

  const visibleItems = useMemo(() => {
    let list = items || [];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        [c.name, c.notes]
          .map((v) => (v || "").toString().toLowerCase())
          .some((v) => v.includes(q))
      );
    }

    if (filterStatus === "has_orders") {
      list = list.filter((c) => (c.stats?.totalOrders || 0) > 0);
    } else if (filterStatus === "no_orders") {
      list = list.filter((c) => (c.stats?.totalOrders || 0) === 0);
    }

    const dir = sortDir === "asc" ? 1 : -1;
    const sorted = [...list].sort((a, b) => {
      let va;
      let vb;

      if (sortBy === "name") {
        va = (a.name || "").toLowerCase();
        vb = (b.name || "").toLowerCase();
      } else if (sortBy === "orders") {
        va = a.stats?.totalOrders || 0;
        vb = b.stats?.totalOrders || 0;
      } else {
        va = a.stats?.totalIncome || 0;
        vb = b.stats?.totalIncome || 0;
      }

      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });

    return sorted;
  }, [items, search, filterStatus, sortBy, sortDir]);

  async function handleDelete(id) {
    const ok = window.confirm(
      "Yakin mau menghapus kategori ini? Pastikan tidak ada orderan dengan kategori ini."
    );
    if (!ok) return;
    try {
      const res = await fetch(`/api/category/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal menghapus kategori");
        return;
      }
      setItems((prev) => prev.filter((c) => c.categoryCode !== id));
    } catch (err) {
      alert("Gagal menghapus kategori");
    }
  }

  return (
    <div className="space-y-4">
      {/* Search + toggle filter */}
      <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-neo dark:shadow-neo-dark">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full flex items-end gap-3">
            <div className="flex-1">
              <label className="label">Pencarian</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama kategori atau catatan"
                  className="input pr-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowFilters((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  aria-label="Buka filter dan sort"
                >
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    fill="none"
                    className="h-4 w-4"
                  >
                    <path
                      d="M3 5h14M6 10h8M8 15h4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
        
            <Link
              href="/category/new"
              className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-primary-600 text-white shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all dark:border-slate-700"
              aria-label="Tambah kategori"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M10 4v12M4 10h12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="label">Filter</label>
              <select
                className="input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua</option>
                <option value="has_orders">Punya orderan</option>
                <option value="no_orders">Belum ada orderan</option>
              </select>
            </div>
            <div>
              <label className="label">Urutkan Berdasarkan</label>
              <select
                className="input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Nama</option>
                <option value="orders">Total Orderan</option>
                <option value="income">Pendapatan</option>
              </select>
            </div>
            <div>
              <label className="label">Arah Sort</label>
              <select
                className="input"
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
              >
                <option value="asc">Naik (A-Z / kecil-besar)</option>
                <option value="desc">Turun (Z-A / besar-kecil)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      {visibleItems.length === 0 ? (
        <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-neo dark:shadow-neo-dark">
          <p className="text-sm font-medium text-slate-500">Belum ada kategori.</p>
        </div>
      ) : (
        <div className="mt-2 overflow-hidden rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-neo dark:shadow-neo-dark">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y-2 divide-slate-900/10 dark:divide-slate-800 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b-2 border-slate-900/10 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Nama Kategori
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Catatan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Total Orderan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Pendapatan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-slate-900/5 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                {visibleItems.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                      <Link
                        href={`/category/${cat.categoryCode}`}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 underline underline-offset-2"
                      >
                        {cat.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500 font-medium">
                      {cat.notes || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                      {cat.stats?.totalOrders ?? 0}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      Rp{" "}
                      {(cat.stats?.totalIncome || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex gap-3 font-bold">
                        <Link
                          href={`/category/${cat.categoryCode}/edit`}
                          className="text-primary-600 hover:text-primary-800 dark:text-primary-400"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.categoryCode)}
                          className="text-rose-600 hover:text-rose-800 dark:text-rose-400"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}