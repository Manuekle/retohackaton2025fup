import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajustes - Configuración de Cuenta",
  description: "Configura las preferencias de tu cuenta",
  keywords: ["ajustes", "configuración", "cuenta", "perfil"],
};

export default function ShopSettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
