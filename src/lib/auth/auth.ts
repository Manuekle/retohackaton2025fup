import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/database/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo electrónico", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Función auxiliar para reintentar la consulta en caso de error de conexión
        const findUserWithRetry = async (retries = 2) => {
          for (let i = 0; i <= retries; i++) {
            try {
              return await prisma.user.findUnique({
                where: { email: credentials.email },
              });
            } catch (error: unknown) {
              const prismaError = error as { code?: string; message?: string };
              // Si es un error de conexión (P5010) y aún hay reintentos, esperar y reintentar
              if (prismaError.code === "P5010" && i < retries) {
                console.warn(
                  `Error de conexión con Prisma Accelerate (intento ${i + 1}/${retries + 1}), reintentando...`,
                );
                // Esperar un poco antes de reintentar (exponencial backoff)
                await new Promise((resolve) =>
                  setTimeout(resolve, 1000 * (i + 1)),
                );
                continue;
              }
              // Si no es un error de conexión o se agotaron los reintentos, lanzar el error
              throw error;
            }
          }
          return null;
        };

        try {
          const user = await findUserWithRetry();

          if (!user) {
            return null;
          }

          if (!user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            return null;
          }

          return user;
        } catch (error: unknown) {
          const prismaError = error as { code?: string; message?: string };
          // Log del error para debugging
          console.error("Error en authorize:", {
            code: prismaError.code,
            message: prismaError.message,
            email: credentials.email,
          });

          // Si es un error de conexión con Prisma Accelerate, retornar null
          // para que NextAuth muestre un mensaje de error genérico
          if (prismaError.code === "P5010") {
            console.error(
              "Error de conexión con Prisma Accelerate. Por favor, intenta de nuevo.",
            );
            return null;
          }

          // Para otros errores, también retornar null para evitar exponer detalles
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "customer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) || "customer";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Página de inicio de sesión personalizada
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
