/**
 * lib/storage.js
 * Wrapper Supabase Storage untuk upload, download (stream), dan delete file hasil joki.
 *
 * Bucket: private (tidak bisa diakses publik tanpa signed URL)
 * Path: order-results/{orderCode}/{filename}
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || "order-results";

function getSupabase() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error(
      "Missing Supabase env vars: SUPABASE_URL and SUPABASE_SERVICE_KEY are required"
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Daftar ekstensi yang DIBLACKLIST karena potensi eksekusi kode di server.
 * Format: lowercase extension tanpa titik.
 */
const BLACKLISTED_EXTENSIONS = new Set([
  "exe", "msi", "bat", "cmd", "sh", "bash",
  "php", "php3", "php4", "php5", "phtml",
  "py", "pyc", "rb", "pl", "perl", "cgi",
  "jar", "war", "ear",
  "dll", "so", "dylib",
  "vbs", "vbe", "wsf", "wsh",
  "ps1", "ps2", "psm1",
  "app", "deb", "rpm",
  "htaccess", "htpasswd",
]);

/**
 * Daftar MIME type yang DIBLACKLIST.
 */
const BLACKLISTED_MIME_PREFIXES = [
  "application/x-executable",
  "application/x-sharedlib",
  "application/x-shellscript",
  "application/x-php",
  "text/x-php",
  "application/x-msdos-program",
  "application/x-msdownload",
];

/**
 * Pemetaan MIME type berdasarkan ekstensi untuk file hasil kerja.
 * Khususnya file desain seperti Photoshop (.psd) yang sering kali tidak dikenali
 * oleh browser di sistem operasi tertentu (misal Windows yang mengirim MIME kosong / application/octet-stream).
 */
const MIME_BY_EXTENSION = {
  // Desain & Grafis (Photoshop, Illustrator, dll)
  psd: "image/vnd.adobe.photoshop",
  psb: "image/vnd.adobe.photoshop",
  ai: "application/postscript",
  eps: "application/postscript",
  indd: "application/x-indesign",
  sketch: "application/x-sketch",
  fig: "application/x-figma",
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
  tiff: "image/tiff",
  tif: "image/tiff",

  // Dokumen
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  csv: "text/csv",

  // Arsip
  zip: "application/zip",
  rar: "application/x-rar-compressed",
  "7z": "application/x-7z-compressed",
  tar: "application/x-tar",
  gz: "application/gzip",
};

/**
 * Resolusi MIME type yang tepat dari nama file dan MIME yang dideteksi browser.
 * Jika browser mengirimkan tipe kosong atau generic (application/octet-stream),
 * ekstensi file akan digunakan untuk mendapatkan MIME type resmi (misal .psd -> image/vnd.adobe.photoshop).
 */
export function getMimeType(filename, detectedMime = "") {
  if (filename) {
    const ext = filename.toLowerCase().split(".").pop();
    if (ext && MIME_BY_EXTENSION[ext]) {
      if (!detectedMime || detectedMime === "application/octet-stream") {
        return MIME_BY_EXTENSION[ext];
      }
    }
  }
  return detectedMime || "application/octet-stream";
}

/**
 * Validasi file sebelum diupload.
 * @returns {{ ok: boolean, error?: string }}
 */
export function validateFile(filename, mimetype, sizeBytes) {
  // Cek ukuran (max 50MB sesuai limit Supabase free tier)
  const MAX_BYTES = 50 * 1024 * 1024;
  if (sizeBytes > MAX_BYTES) {
    return {
      ok: false,
      error: `Ukuran file terlalu besar (>50 MB). Silakan gunakan opsi 'Link External' (Google Drive / Mega / Dropbox) untuk file besar (seperti file PSD resolusi tinggi atau arsip besar).`,
    };
  }

  // Ambil semua ekstensi (e.g. "malware.pdf.exe" → ["pdf", "exe"])
  const parts = filename.toLowerCase().split(".");
  parts.shift(); // buang nama file sebelum titik pertama
  for (const ext of parts) {
    if (BLACKLISTED_EXTENSIONS.has(ext)) {
      return {
        ok: false,
        error: `Tipe file .${ext} tidak diizinkan karena alasan keamanan.`,
      };
    }
  }

  // Cek MIME type
  if (mimetype) {
    const mime = mimetype.toLowerCase();
    for (const blocked of BLACKLISTED_MIME_PREFIXES) {
      if (mime.startsWith(blocked)) {
        return {
          ok: false,
          error: `Tipe MIME ${mime} tidak diizinkan.`,
        };
      }
    }
  }

  return { ok: true };
}

/**
 * Sanitasi nama file: hanya izinkan karakter aman, ganti spasi dengan underscore.
 */
export function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-zA-Z0-9.\-_() ]/g, "_")
    .replace(/\s+/g, "_")
    .substring(0, 200); // max 200 char
}

/**
 * Upload file ke Supabase Storage.
 * @param {string} orderCode - kode order (dipakai sebagai subfolder)
 * @param {Buffer|Uint8Array} fileBuffer - isi file
 * @param {string} filename - nama file asli (akan disanitasi)
 * @param {string} mimetype - MIME type file
 * @returns {Promise<{ storagePath: string, contentType: string }>}
 */
export async function uploadFile(orderCode, fileBuffer, filename, mimetype) {
  const supabase = getSupabase();
  const safeName = sanitizeFilename(filename);
  const storagePath = `${orderCode}/${safeName}`;
  const resolvedMime = getMimeType(filename, mimetype);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: resolvedMime,
      upsert: true, // izinkan overwrite untuk re-upload
    });

  if (error) {
    console.error("[Storage] Upload error:", error);
    throw new Error(`Gagal mengupload file: ${error.message}`);
  }

  return { storagePath, contentType: resolvedMime };
}

/**
 * Download file dari Supabase Storage sebagai Buffer (untuk di-proxy ke client).
 * @param {string} storagePath - path di storage (e.g. "OD1234/hasil.pdf")
 * @returns {Promise<{ data: ArrayBuffer, contentType: string }>}
 */
export async function downloadFile(storagePath) {
  const supabase = getSupabase();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .download(storagePath);

  if (error || !data) {
    console.error("[Storage] Download error:", error);
    throw new Error(`Gagal mengunduh file: ${error?.message || "File tidak ditemukan"}`);
  }

  const buffer = await data.arrayBuffer();
  let contentType = data.type || "application/octet-stream";
  if (!contentType || contentType === "application/octet-stream") {
    const filename = storagePath.split("/").pop();
    contentType = getMimeType(filename, contentType);
  }
  return { buffer, contentType };
}

/**
 * Hapus file dari Supabase Storage.
 * @param {string} storagePath
 */
export async function deleteFile(storagePath) {
  if (!storagePath) return;
  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) {
    console.error("[Storage] Delete error:", error);
    // Tidak throw — file mungkin sudah terhapus, tidak perlu crash
  }
}
