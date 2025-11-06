"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import {
  Moon,
  Sun,
  User,
  Bell,
  Shield,
  Save,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { toast } from "sonner";
import {
  profileSchema,
  passwordSchema,
  type ProfileInput,
  type PasswordInput as PasswordInputType,
} from "@/lib/validations/settings";

export default function ShopSettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { data: session, update: updateSession } = useSession();
  const [notifications, setNotifications] = useState({
    push: false,
  });

  const profileForm = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
    },
  });

  const passwordForm = useForm<PasswordInputType>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Actualizar el formulario cuando cambie la sesión
  useEffect(() => {
    if (session?.user?.name) {
      profileForm.reset({
        name: session.user.name,
        email: session.user.email || "",
      });
    }
  }, [session, profileForm]);

  // Cargar preferencias de notificaciones desde localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notification-preferences");
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch {
        // Ignorar errores al cargar preferencias del localStorage
      }
    }
  }, []);

  // Guardar preferencias de notificaciones en localStorage
  const handleNotificationChange = (
    key: keyof typeof notifications,
    value: boolean,
  ) => {
    const newNotifications = { ...notifications, [key]: value };
    setNotifications(newNotifications);
    localStorage.setItem(
      "notification-preferences",
      JSON.stringify(newNotifications),
    );
    toast.success("Preferencias guardadas", {
      description: "Tus preferencias de notificaciones han sido actualizadas.",
    });
  };

  const onProfileSubmit = async (data: ProfileInput) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el perfil");
      }

      const updatedUser = await response.json();

      // Actualizar la sesión
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: updatedUser.name,
        },
      });

      toast.success("Perfil actualizado exitosamente", {
        description:
          "Tu información de perfil ha sido actualizada correctamente.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el perfil. Por favor, intenta de nuevo.";
      toast.error("Error al actualizar el perfil", {
        description: errorMessage,
      });
    }
  };

  const onPasswordSubmit = async (data: PasswordInputType) => {
    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la contraseña");
      }

      passwordForm.reset();
      toast.success("Contraseña actualizada exitosamente", {
        description: "Tu contraseña ha sido actualizada correctamente.",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la contraseña. Por favor, intenta de nuevo.";
      toast.error("Error al actualizar la contraseña", {
        description: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/shop")}
                className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-heading text-gray-900 dark:text-white">
                  Ajustes
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Configura las preferencias de tu cuenta
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Perfil */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-500/10 p-2">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
                    Perfil
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Información de tu cuenta
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Tu nombre"
                              className="h-10 rounded-full"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="email"
                              className="mt-1 h-10 rounded-full bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                              disabled
                              value={field.value || ""}
                              onChange={() => {}}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white h-10 rounded-full"
                    disabled={profileForm.formState.isSubmitting}
                  >
                    {profileForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Preferencias */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-purple-500/10 p-2">
                  <Bell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
                    Notificaciones
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Gestiona tus preferencias de notificaciones
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <Label className="text-xs font-medium">
                    Notificaciones push
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Recibe notificaciones en tiempo real
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    handleNotificationChange("push", checked)
                  }
                />
              </div>
            </div>
          </div>

          {/* Apariencia */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-100 dark:bg-gray-900 p-2">
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
                    Apariencia
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Personaliza la apariencia de la aplicación
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <Label className="text-xs font-medium">Tema</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Elige entre modo claro u oscuro
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                    className="h-10 rounded-full"
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Claro
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                    className="h-10 rounded-full"
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Oscuro
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-500/10 p-2">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
                    Seguridad
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Gestiona la seguridad de tu cuenta
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña actual</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Ingresa tu contraseña actual"
                            className="h-10 rounded-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nueva contraseña</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Ingresa tu nueva contraseña"
                            className="h-10 rounded-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar contraseña</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="Confirma tu nueva contraseña"
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
                    className="bg-blue-600 hover:bg-blue-700 text-white h-10 rounded-full"
                    disabled={passwordForm.formState.isSubmitting}
                  >
                    {passwordForm.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Actualizando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Actualizar Contraseña
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
