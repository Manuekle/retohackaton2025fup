"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useTheme } from "next-themes";

export interface CategorySalesData {
  name: string;
  total: number;
}

interface SalesByCategoryChartProps {
  data: CategorySalesData[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (active && payload && payload.length) {
    return (
      <div
        className={`rounded-lg border p-2 shadow-lg ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <p
          className={`text-xs font-medium mb-1 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </p>
        {payload.map((entry, index: number) => (
          <p
            key={index}
            className={`text-xs ${isDark ? "text-gray-300" : "text-gray-900"}`}
          >
            <span style={{ color: entry.color }}>●</span> {entry.name}:{" "}
            <span className="font-semibold">
              {entry.value.toLocaleString()}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function SalesByCategoryChart({ data }: SalesByCategoryChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          No hay datos disponibles
        </p>
      </div>
    );
  }

  // Sort categories by total sales in descending order
  const sortedData = [...data].sort((a, b) => b.total - a.total);
  // Get top 10 categories for better visualization
  const topCategories = sortedData.slice(0, 10);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topCategories}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 40,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={isDark ? "#1f2937" : "#e5e7eb"}
          />
          <XAxis
            type="number"
            stroke={isDark ? "#9ca3af" : "#6b7280"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: isDark ? "#9ca3af" : "#6b7280", fontSize: 12 }}
            tickFormatter={(value: number) => value.toLocaleString()}
          />
          <YAxis
            dataKey="name"
            type="category"
            stroke={isDark ? "#9ca3af" : "#6b7280"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: isDark ? "#9ca3af" : "#6b7280", fontSize: 12 }}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              fontSize: "12px",
              color: isDark ? "#9ca3af" : "#6b7280",
            }}
          />
          <Bar
            dataKey="total"
            name="Unidades Vendidas"
            fill="#3b82f6"
            radius={[0, 8, 8, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
