"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function CategoryForm({ category = null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
    notes: category?.notes || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const initialSnapshot = useMemo(() => JSON.stringify(form), []);
  const isDirty = JSON.stringify(form) !== initialSnapshot;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = category
        ? `/api/category/${category.categoryCode}`
        : "/api/category";
      const method = category ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Gagal menyimpan kategori");
      }
    } catch {
      setError("Gagal menyimpan kategori");
    } finally {
      setLoading(false);
    }
  };

  function handleBack() {
    if (isDirty) {
      const ok = window.confirm("Perubahan belum disimpan. Yakin mau kembali?");
      if (!ok) return;
    }
    router.push("/");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-900 dark:border-slate-700 shadow-neo dark:shadow-neo-dark p-6 space-y-6"
    >
      {error && (
        <div className="p-3 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl border-2 border-rose-500 text-xs font-bold shadow-neo-sm">
          {error}
        </div>
      )}
      <div>
        <label className="label">
          Nama Kategori <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="input"
          required
        />
      </div>
      <div>
        <label className="label">Deskripsi</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="input"
          rows={3}
        />
      </div>
      <div>
        <label className="label">Catatan</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          className="input"
          rows={2}
        />
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleBack}
          className="btn btn-secondary"
        >
          Kembali
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Menyimpan…" : "Simpan"}
        </button>
      </div>
    </form>
  );
}
