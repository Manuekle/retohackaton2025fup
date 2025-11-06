// src/app/api/sales/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        customer: true,
        clientType: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      return NextResponse.json(
        { error: "Venta no encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(sale);
  } catch (error) {
    console.error("Error al obtener la venta:", error);
    return NextResponse.json(
      { error: "Error al obtener la venta" },
      { status: 500 },
    );
  }
}
