import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Reto Hackaton 2025 FUP - Dashboard de Análisis de Ventas",
    template: "%s | Reto Hackaton 2025 FUP",
  },
  description:
    "Solución completa de análisis de inventario y ventas para empresas de retail. Dashboard interactivo con KPIs, gráficos, recomendaciones automáticas y gestión de productos, clientes y ventas.",
  keywords: [
    "dashboard",
    "análisis de ventas",
    "inventario",
    "retail",
    "gestión de negocio",
    "KPIs",
    "estadísticas",
    "reportes",
    "ventas",
    "productos",
    "clientes",
  ],
  authors: [{ name: "Reto Hackaton 2025 FUP" }],
  creator: "Reto Hackaton 2025 FUP",
  publisher: "Reto Hackaton 2025 FUP",
  metadataBase: new URL("https://retahackaton2025fup.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Reto Hackaton 2025 FUP - Dashboard de Análisis de Ventas",
    description:
      "Solución completa de análisis de inventario y ventas para empresas de retail. Dashboard interactivo con KPIs, gráficos y recomendaciones automáticas.",
    url: "https://retahackaton2025fup.vercel.app",
    siteName: "Reto Hackaton 2025 FUP",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reto Hackaton 2025 FUP - Dashboard de Análisis de Ventas",
    description:
      "Solución completa de análisis de inventario y ventas para empresas de retail.",
    creator: "@retahackaton2025fup",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Agregar aquí los códigos de verificación si es necesario
    // google: "verification-code",
    // yandex: "verification-code",
  },
};
