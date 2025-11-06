// src/app/api/sizes/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    const sizes = await prisma.size.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(sizes);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener las tallas" },
      { status: 500 },
    );
  }
}
