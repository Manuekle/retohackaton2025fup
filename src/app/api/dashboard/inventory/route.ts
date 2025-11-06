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
    // Get all products with their current stock levels
    const products = await withPrismaRetry(() =>
      prisma.product.findMany({
        include: {
          category: true,
          saleItems: {
            select: {
              quantity: true,
            },
          },
        },
      }),
    );

    // Calculate current stock based on sales (this is a simplified example)
    // In a real app, you'd want to track inventory movements separately
    const inventoryData = products.map((product) => {
      const totalSold = product.saleItems.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );

      // Use the product's stock field as the current stock
      // In a real system, you'd update this based on purchases and sales
      const currentStock = Math.max(0, product.stock - totalSold);

      return {
        id: product.id,
        name: product.name,
        category: product.category?.name || "Sin categoría",
        currentStock,
        minimumStock: 10, // This should come from your product settings
        maximumStock: 200, // This should come from your product settings
      };
    });

    return NextResponse.json(inventoryData);
  } catch (error) {
    console.error("Error al obtener el inventario:", error);
    return NextResponse.json(
      { error: "Error Interno del Servidor" },
      { status: 500 },
    );
  }
}
