// src/app/api/client-types/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    const clientTypes = await prisma.clientType.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return NextResponse.json(clientTypes);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener los tipos de cliente" },
      { status: 500 },
    );
  }
}
