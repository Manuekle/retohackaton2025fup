// src/app/api/sales/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        customer: true,
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
  } catch {
    return NextResponse.json(
      { error: "Error al obtener las ventas" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      items,
      total,
      clientTypeId,
      date,
    } = await request.json();

    // Crear la venta
    const sale = await prisma.$transaction(async (prisma) => {
      // 1. Buscar o crear el cliente
      let customer;
      if (customerId) {
        // Si se proporciona un ID de cliente, usarlo
        customer = await prisma.customer.findUnique({
          where: { id: customerId },
        });
      } else if (customerName && customerEmail) {
        // Si se proporcionan datos del cliente, buscar por email o crear uno nuevo
        customer = await prisma.customer.findUnique({
          where: { email: customerEmail },
        });

        if (!customer) {
          // Crear nuevo cliente
          customer = await prisma.customer.create({
            data: {
              name: customerName,
              email: customerEmail,
              phone: customerPhone || null,
              address: customerAddress || null,
              clientTypeId: clientTypeId || null,
            },
          });
        } else {
          // Actualizar cliente existente si se proporcionan más datos
          customer = await prisma.customer.update({
            where: { id: customer.id },
            data: {
              name: customerName,
              phone: customerPhone || customer.phone,
              address: customerAddress || customer.address,
              clientTypeId: clientTypeId || customer.clientTypeId,
            },
          });
        }
      } else {
        throw new Error("Se requiere información del cliente");
      }

      // 2. Crear la venta
      const newSale = await prisma.sale.create({
        data: {
          customerId: customer.id,
          clientTypeId: clientTypeId || null,
          total: parseFloat(total),
          status: "completed",
          date: date ? new Date(date) : new Date(),
          items: {
            create: items.map(
              (item: {
                productId: string;
                quantity: string;
                price: string;
                size?: string;
              }) => ({
                productId: item.productId,
                quantity: parseInt(item.quantity),
                price: parseFloat(item.price),
                size: item.size || null,
              }),
            ),
          },
        },
        include: {
          items: true,
          customer: true,
        },
      });

      // 3. Actualizar el stock de los productos
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: parseInt(item.quantity),
            },
          },
        });
      }

      return newSale;
    });

    return NextResponse.json(sale);
  } catch (error) {
    console.error("Error al crear la venta:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error al crear la venta";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
