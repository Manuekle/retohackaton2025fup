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
        where: {
          size: {
            not: null,
          },
          ...(dateRange
            ? {
                sale: {
                  date: dateRange,
                },
              }
            : {}),
        },
        select: {
          size: true,
          quantity: true,
        },
      }),
    );

    // Agrupar por talla
    const salesBySize = saleItems.reduce(
      (
        acc: Record<string, { name: string; value: number }>,
        item: { size: string | null; quantity: number },
      ) => {
        if (!item.size) return acc;

        const sizeName = item.size;
        if (!acc[sizeName]) {
          acc[sizeName] = { name: sizeName, value: 0 };
        }
        acc[sizeName].value += item.quantity;
        return acc;
      },
      {},
    );

    // Convertir a array y ordenar por valor descendente
    const result = Object.values(salesBySize).sort((a, b) => b.value - a.value);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error al obtener las ventas por talla:", error);
    return NextResponse.json(
      { error: "Error Interno del Servidor" },
      { status: 500 },
    );
  }
}
