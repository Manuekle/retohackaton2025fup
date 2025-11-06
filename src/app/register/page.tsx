"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error("Error al registrarse", {
          description:
            errorData.message ||
            "No se pudo crear la cuenta. Por favor, intenta de nuevo.",
        });
        return;
      }

      const signInResult = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (signInResult?.error) {
        toast.error("Error al iniciar sesión", {
          description:
            "Tu cuenta fue creada, pero no se pudo iniciar sesión automáticamente. Por favor, inicia sesión manualmente.",
        });
        router.push("/login");
      } else {
        toast.success("Cuenta creada exitosamente", {
          description:
            "Bienvenido! Tu cuenta ha sido creada y has iniciado sesión.",
        });
        router.push("/dashboard");
      }
    } catch {
      toast.error("Error al registrarse", {
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
            Registrarse
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Crea una cuenta para comenzar
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Tu nombre completo"
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
                      placeholder="Crea una contraseña segura"
                      className="h-10 rounded-full"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Debe contener al menos 6 caracteres, una mayúscula, una
                    minúscula y un número
                  </FormDescription>
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
                  Creando cuenta...
                </>
              ) : (
                "Registrarse"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
