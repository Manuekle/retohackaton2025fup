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
    const sales = await prisma.sale.findMany({
      orderBy: { date: "asc" },
    });

    const salesByMonth = sales.reduce(
      (
        acc: Record<string, { name: string; total: number }>,
        sale: { date: Date; total: number },
      ) => {
        const month = new Date(sale.date).toLocaleString("es-MX", {
          month: "short",
          year: "2-digit",
        });
        if (!acc[month]) {
          acc[month] = { name: month, total: 0 };
        }
        acc[month].total += sale.total;
        return acc;
      },
      {},
    );

    const chartData = (
      Object.values(salesByMonth) as { name: string; total: number }[]
    ).sort((a, b) => {
      // Parse month names like "ene 25" to dates
      const parseMonth = (monthStr: string) => {
        const monthMap: Record<string, number> = {
          ene: 0,
          feb: 1,
          mar: 2,
          abr: 3,
          may: 4,
          jun: 5,
          jul: 6,
          ago: 7,
          sep: 8,
          oct: 9,
          nov: 10,
          dic: 11,
        };
        const parts = monthStr.split(" ");
        const month = monthMap[parts[0].toLowerCase()] || 0;
        const year = parseInt(`20${parts[1]}`) || new Date().getFullYear();
        return new Date(year, month, 1);
      };
      return parseMonth(a.name).getTime() - parseMonth(b.name).getTime();
    });

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error al obtener las ventas mensuales:", error);
    return NextResponse.json(
      { error: "Error Interno del Servidor" },
      { status: 500 },
    );
  }
}
