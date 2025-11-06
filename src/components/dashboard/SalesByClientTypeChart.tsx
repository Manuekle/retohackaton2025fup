"use client";

import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useTheme } from "next-themes";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

export interface SizeData {
  name: string;
  value: number;
}

interface SalesBySizeChartProps {
  data: SizeData[];
}

// Colores para las tallas (paleta vibrante)
const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
  "#6366f1", // indigo
  "#14b8a6", // teal
  "#a855f7", // violet
];

const chartConfig: ChartConfig = {
  value: {
    label: "Cantidad Vendida",
  },
} as const;

const RADIAN = Math.PI / 180;

// Función para renderizar etiquetas personalizadas en el gráfico de dona
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  name: string;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Solo mostrar etiqueta si el porcentaje es mayor a 3%
  if (percent < 0.03) return null;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-semibold"
      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: { name: string; value: number };
    fill?: string;
  }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (active && payload && payload.length) {
    const entry = payload[0];
    const data = entry.payload;
    const total = payload.reduce(
      (sum: number, p: { payload?: { value?: number } }) =>
        sum + (p.payload?.value || 0),
      0,
    );
    const percentage = total > 0 ? ((data.value || 0) / total) * 100 : 0;

    return (
      <div
        className={`rounded-lg border p-3 shadow-lg ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <p
          className={`text-sm font-semibold mb-2 ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          Talla: {data.name}
        </p>
        <div className="space-y-1">
          <p
            className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            <span style={{ color: entry.fill }}>●</span>{" "}
            <span className="font-medium">Artículos vendidos:</span>{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {data.value.toLocaleString()}
            </span>
          </p>
          <p
            className={`text-xs ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            <span className="font-medium">Porcentaje:</span>{" "}
            <span className="font-bold text-green-600 dark:text-green-400">
              {percentage.toFixed(1)}%
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function SalesBySizeChart({ data }: SalesBySizeChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          No hay datos de ventas por tallas disponibles
        </p>
      </div>
    );
  }

  // Ordenar por valor descendente
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const total = sortedData.reduce((sum, item) => sum + item.value, 0);

  // Obtener la talla más vendida y la menos vendida
  const mostSold = sortedData[0];
  const leastSold = sortedData[sortedData.length - 1];
  const mostSoldPercentage =
    total > 0 ? ((mostSold.value / total) * 100).toFixed(1) : "0";
  const leastSoldPercentage =
    total > 0 ? ((leastSold.value / total) * 100).toFixed(1) : "0";

  return (
    <div className="w-full space-y-4">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[280px] w-full"
      >
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={90}
            innerRadius={45}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
          >
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke={isDark ? "#111827" : "#fff"}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "12px",
              color: isDark ? "#9ca3af" : "#6b7280",
            }}
            formatter={(value, entry: { payload?: { value?: number } }) => {
              const percentage =
                total > 0 ? ((entry.payload?.value || 0) / total) * 100 : 0;
              return `${value} (${percentage.toFixed(1)}%)`;
            }}
            iconType="circle"
          />
        </PieChart>
      </ChartContainer>

      {/* Información de tallas más y menos vendidas */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
            isDark
              ? "bg-green-900/20 border-green-700/50"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <div>
            <p
              className={`text-xs font-medium ${
                isDark ? "text-green-300" : "text-green-700"
              }`}
            >
              Más vendida
            </p>
            <p
              className={`text-xs font-bold ${
                isDark ? "text-green-200" : "text-green-800"
              }`}
            >
              {mostSold.name}: {mostSoldPercentage}%
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
            isDark
              ? "bg-red-900/20 border-red-700/50"
              : "bg-red-50 border-red-200"
          }`}
        >
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div>
            <p
              className={`text-xs font-medium ${
                isDark ? "text-red-300" : "text-red-700"
              }`}
            >
              Menos vendida
            </p>
            <p
              className={`text-xs font-bold ${
                isDark ? "text-red-200" : "text-red-800"
              }`}
            >
              {leastSold.name}: {leastSoldPercentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mantener el nombre anterior para compatibilidad
export function SalesByClientTypeChart({ data }: { data: SizeData[] }) {
  return <SalesBySizeChart data={data} />;
}
