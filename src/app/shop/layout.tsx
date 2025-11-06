import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tienda - Catálogo de Productos",
  description: "Explora nuestro catálogo de productos y realiza tus compras",
  keywords: ["tienda", "productos", "compras", "catálogo"],
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
