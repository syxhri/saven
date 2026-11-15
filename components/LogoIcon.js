"use client";

import Image from "next/image";

const LOGO_SOURCES = {
  normal: "/images/logo-saven.svg",
  white: "/images/logo-saven-white.svg",
  flat: "/images/logo-saven-flat.svg",
  flatWhite: "/images/logo-saven-flat-white.svg",
};

export default function LogoIcon({
  variant = "normal",
  size = 32,
  className = "",
  alt = "Logo Saven",
  ...rest
}) {
  const src = LOGO_SOURCES[variant] ?? LOGO_SOURCES.normal;

  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      {...rest}
    />
  );
}

export { LogoIcon as SavenLogo };
