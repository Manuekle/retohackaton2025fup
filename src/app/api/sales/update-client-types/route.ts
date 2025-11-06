// Script para actualizar las ventas existentes con clientTypeId basado en sus productos
import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { withPrismaRetry } from "@/lib/database/prisma-retry";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Obtener todas las ventas que no tienen clientTypeId
    const salesWithoutClientType = await withPrismaRetry(() =>
      prisma.sale.findMany({
        where: {
          clientTypeId: null,
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  clientTypeId: true,
                },
              },
            },
          },
        },
      }),
    );

    let updatedCount = 0;

    // Actualizar cada venta
    for (const sale of salesWithoutClientType) {
      if (sale.items.length === 0) continue;

      // Determinar el clientTypeId más común entre los productos
      const clientTypeCounts = new Map<string, number>();
      sale.items.forEach((item) => {
        if (item.product.clientTypeId) {
          clientTypeCounts.set(
            item.product.clientTypeId,
            (clientTypeCounts.get(item.product.clientTypeId) || 0) + 1,
          );
        }
      });

      // Obtener el clientTypeId más común, o el del primer producto si no hay uno común
      let selectedClientTypeId: string | null = null;
      if (clientTypeCounts.size > 0) {
        const sortedClientTypes = Array.from(clientTypeCounts.entries()).sort(
          (a, b) => b[1] - a[1],
        );
        selectedClientTypeId = sortedClientTypes[0][0];
      } else if (sale.items.length > 0 && sale.items[0].product.clientTypeId) {
        selectedClientTypeId = sale.items[0].product.clientTypeId;
      }

      // Actualizar la venta si se encontró un clientTypeId
      if (selectedClientTypeId) {
        await withPrismaRetry(() =>
          prisma.sale.update({
            where: { id: sale.id },
            data: { clientTypeId: selectedClientTypeId },
          }),
        );
        updatedCount++;
      }
    }

    return NextResponse.json({
      message: `Se actualizaron ${updatedCount} ventas`,
      total: salesWithoutClientType.length,
      updated: updatedCount,
    });
  } catch (error) {
    console.error("Error al actualizar las ventas:", error);
    return NextResponse.json(
      { error: "Error al actualizar las ventas" },
      { status: 500 },
    );
  }
}
