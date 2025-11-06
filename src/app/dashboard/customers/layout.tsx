import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clientes - Gestión de Base de Datos | Reto Hackaton 2025 FUP",
  description:
    "Administra tu base de datos de clientes. Crea, edita y elimina clientes, gestiona información de contacto, tipos de clientes y relaciones comerciales para mejorar tu servicio al cliente.",
  keywords: [
    "clientes",
    "gestión de clientes",
    "base de datos",
    "CRM",
    "contactos",
    "tipos de clientes",
    "retail",
    "servicio al cliente",
  ],
  openGraph: {
    title: "Clientes - Gestión de Base de Datos",
    description:
      "Administra tu base de datos de clientes. Crea, edita y elimina clientes, gestiona información de contacto.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Clientes - Gestión de Base de Datos",
    description:
      "Administra tu base de datos de clientes. Crea, edita y elimina clientes, gestiona información de contacto.",
  },
};

export default function CustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
