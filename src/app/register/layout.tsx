import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrarse - Reto Hackaton 2025 FUP",
  description:
    "Crea una cuenta nueva para acceder al dashboard de análisis de inventario y ventas.",
  keywords: [
    "registro",
    "registrarse",
    "crear cuenta",
    "dashboard",
    "reto hackaton",
    "fup",
  ],
  openGraph: {
    title: "Registrarse - Reto Hackaton 2025 FUP",
    description: "Crea una cuenta nueva para acceder al dashboard.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Registrarse - Reto Hackaton 2025 FUP",
    description: "Crea una cuenta nueva para acceder al dashboard.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
