# Guía de Testing

Este proyecto incluye un sistema completo de testing con Jest y React Testing Library para tests unitarios y de componentes, y Playwright para tests end-to-end (E2E).

## Configuración

### Instalación

Las dependencias de testing ya están instaladas. Si necesitas reinstalarlas:

```bash
pnpm install
```

## Tests Unitarios y de Componentes (Jest + React Testing Library)

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

### Estructura de Tests

Los tests deben estar ubicados en:

- `src/**/__tests__/**/*.test.tsx` o `*.test.ts`
- `src/**/*.spec.tsx` o `*.spec.ts`

### Ejemplos de Tests

#### Test de Componente

```typescript
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
```

#### Test de Validación

```typescript
import { loginSchema } from "@/lib/validations/auth";

describe("loginSchema", () => {
  it("validates correct email and password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });
});
```

## Tests End-to-End (Playwright)

### Ejecutar Tests E2E

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar tests con UI interactiva
npm run test:e2e:ui

# Ejecutar tests en modo headed (ver el navegador)
npm run test:e2e:headed
```

### Estructura de Tests E2E

Los tests E2E están ubicados en `e2e/*.spec.ts`

### Ejemplo de Test E2E

```typescript
import { test, expect } from "@playwright/test";

test("should display login form", async ({ page }) => {
  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: /iniciar sesión/i }),
  ).toBeVisible();
});
```

## Ejecutar Todos los Tests

```bash
npm run test:all
```

Esto ejecutará primero los tests unitarios y luego los tests E2E.

## Coverage

Para ver el reporte de cobertura después de ejecutar `npm run test:coverage`, abre el archivo `coverage/lcov-report/index.html` en tu navegador.

## Configuración

### Jest

La configuración de Jest está en `jest.config.js` y `jest.setup.js`.

### Playwright

La configuración de Playwright está en `playwright.config.ts`.

## Buenas Prácticas

1. **Tests Unitarios**: Prueban funciones y componentes de forma aislada
2. **Tests de Integración**: Prueban la interacción entre componentes
3. **Tests E2E**: Prueban flujos completos de usuario
4. **Mocks**: Usa mocks para dependencias externas (APIs, servicios, etc.)
5. **Nombres descriptivos**: Usa nombres claros que describan qué se está probando

## Ejemplos de Tests Implementados

- ✅ `src/components/ui/__tests__/button.test.tsx` - Tests del componente Button
- ✅ `src/lib/validations/__tests__/auth.test.ts` - Tests de validación de autenticación
- ✅ `src/app/__tests__/page.test.tsx` - Tests de la página principal
- ✅ `e2e/home.spec.ts` - Tests E2E de la página principal
- ✅ `e2e/auth.spec.ts` - Tests E2E de autenticación
