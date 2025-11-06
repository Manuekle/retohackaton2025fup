# Uso de Tablas en la Aplicación

Este documento resume el uso de cada tabla del schema de Prisma en la aplicación.

## ✅ Tablas Completamente Usadas

### 1. **Product** ✅

- **Status:** Completamente implementado
- **APIs:**
  - `GET /api/products` - Listar productos
  - `POST /api/products` - Crear producto
  - `GET /api/products/[id]` - Obtener producto
  - `PUT /api/products/[id]` - Actualizar producto
  - `DELETE /api/products/[id]` - Eliminar producto
- **Frontend:** Página completa de gestión de productos (`/dashboard/products`)
- **Seed:** Se crean productos de ejemplo
- **Uso:** CRUD completo

### 2. **Category** ✅

- **Status:** Completamente implementado
- **APIs:**
  - `GET /api/categories` - Listar categorías
- **Frontend:** Se usa en formularios de productos
- **Seed:** Se crean 15 categorías
- **Uso:** Lectura (selección en productos)

### 3. **ClientType** ✅

- **Status:** Completamente implementado
- **APIs:**
  - `GET /api/client-types` - Listar tipos de cliente
- **Frontend:** Se usa en formularios de clientes y ventas
- **Seed:** Se crean 4 tipos (Mujer, Hombre, Niño, Niña)
- **Uso:** Lectura (selección en clientes y ventas)

### 4. **Customer** ✅

- **Status:** Completamente implementado
- **APIs:**
  - `GET /api/customers` - Listar clientes
  - `POST /api/customers` - Crear cliente
  - `GET /api/customers/[id]` - Obtener cliente
  - `PUT /api/customers/[id]` - Actualizar cliente
  - `DELETE /api/customers/[id]` - Eliminar cliente
- **Frontend:** Página completa de gestión de clientes (`/dashboard/customers`)
- **Seed:** Se crean clientes de ejemplo
- **Uso:** CRUD completo

### 5. **Sale** ✅

- **Status:** Completamente implementado
- **APIs:**
  - `GET /api/sales` - Listar ventas
  - `POST /api/sales` - Crear venta
  - `GET /api/sales/[id]` - Obtener venta detallada
- **Frontend:**
  - Página de gestión de ventas (`/dashboard/sales`)
  - Página de detalle de venta (`/dashboard/sales/[id]`)
- **Seed:** Se crean 150 ventas de ejemplo
- **Uso:** Creación y lectura

### 6. **SaleItem** ✅

- **Status:** Completamente implementado
- **APIs:** Se incluye en las respuestas de ventas
- **Frontend:** Se muestra en el detalle de ventas
- **Seed:** Se crean items de venta
- **Uso:** Lectura (se crea junto con las ventas)

### 7. **User** ✅

- **Status:** Completamente implementado
- **APIs:**
  - `POST /api/auth/register` - Registrar usuario
  - `GET /api/user/profile` - Obtener perfil
  - `PUT /api/user/profile` - Actualizar perfil
  - `PUT /api/user/password` - Cambiar contraseña
  - NextAuth endpoints para autenticación
- **Frontend:**
  - Página de login (`/login`)
  - Página de registro (`/register`)
  - Página de configuración (`/dashboard/settings`)
- **Seed:** Se crea un usuario de ejemplo (admin@example.com)
- **Uso:** Autenticación y gestión de perfil

---

## ⚠️ Tablas Parcialmente Usadas

### 8. **Branch** ⚠️

- **Status:** Parcialmente implementado
- **APIs:**
  - ❌ **NO existe** `GET /api/branches` - Listar sucursales
  - ✅ Se acepta `branchId` en `POST /api/sales`
  - ✅ Se incluye `branch` en `GET /api/sales/[id]`
- **Frontend:**
  - ✅ Se muestra en el detalle de venta (`/dashboard/sales/[id]`)
  - ❌ **NO se puede seleccionar** branch al crear ventas (falta API)
- **Seed:** Se crean 3 sucursales (Sucursal A, B, C)
- **Uso:**
  - ✅ Se guarda en ventas
  - ✅ Se muestra en detalle de venta
  - ❌ **NO se puede seleccionar** al crear ventas (falta API)

### Problema Identificado:

El modelo `Branch` está definido en el schema y se usa en el seed y en las ventas, pero:

1. **Falta API para obtener branches** - No hay endpoint para listar sucursales
2. **No se puede seleccionar branch al crear ventas** - El formulario de crear venta no tiene un selector de sucursal porque no hay API para obtenerlas

---

## Resumen

| Tabla      | Status | APIs               | Frontend                   | Seed | CRUD             |
| ---------- | ------ | ------------------ | -------------------------- | ---- | ---------------- |
| Product    | ✅     | 5 endpoints        | ✅ Página completa         | ✅   | ✅ Completo      |
| Category   | ✅     | 1 endpoint         | ✅ En formularios          | ✅   | 🔄 Solo lectura  |
| ClientType | ✅     | 1 endpoint         | ✅ En formularios          | ✅   | 🔄 Solo lectura  |
| **Branch** | ⚠️     | **0 endpoints**    | ⚠️ Solo visualización      | ✅   | ❌ **Falta API** |
| Customer   | ✅     | 5 endpoints        | ✅ Página completa         | ✅   | ✅ Completo      |
| Sale       | ✅     | 3 endpoints        | ✅ Página completa         | ✅   | ✅ Crear/Leer    |
| SaleItem   | ✅     | Incluido en ventas | ✅ En detalle              | ✅   | ✅ Auto-creado   |
| User       | ✅     | 4+ endpoints       | ✅ Login/Register/Settings | ✅   | ✅ Completo      |

---

## Recomendaciones

### Para Branch:

1. **Crear API endpoint** `GET /api/branches` para listar sucursales
2. **Agregar selector** de sucursal en el formulario de crear venta
3. **Opcional:** Crear página de gestión de sucursales (`/dashboard/branches`) con CRUD completo

¿Deseas que implemente la API de branches y el selector en el formulario de ventas?
