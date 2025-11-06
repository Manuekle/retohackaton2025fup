import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle de Compra",
  description: "Detalles de tu compra",
  keywords: ["compra", "detalle", "pedido"],
};

export default function PurchaseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
