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
        where: {
          size: {
            not: null,
          },
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
