"use client";

import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";

export interface InventoryItem {
  id: string;
  name: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  category: string;
}

interface InventoryStatusProps {
  data: InventoryItem[];
}

export function InventoryStatus({ data }: InventoryStatusProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          No hay datos de inventario disponibles
        </p>
      </div>
    );
  }

  // Filter items that are below 30% of their maximum stock
  const lowStockItems = data.filter(
    (item) => item.currentStock / item.maximumStock < 0.3,
  );

  // Sort by stock level (lowest first)
  const sortedItems = [...data].sort(
    (a, b) => a.currentStock / a.maximumStock - b.currentStock / b.maximumStock,
  );

  return (
    <div className="space-y-6">
      {lowStockItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-amber-500/10 p-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">
              Productos con bajo stock ({lowStockItems.length})
            </h3>
          </div>
          <div className="space-y-3">
            {lowStockItems.slice(0, 5).map((item) => {
              const percentage = (item.currentStock / item.maximumStock) * 100;
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {item.currentStock} / {item.maximumStock}
                    </span>
                  </div>
                  <Progress
                    value={percentage}
                    className="h-2"
                    style={
                      {
                        "--progress-indicator-color":
                          percentage < 15 ? "#ef4444" : "#f59e0b",
                      } as React.CSSProperties
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-gray-900 dark:text-white">
          Niveles de Inventario
        </h3>
        <div className="space-y-3">
          {sortedItems.slice(0, 5).map((item) => {
            const percentage = (item.currentStock / item.maximumStock) * 100;
            const isLowStock = percentage < 30;
            const isOverstock = percentage > 90;

            return (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {item.currentStock} / {item.maximumStock}
                  </span>
                </div>
                <Progress
                  value={percentage}
                  className="h-2"
                  style={
                    {
                      "--progress-indicator-color": isLowStock
                        ? "#ef4444"
                        : isOverstock
                          ? "#22c55e"
                          : "#3b82f6",
                    } as React.CSSProperties
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
