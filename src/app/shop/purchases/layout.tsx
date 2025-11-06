import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mis Compras - Historial de Compras",
  description: "Revisa tu historial de compras y detalles de tus pedidos",
  keywords: ["compras", "historial", "pedidos", "mis compras"],
};

export default function PurchasesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
