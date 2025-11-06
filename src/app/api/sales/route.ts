// src/app/api/sales/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/database/prisma";
import { withPrismaRetry } from "@/lib/database/prisma-retry";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";

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
      date,
    } = await request.json();

    // Obtener la sesión del usuario si está autenticado
    const session = await getServerSession(authOptions);

    // Crear la venta
    const sale = await withPrismaRetry(async () => {
      return await prisma.$transaction(async (prisma) => {
        // 1. Buscar o crear el cliente
        let customer;
        if (customerId) {
          // Si se proporciona un ID de cliente, usarlo
          customer = await prisma.customer.findUnique({
            where: { id: customerId },
          });
          if (!customer) {
            throw new Error("Cliente no encontrado");
          }
        } else if (customerName && customerEmail) {
          // Si se proporcionan datos del cliente, buscar por email o crear uno nuevo
          customer = await prisma.customer.findUnique({
            where: { email: customerEmail },
          });

          if (!customer) {
            // Buscar si existe un usuario con este email para asociarlo
            let userId: string | null = null;
            if (session?.user?.email === customerEmail) {
              userId = session.user.id;
            } else {
              const user = await prisma.user.findUnique({
                where: { email: customerEmail },
                select: { id: true },
              });
              if (user) {
                userId = user.id;
              }
            }

            // Crear nuevo cliente
            customer = await prisma.customer.create({
              data: {
                name: customerName,
                email: customerEmail,
                phone: customerPhone || null,
                address: customerAddress || null,
                userId: userId,
              },
            });
          } else {
            // Actualizar cliente existente si se proporcionan más datos
            // Si hay un usuario autenticado y el cliente no tiene userId, asociarlo
            let userId = customer.userId;
            if (!userId && session?.user?.email === customerEmail) {
              userId = session.user.id;
            } else if (!userId) {
              const user = await prisma.user.findUnique({
                where: { email: customerEmail },
                select: { id: true },
              });
              if (user) {
                userId = user.id;
              }
            }

            customer = await prisma.customer.update({
              where: { id: customer.id },
              data: {
                name: customerName,
                phone: customerPhone || customer.phone,
                address: customerAddress || customer.address,
                userId: userId || customer.userId,
              },
            });
          }
        } else {
          throw new Error("Se requiere información del cliente");
        }

        // 2. Obtener el clientTypeId del primer producto (o el más común si hay múltiples)
        // Obtener los productos para determinar el clientTypeId
        const productIds = items.map(
          (item: { productId: string }) => item.productId,
        );

        if (productIds.length === 0) {
          throw new Error("No se proporcionaron productos para la venta");
        }

        const products = await prisma.product.findMany({
          where: {
            id: {
              in: productIds,
            },
          },
          select: {
            id: true,
            clientTypeId: true,
            stock: true,
          },
        });

        // Validar que todos los productos existan
        if (products.length !== productIds.length) {
          throw new Error("Uno o más productos no fueron encontrados");
        }

        // Validar stock antes de crear la venta
        for (const item of items) {
          const product = products.find((p) => p.id === item.productId);
          if (!product) {
            throw new Error(`Producto ${item.productId} no encontrado`);
          }
          const quantity = parseInt(item.quantity);
          if (product.stock < quantity) {
            throw new Error(
              `Stock insuficiente para el producto ${product.id}. Stock disponible: ${product.stock}, solicitado: ${quantity}`,
            );
          }
        }

        // Determinar el clientTypeId más común entre los productos
        const clientTypeCounts = new Map<string, number>();
        products.forEach((product) => {
          if (product.clientTypeId) {
            clientTypeCounts.set(
              product.clientTypeId,
              (clientTypeCounts.get(product.clientTypeId) || 0) + 1,
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
        } else if (products.length > 0 && products[0].clientTypeId) {
          selectedClientTypeId = products[0].clientTypeId;
        }

        // 3. Crear la venta
        const newSale = await prisma.sale.create({
          data: {
            customerId: customer.id,
            clientTypeId: selectedClientTypeId,
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
            clientType: true,
          },
        });

        // 4. Actualizar el stock de los productos
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
    });

    return NextResponse.json(sale);
  } catch (error) {
    console.error("Error al crear la venta:", error);

    // Manejar errores específicos de Prisma
    if (error && typeof error === "object" && "code" in error) {
      const prismaError = error as { code?: string; message?: string };

      // Error de constraint único
      if (prismaError.code === "P2002") {
        return NextResponse.json(
          { error: "Error de duplicación en la base de datos" },
          { status: 409 },
        );
      }

      // Error de conexión con Prisma Accelerate
      if (prismaError.code === "P5010") {
        return NextResponse.json(
          { error: "Error de conexión. Por favor, intenta de nuevo." },
          { status: 503 },
        );
      }

      // Error de foreign key
      if (prismaError.code === "P2003") {
        return NextResponse.json(
          { error: "Error: Referencia inválida en la base de datos" },
          { status: 400 },
        );
      }
    }

    const errorMessage =
      error instanceof Error ? error.message : "Error al crear la venta";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
