/**
 * lib/url.js
 * Utilitas untuk mendeteksi dan menghasilkan base URL & hostname secara dinamis.
 * Menyesuaikan secara otomatis dengan:
 * 1. window.location di browser (client-side)
 * 2. process.env.NEXT_PUBLIC_SITE_URL / APP_URL (custom domain produksi)
 * 3. process.env.VERCEL_URL (otomatis disediakan oleh Vercel di preview & production)
 * 4. Fallback ke localhost:3000 saat development
 */

export function getBaseUrl() {
  // Client-side: selalu gunakan origin browser saat ini
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  // Server-side: cek environment variables
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }

  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/+$/, "");
  }

  // Vercel deployment: Vercel menyediakan VERCEL_URL tanpa protokol
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/+$/, "")}`;
  }

  // Fallback dev lokal
  return "http://localhost:3000";
}

export function getHostName() {
  if (typeof window !== "undefined" && window.location?.host) {
    return window.location.host;
  }

  try {
    const base = getBaseUrl();
    const parsed = new URL(base);
    return parsed.host;
  } catch {
    return "saven.vercel.app";
  }
}
