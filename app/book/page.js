"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BookPage() {
  const router = useRouter();

  const [jokiList, setJokiList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingJoki, setLoadingJoki] = useState(true);
  const [loadingCat, setLoadingCat] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [jokiDropdownOpen, setJokiDropdownOpen] = useState(false);
  const jokiDropdownRef = useRef(null);

  const [form, setForm] = useState({
    joki_user_code: "",
    customer_name: "",
    customer_phone: "",
    task_name: "",
    category_id: "",
    custom_category: "",
    deadline_date: "",
    notes: "",
  });

  const [useCustomCat, setUseCustomCat] = useState(false);

  // Auto-fill data pemesan jika pernah order sebelumnya
  useEffect(() => {
    try {
      const savedProfile = JSON.parse(
        localStorage.getItem("Saven_customer_profile") ||
        localStorage.getItem("jokiwi_customer_profile") ||
        "null"
      );
      if (savedProfile) {
        setForm((prev) => ({
          ...prev,
          customer_name: prev.customer_name || savedProfile.name || "",
          customer_phone: prev.customer_phone || savedProfile.phone || "",
        }));
      }
    } catch {}
  }, []);

  // Ambil daftar penjoki
  useEffect(() => {
    fetch("/api/customer/orders")
      .then((r) => r.json())
      .then((d) => setJokiList(d.joki || []))
      .catch(() => setJokiList([]))
      .finally(() => setLoadingJoki(false));
  }, []);

  // Ambil kategori ketika penjoki dipilih
  useEffect(() => {
    if (!form.joki_user_code) {
      setCategories([]);
      return;
    }
    setLoadingCat(true);
    fetch(`/api/customer/orders?joki_user_code=${form.joki_user_code}`)
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCat(false));
  }, [form.joki_user_code]);

  // Tutup dropdown saat klik di luar atau tekan Esc
  useEffect(() => {
    function handleClickOutside(e) {
      if (jokiDropdownRef.current && !jokiDropdownRef.current.contains(e.target)) {
        setJokiDropdownOpen(false);
      }
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setJokiDropdownOpen(false);
    }
    function onCloseModal() {
      setJokiDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("close-modal", onCloseModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("close-modal", onCloseModal);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "category_id") {
      if (value === "CUSTOM") {
        setUseCustomCat(true);
        setForm((prev) => ({ ...prev, category_id: "" }));
      } else {
        setUseCustomCat(false);
        setForm((prev) => ({ ...prev, category_id: value, custom_category: "" }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi 628
    const cleanPhone = form.customer_phone.trim().replace(/[^0-9+]/g, "");
    const formattedPhone = cleanPhone.startsWith("08")
      ? "628" + cleanPhone.slice(2)
      : cleanPhone.startsWith("+62")
      ? cleanPhone.slice(1)
      : cleanPhone;

    if (!/^628[0-9]{8,12}$/.test(formattedPhone)) {
      setError("Nomor WhatsApp wajib diawali 628 (contoh: 628123456789)");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/customer/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          customer_phone: formattedPhone,
          category_id: useCustomCat ? null : form.category_id ? Number(form.category_id) : null,
          custom_category: useCustomCat ? form.custom_category : null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Gagal membuat pesanan");
        return;
      }

      // Simpan ke localStorage agar customer bisa lacak tanpa hapal kode
      try {
        const saved = JSON.parse(
          localStorage.getItem("Saven_recent_orders") ||
          localStorage.getItem("jokiwi_recent_orders") ||
          "[]"
        );
        const existingIdx = saved.findIndex((o) => o.orderCode === data.orderCode);
        const newItem = {
          orderCode: data.orderCode,
          taskName: form.task_name,
          createdAt: new Date().toISOString(),
        };
        if (existingIdx >= 0) saved[existingIdx] = newItem;
        else saved.unshift(newItem);
        localStorage.setItem("Saven_recent_orders", JSON.stringify(saved.slice(0, 10)));

        // Simpan profil pemesan agar auto-fill di pesanan berikutnya
        localStorage.setItem(
          "Saven_customer_profile",
          JSON.stringify({ name: form.customer_name, phone: formattedPhone })
        );
      } catch {}

      // Redirect ke halaman tracking
      router.push(`/track/${data.orderCode}`);
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedJoki = jokiList.find((j) => j.userCode === form.joki_user_code);

  return (
    <div className="py-8 sm:py-12 px-4 max-w-5xl mx-auto space-y-10">
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left Column: Guiding Info & Trust */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 dark:border-slate-700 bg-amber-300 dark:bg-amber-400 px-3.5 py-1 text-xs font-black uppercase text-slate-950 shadow-neo-sm">
            ⚡ Pesan Joki Tanpa Akun
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
              Order Tugasmu, Pantau Progresnya.
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
              Cukup lengkapi form di samping. Penjoki akan segera menentukan harga &amp; estimasi waktu, lalu kamu bisa langsung pantau di link tracking unik milikmu.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-neo-sm space-y-1">
              <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🛡️</span> Kerahasiaan 100% Terjaga
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Data &amp; berkas tugas kamu tidak dipublikasikan ke publik. Hanya kamu dan penjoki yang dapat mengaksesnya.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-neo-sm space-y-1">
              <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>💳</span> QRIS Dinamis Otomatis
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Setelah deal harga, scan QRIS untuk bayar dari semua bank &amp; e-wallet (BCA, Mandiri, GoPay, Dana, dll).
              </p>
            </div>

            <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-neo-sm space-y-1">
              <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>⚡</span> Tracking &amp; Struk Digital
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Kamu akan otomatis mendapatkan link tracking pesanan serta struk digital resmi yang bisa diunduh.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 p-4 space-y-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Pernah order sebelumnya?</p>
            <div className="flex gap-2 flex-wrap">
              <Link href="/track" className="btn btn-secondary text-xs py-1.5 px-3">
                Lacak Pesanan
              </Link>
              <Link href="/my-orders" className="btn btn-secondary text-xs py-1.5 px-3">
                Riwayat Order Saya
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: The Order Form */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white dark:bg-slate-900 shadow-neo-md dark:shadow-neo-dark-md border-3 border-slate-900 dark:border-slate-700 p-6 sm:p-8 space-y-6"
          >
          {error && (
            <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 text-rose-900 dark:text-rose-200 p-3.5 text-sm font-semibold shadow-neo-sm">
              {error}
            </div>
          )}

          {/* Pilih penjoki — custom dropdown dengan foto */}
          <div className="space-y-1.5" ref={jokiDropdownRef}>
            <label className="label">
              Pilih Penjoki <span className="text-red-500">*</span>
            </label>
            {loadingJoki ? (
              <div className="h-11 animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800" />
            ) : (
              <div className="relative">
                {/* Trigger button */}
                <button
                  type="button"
                  onClick={() => setJokiDropdownOpen((o) => !o)}
                  className="input flex items-center gap-2.5 text-left w-full pr-9"
                >
                  {form.joki_user_code ? (() => {
                    const j = jokiList.find(x => x.userCode === form.joki_user_code);
                    return j ? (
                      <>
                        <div className="flex-shrink-0 h-6 w-6 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                          {j.avatarUrl ? (
                            <img src={j.avatarUrl} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400">
                              {(j.name || j.username)[0].toUpperCase()}
                            </span>
                          )}
                        </div>
                        <span className="flex-1 truncate text-sm text-gray-900 dark:text-gray-100">
                          {j.name || j.username}
                          <span className="text-gray-400 font-mono ml-1.5 text-xs">@{j.username}</span>
                        </span>
                      </>
                    ) : null;
                  })() : (
                    <span className="text-gray-400 text-sm">-- Pilih penjoki --</span>
                  )}
                  <svg className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-transform ${jokiDropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </button>

                {/* Dropdown list */}
                {jokiDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-full rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-neo-md dark:shadow-neo-dark-md overflow-hidden">
                    <div className="max-h-52 overflow-y-auto divide-y divide-gray-50 dark:divide-slate-800">
                      {jokiList.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-gray-400">Belum ada penjoki tersedia.</p>
                      ) : jokiList.map((j) => {
                        const selected = form.joki_user_code === j.userCode;
                        return (
                          <button
                            key={j.userCode}
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({ ...prev, joki_user_code: j.userCode }));
                              setJokiDropdownOpen(false);
                            }}
                            className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                              selected ? "bg-primary-50 dark:bg-primary-900/20" : "hover:bg-gray-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                              {j.avatarUrl ? (
                                <img src={j.avatarUrl} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                  {(j.name || j.username)[0].toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-semibold truncate ${selected ? "text-primary-700 dark:text-primary-300" : "text-gray-900 dark:text-gray-100"}`}>
                                {j.name || j.username}
                              </p>
                              <p className="text-xs text-gray-400 font-mono">@{j.username}</p>
                            </div>
                            {selected && (
                              <svg className="h-4 w-4 flex-shrink-0 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Hidden input untuk validasi form required */}
                <input
                  type="text"
                  value={form.joki_user_code}
                  onChange={() => {}}
                  required
                  className="sr-only"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            )}
          </div>

          {/* Nama customer */}
          <div className="space-y-1">
            <label htmlFor="customer_name" className="label">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              id="customer_name"
              type="text"
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              className="input"
              placeholder="Nama kamu"
              required
              minLength={2}
            />
          </div>

          {/* Nomor WA customer */}
          <div className="space-y-1">
            <label htmlFor="customer_phone" className="label">
              Nomor WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              id="customer_phone"
              type="tel"
              name="customer_phone"
              value={form.customer_phone}
              onChange={handleChange}
              className="input"
              placeholder="628123456789"
              required
            />
            <p className="text-xs text-gray-400">
              Wajib diawali <strong className="text-gray-600 dark:text-gray-300">628</strong> (Contoh: 628123456789).
            </p>
          </div>

          {/* Nama tugas */}
          <div className="space-y-1">
            <label htmlFor="task_name" className="label">
              Nama Tugas / Deskripsi Singkat <span className="text-red-500">*</span>
            </label>
            <input
              id="task_name"
              type="text"
              name="task_name"
              value={form.task_name}
              onChange={handleChange}
              className="input"
              placeholder="Contoh: Essay Pancasila 1500 kata"
              required
              minLength={3}
            />
          </div>

          {/* Kategori */}
          <div className="space-y-2">
            <label htmlFor="category_id" className="label">
              Kategori / Mata Kuliah{" "}
              <span className="text-gray-400 text-xs">(opsional)</span>
            </label>
            {loadingCat ? (
              <div className="h-10 animate-pulse rounded-lg bg-gray-100 dark:bg-slate-800" />
            ) : (
              <select
                id="category_id"
                name="category_id"
                value={useCustomCat ? "CUSTOM" : form.category_id}
                onChange={handleChange}
                className="input"
                disabled={!form.joki_user_code}
              >
                <option value="">
                  {!form.joki_user_code
                    ? "-- Pilih penjoki dulu --"
                    : "-- Pilih kategori --"}
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                {form.joki_user_code && (
                  <option value="CUSTOM">Input Kategori Sendiri...</option>
                )}
              </select>
            )}

            {/* Input custom category */}
            {useCustomCat && (
              <div className="pt-1">
                <input
                  type="text"
                  name="custom_category"
                  value={form.custom_category}
                  onChange={handleChange}
                  className="input text-xs"
                  placeholder="Ketik nama mata kuliah / kategori baru…"
                  required
                  autoFocus
                />
                <p className="text-[11px] text-primary-600 dark:text-primary-400 mt-1">
                  Kategori baru ini akan tersimpan otomatis untuk penjoki.
                </p>
              </div>
            )}
          </div>

          {/* Deadline */}
          <div className="space-y-1">
            <label htmlFor="deadline_date" className="label">
              Deadline <span className="text-gray-400 text-xs">(opsional)</span>
            </label>
            <input
              id="deadline_date"
              type="date"
              name="deadline_date"
              value={form.deadline_date}
              onChange={handleChange}
              className="input"
              min={new Date().toISOString().slice(0, 10)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label htmlFor="notes" className="label">
              Catatan Tambahan{" "}
              <span className="text-gray-400 text-xs">(opsional)</span>
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className="input min-h-[80px] resize-y"
              placeholder="Detail tambahan (NIM, kelas, jurusan, angkatan), instruksi khusus, format yang diinginkan, dll."
              rows={3}
            />
          </div>

          {/* Info: harga ditentukan penjoki */}
          <div className="rounded-xl bg-sky-50 dark:bg-sky-950/40 border-2 border-slate-900 dark:border-slate-700 p-3.5 text-xs text-slate-800 dark:text-slate-200 shadow-neo-sm font-medium">
            <strong>Catatan:</strong> Harga akan ditentukan oleh penjoki setelah pesanan diterima. Kamu akan mendapat notifikasi beserta detail harganya.
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-sm font-bold"
            disabled={submitting || loadingJoki}
          >
            {submitting ? "Mengirim pesanan…" : "Kirim Order"}
          </button>
        </form>
      </div>
    </div>
  </div>
);
}
