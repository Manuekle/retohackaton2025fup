// src/app/api/categories/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { withPrismaRetry } from "@/lib/database/prisma-retry";

export async function GET() {
  try {
    const categories = await withPrismaRetry(() =>
      prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    );
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener las categorías" },
      { status: 500 },
    );
  }
}
