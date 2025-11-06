"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { SalesByCategoryChart } from "@/components/dashboard/SalesByCategoryChart";
import { SalesByClientTypeChart } from "@/components/dashboard/SalesByClientTypeChart";
import { MonthlySalesChart } from "@/components/dashboard/MonthlySalesChart";
import { Recommendations } from "@/components/dashboard/Recommendations";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";
import { LoadingSkeleton } from "@/components/dashboard/LoadingSkeleton";
import { toast } from "sonner";

export default function DashboardPageClient() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalQuantity: 0,
    totalSales: 0,
    averageOrderValue: 0,
  });
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [salesByClientType, setSalesByClientType] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [inventory, setInventory] = useState<
    Array<{
      id: string;
      name: string;
      currentStock: number;
      minimumStock: number;
      maximumStock: number;
      category: string;
    }>
  >([]);
  const [recommendations, setRecommendations] = useState({
    topProducts: [] as Array<{ name: string; quantity: number }>,
    bottomProducts: [] as Array<{ name: string; quantity: number }>,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [
          statsRes,
          salesByCategoryRes,
          salesByClientTypeRes,
          monthlySalesRes,
          inventoryRes,
          recommendationsRes,
        ] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard/sales-by-category"),
          fetch("/api/dashboard/sales-by-size"),
          fetch("/api/dashboard/monthly-sales"),
          fetch("/api/dashboard/inventory"),
          fetch("/api/dashboard/recommendations"),
        ]);

        if (
          !statsRes.ok ||
          !salesByCategoryRes.ok ||
          !salesByClientTypeRes.ok ||
          !monthlySalesRes.ok ||
          !inventoryRes.ok ||
          !recommendationsRes.ok
        ) {
          throw new Error("Error al cargar los datos");
        }

        const [
          statsData,
          salesByCategoryData,
          salesByClientTypeData,
          monthlySalesData,
          inventoryData,
          recommendationsData,
        ] = await Promise.all([
          statsRes.json(),
          salesByCategoryRes.json(),
          salesByClientTypeRes.json(),
          monthlySalesRes.json(),
          inventoryRes.json(),
          recommendationsRes.json(),
        ]);

        setStats(statsData);
        setSalesByCategory(salesByCategoryData);
        setSalesByClientType(salesByClientTypeData);
        setMonthlySales(monthlySalesData);
        setInventory(inventoryData);
        setRecommendations(recommendationsData);
      } catch {
        toast.error("Error al cargar los datos del dashboard", {
          description:
            "No se pudieron cargar las estadísticas. Por favor, recarga la página.",
        });
      } finally {
        setLoading(false);
      }
    }

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

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-heading text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Resumen general de tu negocio
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(stats.totalRevenue)}
          description={`Promedio: ${formatCurrency(stats.averageOrderValue)}`}
          icon="dollar-sign"
        />
        <StatCard
          title="Artículos Vendidos"
          value={stats.totalQuantity.toLocaleString()}
          description="Total de unidades"
          icon="shopping-bag"
        />
        <StatCard
          title="Total de Ventas"
          value={stats.totalSales.toLocaleString()}
          description="Transacciones completadas"
          icon="shopping-cart"
        />
        <StatCard
          title="Valor Promedio"
          value={formatCurrency(stats.averageOrderValue)}
          description="Por transacción"
          icon="credit-card"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
              Ventas Mensuales
            </h3>
          </div>
          <div className="p-6">
            <MonthlySalesChart data={monthlySales} />
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
              Ventas por Categoría
            </h3>
          </div>
          <div className="p-6">
            <SalesByCategoryChart data={salesByCategory} />
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
              Ventas por Tallas
            </h3>
          </div>
          <div className="p-6">
            <SalesByClientTypeChart data={salesByClientType} />
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
              Estado del Inventario
            </h3>
          </div>
          <div className="p-6">
            <InventoryStatus data={inventory} />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
            Recomendaciones
          </h3>
        </div>
        <div className="p-6">
          <Recommendations data={recommendations} />
        </div>
      </div>
    </div>
  );
}
