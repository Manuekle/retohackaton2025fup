/**
 * Función auxiliar para reintentar operaciones de Prisma en caso de errores de conexión
 * @param operation Función que ejecuta la operación de Prisma
 * @param retries Número de reintentos (por defecto: 2)
 * @returns Resultado de la operación
 */
export async function withPrismaRetry<T>(
  operation: () => Promise<T>,
  retries = 2,
): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await operation();
    } catch (error: unknown) {
      const prismaError = error as { code?: string; message?: string };

      // Si es un error de conexión (P5010) y aún hay reintentos, esperar y reintentar
      if (prismaError.code === "P5010" && i < retries) {
        console.warn(
          `Error de conexión con Prisma Accelerate (intento ${i + 1}/${retries + 1}), reintentando...`,
        );
        // Esperar un poco antes de reintentar (exponencial backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }

      // Si no es un error de conexión o se agotaron los reintentos, lanzar el error
      throw error;
    }
  }

  // Este código nunca debería ejecutarse, pero TypeScript lo requiere
  throw new Error(
    "Error de conexión con Prisma Accelerate después de múltiples reintentos",
  );
}
