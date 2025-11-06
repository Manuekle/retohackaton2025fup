"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageLoading } from "@/components/dashboard/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  User,
  Package,
  CreditCard,
  Mail,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type Customer = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

type SaleItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  product: Product;
};

type Sale = {
  id: string;
  customer: Customer | null;
  total: number;
  items: SaleItem[];
  createdAt: string;
  status: "completed" | "pending" | "cancelled";
  date?: string;
  clientType?: {
    id: string;
    name: string;
  };
};

export default function SaleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const saleId = params.id as string;

  const [sale, setSale] = useState<Sale | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/sales/${saleId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Venta no encontrada");
          }
          throw new Error("Error al cargar los detalles de la venta");
        }

        const saleData = await response.json();
        setSale(saleData);
      } catch {
        const errorMessage = "Error al cargar los datos";
        setError(errorMessage);
        toast.error("Error al cargar los detalles de la venta", {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (saleId) {
      fetchSale();
    }
  }, [saleId]);

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
      <Badge
        variant={variants[status] || "outline"}
        className="text-xs px-3 py-1"
      >
        {labels[status] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (error || !sale) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </Button>
        </div>
        <div className="border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">
            {error || "Venta no encontrada"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-heading text-gray-900 dark:text-white">
                Detalle de Venta
              </h1>
              {getStatusBadge(sale.status)}
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              ID: <span className="font-mono">{sale.id.slice(0, 8)}...</span>
            </p>
          </div>
        </div>
      </div>

      {/* Información General */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Información de la Venta */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <h2 className="text-xs font-bold tracking-heading text-gray-900 dark:text-white mb-5">
            Información de la Venta
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-500/10 p-2.5">
                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Fecha
                </p>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {format(new Date(sale.createdAt), "PPp", { locale: es })}
                </p>
              </div>
            </div>
            {sale.clientType && (
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-500/10 p-2.5">
                  <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Tipo de Cliente
                  </p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {sale.clientType.name}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
              <div className="rounded-full bg-indigo-500/10 p-2.5">
                <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Total
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(sale.total)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información del Cliente */}
        {sale.customer ? (
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-xs font-bold tracking-heading text-gray-900 dark:text-white mb-5">
              Información del Cliente
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-500/10 p-2.5">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Nombre
                  </p>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    {sale.customer.name}
                  </p>
                </div>
              </div>
              {sale.customer.email && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-500/10 p-2.5">
                    <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Email
                    </p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {sale.customer.email}
                    </p>
                  </div>
                </div>
              )}
              {sale.customer.phone && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-500/10 p-2.5">
                    <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Teléfono
                    </p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {sale.customer.phone}
                    </p>
                  </div>
                </div>
              )}
              {sale.customer.address && (
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-amber-500/10 p-2.5 mt-1">
                    <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Dirección
                    </p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">
                      {sale.customer.address}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <h2 className="text-xs font-bold tracking-heading text-gray-900 dark:text-white mb-5">
              Información del Cliente
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No hay información de cliente disponible
            </p>
          </div>
        )}
      </div>

      {/* Items de la Venta */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xs font-bold tracking-heading text-gray-900 dark:text-white">
            Productos ({sale.items.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Producto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Talla
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Cantidad
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Precio Unitario
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {sale.items.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SKU: {item.product.id.slice(0, 8)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-gray-900 dark:text-white">
                      {item.size || "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-xs text-gray-900 dark:text-white">
                      {formatCurrency(item.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      {formatCurrency(item.quantity * item.price)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-4 text-right text-xs font-semibold text-gray-900 dark:text-white"
                >
                  Total:
                </td>
                <td className="px-6 py-4 text-right text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(sale.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
