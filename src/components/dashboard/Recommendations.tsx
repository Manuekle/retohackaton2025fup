import { TrendingUp, TrendingDown } from "lucide-react";

interface RecommendationsProps {
  data: {
    topProducts: { name: string; quantity: number }[];
    bottomProducts: { name: string; quantity: number }[];
  };
}

export function Recommendations({ data }: RecommendationsProps) {
  const { topProducts, bottomProducts } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Products */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-green-500/10 p-2">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">
              Aumentar Stock
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Productos con alta rotación
            </p>
          </div>
        </div>
        {topProducts.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 py-4">
            No hay productos destacados
          </p>
        ) : (
          <div className="space-y-2">
            {topProducts
              .slice(0, 5)
              .map((p: { name: string; quantity: number }) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {p.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {p.quantity} vendidos
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Bottom Products */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-red-500/10 p-2">
            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-gray-900 dark:text-white">
              Aplicar Descuentos
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Productos con baja rotación
            </p>
          </div>
        </div>
        {bottomProducts.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400 py-4">
            No hay productos con baja rotación
          </p>
        ) : (
          <div className="space-y-2">
            {bottomProducts
              .slice(0, 5)
              .map((p: { name: string; quantity: number }) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <span className="text-xs font-medium text-gray-900 dark:text-white">
                    {p.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {p.quantity} vendidos
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
