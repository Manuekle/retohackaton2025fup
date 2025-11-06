"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoading } from "@/components/dashboard/LoadingSkeleton";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
};

type SaleItem = {
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  product: {
    id: string;
    name: string;
  };
};

type Sale = {
  id: string;
  customer: Customer | null;
  total: number;
  items: SaleItem[];
  createdAt: string;
  status: "completed" | "pending" | "cancelled";
};

export default function SalesPage() {
  const router = useRouter();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const salesRes = await fetch("/api/sales");

        if (!salesRes.ok) {
          throw new Error("Error al cargar los datos");
        }

        const salesData = await salesRes.json();
        setSales(salesData);
      } catch {
        toast.error("Error al cargar los datos", {
          description:
            "No se pudieron cargar las ventas. Por favor, recarga la página.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      completed: "default",
      pending: "secondary",
      cancelled: "destructive",
    };

    const labels: Record<string, string> = {
      completed: "Completada",
      pending: "Pendiente",
      cancelled: "Cancelada",
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {labels[status] || status}
      </Badge>
    );
  };

  const columns = [
    {
      key: "id",
      header: "ID",
      render: (_: unknown, row: Sale) => (
        <span className="font-mono text-xs">#{row.id.slice(0, 8)}</span>
      ),
    },
    {
      key: "createdAt",
      header: "Fecha",
      render: (_value: unknown, row: Sale) =>
        format(new Date(row.createdAt), "PPp", { locale: es }),
    },
    {
      key: "customer",
      header: "Cliente",
      render: (_: unknown, row: Sale) => (
        <div>
          <p className="font-medium">{row.customer?.name || "Sin cliente"}</p>
          {row.customer?.email && (
            <p className="text-xs text-gray-500">{row.customer.email}</p>
          )}
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      className: "text-right",
      render: (_: unknown, row: Sale) => (
        <span className="font-semibold">{formatCurrency(row.total)}</span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      render: (_value: unknown, row: Sale) => getStatusBadge(row.status),
    },
    {
      key: "actions",
      header: "Acciones",
      className: "text-right",
      render: (_: unknown, row: Sale) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/dashboard/sales/${row.id}`)}
          className="h-8"
        >
          Ver Detalles
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-heading text-gray-900 dark:text-white">
            Ventas
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Revisa todas las ventas realizadas por los clientes
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={sales}
        columns={columns}
        searchKey={["id", "customer.name", "customer.email"]}
        searchPlaceholder="Buscar por ID, cliente, email..."
        customFilter={(item, searchTerm) => {
          const sale = item as Sale;
          const term = searchTerm.toLowerCase();
          return (
            sale.id.toLowerCase().includes(term) ||
            sale.customer?.name?.toLowerCase().includes(term) ||
            sale.customer?.email?.toLowerCase().includes(term) ||
            formatCurrency(sale.total).toLowerCase().includes(term) ||
            sale.status.toLowerCase().includes(term)
          );
        }}
        filterOptions={[
          {
            key: "status",
            label: "Estado",
            options: [
              { value: "completed", label: "Completadas" },
              { value: "pending", label: "Pendientes" },
              { value: "cancelled", label: "Canceladas" },
            ],
          },
        ]}
        itemsPerPage={10}
        onRowClick={(row) => router.push(`/dashboard/sales/${row.id}`)}
        emptyMessage="No hay ventas registradas"
      />
    </div>
  );
}
