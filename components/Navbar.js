"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ThemeToggle from "./ThemeToggle";
import LogoIcon from "./LogoIcon";

// ─── Playful Neobrutalist Notification Popover ─────────────────────────
function NotificationBell({ userId }) {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const popoverRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notifications?limit=20", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setUnread(data.unreadCount || 0);
      setNotifications(data.notifications || []);
    } catch {
      // Ignore silent error
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
    } catch {}
  }

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/notifications?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setUnread((prev) => Math.max(0, prev - 1));
      }
    } catch {}
    finally {
      setDeletingId(null);
    }
  }

  async function handleDeleteAll() {
    setDeletingAll(true);
    try {
      const res = await fetch("/api/notifications?all=true", { method: "DELETE" });
      if (res.ok) {
        setNotifications([]);
        setUnread(0);
      }
    } catch {}
    finally {
      setDeletingAll(false);
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open && unread > 0) handleMarkAllRead();
        }}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all select-none"
        aria-label="Buka notifikasi"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unread > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full border-2 border-slate-900 bg-amber-400 px-1 text-[9px] font-black text-slate-950 shadow-neo-sm animate-pulse">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Floating Neobrutalist Popover */}
      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border-3 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-neo-md dark:shadow-neo-dark-md overflow-hidden animate-fade-in-up">
          {/* Header Popover */}
          <div className="flex items-center justify-between border-b-2 border-slate-900/15 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Notifikasi
              </span>
              {unread > 0 && (
                <span className="rounded-full border border-slate-900/30 bg-amber-300 dark:bg-amber-400/90 px-1.5 py-0.2 text-[10px] font-black text-slate-950">
                  {unread} Baru
                </span>
              )}
            </div>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleDeleteAll}
                disabled={deletingAll}
                className="text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline disabled:opacity-50"
              >
                {deletingAll ? "Menghapus..." : "Hapus Semua"}
              </button>
            )}
          </div>

          {/* List Notifikasi */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 p-2 space-y-1.5">
            {loading && notifications.length === 0 ? (
              <div className="py-8 text-center text-xs font-bold text-slate-400">
                Memuat notifikasi...
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-10 text-center space-y-2">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900/20 bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Belum ada notifikasi baru
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`group relative rounded-xl border-2 border-slate-900/10 dark:border-slate-800 p-3 transition-all hover:border-slate-900 dark:hover:border-slate-700 hover:shadow-neo-sm ${
                    !n.isRead
                      ? "bg-amber-50/50 dark:bg-amber-950/20"
                      : "bg-white dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <p className="text-xs font-black text-slate-900 dark:text-slate-100">
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                        {n.message}
                      </p>
                      {n.orderId && (
                        <Link
                          href={`/order/${n.orderId}`}
                          onClick={() => setOpen(false)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline mt-1"
                        >
                          Lihat Orderan &rarr;
                        </Link>
                      )}
                      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 pt-0.5">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : ""}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(n.id)}
                      disabled={deletingId === n.id}
                      className="text-slate-300 hover:text-rose-500 p-1 transition-colors"
                      aria-label="Hapus"
                    >
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Playful Neobrutalist Logout Confirmation Modal ─────────────────────
function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl border-3 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-neo-lg dark:shadow-neo-dark-lg space-y-5 animate-fade-in-up">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-slate-900 bg-rose-100 text-rose-600 shadow-neo-sm dark:border-slate-700 dark:bg-rose-950/50">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Keluar dari Akun?
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Sesi login penjoki akan diakhiri di perangkat ini.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary flex-1 py-2 text-xs font-bold"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-danger flex-1 py-2 text-xs font-bold"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Floating Island Header ─────────────────────────────────────────────
export default function Navbar() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let ignore = false;
    async function fetchUser() {
      setLoadingUser(true);
      try {
        const res = await fetch("/api/user", { cache: "no-store" });
        if (!res.ok) {
          if (!ignore) setUser(null);
          return;
        }
        const data = await res.json();
        if (!ignore) setUser(data.user ?? null);
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoadingUser(false);
      }
    }
    fetchUser().catch(() => {});
    return () => {
      ignore = true;
    };
  }, [pathname]);

  useEffect(() => {
    setDrawerOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // Service Worker for Push Notifications
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return;

    async function registerAndSubscribe() {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        let permission = Notification.permission;
        if (permission === "default") {
          await new Promise((r) => setTimeout(r, 2000));
          permission = await Notification.requestPermission();
        }
        if (permission !== "granted") return;

        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          await fetch("/api/push/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subscription: sub.toJSON() }),
          }).catch(() => {});
        }
      } catch {}
    }

    if (user) {
      registerAndSubscribe();
    }
  }, [user]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setAccountOpen(false);
      setDrawerOpen(false);
      setLogoutOpen(false);
      router.push("/");
      router.refresh?.();
    } catch {}
  }

  const isNavActive = (href) => pathname === href;

  return (
    <>
      {/* Floating Island Navigation Header */}
      <header className="sticky top-2 sm:top-4 z-40 w-full px-3 sm:px-6 transition-all duration-200">
        <div className="mx-auto max-w-5xl rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-neo dark:shadow-neo-dark px-3 py-2.5 sm:px-4 flex items-center justify-between gap-3">
          
          {/* Brand Anchor */}
          <div className="flex items-center gap-2">
            {/* Mobile Drawer Trigger */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-neo-sm md:hidden hover:bg-slate-50 transition-transform active:translate-x-0.5 active:translate-y-0.5"
              aria-label="Buka menu navigasi"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2 select-none group">
              <span className="flex items-center justify-center transition-transform group-hover:scale-105 group-hover:-rotate-3">
                <LogoIcon size={30} className="h-7 w-7 sm:h-8 sm:w-8" />
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Saven
                </span>
                <span className="hidden sm:inline-flex items-center gap-0.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-slate-900/25 dark:border-slate-700 bg-amber-300 dark:bg-amber-400/90 text-slate-950 shadow-neo-sm">
                  ⚡ Joki
                </span>
              </div>
            </Link>
          </div>

          {/* Central Segmented Pill Dock (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <Link
              href="/"
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                isNavActive("/")
                  ? "bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-neo-sm border-2 border-slate-900 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              Home
            </Link>

            <Link
              href="/book"
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                isNavActive("/book")
                  ? "bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-neo-sm border-2 border-slate-900 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              Pesan Joki
            </Link>

            <Link
              href="/track"
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                isNavActive("/track")
                  ? "bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-neo-sm border-2 border-slate-900 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
              }`}
            >
              Lacak Status
            </Link>

            {user && (
              <>
                <Link
                  href="/orders"
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    isNavActive("/orders")
                      ? "bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-neo-sm border-2 border-slate-900 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                  }`}
                >
                  Orderan
                </Link>
                <Link
                  href="/categories"
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    isNavActive("/categories")
                      ? "bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-neo-sm border-2 border-slate-900 dark:border-slate-700"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white"
                  }`}
                >
                  Kategori
                </Link>
              </>
            )}
          </nav>

          {/* Right Tactile Utility Bar */}
          <div className="flex items-center gap-2">
            {/* Direct Quick Lacak Link (Mobile Only Shortcut) */}
            <Link
              href="/track"
              className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-neo-sm"
              title="Lacak Order"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>

            {/* Notification Bell (Penjoki) */}
            {!loadingUser && user && <NotificationBell userId={user.id} />}

            {/* Tactile Theme Switcher */}
            <ThemeToggle />

            {/* Auth / Account Profile Dock */}
            {loadingUser ? (
              <div className="h-9 w-20 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse border-2 border-transparent" />
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAccountOpen((o) => !o)}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1 text-xs font-black shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  aria-label="Menu akun penjoki"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary-600 text-white font-black overflow-hidden text-[10px]">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                      (user.name || user.username || "P").charAt(0).toUpperCase()
                    )}
                  </span>
                  <span className="hidden sm:inline max-w-[100px] truncate text-slate-900 dark:text-slate-100">
                    {user.name || user.username}
                  </span>
                  <svg className="h-3 w-3 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {accountOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAccountOpen(false)} />
                    <div className="absolute right-0 top-11 z-50 w-48 rounded-2xl border-3 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-neo-md dark:shadow-neo-dark-md space-y-1 animate-fade-in-up">
                      <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Penjoki</p>
                        <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {user.name || user.username}
                        </p>
                      </div>

                      <Link
                        href="/orders"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setAccountOpen(false)}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        List Orderan
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        onClick={() => setAccountOpen(false)}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profil &amp; QRIS
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          setLogoutOpen(true);
                        }}
                        className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="btn btn-primary text-xs py-1.5 px-3 font-black shadow-neo-sm"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r-3 border-slate-900 dark:border-slate-700 shadow-neo-lg dark:shadow-neo-dark-lg p-5 flex flex-col justify-between md:hidden animate-fade-in-up">
            <div className="space-y-6">
              {/* Drawer Brand */}
              <div className="flex items-center justify-between border-b-2 border-slate-900/10 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <LogoIcon size={30} className="h-7 w-7" />
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    Saven
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-neo-sm"
                  aria-label="Tutup"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Drawer Links */}
              <nav className="space-y-1.5">
                <Link
                  href="/"
                  className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-black transition-all ${
                    isNavActive("/")
                      ? "border-slate-900 bg-primary-100 text-primary-900 shadow-neo-sm dark:border-slate-700 dark:bg-primary-950/60 dark:text-primary-300"
                      : "border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setDrawerOpen(false)}
                >
                  Home
                </Link>

                <Link
                  href="/book"
                  className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-black transition-all ${
                    isNavActive("/book")
                      ? "border-slate-900 bg-primary-100 text-primary-900 shadow-neo-sm dark:border-slate-700 dark:bg-primary-950/60 dark:text-primary-300"
                      : "border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setDrawerOpen(false)}
                >
                  Pesan Joki Tugas
                </Link>

                <Link
                  href="/track"
                  className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-black transition-all ${
                    isNavActive("/track")
                      ? "border-slate-900 bg-primary-100 text-primary-900 shadow-neo-sm dark:border-slate-700 dark:bg-primary-950/60 dark:text-primary-300"
                      : "border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => setDrawerOpen(false)}
                >
                  Lacak Pesanan
                </Link>

                {user && (
                  <>
                    <div className="pt-3 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Menu Penjoki
                    </div>
                    <Link
                      href="/orders"
                      className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-black transition-all ${
                        isNavActive("/orders")
                          ? "border-slate-900 bg-primary-100 text-primary-900 shadow-neo-sm dark:border-slate-700 dark:bg-primary-950/60 dark:text-primary-300"
                          : "border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      Daftar Orderan
                    </Link>
                    <Link
                      href="/categories"
                      className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-black transition-all ${
                        isNavActive("/categories")
                          ? "border-slate-900 bg-primary-100 text-primary-900 shadow-neo-sm dark:border-slate-700 dark:bg-primary-950/60 dark:text-primary-300"
                          : "border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      Kelola Kategori
                    </Link>
                    <Link
                      href="/profile"
                      className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-sm font-black transition-all ${
                        isNavActive("/profile")
                          ? "border-slate-900 bg-primary-100 text-primary-900 shadow-neo-sm dark:border-slate-700 dark:bg-primary-950/60 dark:text-primary-300"
                          : "border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      Profil &amp; QRIS
                    </Link>
                  </>
                )}
              </nav>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="border-t-2 border-slate-900/10 dark:border-slate-800 pt-4 space-y-3">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    setLogoutOpen(true);
                  }}
                  className="btn btn-danger w-full text-xs font-bold"
                >
                  Logout Akun
                </button>
              ) : (
                <Link
                  href="/login"
                  className="btn btn-primary w-full text-xs font-bold"
                  onClick={() => setDrawerOpen(false)}
                >
                  Login Penjoki &rarr;
                </Link>
              )}
            </div>
          </aside>
        </>
      )}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
