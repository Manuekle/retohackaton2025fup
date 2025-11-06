// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener los productos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        sizes: data.sizes || [],
        categoryId: data.categoryId,
      },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 },
    );
  }
}
