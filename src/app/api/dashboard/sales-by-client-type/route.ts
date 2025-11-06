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
    const sales = await withPrismaRetry(() =>
      prisma.sale.findMany({
        include: {
          clientType: true,
          items: true,
        },
      }),
    );

    const salesByClientType = sales.reduce(
      (
        acc: Record<string, { name: string; value: number }>,
        sale: {
          clientType: { name: string } | null;
          items: { quantity: number }[];
        },
      ) => {
        const clientTypeName = sale.clientType?.name || "Sin tipo";
        if (!acc[clientTypeName]) {
          acc[clientTypeName] = { name: clientTypeName, value: 0 };
        }
        const totalQuantity = sale.items.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        acc[clientTypeName].value += totalQuantity;
        return acc;
      },
      {},
    );

    return NextResponse.json(Object.values(salesByClientType));
  } catch (error) {
    console.error("Error al obtener las ventas por tipo de cliente:", error);
    return NextResponse.json(
      { error: "Error Interno del Servidor" },
      { status: 500 },
    );
  }
}
