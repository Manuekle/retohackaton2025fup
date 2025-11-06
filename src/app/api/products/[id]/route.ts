// src/app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        sizes: {
          include: {
            size: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 },
      );
    }

    // Transformar para incluir sizes como array de strings
    const productWithSizes = {
      ...product,
      sizes: product.sizes.map((ps) => ps.size.name),
    };

    return NextResponse.json(productWithSizes);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    return NextResponse.json(
      { error: "Error al obtener el producto" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const data = await request.json();

    // Obtener todas las tallas disponibles
    const allSizes = await prisma.size.findMany();
    const sizeMap = new Map(allSizes.map((s) => [s.name, s.id]));

    // Eliminar todas las relaciones de tallas existentes
    await prisma.productSize.deleteMany({
      where: { productId: id },
    });

    // Actualizar el producto
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
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
    console.error("Error al actualizar el producto:", error);
    return NextResponse.json(
      { error: "Error al actualizar el producto" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    return NextResponse.json(
      { error: "Error al eliminar el producto" },
      { status: 500 },
    );
  }
}
