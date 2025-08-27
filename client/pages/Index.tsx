import DashboardLayout from "@/components/layout/DashboardLayout";
import EnhancedStatsCards from "@/components/dashboard/EnhancedStatsCards";
import ImprovedAnalyticsCharts from "@/components/dashboard/ImprovedAnalyticsCharts";
import InteractiveAnalyticsChart from "@/components/dashboard/InteractiveAnalyticsChart";
import DynamicAnalyticsChart from "@/components/dashboard/DynamicAnalyticsChart";
import DetailedOverview from "@/components/dashboard/DetailedOverview";
import PerformanceAnalytics from "@/components/dashboard/PerformanceAnalytics";
import DateRangePicker from "@/components/dashboard/DateRangePicker";
import LiveDataIndicator from "@/components/dashboard/LiveDataIndicator";
import { useRealTimeData } from "@/hooks/useRealTimeData";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RefreshCw, Activity } from "lucide-react";

export default function Index() {
  const { data, trends, isLive, toggleLiveUpdates, lastUpdated } =
    useRealTimeData();
  const [dateRange, setDateRange] = useState({
    label: "Last 30 days",
    value: "30d",
    days: 30,
  });

  const handleDateRangeChange = (range: any) => {
    setDateRange(range);
    // Here you would typically refetch data for the new date range
    console.log("Date range changed to:", range);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Dashboard Controls */}
        <div data-tour="dashboard-controls">
          <Card className="bg-gradient-to-r from-valasys-orange/5 to-valasys-blue/5 border-valasys-orange/20">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-valasys-orange" />
                    <h2 className="text-lg font-semibold text-valasys-gray-900">
                      Real-time Dashboard
                    </h2>
                  </div>
                  <LiveDataIndicator
                    data-tour="live-indicator"
                    isLive={isLive}
                    lastUpdated={lastUpdated}
                    onToggle={toggleLiveUpdates}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <DateRangePicker
                    onRangeChange={handleDateRangeChange}
                    defaultRange={dateRange.value}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Stats Cards with Real-time Data */}
        <div data-tour="stats-cards">
          <EnhancedStatsCards data={data} trends={trends} />
        </div>

        {/* Interactive SaaS Analytics Chart */}
        <div data-tour="analytics-charts">
          <InteractiveAnalyticsChart />
        </div>

        {/* Performance Analytics */}
        <div data-tour="performance-analytics">
          <PerformanceAnalytics />
        </div>

        {/* Dynamic Distribution Analytics Charts */}
        <div data-tour="distribution-analysis">
          <DynamicAnalyticsChart />
        </div>

        {/* Detailed Overview */}
        <div data-tour="detailed-overview">
          <DetailedOverview />
        </div>

        {/* Additional Insights */}
        <div data-tour="additional-insights">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {((data.accountsVerified / 1500) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-valasys-gray-600">
                    Monthly Target Achievement
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {(
                      (data.creditsSpent / data.availableCredits) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-sm text-valasys-gray-600">
                    Credit Utilization Rate
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {data.successRate >= 95
                      ? "🎯"
                      : data.successRate >= 90
                        ? "📈"
                        : "⚠️"}
                  </div>
                  <div className="text-sm text-valasys-gray-600">
                    Performance Status
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
