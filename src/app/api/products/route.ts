// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        sizes: {
          include: {
            size: true,
          },
        },
      },
    });

    // Transformar para incluir sizes como array de strings
    const productsWithSizes = products.map((product) => ({
      ...product,
      sizes: product.sizes.map((ps) => ps.size.name),
    }));

    return NextResponse.json(productsWithSizes);
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

    // Obtener todas las tallas disponibles
    const allSizes = await prisma.size.findMany();
    const sizeMap = new Map(allSizes.map((s) => [s.name, s.id]));

    // Crear el producto
    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        image: data.image || null,
        categoryId: data.categoryId || null,
        sizes: {
          create: (data.sizes || []).map((sizeName: string) => {
            const sizeId = sizeMap.get(sizeName);
            if (!sizeId) {
              throw new Error(`Talla ${sizeName} no encontrada`);
            }
            return { sizeId };
          }),
        },
      },
      include: {
        category: true,
        sizes: {
          include: {
            size: true,
          },
        },
      },
    });

    // Transformar para incluir sizes como array de strings
    const productWithSizes = {
      ...product,
      sizes: product.sizes.map((ps) => ps.size.name),
    };

    return NextResponse.json(productWithSizes);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 },
    );
  }
}
