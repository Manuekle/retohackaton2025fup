# Reto Hackaton 2025 FUP - Dashboard de Análisis de Ventas

Este proyecto es una solución de software tipo web desarrollada para el Reto Hackaton 2025 FUP. La aplicación permite a una empresa de retail analizar sus ventas, controlar su inventario de manera eficiente y tomar decisiones basadas en datos.

## 🚀 Características Principales

- **Dashboard Interactivo:** Visualización clara de KPIs (Key Performance Indicators) como ingresos totales, artículos vendidos y total de transacciones.
- **Análisis de Ventas:** Gráficos que muestran las ventas por categoría, por tipo de cliente (género) y las tendencias de ventas mensuales.
- **Recomendaciones Automáticas:** Sistema que identifica productos con alta y baja rotación, sugiriendo acciones como aumentar stock o aplicar descuentos.
- **Autenticación Segura:** Sistema de inicio de sesión con credenciales (email y contraseña) para proteger el acceso al dashboard.
- **Modo Claro y Oscuro:** Interfaz con soporte para temas claro y oscuro para una mejor experiencia de usuario.
- **Diseño Responsive:** Interfaz completamente responsive que se adapta a dispositivos móviles, tablets y desktop.
- **Diseño Minimalista:** Estética limpia y moderna inspirada en el Twitter de 2016.
- **Validación de Formularios:** Validación completa con Zod y React Hook Form en todos los formularios.
- **SEO Optimizado:** Metadata completa, sitemap y robots.txt para mejor indexación.
- **Testing:** Suite completa de tests unitarios (Jest) y tests E2E (Playwright).

## 📦 Stack Tecnológico

- **Framework:** Next.js 15.2.0 (con App Router)
- **Lenguaje:** TypeScript 5.8.3
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma 6.18.0
- **Autenticación:** NextAuth.js 4.24.7
- **Estilos:** Tailwind CSS 4.0.9
- **Componentes UI:** shadcn/ui (Radix UI)
- **Visualización de Datos:** Recharts 2.15.1
- **Validación:** Zod 3.25.76
- **Formularios:** React Hook Form 7.54.2
- **Notificaciones:** Sonner 2.0.1
- **Animaciones:** Framer Motion 12.23.0
- **Fuentes:** Geist Fonts
- **Testing:** Jest 30.2.0, React Testing Library 16.3.0, Playwright 1.56.1
- **Linting y Formato:** ESLint, Prettier

## 🛠️ Instalación y Ejecución

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### 1. Prerrequisitos

- Node.js (v18 o superior)
- npm, yarn, o pnpm
- Una base de datos PostgreSQL en ejecución

### 2. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 3. Instalar Dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables. Reemplaza los valores con tus propias credenciales.

```env
# URL de conexión a tu base de datos PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# URL completa de la aplicación (para NextAuth)
NEXTAUTH_URL="http://localhost:3000"

# Clave secreta para firmar los JWT (puedes generar una con `openssl rand -base64 32`)
NEXTAUTH_SECRET="TU_CLAVE_SECRETA"
```

### 5. Migración de la Base de Datos

Aplica el esquema de Prisma a tu base de datos. Esto creará todas las tablas necesarias.

```bash
npx prisma migrate dev
```

### 6. Poblar la Base de Datos (Seeding)

Ejecuta el script de seeding para poblar la base de datos con datos de muestra (un usuario y más de 100 ventas aleatorias).

```bash
npx prisma db seed
```

El usuario creado por defecto es:

- **Email:** `admin@example.com`
- **Contraseña:** `password123`

### 7. Ejecutar el Proyecto

Inicia el servidor de desarrollo.

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

## 📁 Estructura del Proyecto

```
prueba-hack/
├── prisma/
│   ├── schema.prisma          # Esquema de la base de datos
│   └── seed.ts                # Script para poblar la base de datos
├── public/
│   ├── sponsors/              # Imágenes de sponsors
│   └── fup.png                # Logo FUP
├── src/
│   ├── app/                    # Rutas de la aplicación (App Router)
│   │   ├── api/               # Endpoints de la API REST
│   │   │   ├── auth/          # Autenticación
│   │   │   ├── categories/    # Categorías
│   │   │   ├── client-types/  # Tipos de cliente
│   │   │   ├── customers/     # Clientes
│   │   │   ├── dashboard/     # Estadísticas del dashboard
│   │   │   ├── products/     # Productos
│   │   │   ├── sales/        # Ventas
│   │   │   └── user/         # Perfil de usuario
│   │   ├── dashboard/         # Páginas protegidas del dashboard
│   │   │   ├── customers/    # Gestión de clientes
│   │   │   ├── products/     # Gestión de productos
│   │   │   ├── reports/      # Reportes y análisis
│   │   │   ├── sales/        # Gestión de ventas
│   │   │   └── settings/     # Configuración
│   │   ├── login/            # Página de inicio de sesión
│   │   ├── register/         # Página de registro
│   │   ├── layout.tsx        # Layout principal
│   │   ├── page.tsx          # Página principal
│   │   ├── metadata.ts       # Metadata global
│   │   ├── sitemap.ts        # Sitemap XML
│   │   └── robots.ts         # Robots.txt
│   ├── components/
│   │   ├── dashboard/        # Componentes específicos del dashboard
│   │   │   ├── AnimatedSidebar.tsx
│   │   │   ├── MonthlySalesChart.tsx
│   │   │   ├── SalesByCategoryChart.tsx
│   │   │   ├── SalesByClientTypeChart.tsx
│   │   │   ├── Recommendations.tsx
│   │   │   ├── InventoryStatus.tsx
│   │   │   └── ...
│   │   └── ui/               # Componentes de UI genéricos
│   │       ├── button.tsx
│   │       ├── data-table.tsx
│   │       ├── pagination.tsx
│   │       ├── password-input.tsx
│   │       ├── sponsor-carousel.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── auth/             # Configuración de NextAuth.js
│   │   ├── database/          # Instancia del cliente de Prisma
│   │   ├── utils/            # Utilidades compartidas
│   │   └── validations/      # Schemas de validación Zod
│   │       ├── auth.ts
│   │       ├── customer.ts
│   │       ├── product.ts
│   │       └── settings.ts
│   └── providers/            # Context providers
│       ├── auth-provider.tsx
│       └── theme-provider.tsx
├── e2e/                       # Tests end-to-end (Playwright)
│   ├── home.spec.ts
│   └── auth.spec.ts
├── jest.config.js             # Configuración de Jest
├── jest.setup.js              # Setup de Jest
├── playwright.config.ts       # Configuración de Playwright
└── package.json
```

## 🔌 API Endpoints

### Autenticación

#### `POST /api/auth/register`

Registra un nuevo usuario.

**Body:**

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Response:** `201 Created`

```json
{
  "id": "user_id",
  "email": "juan@example.com"
}
```

#### `POST /api/auth/[...nextauth]`

Endpoint de NextAuth para autenticación (login, logout, etc.).

---

### Productos

#### `GET /api/products`

Obtiene todos los productos con sus categorías.

**Response:** `200 OK`

```json
[
  {
    "id": "product_id",
    "name": "Camiseta",
    "description": "Camiseta de algodón",
    "price": 50000,
    "stock": 100,
    "categoryId": "category_id",
    "category": {
      "id": "category_id",
      "name": "Ropa"
    }
  }
]
```

#### `POST /api/products`

Crea un nuevo producto.

**Body:**

```json
{
  "name": "Camiseta",
  "description": "Camiseta de algodón",
  "price": "50000",
  "stock": "100",
  "categoryId": "category_id"
}
```

**Response:** `200 OK`

#### `GET /api/products/[id]`

Obtiene un producto específico por ID.

**Response:** `200 OK` o `404 Not Found`

#### `PUT /api/products/[id]`

Actualiza un producto existente.

**Body:**

```json
{
  "name": "Camiseta Actualizada",
  "description": "Nueva descripción",
  "price": "55000",
  "stock": "120",
  "categoryId": "category_id"
}
```

**Response:** `200 OK` o `404 Not Found`

#### `DELETE /api/products/[id]`

Elimina un producto.

**Response:** `200 OK` o `404 Not Found`

---

### Clientes

#### `GET /api/customers`

Obtiene todos los clientes.

**Response:** `200 OK`

```json
[
  {
    "id": "customer_id",
    "name": "María García",
    "email": "maria@example.com",
    "phone": "+57 300 123 4567",
    "address": "Calle 123",
    "clientTypeId": "client_type_id"
  }
]
```

#### `POST /api/customers`

Crea un nuevo cliente.

**Body:**

```json
{
  "name": "María García",
  "email": "maria@example.com",
  "phone": "+57 300 123 4567",
  "address": "Calle 123",
  "clientTypeId": "client_type_id"
}
```

**Response:** `200 OK`

#### `GET /api/customers/[id]`

Obtiene un cliente específico por ID.

**Response:** `200 OK` o `404 Not Found`

#### `PUT /api/customers/[id]`

Actualiza un cliente existente.

**Body:**

```json
{
  "name": "María García Actualizada",
  "email": "maria.nueva@example.com",
  "phone": "+57 300 999 9999",
  "address": "Nueva dirección",
  "clientTypeId": "client_type_id"
}
```

**Response:** `200 OK` o `404 Not Found`

#### `DELETE /api/customers/[id]`

Elimina un cliente.

**Response:** `200 OK` o `404 Not Found`

---

### Ventas

#### `GET /api/sales`

Obtiene todas las ventas con sus items, cliente y productos.

**Response:** `200 OK`

```json
[
  {
    "id": "sale_id",
    "customerId": "customer_id",
    "customer": { ... },
    "total": 150000,
    "status": "completed",
    "date": "2025-01-15T00:00:00.000Z",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "items": [
      {
        "id": "item_id",
        "productId": "product_id",
        "product": { ... },
        "quantity": 2,
        "price": 50000,
        "size": "M"
      }
    ]
  }
]
```

#### `POST /api/sales`

Crea una nueva venta y actualiza el stock de los productos.

**Body:**

```json
{
  "customerId": "customer_id",
  "branchId": "branch_id",
  "clientTypeId": "client_type_id",
  "total": "150000",
  "date": "2025-01-15",
  "items": [
    {
      "productId": "product_id",
      "quantity": "2",
      "price": "50000",
      "size": "M"
    }
  ]
}
```

**Response:** `200 OK`

#### `GET /api/sales/[id]`

Obtiene una venta específica por ID con todos sus detalles.

**Response:** `200 OK` o `404 Not Found`

---

### Dashboard (Estadísticas)

#### `GET /api/dashboard/stats`

Obtiene estadísticas generales del dashboard.

**Response:** `200 OK`

```json
{
  "totalRevenue": 5000000,
  "totalQuantity": 150,
  "totalSales": 50,
  "averageOrderValue": 100000
}
```

#### `GET /api/dashboard/sales-by-category`

Obtiene ventas agrupadas por categoría.

**Response:** `200 OK`

```json
[
  {
    "category": "Ropa",
    "total": 2000000,
    "quantity": 60
  }
]
```

#### `GET /api/dashboard/sales-by-client-type`

Obtiene ventas agrupadas por tipo de cliente.

**Response:** `200 OK`

```json
[
  {
    "clientType": "Mayorista",
    "total": 3000000,
    "quantity": 90
  }
]
```

#### `GET /api/dashboard/monthly-sales`

Obtiene ventas agrupadas por mes.

**Response:** `200 OK`

```json
[
  {
    "month": "Enero 2025",
    "total": 1500000,
    "sales": 25
  }
]
```

#### `GET /api/dashboard/recommendations`

Obtiene recomendaciones de productos (top y bottom sellers).

**Response:** `200 OK`

```json
{
  "topProducts": [
    {
      "name": "Camiseta",
      "quantity": 50
    }
  ],
  "bottomProducts": [
    {
      "name": "Pantalón",
      "quantity": 2
    }
  ]
}
```

#### `GET /api/dashboard/inventory`

Obtiene el estado del inventario.

**Response:** `200 OK`

```json
[
  {
    "id": "product_id",
    "name": "Camiseta",
    "currentStock": 50,
    "minimumStock": 10,
    "maximumStock": 200,
    "totalSold": 50,
    "category": "Ropa"
  }
]
```

---

### Categorías y Tipos de Cliente

#### `GET /api/categories`

Obtiene todas las categorías.

**Response:** `200 OK`

```json
[
  {
    "id": "category_id",
    "name": "Ropa"
  }
]
```

#### `GET /api/client-types`

Obtiene todos los tipos de cliente.

**Response:** `200 OK`

```json
[
  {
    "id": "client_type_id",
    "name": "Mayorista"
  }
]
```

---

### Usuario (Perfil)

#### `GET /api/user/profile`

Obtiene el perfil del usuario autenticado.

**Response:** `200 OK` o `401 Unauthorized`

```json
{
  "id": "user_id",
  "name": "Juan Pérez",
  "email": "juan@example.com"
}
```

#### `PUT /api/user/profile`

Actualiza el perfil del usuario autenticado.

**Body:**

```json
{
  "name": "Juan Pérez Actualizado"
}
```

**Response:** `200 OK` o `401 Unauthorized`

#### `PUT /api/user/password`

Cambia la contraseña del usuario autenticado.

**Body:**

```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

**Response:** `200 OK` o `401 Unauthorized`

---

## 🧪 Testing

### Tests Unitarios y de Componentes

Ejecuta los tests con Jest y React Testing Library:

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

### Tests End-to-End

Ejecuta los tests E2E con Playwright:

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar tests con UI interactiva
npm run test:e2e:ui

# Ejecutar tests en modo headed (ver el navegador)
npm run test:e2e:headed
```

### Ejecutar Todos los Tests

```bash
npm run test:all
```

Para más información sobre testing, consulta [README.testing.md](./README.testing.md).

## 📝 Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción
npm run lint         # Ejecuta ESLint
npm run format       # Formatea el código con Prettier
npm run type-check   # Verifica tipos TypeScript
npm run test         # Ejecuta tests unitarios
npm run test:e2e     # Ejecuta tests E2E
```

## 🎨 Características de Diseño

- **Responsive Design:** La aplicación se adapta completamente a dispositivos móviles, tablets y desktop.
- **Dark Mode:** Soporte completo para modo claro y oscuro con persistencia de preferencias.
- **Animaciones Suaves:** Transiciones y animaciones fluidas con Framer Motion.
- **UI Moderna:** Componentes UI modernos basados en Radix UI y shadcn/ui.
- **Formularios Validados:** Todos los formularios tienen validación con Zod y feedback visual.

## 🔒 Seguridad

- Autenticación segura con NextAuth.js
- Validación de formularios con Zod
- Protección de rutas con middleware
- Contraseñas hasheadas con bcryptjs
- Variables de entorno para datos sensibles

## 📊 SEO y Metadata

- Metadata completa para todas las páginas
- Sitemap XML generado automáticamente (`/sitemap.xml`)
- Robots.txt configurado (`/robots.txt`)
- Open Graph y Twitter Cards implementados

## 🤝 Contribuir

Este proyecto fue desarrollado para el Reto Hackaton 2025 FUP. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto fue desarrollado para el Reto Hackaton 2025 FUP.

## 👥 Sponsors

Agradecemos a nuestros sponsors:

- Programa Ingeniería de Sistemas
- Smurfit Kappa
- SMARTER
- SENPRO
- BLESS CARD
- LIBERO
- DEVENIAC

---

Desarrollado con ❤️ para el Reto Hackaton 2025 FUP
