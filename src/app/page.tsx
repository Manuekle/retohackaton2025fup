import { Metadata } from "next";
import { HomeContent } from "./home-content";

export const metadata: Metadata = {
  title: "Inicio - Reto Hackaton 2025 FUP",
  description:
    "Bienvenido al Reto Hackaton 2025 FUP. Solución de análisis de inventario y ventas para empresas de retail.",
  keywords: [
    "reto hackaton",
    "fup",
    "inventario",
    "ventas",
    "retail",
    "dashboard",
    "análisis",
  ],
  openGraph: {
    title: "Reto Hackaton 2025 FUP - Inicio",
    description:
      "Bienvenido al Reto Hackaton 2025 FUP. Solución de análisis de inventario y ventas.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reto Hackaton 2025 FUP - Inicio",
    description: "Bienvenido al Reto Hackaton 2025 FUP.",
  },
};

export default function Home() {
  return <HomeContent />;
}
