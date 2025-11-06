"use client";

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useTheme } from "next-themes";
import { ChartContainer, ChartConfig } from "@/components/ui/chart";

const chartConfig: ChartConfig = {
  total: {
    label: "Ventas",
    color: "#3b82f6",
  },
} as const;

export interface MonthlySalesData {
  name: string;
  total: number;
}

interface MonthlySalesChartProps {
  data: MonthlySalesData[];
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
              ${entry.value.toLocaleString()} COP
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function MonthlySalesChart({ data }: MonthlySalesChartProps) {
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

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-auto h-[250px] w-full"
    >
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={isDark ? "#1f2937" : "#e5e7eb"}
        />
        <XAxis
          dataKey="name"
          stroke={isDark ? "#9ca3af" : "#6b7280"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: isDark ? "#9ca3af" : "#6b7280", fontSize: 12 }}
        />
        <YAxis
          stroke={isDark ? "#9ca3af" : "#6b7280"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tick={{ fill: isDark ? "#9ca3af" : "#6b7280", fontSize: 12 }}
          tickFormatter={(value: number) => `$${value.toLocaleString()}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{
            fontSize: "12px",
            color: isDark ? "#9ca3af" : "#6b7280",
          }}
          iconType="line"
        />
        <Line
          type="monotone"
          dataKey="total"
          name="Ventas"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ r: 4, fill: "#3b82f6" }}
          activeDot={{ r: 6, fill: "#3b82f6" }}
        />
      </LineChart>
    </ChartContainer>
  );
}
