"use client";

import Image from "next/image";

/**
 * File fallback sources jika dibutuhkan untuk <img>, favicon, atau tag meta eksternal.
 */
export const SAVEN_LOGO_FILES = {
  saven: {
    light: "/images/logo-saven.svg",
    dark: "/images/logo-saven-white.svg",
  },
  "saven-flat": {
    light: "/images/logo-saven-flat.svg",
    dark: "/images/logo-saven-flat-white.svg",
  },
  // Alias praktis
  normal: "/images/logo-saven.svg",
  white: "/images/logo-saven-white.svg",
  flat: "/images/logo-saven-flat.svg",
  flatWhite: "/images/logo-saven-flat-white.svg",
};

/**
 * Komponen khusus SavenLogo.
 * Merender vektor SVG inline secara langsung (zero latency, zero layout shift)
 * dengan opsi fallback ke file .svg jika asImage/fallback aktif.
 *
 * Props:
 * - style / variant: "saven" | "saven-flat" (default: "saven")
 * - mode: "auto" | "light" | "dark" (default: "auto", otomatis adaptif dark mode via Tailwind)
 * - size: number | string (default: 32)
 * - className: string
 * - asImage / fallback: boolean (merender tag <img> / Next Image ke file SVG)
 */
export default function SavenLogo({
  variant = "saven",
  style,
  mode = "auto",
  size = 32,
  className = "",
  alt = "Logo Saven",
  asImage = false,
  fallback = false,
  ...props
}) {
  const selectedStyle = style || variant;
  const isFlat = selectedStyle === "saven-flat" || selectedStyle === "flat";

  // Jika diminta menggunakan file SVG sebagai fallback / image tag
  if (asImage || fallback) {
    let src = SAVEN_LOGO_FILES.normal;
    if (isFlat) {
      src = mode === "dark" ? SAVEN_LOGO_FILES.flatWhite : SAVEN_LOGO_FILES.flat;
    } else {
      src = mode === "dark" ? SAVEN_LOGO_FILES.white : SAVEN_LOGO_FILES.normal;
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
  // Style 1: Saven Standard (Neobrutalism Dimensional Badge)
  if (!isFlat) {
    if (mode === "light") {
      return <SavenBadgeLight size={size} className={className} alt={alt} {...props} />;
    }
    if (mode === "dark") {
      return <SavenBadgeDark size={size} className={className} alt={alt} {...props} />;
    }

    // Auto Mode: Responsive terhadap class "dark" di HTML parent tanpa delay JS
    return (
      <span className={`inline-block ${className}`} style={{ width: size, height: size }}>
        <span className="block dark:hidden w-full h-full">
          <SavenBadgeLight size="100%" alt={alt} {...props} />
        </span>
        <span className="hidden dark:block w-full h-full">
          <SavenBadgeDark size="100%" alt={alt} {...props} />
        </span>
      </span>
    );
  }

  // Style 2: Saven Flat (Clean Geometric Solid Badge)
  if (mode === "light") {
    return <SavenFlatLight size={size} className={className} alt={alt} {...props} />;
  }
  if (mode === "dark") {
    return <SavenFlatDark size={size} className={className} alt={alt} {...props} />;
  }

  // Auto Mode Flat
  return (
    <span className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <span className="block dark:hidden w-full h-full">
        <SavenFlatLight size="100%" alt={alt} {...props} />
      </span>
      <span className="hidden dark:block w-full h-full">
        <SavenFlatDark size="100%" alt={alt} {...props} />
      </span>
    </span>
  );
}

// Sub-komponen SVG Inline Murni:
function SavenBadgeLight({ size, className, alt, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={alt}
      fill="none"
      {...rest}
    >
      <defs>
        <linearGradient id="savenGradLight" x1="15%" y1="10%" x2="85%" y2="90%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <linearGradient id="savenAccentLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Hard Drop Shadow */}
      <rect x="18" y="18" width="84" height="84" rx="24" fill="#0F172A" />

      {/* Badge Canvas */}
      <rect
        x="14"
        y="14"
        width="84"
        height="84"
        rx="24"
        fill="#FFFFFF"
        stroke="#0F172A"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* S Geometric Ribbon */}
      <path
        d="M72 35 C72 28, 44 26, 38 36 C32 46, 68 47, 66 63 C64 77, 34 76, 34 68"
        stroke="url(#savenGradLight)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Checkmark Accent */}
      <path
        d="M48 62 L56 70 L76 50"
        stroke="url(#savenAccentLight)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Playful Dot */}
      <circle cx="78" cy="30" r="5" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.5" />
    </svg>
  );
}

function SavenBadgeDark({ size, className, alt, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={alt}
      fill="none"
      {...rest}
    >
      <defs>
        <linearGradient id="savenGradDarkComp" x1="10%" y1="10%" x2="90%" y2="90%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="60%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="savenAccentDarkComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* Glowing Hard Shadow */}
      <rect x="18" y="18" width="84" height="84" rx="24" fill="#4338CA" fillOpacity="0.6" />

      {/* Badge Canvas */}
      <rect
        x="14"
        y="14"
        width="84"
        height="84"
        rx="24"
        fill="#0B0F19"
        stroke="#818CF8"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* S Geometric Ribbon */}
      <path
        d="M72 35 C72 28, 44 26, 38 36 C32 46, 68 47, 66 63 C64 77, 34 76, 34 68"
        stroke="url(#savenGradDarkComp)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Checkmark Accent */}
      <path
        d="M48 62 L56 70 L76 50"
        stroke="url(#savenAccentDarkComp)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Playful Glowing Dot */}
      <circle cx="78" cy="30" r="5" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="2" />
    </svg>
  );
}

function SavenFlatLight({ size, className, alt, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={alt}
      fill="none"
      {...rest}
    >
      <rect x="16" y="16" width="88" height="88" rx="24" fill="#0F172A" />
      <path
        d="M74 36 C74 29, 46 27, 40 37 C34 47, 70 48, 68 64 C66 78, 36 77, 36 69"
        stroke="#FFFFFF"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M49 63 L57 71 L75 53"
        stroke="#34D399"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="78" cy="30" r="5" fill="#F59E0B" />
    </svg>
  );
}

function SavenFlatDark({ size, className, alt, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={alt}
      fill="none"
      {...rest}
    >
      <rect x="16" y="16" width="88" height="88" rx="24" fill="#FFFFFF" />
      <path
        d="M74 36 C74 29, 46 27, 40 37 C34 47, 70 48, 68 64 C66 78, 36 77, 36 69"
        stroke="#0F172A"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M49 63 L57 71 L75 53"
        stroke="#059669"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="78" cy="30" r="5" fill="#F59E0B" />
    </svg>
  );
}

SavenLogo.sources = SAVEN_LOGO_FILES;
export { SavenLogo };
