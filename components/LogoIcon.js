"use client";

import SavenLogo, { SAVEN_LOGO_FILES } from "./SavenLogo";

/**
 * Komponen LogoIcon kompatibel yang meneruskan ke SavenLogo.
 */
export default function LogoIcon(props) {
  return <SavenLogo {...props} />;
}

export { SavenLogo, SAVEN_LOGO_FILES };
