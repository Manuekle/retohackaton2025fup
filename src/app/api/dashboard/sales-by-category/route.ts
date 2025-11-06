import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const saleItems = await prisma.saleItem.findMany({
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    const categorySales = saleItems.reduce(
      (
        acc: Record<string, { name: string; total: number }>,
        item: {
          product: { category: { name: string } | null };
          quantity: number;
        },
      ) => {
        const categoryName = item.product.category?.name || "Sin categoría";
        if (!acc[categoryName]) {
          acc[categoryName] = { name: categoryName, total: 0 };
        }
        acc[categoryName].total += item.quantity;
        return acc;
      },
      {},
    );

    return NextResponse.json(Object.values(categorySales));
  } catch (error) {
    console.error("Error al obtener las ventas por categoría:", error);
    return NextResponse.json(
      { error: "Error Interno del Servidor" },
      { status: 500 },
    );
  }
}
