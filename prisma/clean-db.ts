import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log("🧹 Limpiando la base de datos...");
  console.log("⚠️  Nota: Si tienes problemas con el pool de conexiones,");
  console.log("    considera usar 'npm run db:reset' en su lugar.\n");

  try {
    // Eliminar en orden para respetar las relaciones de foreign keys
    // Usar deleteMany directamente - si falla por timeout, usar db:reset

    console.log("Eliminando SaleItems...");
    await prisma.saleItem.deleteMany({});
    console.log("✅ SaleItems eliminados");

    console.log("Eliminando Sales...");
    await prisma.sale.deleteMany({});
    console.log("✅ Sales eliminadas");

    console.log("Eliminando Customers...");
    await prisma.customer.deleteMany({});
    console.log("✅ Customers eliminados");

    console.log("Eliminando ProductSizes...");
    await prisma.productSize.deleteMany({});
    console.log("✅ ProductSizes eliminados");

    console.log("Eliminando Products...");
    await prisma.product.deleteMany({});
    console.log("✅ Products eliminados");

    console.log("Eliminando Sizes...");
    await prisma.size.deleteMany({});
    console.log("✅ Sizes eliminados");

    console.log("Eliminando Categories...");
    await prisma.category.deleteMany({});
    console.log("✅ Categories eliminadas");

    console.log("Eliminando ClientTypes...");
    await prisma.clientType.deleteMany({});
    console.log("✅ ClientTypes eliminados");

    console.log("Eliminando Users...");
    await prisma.user.deleteMany({});
    console.log("✅ Users eliminados");

    console.log("\n✨ Base de datos limpiada exitosamente!");
  } catch (error: any) {
    console.error("\n❌ Error al limpiar la base de datos:", error.message);
    console.error("\n💡 Solución recomendada:");
    console.error("   Ejecuta: npm run db:reset");
    console.error(
      "   Esto reseteará completamente la base de datos y aplicará las migraciones.",
    );
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase().catch((e) => {
  console.error(e);
  process.exit(1);
});
