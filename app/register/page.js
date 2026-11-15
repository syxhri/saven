export const dynamic = "force-dynamic";

import RegisterClient from "./registerClient";

export const metadata = {
  title: "Saven - Register",
  description: "Buat akun Saven",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function RegisterPage({ searchParams }) {
  const next = searchParams?.next || "/";

  return <RegisterClient next={next} />;
}
