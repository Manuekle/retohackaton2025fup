import { Metadata } from "next";
import DashboardPageClient from "./dashboard-page-client";

export const metadata: Metadata = {
  title: "Dashboard - Análisis de Ventas | Reto Hackaton 2025 FUP",
  description:
    "Panel de control principal con análisis de ventas, inventario, KPIs y recomendaciones automáticas para optimizar la gestión de tu negocio de retail.",
  keywords: [
    "dashboard",
    "análisis de ventas",
    "inventario",
    "KPIs",
    "retail",
    "gestión de negocio",
    "estadísticas de ventas",
  ],
  openGraph: {
    title: "Dashboard - Análisis de Ventas",
    description:
      "Panel de control principal con análisis de ventas, inventario y recomendaciones automáticas.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard - Análisis de Ventas",
    description:
      "Panel de control principal con análisis de ventas, inventario y recomendaciones automáticas.",
  },
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
