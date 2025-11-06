import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { withPrismaRetry } from "@/lib/database/prisma-retry";

function getDateRange(timeRange: string) {
  const now = new Date();

  switch (timeRange) {
    case "month":
      return {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
      };
    case "quarter":
      const quarter = Math.floor(now.getMonth() / 3);
      return {
        gte: new Date(now.getFullYear(), quarter * 3, 1),
      };
    case "year":
      return {
        gte: new Date(now.getFullYear(), 0, 1),
      };
    default:
      return undefined;
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "all";

    const dateRange = getDateRange(timeRange);

    const saleItems = await withPrismaRetry(() =>
      prisma.saleItem.findMany({
        where: dateRange
          ? {
              sale: {
                date: dateRange,
              },
            }
          : undefined,
        include: {
          product: {
            include: {
              category: true,
            },
          },
        },
      }),
    );

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
