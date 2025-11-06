"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Copy, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success("Copiado", {
        description: "Credencial copiada al portapapeles.",
      });
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Error al copiar", {
        description: "No se pudo copiar al portapapeles.",
      });
    }
  };

  const onSubmit = async (data: LoginInput) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error("Error al iniciar sesión", {
          description:
            "Email o contraseña inválidos. Por favor, verifica tus credenciales.",
        });
      } else {
        toast.success("Sesión iniciada exitosamente", {
          description: "Bienvenido de vuelta.",
        });
        // Redirigir según el rol después de obtener la sesión actualizada
        const sessionResponse = await fetch("/api/auth/session");
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          if (sessionData?.user?.role === "admin") {
            router.push("/dashboard");
          } else {
            router.push("/shop");
          }
        } else {
          router.push("/shop");
        }
      }
    } catch {
      toast.error("Error al iniciar sesión", {
        description:
          "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-black shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl sm:text-3xl tracking-heading font-bold text-gray-900 dark:text-white">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="ejemplo@correo.com"
                      className="h-10 rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Ingresa tu contraseña"
                      className="h-10 rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-10 rounded-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </div>

        {/* Credenciales de Demo */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 text-center">
            Credenciales de Demo
          </p>
          <div className="space-y-3">
            {/* Admin */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">
                Administrador
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                    Email: <span className="font-mono">admin@gmail.com</span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard("admin@gmail.com", "admin-email")
                    }
                    className="h-6 w-6 p-0 rounded-full"
                  >
                    {copiedField === "admin-email" ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                    Contraseña: <span className="font-mono">password123</span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard("password123", "admin-password")
                    }
                    className="h-6 w-6 p-0 rounded-full"
                  >
                    {copiedField === "admin-password" ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Customer */}
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
              <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">
                Cliente
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                    Email: <span className="font-mono">customer@gmail.com</span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard("customer@gmail.com", "customer-email")
                    }
                    className="h-6 w-6 p-0 rounded-full"
                  >
                    {copiedField === "customer-email" ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400 flex-1">
                    Contraseña: <span className="font-mono">password123</span>
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard("password123", "customer-password")
                    }
                    className="h-6 w-6 p-0 rounded-full"
                  >
                    {copiedField === "customer-password" ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
