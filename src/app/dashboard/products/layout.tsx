import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos - Gestión de Inventario | Reto Hackaton 2025 FUP",
  description:
    "Administra tu catálogo de productos. Crea, edita y elimina productos, gestiona precios, stock y categorías para mantener tu inventario actualizado y optimizado.",
  keywords: [
    "productos",
    "inventario",
    "catálogo",
    "gestión de productos",
    "stock",
    "precios",
    "retail",
    "categorías",
  ],
  openGraph: {
    title: "Productos - Gestión de Inventario",
    description:
      "Administra tu catálogo de productos. Crea, edita y elimina productos, gestiona precios y stock.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Productos - Gestión de Inventario",
    description:
      "Administra tu catálogo de productos. Crea, edita y elimina productos, gestiona precios y stock.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
