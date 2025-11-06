import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración - Ajustes del Sistema | Reto Hackaton 2025 FUP",
  description:
    "Configura y personaliza tu sistema. Gestiona preferencias, ajustes del sistema y configuraciones avanzadas para optimizar tu experiencia de uso del dashboard.",
  keywords: [
    "configuración",
    "ajustes",
    "preferencias",
    "configuración del sistema",
    "personalización",
    "retail",
    "dashboard",
    "settings",
  ],
  openGraph: {
    title: "Configuración - Ajustes del Sistema",
    description:
      "Configura y personaliza tu sistema. Gestiona preferencias y ajustes del sistema.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Configuración - Ajustes del Sistema",
    description:
      "Configura y personaliza tu sistema. Gestiona preferencias y ajustes del sistema.",
  },
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
