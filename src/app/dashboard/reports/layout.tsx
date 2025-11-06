import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reportes - Análisis y Estadísticas | Reto Hackaton 2025 FUP",
  description:
    "Visualiza reportes detallados de ventas, analiza tendencias por categoría y tipo de cliente, y genera insights para tomar decisiones basadas en datos para tu negocio de retail.",
  keywords: [
    "reportes",
    "análisis",
    "estadísticas",
    "tendencias",
    "ventas por categoría",
    "ventas por cliente",
    "insights",
    "retail",
    "business intelligence",
  ],
  openGraph: {
    title: "Reportes - Análisis y Estadísticas",
    description:
      "Visualiza reportes detallados de ventas, analiza tendencias por categoría y tipo de cliente.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reportes - Análisis y Estadísticas",
    description:
      "Visualiza reportes detallados de ventas, analiza tendencias por categoría y tipo de cliente.",
  },
};

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
