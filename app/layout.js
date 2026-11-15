import Link from "next/link";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MissingWhatsappDialog from "@/components/MissingWhatsappDialog";
import EscHandler from "@/components/EscHandler";
import { getCurrentUser } from "@/lib/auth.js";
import { ThemeProvider } from "./ThemeProvider";
import { getBaseUrl } from "@/lib/url.js";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Saven - Solusi Joki Tugas Cepat & Terpercaya",
  description: "Platform joki tugas modern, cepat, dan transparan. Pantau tugasmu langsung tanpa ribet.",
  icons: {
    icon: "/images/logo-saven.svg",
    shortcut: "/images/logo-saven.svg",
    apple: "/images/logo-saven.svg",
  },
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  const initialUser = user
    ? { id: user.id, username: user.username, name: user.name || "" }
    : null;

  // Dialog wajib WA: hanya tampil untuk penjoki yang sudah login tapi belum isi WA
  const showWhatsappDialog =
    user && user.role === "joki" && !user.whatsappPhone;

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen bg-[#FAF9F5] text-slate-900 dark:bg-[#0B0F19] dark:text-slate-100 flex flex-col justify-between">
            <EscHandler />
            <Navbar initialUser={initialUser} />
            <main className="flex-1">{children}</main>
            <Footer />
            {/* Modal mandatory jika penjoki belum isi nomor WhatsApp */}
            {showWhatsappDialog && <MissingWhatsappDialog />}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

