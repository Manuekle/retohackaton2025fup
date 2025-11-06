import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { withPrismaRetry } from "@/lib/database/prisma-retry";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const saleItems = await withPrismaRetry(() =>
      prisma.saleItem.findMany({
        include: {
          product: true,
        },
      }),
    );

    const productSales = saleItems.reduce(
      (
        acc: Record<string, { name: string; quantity: number }>,
        item: { product: { id: string; name: string }; quantity: number },
      ) => {
        const productId = item.product.id;
        if (!acc[productId]) {
          acc[productId] = { name: item.product.name, quantity: 0 };
        }
        acc[productId].quantity += item.quantity;
        return acc;
      },
      {},
    );

    const sortedProducts = Object.values(productSales).sort(
      (a, b) => b.quantity - a.quantity,
    );

    const topProducts = sortedProducts.slice(0, 3);
    const bottomProducts = sortedProducts.slice(-3).reverse();

    return NextResponse.json({ topProducts, bottomProducts });
  } catch (error) {
    console.error("Error al obtener las recomendaciones:", error);
    return NextResponse.json(
      { error: "Error Interno del Servidor" },
      { status: 500 },
    );
  }
}
