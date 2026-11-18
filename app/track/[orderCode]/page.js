"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import QRISLogo from "@/components/QRISLogo";
import QRCode from "@/components/QRCode";
import { convertQrisStaticToDynamic } from "@/lib/qris";
import ReceiptCard from "@/components/ReceiptCard";

function buildQrisWithAmount(qris, amount) {
  try {
    const result = convertQrisStaticToDynamic(qris, amount);
    return result;
  } catch {
    return qris;
  }
}

function getDeadlineInfo(deadlineDate, status) {
  if (!deadlineDate || status === "done" || status === "rejected") return null;
  const deadline = new Date(deadlineDate);
  deadline.setHours(23, 59, 59, 999);
  const now = new Date();
  const diffMs = deadline - now;
  if (diffMs <= 0) {
    return {
      text: "Deadline Terlewat",
      color: "text-red-700 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900",
    };
  }
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  const remHours = diffHours % 24;
  if (diffDays > 0) {
    return {
      text: `Sisa: ${diffDays} hari ${remHours > 0 ? `${remHours} jam` : ""}`,
      color: diffDays <= 1
        ? "text-amber-700 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900"
        : "text-primary-700 bg-primary-50 dark:bg-primary-950/40 border-primary-200 dark:border-primary-900",
    };
  }
  return {
    text: `Sisa: ${diffHours} jam`,
    color: "text-red-700 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900",
  };
}

const STATUS_CONFIG = {
  pending:  { label: "Menunggu Konfirmasi", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300" },
  accepted: { label: "Diterima & Diproses", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  rejected: { label: "Ditolak", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
  done:     { label: "Selesai", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  manual:   { label: "Diproses", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
};

function PaymentDialog({ order }) {
  const [qrisDataUrl, setQrisDataUrl] = useState("");
  const qrisWithAmount = order.jokiQrisPayload && order.price ? buildQrisWithAmount(order.jokiQrisPayload, order.price) : null;
  const waMsg = "Halo, saya ingin konfirmasi pembayaran pesanan *" + order.orderCode + "* - " + order.taskName + ".\n\nMohon dikonfirmasi ya, terima kasih!";
  const waLink = order.jokiWhatsapp ? "https://wa.me/" + order.jokiWhatsapp.replace(/[^0-9]/g, "").replace(/^0/, "62") + "?text=" + encodeURIComponent(waMsg) : null;
  function downloadQris() {
    if (!qrisDataUrl) return;
    const link = document.createElement("a");
    link.href = qrisDataUrl;
    link.download = "QRIS_" + (order.orderCode || "ORDER") + ".png";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  }
  return (
    <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-amber-50/80 dark:bg-amber-950/20 p-5 space-y-4 shadow-neo dark:shadow-neo-dark">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center rounded-lg border-2 border-slate-900 bg-amber-200 dark:border-slate-700 dark:bg-amber-900/60 px-2.5 py-0.5 text-xs font-black text-amber-950 dark:text-amber-200">
          PEMBAYARAN
        </span>
        <h2 className="font-bold text-slate-900 dark:text-amber-200">Selesaikan Pembayaran</h2>
      </div>
      <div className="space-y-1 text-sm text-slate-800 dark:text-amber-300 font-medium">
        <p><span className="font-bold">Total Bayar: </span>Rp {Number(order.price || 0).toLocaleString("id-ID")}</p>
        {order.estimatedHours && <p><span className="font-bold">Estimasi: </span>{order.estimatedHours} jam</p>}
      </div>
      <div className="rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-900/30 dark:border-slate-700 p-4 space-y-2">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Cara Bayar &amp; Kirim Bukti:</p>
        <ol className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside font-medium">
          <li>Scan QRIS di bawah atau transfer manual ke penjoki</li>
          <li>Kirim bukti pembayaran ke WhatsApp penjoki:{" "}
            {waLink ? <a href={waLink} target="_blank" rel="noopener noreferrer" className="font-bold text-primary-600 underline">Chat penjoki</a>
                    : <span className="font-bold">{order.jokiName || order.jokiUsername}</span>}
          </li>
          <li>Tunggu konfirmasi dari penjoki, lalu kamu bisa download hasil</li>
        </ol>
      </div>
      {qrisWithAmount && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-800 dark:text-amber-300">QR Pembayaran (sudah include nominal):</p>
          <div className="flex items-center justify-center rounded-2xl bg-white p-4 border-2 border-slate-900 dark:border-slate-700 shadow-neo-sm">
            <QRCode value={qrisWithAmount} size={200} onDataUrl={setQrisDataUrl} />
          </div>
          <button onClick={downloadQris} className="btn btn-secondary w-full text-xs font-bold">Download QRIS</button>
        </div>
      )}
    </div>
  );
}

function PushBanner({ orderCode, onSubscribed }) {
  // "idle" | "loading" | "done" | "denied" | "error" | "unsupported"
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported"); return;
    }
    if (Notification.permission === "denied") { setStatus("denied"); return; }
    if (Notification.permission === "granted") { autoSubscribe(); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function autoSubscribe() {
    try {
      // Pastikan SW sudah terdaftar sebelum pakai .ready
      await navigator.serviceWorker.register("/sw.js");
      const reg = await navigator.serviceWorker.ready;
      const vapidRes = await fetch("/api/customer/orders/" + orderCode + "/push-subscribe");
      if (!vapidRes.ok) return; // gagal silently — biarkan banner tetap idle
      const { vapidPublicKey } = await vapidRes.json();
      if (!vapidPublicKey) return;
      let sub = await reg.pushManager.getSubscription();
      if (!sub) { sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidPublicKey }); }
      await fetch("/api/customer/orders/" + orderCode + "/push-subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      setStatus("done"); onSubscribed?.();
    } catch {
      // Gagal auto-subscribe: jangan ubah status, biarkan banner "idle" tampil
      // supaya user bisa klik manual
    }
  }

  async function subscribe() {
    setStatus("loading");
    setErrorMsg("");
    try {
      await navigator.serviceWorker.register("/sw.js");
      const reg = await navigator.serviceWorker.ready;
      const vapidRes = await fetch("/api/customer/orders/" + orderCode + "/push-subscribe");
      const { vapidPublicKey } = await vapidRes.json();
      if (!vapidPublicKey) {
        setStatus("error");
        setErrorMsg("Gagal mendapatkan konfigurasi notifikasi. Coba lagi nanti.");
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === "denied") {
        setStatus("denied");
        return;
      }
      if (permission !== "granted") {
        // User menutup dialog tanpa memilih — kembali ke idle
        setStatus("idle");
        return;
      }
      let sub = await reg.pushManager.getSubscription();
      if (!sub) { sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: vapidPublicKey }); }
      await fetch("/api/customer/orders/" + orderCode + "/push-subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
      setStatus("done"); onSubscribed?.();
    } catch (err) {
      console.error("Push subscribe error:", err);
      setStatus("error");
      setErrorMsg("Gagal mengaktifkan notifikasi. Pastikan browser kamu mendukung fitur ini.");
    }
  }

  // Sudah subscribe berhasil — tidak perlu tampilkan apa-apa
  if (status === "done" || status === "unsupported") return null;

  // Notifikasi diblokir oleh browser — tampilkan panduan
  if (status === "denied") {
    return (
      <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4 shadow-neo-sm">
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Notifikasi diblokir. Untuk aktifkan, buka pengaturan browser dan izinkan notifikasi untuk situs ini, lalu muat ulang halaman.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-slate-900 dark:border-slate-700 bg-sky-50 dark:bg-sky-950/30 p-4 flex items-start gap-3 shadow-neo dark:shadow-neo-dark">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-sky-900 dark:text-sky-200">Aktifkan Notifikasi</p>
        <p className="text-xs text-sky-700 dark:text-sky-300 mt-0.5 font-medium">Dapatkan update otomatis saat pesanan diterima, selesai, atau ada pengingat bayar.</p>
        {status === "error" && (
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-1">{errorMsg}</p>
        )}
        <button
          onClick={subscribe}
          disabled={status === "loading"}
          className="mt-2.5 btn btn-primary text-xs py-1.5 px-3 disabled:opacity-60"
        >
          {status === "loading" ? "Menunggu izin..." : status === "error" ? "Coba Lagi" : "Izinkan Notifikasi"}
        </button>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  const { orderCode } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const receiptRef = useRef(null);

  const fetchOrder = useCallback(async () => {
    if (!orderCode) return;
    try {
      const res = await fetch("/api/customer/orders/" + orderCode, { cache: "no-store" });
      if (!res.ok) { const data = await res.json().catch(() => ({})); setError(data.error || "Order tidak ditemukan"); return; }
      const data = await res.json(); setOrder(data);
    } catch { setError("Gagal mengambil data pesanan"); } finally { setLoading(false); }
  }, [orderCode]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  useEffect(() => {
    if ("serviceWorker" in navigator) { navigator.serviceWorker.register("/sw.js").catch(() => {}); }
  }, []);

  useEffect(() => {
    if (!order || order.status === "rejected" || (order.status === "done" && order.hasFile)) return;
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [order, fetchOrder]);

  async function handleDownload() {
    setDownloading(true); setDownloadError("");
    try {
      const res = await fetch("/api/customer/orders/" + orderCode + "/download");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setDownloadError(data.code === "FILE_NOT_FOUND" ? "File sudah tidak tersedia (dihapus otomatis). Hubungi penjoki untuk upload ulang." : data.error || "Gagal mengunduh file");
        return;
      }
      const blob = await res.blob();
      const contentDisposition = res.headers.get("content-disposition") || "";
      const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?["']?([^"';]+)/i);
      const filename = match?.[1]
        ? decodeURIComponent(match[1])
        : order?.fileName || order?.taskName?.replace(/[^a-zA-Z0-9]/g, "_") || "hasil";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      setTimeout(fetchOrder, 1000);
    } catch { setDownloadError("Terjadi kesalahan saat mengunduh"); } finally { setDownloading(false); }
  }

  const statusCfg = order ? (STATUS_CONFIG[order.status] || STATUS_CONFIG.manual) : null;
  const showPaymentDialog = order && (order.status === "accepted" || order.status === "done") && !order.isPaid;

  async function handleReceiptDownloadPng() {
    if (!receiptRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const el = receiptRef.current;
      const width = el.offsetWidth || 380;
      const height = el.offsetHeight || 500;
      const canvas = await html2canvas(el, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        width: width,
        height: height,
        windowWidth: width,
        windowHeight: height,
        onclone: (clonedDoc) => {
          const target = clonedDoc.querySelector("[data-receipt-card]") || clonedDoc.body.firstChild;
          if (target) {
            target.style.width = `${width}px`;
            target.style.maxWidth = `${width}px`;
            target.style.minWidth = `${width}px`;
            target.style.boxSizing = "border-box";
            target.style.margin = "0";
            target.style.padding = "20px";
            target.style.backgroundColor = "#ffffff";
          }
        },
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `Struk_${order.orderCode || "ORDER"}.png`;
      a.click();
    } catch {}
  }

  async function handleReceiptDownloadPdf() {
    if (!receiptRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const el = receiptRef.current;
      const width = el.offsetWidth || 380;
      const height = el.offsetHeight || 500;
      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        width: width,
        height: height,
        windowWidth: width,
        windowHeight: height,
        onclone: (clonedDoc) => {
          const target = clonedDoc.querySelector("[data-receipt-card]") || clonedDoc.body.firstChild;
          if (target) {
            target.style.width = `${width}px`;
            target.style.maxWidth = `${width}px`;
            target.style.minWidth = `${width}px`;
            target.style.boxSizing = "border-box";
            target.style.margin = "0";
            target.style.padding = "20px";
            target.style.backgroundColor = "#ffffff";
          }
        },
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 140;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xOffset = (210 - imgWidth) / 2;
      pdf.addImage(imgData, "PNG", xOffset, 15, imgWidth, imgHeight);
      pdf.save(`Struk_${order.orderCode || "ORDER"}.pdf`);
    } catch {}
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
      <div className="space-y-2 text-center">
        <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-gray-500">Memuat status orderan...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4">
      <div className="text-center space-y-5 max-w-sm">
        <svg className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="20" strokeLinecap="round"/>
          <path d="M16 30c1.5-3 4.5-5 8-5s6.5 2 8 5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="17" cy="20" r="2" fill="currentColor" stroke="none"/>
          <circle cx="31" cy="20" r="2" fill="currentColor" stroke="none"/>
        </svg>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">{error}</h1>
          <p className="text-sm text-gray-500">Pastikan kode orderan sudah benar, atau buat orderan baru.</p>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="/track" className="btn btn-secondary text-sm">Cari Orderan Lain</a>
          <a href="/book" className="btn btn-primary text-sm">Buat Orderan Baru</a>
        </div>
      </div>
    </div>
  );

  const receiptData = order ? {
    orderCode: order.orderCode,
    client_name: order.clientName || order.customerName || "-",
    task_name: order.taskName,
    category_name: order.categoryName,
    deadline_date: order.deadlineDate,
    price: order.price,
    is_done: order.isDone || order.status === "done",
    is_paid: order.isPaid,
    notes: order.notes,
  } : null;

  const deadlineInfo = order ? getDeadlineInfo(order.deadlineDate, order.status) : null;

  return (
    <div className="py-8 sm:py-12 px-4 max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900/10 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-slate-900/30 bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300">
              Live Order Tracker
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">
              #{orderCode}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {order.taskName}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/track"
            className="btn btn-secondary text-xs py-2 px-3.5 font-bold"
          >
            &larr; Cari Order Lain
          </Link>
          <Link
            href="/book"
            className="btn btn-primary text-xs py-2 px-3.5 font-bold"
          >
            + Pesan Baru
          </Link>
        </div>
      </div>

      {/* 2-Column Desktop Architecture */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column (5 Cols): Progress, Payment & Contact */}
        <div className="lg:col-span-5 space-y-5">
          {/* Stepper Status Card */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-neo-md dark:shadow-neo-dark-md border-3 border-slate-900 dark:border-slate-700 p-6 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className={"inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black border-2 border-slate-900 dark:border-slate-700 shadow-neo-sm " + statusCfg.color}>
                <span>{statusCfg.label}</span>
              </div>
              {deadlineInfo && (
                <span className={`text-xs font-black px-2.5 py-1 rounded-full border-2 border-slate-900 dark:border-slate-700 shadow-neo-sm ${deadlineInfo.color}`}>
                  {deadlineInfo.text}
                </span>
              )}
            </div>

            <div className="space-y-3 pt-1">
              {[{ key: "pending", label: "Orderan Terkirim" }, { key: "accepted", label: "Diproses Penjoki" }, { key: "done", label: "Pengerjaan Selesai" }].map((step, i) => {
                const statuses = ["pending", "accepted", "done"];
                const isDone = i <= statuses.indexOf(order.status) && order.status !== "rejected";
                const isRejected = order.status === "rejected" && i === 0;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={"h-8 w-8 flex-shrink-0 rounded-xl border-2 border-slate-900 dark:border-slate-700 flex items-center justify-center text-xs font-black shadow-neo-sm " + (isDone ? "bg-primary-600 text-white" : isRejected ? "bg-rose-500 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400")}>
                      {isDone ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : isRejected ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <span className={"text-sm " + (isDone ? "text-slate-900 dark:text-slate-100 font-black" : "text-slate-400 font-medium")}>
                      {step.label}{step.key === "accepted" && order.status === "rejected" ? " (Ditolak)" : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Card (QRIS) */}
          {showPaymentDialog && <PaymentDialog order={order} />}

          {/* Kontak Penjoki */}
          {(order.jokiWhatsapp || order.jokiName || order.jokiUsername) && (
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl p-4 shadow-neo dark:shadow-neo-dark">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl border-2 border-slate-900 dark:border-slate-700 bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 flex items-center justify-center font-black text-sm flex-shrink-0 shadow-neo-sm">
                  {(order.jokiName || order.jokiUsername || "P")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Penjoki Bertugas</p>
                  <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {order.jokiName || order.jokiUsername}
                  </p>
                </div>
              </div>
              {order.jokiWhatsapp && (
                <a
                  href={"https://wa.me/" + order.jokiWhatsapp.replace(/[^0-9]/g, "").replace(/^0/, "62") + "?text=" + encodeURIComponent("Halo, saya ingin menanyakan pesanan *" + orderCode + "* - " + (order.taskName || "") + ".")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary text-xs py-2 px-3 font-black shadow-neo-sm"
                >
                  Chat WA &rarr;
                </a>
              )}
            </div>
          )}

          {/* Push Banner */}
          {order.status !== "rejected" && <PushBanner orderCode={orderCode} onSubscribed={fetchOrder} />}

          <p className="text-center text-xs text-slate-400 pt-2 font-medium">
            Simpan link halaman ini untuk memantau status pesanan kapan pun.
          </p>
        </div>

        {/* Right Column (7 Cols): Receipt & Hasil Pengerjaan */}
        <div className="lg:col-span-7 space-y-5">
          {/* Order Ditolak Alert */}
          {order.status === "rejected" && (
            <div className="rounded-3xl bg-rose-50 dark:bg-rose-950/30 border-3 border-rose-500 p-6 text-center space-y-3 shadow-neo">
              <p className="font-black text-rose-800 dark:text-rose-200 text-lg">Order Ditolak</p>
              <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">Maaf, penjoki tidak dapat menerima ordermu saat ini. Kamu bisa memesan ke penjoki lain.</p>
              <Link href="/book" className="btn btn-primary text-xs font-black">Buat Orderan Baru &rarr;</Link>
            </div>
          )}

          {/* Detail Pesanan & Struk Pembayaran */}
          {receiptData && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 shadow-neo-md dark:shadow-neo-dark-md border-3 border-slate-900 dark:border-slate-700 p-6 space-y-5">
              <div className="flex items-center justify-between border-b-2 border-slate-900/10 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-black text-slate-900 dark:text-slate-50 uppercase tracking-wider">
                  Struk &amp; Detail Pesanan
                </h2>
                <span className={`text-xs font-black px-3 py-0.5 rounded-full border-2 border-slate-900 dark:border-slate-700 shadow-neo-sm ${order.isPaid ? "bg-emerald-300 text-slate-950" : "bg-amber-300 text-slate-950"}`}>
                  {order.isPaid ? "✓ Lunas" : "Menunggu Bayar"}
                </span>
              </div>

              {/* Receipt Card */}
              <div className="rounded-2xl border-2 border-slate-900/15 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40 p-2 sm:p-4" data-receipt-root>
                <ReceiptCard order={receiptData} ref={receiptRef} variant="plain" />
              </div>

              {/* Unduh Struk (Hanya jika sudah lunas) */}
              {order.isPaid && (
                <div className="space-y-2 pt-2 border-t-2 border-slate-900/10 dark:border-slate-800">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">Unduh Struk Resmi</span>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={handleReceiptDownloadPdf}
                      className="btn btn-secondary flex-1 text-xs py-2.5 font-black shadow-neo-sm"
                    >
                      📄 Download PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleReceiptDownloadPng}
                      className="btn btn-secondary flex-1 text-xs py-2.5 font-black shadow-neo-sm"
                    >
                      🖼️ Download PNG
                    </button>
                  </div>
                </div>
              )}

              {/* Hasil Pengerjaan (Disatukan di sini agar ringkas) */}
              {order.status === "done" && (
                <div className="border-t-2 border-slate-900/10 dark:border-slate-800 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Hasil Pengerjaan</h3>
                    {order.isPaid && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-black">✓ Berkas Siap Diunduh</span>}
                  </div>

                  {!order.isPaid ? (
                    <p className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 p-3.5 rounded-2xl font-medium">
                      Selesaikan pembayaran terlebih dahulu untuk mengakses file hasil pengerjaan.
                    </p>
                  ) : order.hasExternalLink ? (
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">File tersedia via link cloud eksternal:</p>
                      {order.externalLink ? (
                        <a href={order.externalLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full text-xs py-2.5 font-black inline-flex items-center justify-center gap-2 shadow-neo">
                          Buka Link Hasil Tugas (Drive / Cloud) &rarr;
                        </a>
                      ) : (
                        <p className="text-xs text-amber-600">Link tidak tersedia.</p>
                      )}
                    </div>
                  ) : !order.hasFile ? (
                    <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border-2 border-slate-900 dark:border-slate-700 p-4 text-xs text-amber-900 dark:text-amber-200 space-y-2 shadow-neo-sm">
                      <p className="font-bold">File sudah tidak tersedia atau sudah kedaluwarsa otomatis. Hubungi penjoki untuk upload ulang.</p>
                      {order.jokiWhatsapp && (
                        <a
                          href={"https://wa.me/" + order.jokiWhatsapp.replace(/[^0-9]/g, "").replace(/^0/, "62") + "?text=" + encodeURIComponent("Halo, bisakah file untuk pesanan " + orderCode + " diupload ulang? Terima kasih!")}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary text-xs inline-flex items-center gap-1.5 font-black py-1.5 px-3"
                        >
                          Chat Penjoki Minta Upload Ulang
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {order.fileName && (
                        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-900/10 dark:border-slate-700 text-xs">
                          <span className="text-base">📁</span>
                          <div className="truncate flex-1">
                            <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{order.fileName}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              {order.fileName.toLowerCase().endsWith(".psd") ? "Format Adobe Photoshop (.psd)" : "Berkas Hasil Tugas"}
                            </p>
                          </div>
                        </div>
                      )}
                      {downloadError && (
                        <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 p-2.5 text-xs text-rose-800 dark:text-rose-200 font-bold">
                          {downloadError}
                        </div>
                      )}
                      <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="btn btn-primary w-full text-xs font-black py-3 shadow-neo"
                      >
                        {downloading ? "Mengunduh Berkas..." : "🚀 Unduh File Hasil Tugas"}
                      </button>
                      <p className="text-[10px] text-slate-400 text-center font-medium">
                        File disimpan aman dan otomatis dibersihkan secara berkala demi privasi.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}