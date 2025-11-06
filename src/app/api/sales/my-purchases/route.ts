import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Buscar el customer por email del usuario
    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email },
    });

    if (!customer) {
      // Si no hay customer, retornar array vacío
      return NextResponse.json([]);
    }

    // Obtener todas las ventas de este customer
    const sales = await prisma.sale.findMany({
      where: {
        customerId: customer.id,
      },
      include: {
        customer: true,
        clientType: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error al obtener las compras del usuario:", error);
    return NextResponse.json(
      { error: "Error al obtener las compras" },
      { status: 500 },
    );
  }
}
