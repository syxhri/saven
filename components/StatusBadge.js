/**
 * components/StatusBadge.js
 * Badge status untuk order di dashboard penjoki.
 * Mendukung type: "done", "paid", "order-status"
 */
export default function StatusBadge({ type, status }) {
  const base =
    "inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-bold whitespace-nowrap border-2 border-slate-900 dark:border-slate-700 shadow-neo-sm dark:shadow-neo-dark-sm";

  let label = "";
  let className = base;

  if (type === "done") {
    if (status) {
      label = "Selesai";
      className += " bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200";
    } else {
      label = "Belum Selesai";
      className += " bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200";
    }
  } else if (type === "paid") {
    if (status) {
      label = "Lunas";
      className += " bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200";
    } else {
      label = "Belum Lunas";
      className += " bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200";
    }
  } else if (type === "order-status") {
    // status = "pending" | "accepted" | "rejected" | "done" | "manual"
    switch (status) {
      case "pending":
        label = "Pending";
        className += " bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200";
        break;
      case "accepted":
        label = "Diterima";
        className += " bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-200";
        break;
      case "rejected":
        label = "Ditolak";
        className += " bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200";
        break;
      case "done":
        label = "Selesai";
        className += " bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200";
        break;
      default:
        label = "Manual";
        className += " bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
    }
  }

  if (!label) return null;
  return <span className={className}>{label}</span>;
}
