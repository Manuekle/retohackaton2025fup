import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  console.log("Start seeding...");

  // 1. Limpiar datos existentes
  await prisma.saleItem.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.clientType.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Cleaned up database.");

  // 2. Crear usuarios (admin y customer)
  const adminPassword = await bcrypt.hash("password123", 10);
  const customerPassword = await bcrypt.hash("password123", 10);

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@gmail.com",
      name: "Admin User",
      password: adminPassword,
      role: "admin",
    },
  });
  console.log(`Created admin user: ${adminUser.email} (password: password123)`);

  const customerUser = await prisma.user.create({
    data: {
      email: "customer@gmail.com",
      name: "Customer User",
      password: customerPassword,
      role: "customer",
    },
  });
  console.log(
    `Created customer user: ${customerUser.email} (password: password123)`,
  );

  // 3. Crear datos base (Tipos de Cliente, Categorías)
  const clientTypes = await prisma.clientType.createManyAndReturn({
    data: [
      { name: "Mujer" },
      { name: "Hombre" },
      { name: "Niño" },
      { name: "Niña" },
    ],
  });

  const categoriesData = [
    { name: "Abrigos" },
    { name: "Bermudas" },
    { name: "Buzos" },
    { name: "Camisas" },
    { name: "Faldas" },
    { name: "Hogar" },
    { name: "Jeans" },
    { name: "Pantalones" },
    { name: "Pijamas" },
    { name: "Ropa Interior" },
    { name: "Terceras Piezas" },
    { name: "T-Shirts" },
    { name: "Vestidos" },
    { name: "Polos" },
    { name: "Ropa de Baño" },
  ];
  const categories = await prisma.category.createManyAndReturn({
    data: categoriesData,
  });
  console.log("Created base data.");

  // 4. Crear productos con tallas
  const sizes = {
    Mujer: ["XXS", "XS", "S", "M", "L", "XL"],
    Hombre: ["XXS", "XS", "S", "M", "L", "XL"],
    Niño: ["4", "6", "8", "10", "12", "14", "16"],
    Niña: ["4", "6", "8", "10", "12", "14", "16"],
  };

  const productsData = [
    // Mujer
    { name: "ABRIGO", categoryName: "Abrigos", sizes: sizes.Mujer },
    { name: "BERMUDA", categoryName: "Bermudas", sizes: sizes.Mujer },
    { name: "BUZOS", categoryName: "Buzos", sizes: sizes.Mujer },
    { name: "CAMISAS", categoryName: "Camisas", sizes: sizes.Mujer },
    { name: "FALDA", categoryName: "Faldas", sizes: sizes.Mujer },
    { name: "JEANS TERMINADOS", categoryName: "Jeans", sizes: sizes.Mujer },
    // Hombre
    { name: "BUZO", categoryName: "Buzos", sizes: sizes.Hombre },
    { name: "POLOS", categoryName: "Polos", sizes: sizes.Hombre },
    // Niño & Niña
    { name: "PANTALONES", categoryName: "Pantalones", sizes: sizes.Niño },
    { name: "ROPA DE BAÑO", categoryName: "Ropa de Baño", sizes: sizes.Niño },
    { name: "TSHIRT TERMINADA", categoryName: "T-Shirts", sizes: sizes.Niña },
    { name: "VESTIDOS", categoryName: "Vestidos", sizes: sizes.Niña },
  ];

  const categoryMap = categories.reduce(
    (acc, cat) => ({ ...acc, [cat.name]: cat.id }),
    {} as Record<string, string>,
  );

  await Promise.all(
    productsData.map((p) =>
      prisma.product.create({
        data: {
          name: p.name,
          categoryId: categoryMap[p.categoryName],
          // Precios en COP: entre 20.000 y 500.000 COP
          price: Math.floor(Math.random() * 480000) + 20000,
          stock: Math.floor(Math.random() * 200) + 50,
          description: `Producto ${p.name} de la categoría ${p.categoryName}`,
          sizes: p.sizes,
        },
      }),
    ),
  );
  const allProducts = await prisma.product.findMany();
  console.log("Created products.");

  // 5. Crear 5 clientes de ejemplo
  const customersData = [
    {
      name: "María García",
      email: "maria@gmail.com",
      phone: "+57 300 123 4567",
      clientTypeId: clientTypes[0].id,
    }, // Mujer
    {
      name: "Juan Pérez",
      email: "juan@gmail.com",
      phone: "+57 300 234 5678",
      clientTypeId: clientTypes[1].id,
    }, // Hombre
    {
      name: "Ana Martínez",
      email: "ana@gmail.com",
      phone: "+57 300 345 6789",
      clientTypeId: clientTypes[0].id,
    }, // Mujer
    {
      name: "Carlos Rodríguez",
      email: "carlos@gmail.com",
      phone: "+57 300 456 7890",
      clientTypeId: clientTypes[1].id,
    }, // Hombre
    {
      name: "Laura Sánchez",
      email: "laura@gmail.com",
      phone: "+57 300 567 8901",
      clientTypeId: clientTypes[0].id,
    }, // Mujer
  ];

  const customers = await Promise.all(
    customersData.map((data) =>
      prisma.customer.create({
        data,
      }),
    ),
  );
  console.log("Created 5 customers.");

  // 6. Generar datos de ventas aleatorios
  const salesToCreate = 150;
  const sales = [];
  const saleSizes = {
    Mujer: ["XXS", "XS", "S", "M", "L", "XL"],
    Hombre: ["XXS", "XS", "S", "M", "L", "XL"],
    Niño: ["4", "6", "8", "10", "12", "14", "16"],
    Niña: ["4", "6", "8", "10", "12", "14", "16"],
  };

  // Generar fechas solo de este año (2025)
  const currentYear = 2025;
  const startOfYear = new Date(currentYear, 0, 1); // 1 de enero de 2025
  const now = new Date(); // Fecha actual
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59); // 31 de diciembre de 2025
  const endDate = now < endOfYear ? now : endOfYear; // Usar la fecha actual si es menor que fin de año

  for (let i = 0; i < salesToCreate; i++) {
    const product = allProducts[Math.floor(Math.random() * allProducts.length)];
    const clientType =
      clientTypes[Math.floor(Math.random() * clientTypes.length)];
    const quantity = Math.floor(Math.random() * 5) + 1;
    // Precio unitario en COP: entre 20.000 y 500.000 COP
    const unitPrice = Math.floor(Math.random() * 480000) + 20000;
    const totalPrice = quantity * unitPrice;
    // Generar fecha aleatoria entre inicio de año y fecha actual
    const randomTime =
      startOfYear.getTime() +
      Math.random() * (endDate.getTime() - startOfYear.getTime());
    const date = new Date(randomTime);
    const clientSizes = saleSizes[clientType.name as keyof typeof saleSizes];
    const size = clientSizes[Math.floor(Math.random() * clientSizes.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];

    sales.push(
      prisma.sale.create({
        data: {
          customerId: customer.id,
          clientTypeId: clientType.id,
          total: totalPrice,
          date,
          status: "completed",
          items: {
            create: {
              productId: product.id,
              quantity,
              price: unitPrice,
              size,
            },
          },
        },
      }),
    );
  }

  await Promise.all(sales);
  console.log(`Created ${salesToCreate} sales.`);

  console.log("Seeding finished.");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
