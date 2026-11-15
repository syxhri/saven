"use client";

import Image from "next/image";

/**
 * File fallback sources jika dibutuhkan untuk <img>, favicon, atau tag meta eksternal.
 */
export const SAVEN_LOGO_FILES = {
  normal: "/images/logo-saven.svg",
  white: "/images/logo-saven-white.svg",
  flat: "/images/logo-saven-flat.svg",
  flatWhite: "/images/logo-saven-flat-white.svg",
  saven: "/images/logo-saven.svg",
  "saven-flat": "/images/logo-saven-flat.svg",
};

/**
 * Komponen khusus SavenLogo.
 * Merender monogram vektor SVG Saven secara inline langsung:
 * Desain sangat simpel, elegan, modern, dan minimalis (S-stroke fluid + accent spark dot).
 *
 * Gaya flat adalah 100% transparan tanpa background (hanya logo utama).
 *
 * Props:
 * - variant / style: "flat" | "normal" | "white" | "flatWhite" | "saven" | "saven-flat" (default: "flat")
 * - mode: "auto" | "light" | "dark" (default: "auto", adaptif Tailwind dark mode)
 * - size: number | string (default: 32)
 * - className: string
 * - asImage / fallback: boolean (merender tag <img> / Next Image ke file SVG)
 */
export default function SavenLogo({
  variant = "flat",
  style,
  mode = "auto",
  size = 32,
  className = "",
  alt = "Logo Saven",
  asImage = false,
  fallback = false,
  ...props
}) {
  const selectedVariant = style || variant;
  const isFlat =
    selectedVariant === "flat" ||
    selectedVariant === "flatWhite" ||
    selectedVariant === "saven-flat";

  // Jika diminta menggunakan file SVG statis
  if (asImage || fallback) {
    let src = SAVEN_LOGO_FILES.flat;
    if (isFlat) {
      src =
        mode === "dark" || selectedVariant === "flatWhite"
          ? SAVEN_LOGO_FILES.flatWhite
          : SAVEN_LOGO_FILES.flat;
    } else {
      src =
        mode === "dark" || selectedVariant === "white"
          ? SAVEN_LOGO_FILES.white
          : SAVEN_LOGO_FILES.normal;
    }

    return (
      <Image
        src={src}
        alt={alt}
        width={typeof size === "number" ? size : 32}
        height={typeof size === "number" ? size : 32}
        className={className}
        {...props}
      />
    );
  }

  // --- Inline Vector Render ---
  // Style Flat: 100% Transparan tanpa background rectangle (hanya logo utama)
  if (isFlat) {
    if (mode === "light" && selectedVariant !== "flatWhite") {
      return (
        <svg
          viewBox="0 0 64 64"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={alt}
          {...props}
        >
          <g transform="translate(0 -1)">
            <circle cx="44" cy="20" r="4" fill="#F59E0B" />
            <path
              d="M36 20 H27 C22.5 20 19 23.5 19 28 C19 32.5 22.5 35.5 27 35.5 H37 C41.5 35.5 45 38.5 45 43 C45 47.5 41.5 51 37 51 H22"
              stroke="#4F46E5"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      );
    }

    if (mode === "dark" || selectedVariant === "flatWhite") {
      return (
        <svg
          viewBox="0 0 64 64"
          width={size}
          height={size}
          className={className}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label={alt}
          {...props}
        >
          <g transform="translate(0 -1)">
            <circle cx="44" cy="20" r="4" fill="#FACC15" />
            <path
              d="M36 20 H27 C22.5 20 19 23.5 19 28 C19 32.5 22.5 35.5 27 35.5 H37 C41.5 35.5 45 38.5 45 43 C45 47.5 41.5 51 37 51 H22"
              stroke="#FFFFFF"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      );
    }

    // Auto Mode: Mengikuti dark mode secara reaktif via class Tailwind
    return (
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        className={className}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={alt}
        {...props}
      >
        <g transform="translate(0 -1)">
          <circle
            cx="44"
            cy="20"
            r="4"
            className="fill-amber-500 dark:fill-yellow-400 transition-colors"
          />
          <path
            d="M36 20 H27 C22.5 20 19 23.5 19 28 C19 32.5 22.5 35.5 27 35.5 H37 C41.5 35.5 45 38.5 45 43 C45 47.5 41.5 51 37 51 H22"
            className="stroke-primary-600 dark:stroke-white transition-colors"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  }

  // Style Badge: Background rounded rectangle (rx=16)
  const isWhiteBadge = selectedVariant === "white";

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={alt}
      {...props}
    >
      <defs>
        <linearGradient id="savenGradInline" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
      </defs>

      <rect
        x="4"
        y="4"
        width="56"
        height="56"
        rx="16"
        fill={isWhiteBadge ? "#FFFFFF" : "url(#savenGradInline)"}
      />

      <g transform="translate(0 -1)">
        <circle
          cx="44"
          cy="20"
          r="4"
          fill={isWhiteBadge ? "#F59E0B" : "#FACC15"}
        />
        <path
          d="M36 20 H27 C22.5 20 19 23.5 19 28 C19 32.5 22.5 35.5 27 35.5 H37 C41.5 35.5 45 38.5 45 43 C45 47.5 41.5 51 37 51 H22"
          stroke={isWhiteBadge ? "#4F46E5" : "#FFFFFF"}
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

SavenLogo.sources = SAVEN_LOGO_FILES;
export { SavenLogo };
