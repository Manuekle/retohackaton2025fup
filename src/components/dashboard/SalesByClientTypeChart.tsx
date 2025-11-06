"use client";

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { useTheme } from "next-themes";

export interface ClientTypeData {
  name: string;
  value: number;
}

interface SalesByClientTypeChartProps {
  data: ClientTypeData[];
}

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
];

const RADIAN = Math.PI / 180;
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
  const radius = innerRadius + (outerRadius - innerRadius) * 1.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="currentColor"
      className="text-xs font-medium text-gray-700 dark:text-gray-300"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (active && payload && payload.length) {
    const entry = payload[0];
    const total = payload.reduce(
      (sum: number, p: { payload?: { value?: number } }) =>
        sum + (p.payload?.value || 0),
      0,
    );
    const percentage =
      total > 0 ? ((entry.payload?.value || 0) / total) * 100 : 0;

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
          {entry.name}
        </p>
        <p className={`text-xs ${isDark ? "text-gray-300" : "text-gray-900"}`}>
          <span style={{ color: entry.payload?.fill }}>●</span> Ventas:{" "}
          <span className="font-semibold">
            {entry.payload?.value.toLocaleString()} ({percentage.toFixed(1)}%)
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function SalesByClientTypeChart({ data }: SalesByClientTypeChartProps) {
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

  // Sort by value descending
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const total = sortedData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            innerRadius={50}
            paddingAngle={2}
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
      </ResponsiveContainer>
    </div>
  );
}
