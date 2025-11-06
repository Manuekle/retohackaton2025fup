"use client";

import { useEffect, useState } from "react";
import { SalesByCategoryChart } from "@/components/dashboard/SalesByCategoryChart";
import { SalesByClientTypeChart } from "@/components/dashboard/SalesByClientTypeChart";
import { MonthlySalesChart } from "@/components/dashboard/MonthlySalesChart";
import { PageLoading } from "@/components/dashboard/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import { Download, Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReportsPage() {
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [salesByClientType, setSalesByClientType] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [salesByCategoryRes, salesByClientTypeRes, monthlySalesRes] =
          await Promise.all([
            fetch("/api/dashboard/sales-by-category"),
            fetch("/api/dashboard/sales-by-client-type"),
            fetch("/api/dashboard/monthly-sales"),
          ]);

        if (
          !salesByCategoryRes.ok ||
          !salesByClientTypeRes.ok ||
          !monthlySalesRes.ok
        ) {
          throw new Error("Error al cargar los datos");
        }

        setSalesByCategory(await salesByCategoryRes.json());
        setSalesByClientType(await salesByClientTypeRes.json());
        setMonthlySales(await monthlySalesRes.json());
      } catch {
        toast.error("Error al cargar los reportes", {
          description:
            "No se pudieron cargar los reportes. Por favor, recarga la página.",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [timeRange]);

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-heading text-gray-900 dark:text-white">
            Reportes
          </h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Visualiza y analiza las métricas de tu negocio
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-full">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los períodos</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="h-10 rounded-full w-full sm:w-auto"
            onClick={() => toast.info("Función de exportar próximamente")}
          >
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
                Ventas Mensuales
              </h3>
              <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span>+12.5%</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-80">
              <MonthlySalesChart data={monthlySales} />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
              Por Categoría
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <SalesByCategoryChart data={salesByCategory} />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
              Por Tipo de Cliente
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <SalesByClientTypeChart data={salesByClientType} />
            </div>
          </div>
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold tracking-heading text-gray-900 dark:text-white">
              Resumen
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Total Ventas
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {salesByCategory
                      .reduce(
                        (acc: number, item: { total: number }) =>
                          acc + item.total,
                        0,
                      )
                      .toLocaleString()}
                  </p>
                </div>
                <div className="rounded-full bg-blue-500/10 p-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Categorías Activas
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {salesByCategory.length}
                  </p>
                </div>
                <div className="rounded-full bg-green-500/10 p-3">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
