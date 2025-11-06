import { Metadata } from "next";
import { prisma } from "@/lib/database/prisma";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sale = await prisma.sale.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!sale) {
    return {
      title: "Venta no encontrada | Reto Hackaton 2025 FUP",
      description: "La venta solicitada no fue encontrada.",
    };
  }

  const customerName = sale.customer?.name || "Sin cliente";
  const total = sale.total.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const date = sale.date
    ? new Date(sale.date).toLocaleDateString("es-CO")
    : new Date(sale.createdAt).toLocaleDateString("es-CO");

  return {
    title: `Venta #${sale.id.slice(0, 8)} - ${customerName} | Reto Hackaton 2025 FUP`,
    description: `Detalle de venta del ${date} por un total de ${total}. Cliente: ${customerName}. Estado: ${sale.status === "completed" ? "Completada" : sale.status === "pending" ? "Pendiente" : "Cancelada"}.`,
    keywords: [
      "venta",
      "detalle de venta",
      "transacción",
      "orden",
      "cliente",
      customerName,
      "retail",
    ],
    openGraph: {
      title: `Venta #${sale.id.slice(0, 8)} - ${customerName}`,
      description: `Detalle de venta del ${date} por un total de ${total}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Venta #${sale.id.slice(0, 8)} - ${customerName}`,
      description: `Detalle de venta del ${date} por un total de ${total}`,
    },
  };
}

export default function SaleDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
