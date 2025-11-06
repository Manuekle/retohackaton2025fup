import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión - Reto Hackaton 2025 FUP",
  description:
    "Inicia sesión en tu cuenta para acceder al dashboard de análisis de inventario y ventas.",
  keywords: [
    "login",
    "iniciar sesión",
    "autenticación",
    "dashboard",
    "reto hackaton",
    "fup",
  ],
  openGraph: {
    title: "Iniciar Sesión - Reto Hackaton 2025 FUP",
    description: "Inicia sesión en tu cuenta para acceder al dashboard.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Iniciar Sesión - Reto Hackaton 2025 FUP",
    description: "Inicia sesión en tu cuenta para acceder al dashboard.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
