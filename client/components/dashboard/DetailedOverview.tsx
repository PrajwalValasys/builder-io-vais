import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  AlertTriangle,
} from "lucide-react";

// Enhanced sample data with month-over-month changes
const generateChartData = (category: string) => {
  const baseData = {
    "Employee Size": [
      { name: "Jan", value: 420, previousValue: 380 },
      { name: "Feb", value: 380, previousValue: 420 },
      { name: "Mar", value: 520, previousValue: 380 },
      { name: "Apr", value: 490, previousValue: 520 },
      { name: "May", value: 610, previousValue: 490 },
      { name: "Jun", value: 580, previousValue: 610 },
    ],
    Industry: [
      { name: "Jan", value: 240, previousValue: 220 },
      { name: "Feb", value: 280, previousValue: 240 },
      { name: "Mar", value: 320, previousValue: 280 },
      { name: "Apr", value: 380, previousValue: 320 },
      { name: "May", value: 420, previousValue: 380 },
      { name: "Jun", value: 450, previousValue: 420 },
    ],
    "Company Revenue": [
      { name: "Jan", value: 340, previousValue: 310 },
      { name: "Feb", value: 320, previousValue: 340 },
      { name: "Mar", value: 410, previousValue: 320 },
      { name: "Apr", value: 380, previousValue: 410 },
      { name: "May", value: 470, previousValue: 380 },
      { name: "Jun", value: 520, previousValue: 470 },
    ],
  };

  return (
    baseData[category as keyof typeof baseData] || baseData["Employee Size"]
  );
};

const tabsData = [
  {
    id: "emp-size",
    label: "By Employee Size",
    category: "Employee Size",
    colors: {
      primary: "#FF6A00",
      light: "#FFF3E0",
      gradient: {
        start: "#FF6A00",
        end: "#FFB366",
      },
    },
  },
  {
    id: "industry",
    label: "By Industry",
    category: "Industry",
    colors: {
      primary: "#1A73E8",
      light: "#E8F0FE",
      gradient: {
        start: "#1A73E8",
        end: "#6BB6FF",
      },
    },
  },
  {
    id: "revenue",
    label: "By Company Revenue",
    category: "Company Revenue",
    colors: {
      primary: "#00C48C",
      light: "#E6F7FF",
      gradient: {
        start: "#00C48C",
        end: "#66D9A6",
      },
    },
  },
];

const dateRangeOptions = [
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
];

interface DetailedOverviewProps {
  className?: string;
}

export default function DetailedOverview({ className }: DetailedOverviewProps) {
  const [activeTab, setActiveTab] = useState("emp-size");
  const [dateRange, setDateRange] = useState("6m");

  const activeTabData = useMemo(
    () => tabsData.find((tab) => tab.id === activeTab) || tabsData[0],
    [activeTab],
  );

  const chartData = useMemo(
    () => generateChartData(activeTabData.category),
    [activeTabData.category],
  );

  // Calculate KPIs
  const kpis = useMemo(() => {
    const values = chartData.map((item) => item.value);
    const highestMonth = chartData.reduce((prev, current) =>
      prev.value > current.value ? prev : current,
    );
    const lowestMonth = chartData.reduce((prev, current) =>
      prev.value < current.value ? prev : current,
    );

    // Calculate average MoM growth
    const momChanges = chartData.map(
      (item) => ((item.value - item.previousValue) / item.previousValue) * 100,
    );
    const avgMomGrowth =
      momChanges.reduce((sum, change) => sum + change, 0) / momChanges.length;

    return {
      highestMonth,
      lowestMonth,
      avgMomGrowth,
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const momChange =
        ((data.value - data.previousValue) / data.previousValue) * 100;

      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{`Month: ${label}`}</p>
          <p className="text-sm text-gray-700 mb-1">
            {`Value: ${data.value.toLocaleString()}`}
          </p>
          <div className="flex items-center space-x-1">
            {momChange >= 0 ? (
              <TrendingUp className="w-3 h-3 text-green-500" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${momChange >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {momChange > 0 ? "+" : ""}
              {momChange.toFixed(1)}% vs prev month
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-valasys-orange" />
            <span>Detailed Overview Chart</span>
          </CardTitle>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              {dateRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-gray-100 p-1 rounded-lg">
            {tabsData.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`
                  relative px-6 py-2 rounded-md font-medium text-sm transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? `bg-white text-gray-900 shadow-sm`
                      : `text-gray-600 hover:text-gray-900 hover:bg-gray-50`
                  }
                `}
                style={{
                  backgroundColor:
                    activeTab === tab.id ? tab.colors.primary : undefined,
                  color: activeTab === tab.id ? "white" : undefined,
                }}
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabsData.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    maxBarSize={40}
                  >
                    <defs>
                      <linearGradient
                        id={`gradient-${tab.id}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={tab.colors.gradient.start}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={tab.colors.gradient.end}
                          stopOpacity={0.3}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      fill={`url(#gradient-${tab.id})`}
                      radius={[8, 8, 0, 0]}
                      stroke={tab.colors.primary}
                      strokeWidth={1}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#gradient-${tab.id})`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div
            className="p-4 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: activeTabData.colors.light }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: activeTabData.colors.primary }}
              >
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Highest Month
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {kpis.highestMonth.name}
                </p>
                <p className="text-sm text-gray-500">
                  {kpis.highestMonth.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div
            className="p-4 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: activeTabData.colors.light }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: activeTabData.colors.primary }}
              >
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Lowest Month
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {kpis.lowestMonth.name}
                </p>
                <p className="text-sm text-gray-500">
                  {kpis.lowestMonth.value.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div
            className="p-4 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: activeTabData.colors.light }}
          >
            <div className="flex items-center space-x-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: activeTabData.colors.primary }}
              >
                {kpis.avgMomGrowth >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-white" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  MoM Growth %
                </p>
                <p
                  className={`text-xl font-bold ${kpis.avgMomGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {kpis.avgMomGrowth > 0 ? "+" : ""}
                  {kpis.avgMomGrowth.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">Average change</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
