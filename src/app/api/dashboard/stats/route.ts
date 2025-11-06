import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const sales = await prisma.sale.findMany({
      include: {
        items: true,
      },
    });

    const totalRevenue = sales.reduce(
      (acc: number, sale: { total: number }) => acc + sale.total,
      0,
    );
    const totalQuantity = sales.reduce(
      (acc: number, sale: { items: { quantity: number }[] }) =>
        acc + sale.items.reduce((sum, item) => sum + item.quantity, 0),
      0,
    );
    const totalSales = sales.length;
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    return NextResponse.json({
      totalRevenue,
      totalQuantity,
      totalSales,
      averageOrderValue,
    });
  } catch (error) {
    console.error("Error al obtener las estadísticas del dashboard:", error);
    return NextResponse.json(
      { error: "Error Interno del Servidor" },
      { status: 500 },
    );
  }
}
