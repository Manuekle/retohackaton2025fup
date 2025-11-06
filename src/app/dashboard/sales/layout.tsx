import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ventas - Gestión de Transacciones | Reto Hackaton 2025 FUP",
  description:
    "Administra y visualiza todas tus ventas. Crea nuevas transacciones, consulta el historial de ventas y gestiona los estados de las órdenes para optimizar tu negocio de retail.",
  keywords: [
    "ventas",
    "transacciones",
    "gestión de ventas",
    "historial de ventas",
    "retail",
    "administración de ventas",
    "ordenes",
  ],
  openGraph: {
    title: "Ventas - Gestión de Transacciones",
    description:
      "Administra y visualiza todas tus ventas. Crea nuevas transacciones y consulta el historial.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ventas - Gestión de Transacciones",
    description:
      "Administra y visualiza todas tus ventas. Crea nuevas transacciones y consulta el historial.",
  },
};

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
