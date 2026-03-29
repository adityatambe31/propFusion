"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface Property {
  id: string;
  name: string;
  price: string;
  status: string;
  type: string;
  expenses?: {
    maintenance?: string;
    taxes?: string;
    insurance?: string;
    utilities?: string;
    loanEMI?: string;
    managementFees?: string;
    other?: string;
  };
}

interface Land {
  id: string;
  name: string;
  profit: string;
  crop: string;
  area: string;
  expenses?: {
    seeds?: string;
    labor?: string;
    equipment?: string;
    fertilizers?: string;
    pesticides?: string;
    irrigation?: string;
    taxes?: string;
    insurance?: string;
    other?: string;
  };
}

interface PortfolioChartsProps {
  properties: Property[];
  lands: Land[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

const parseCurrency = (value?: string): number => {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, "");
  return parseFloat(cleaned) || 0;
};

export function RevenueByAssetChart({
  properties,
  lands,
}: PortfolioChartsProps) {
  const data = [
    ...properties.map((p) => ({
      name: p.name || "Property",
      revenue: parseCurrency(p.price),
      type: "Real Estate",
    })),
    ...lands.map((l) => ({
      name: l.name || "Land",
      revenue: parseCurrency(l.profit),
      type: "Agriculture",
    })),
  ].slice(0, 8);

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
        />
        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function AssetDistributionChart({
  properties,
  lands,
}: PortfolioChartsProps) {
  // Group by type
  const propertyTypes = properties.reduce(
    (acc, p) => {
      const type = p.type || "Other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const landTypes = lands.reduce(
    (acc, l) => {
      const type = l.crop || "Other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = [
    ...Object.entries(propertyTypes).map(([name, value]) => ({ name, value })),
    ...Object.entries(landTypes).map(([name, value]) => ({ name, value })),
  ];

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          labelLine={true}
        >
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function OccupancyChart({ properties }: { properties: Property[] }) {
  const occupied = properties.filter((p) => p.status === "Occupied").length;
  const vacant = properties.filter((p) => p.status === "Vacant").length;
  const maintenance = properties.filter(
    (p) => p.status === "Under Maintenance"
  ).length;

  const data = [
    { name: "Occupied", value: occupied, fill: "#10b981" },
    { name: "Vacant", value: vacant, fill: "#ef4444" },
    { name: "Maintenance", value: maintenance, fill: "#f59e0b" },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-gray-500">
        No properties
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RevenueVsExpensesChart({
  properties,
  lands,
}: PortfolioChartsProps) {
  const calcExpenses = (
    exp?: Record<string, string | undefined>
  ): number => {
    if (!exp) return 0;
    return Object.values(exp).reduce(
      (sum, val) => sum + parseCurrency(val),
      0
    );
  };

  const propertyData = properties.map((p) => ({
    name: p.name || "Property",
    revenue: parseCurrency(p.price),
    expenses: calcExpenses(p.expenses),
  }));

  const landData = lands.map((l) => ({
    name: l.name || "Land",
    revenue: parseCurrency(l.profit),
    expenses: calcExpenses(l.expenses),
  }));

  const data = [...propertyData, ...landData].slice(0, 6);

  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value: number) => `$${value.toLocaleString()}`}
        />
        <Legend />
        <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[4, 4, 0, 0]} />
        <Bar
          dataKey="expenses"
          fill="#ef4444"
          name="Expenses"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PortfolioValueTrend() {
  // Mock trend data - in production, this would come from historical data
  const data = [
    { month: "Jan", value: 850000 },
    { month: "Feb", value: 862000 },
    { month: "Mar", value: 875000 },
    { month: "Apr", value: 890000 },
    { month: "May", value: 912000 },
    { month: "Jun", value: 925000 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} />
        <YAxis
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, "Portfolio Value"]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={{ fill: "#3b82f6", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
