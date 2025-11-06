"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Calendar, CreditCard, Eye } from "lucide-react";
import { toast } from "sonner";
import { PageLoading } from "@/components/dashboard/LoadingSkeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type Product = {
  id: string;
  name: string;
  price: number;
};

type Customer = {
  id: string;
  name: string;
  email?: string;
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
  } | null;
};

export default function PurchasesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [purchases, setPurchases] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/sales/my-purchases");

        if (!response.ok) {
          throw new Error("Error al cargar las compras");
        }

        const data = await response.json();
        setPurchases(data);
      } catch {
        toast.error("Error al cargar tus compras", {
          description:
            "No se pudieron cargar tus compras. Por favor, recarga la página.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchPurchases();
    } else {
      setIsLoading(false);
    }
  }, [session]);

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
      <Badge variant={variants[status] || "outline"} className="text-xs h-5">
        {labels[status] || status}
      </Badge>
    );
  };

  if (isLoading) {
    return <PageLoading />;
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
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
                    Mis Compras
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Historial de tus compras
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
            <div className="rounded-full bg-gray-100 dark:bg-gray-900 p-6 mb-6">
              <Package className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            </div>
            <h2 className="text-xl font-bold tracking-heading text-gray-900 dark:text-white mb-2">
              Inicia sesión para ver tus compras
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
              Necesitas iniciar sesión para acceder a tu historial de compras
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-11 px-6 font-medium"
            >
              Iniciar Sesión
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
                  Mis Compras
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {purchases.length}{" "}
                  {purchases.length === 1 ? "compra" : "compras"} en total
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] py-16">
            <div className="rounded-full bg-gray-100 dark:bg-gray-900 p-6 mb-6">
              <Package className="h-16 w-16 text-gray-400 dark:text-gray-600" />
            </div>
            <h2 className="text-xl font-bold tracking-heading text-gray-900 dark:text-white mb-2">
              No tienes compras aún
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center max-w-md">
              Comienza a comprar productos y verás tu historial aquí
            </p>
            <Button
              onClick={() => router.push("/shop")}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-11 px-6 font-medium"
            >
              Explorar Productos
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => (
              <div
                key={purchase.id}
                className="border border-gray-200 dark:border-gray-800 rounded-xl p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        Compra #{purchase.id.slice(0, 8)}
                      </h3>
                      {getStatusBadge(purchase.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          {format(
                            new Date(purchase.createdAt),
                            "dd/MM/yyyy 'a las' HH:mm",
                            { locale: es },
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5" />
                        <span>
                          {purchase.items.length}{" "}
                          {purchase.items.length === 1
                            ? "producto"
                            : "productos"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {formatCurrency(purchase.total)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Si el usuario es admin, ir al dashboard, sino mostrar detalle en el shop
                        if (session?.user?.role === "admin") {
                          router.push(`/dashboard/sales/${purchase.id}`);
                        } else {
                          // TODO: Crear página de detalle de compra para usuarios normales
                          router.push(`/shop/purchases/${purchase.id}`);
                        }
                      }}
                      className="h-8 px-3 rounded-full text-xs"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      Ver Detalle
                    </Button>
                  </div>
                </div>

                {/* Productos */}
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                  <div className="space-y-2">
                    {purchase.items.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 dark:text-white font-medium">
                            {item.product.name}
                          </span>
                          {item.size && (
                            <Badge
                              variant="outline"
                              className="text-xs h-4 px-1.5 border-gray-200 dark:border-gray-700"
                            >
                              {item.size}
                            </Badge>
                          )}
                          <span className="text-gray-500 dark:text-gray-400">
                            x{item.quantity}
                          </span>
                        </div>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {purchase.items.length > 3 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
                        +{purchase.items.length - 3} producto(s) más
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
