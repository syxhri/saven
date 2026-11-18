export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { findOrderByCode, markFileDownloaded } from "@/lib/db.js";
import { downloadFile, getMimeType } from "@/lib/storage.js";
import { apiLimiter, getClientIp } from "@/lib/client.js";

/**
 * GET /api/customer/orders/[orderCode]/download
 * Proxy download file hasil kerja.
 * - Cek is_paid = true
 * - Stream file dari Supabase ke browser customer
 * - Setelah sukses: tandai file_downloaded_at dan jadwalkan hapus 15 menit
 */
export async function GET(request, { params }) {
  const ip = getClientIp(request);
  const { success } = await apiLimiter.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Terlalu banyak request." }, { status: 429 });
  }

  try {
    const { orderCode } = await params;

    if (!orderCode || !orderCode.startsWith("OD")) {
      return NextResponse.json({ error: "Kode order tidak valid" }, { status: 400 });
    }

    const order = await findOrderByCode(orderCode);
    if (!order) {
      return NextResponse.json({ error: "Order tidak ditemukan" }, { status: 404 });
    }

    if (!order.is_paid) {
      return NextResponse.json(
        {
          error: "Selesaikan pembayaran terlebih dahulu untuk mengunduh file.",
          code: "PAYMENT_REQUIRED",
        },
        { status: 402 }
      );
    }

    if (!order.storage_path) {
      return NextResponse.json(
        {
          error: "File tidak tersedia. Mungkin sudah dihapus otomatis. Silakan hubungi penjoki untuk upload ulang.",
          code: "FILE_NOT_FOUND",
        },
        { status: 404 }
      );
    }

    // Unduh file dari Supabase Storage
    const { buffer, contentType } = await downloadFile(order.storage_path);

    // Tandai sudah didownload dan jadwalkan penghapusan 15 menit dari sekarang
    // (non-blocking, jangan sampai gagal download hanya karena ini)
    markFileDownloaded(order.id).catch((err) =>
      console.error("[Download] markFileDownloaded error:", err)
    );

    const filename = order.original_filename || order.storage_path.split("/").pop() || "hasil";
    const resolvedContentType = getMimeType(filename, contentType);
    const safeFilename = encodeURIComponent(filename);
    const cleanAsciiFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": resolvedContentType,
        "Content-Disposition": `attachment; filename="${cleanAsciiFilename}"; filename*=UTF-8''${safeFilename}`,
        "Content-Length": String(buffer.byteLength),
        "Access-Control-Expose-Headers": "Content-Disposition",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Failed to download file:", err);
    return NextResponse.json({ error: "Gagal mengunduh file" }, { status: 500 });
  }
}
