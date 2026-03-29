"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { authClient } from "@/lib/auth/auth-client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import {
  useRealEstateContext,
  Property,
} from "@/app/dashboard/realestate/real-estate-context";
import {
  useAgricultureContext,
  Land,
} from "@/app/dashboard/agriculture/agriculture-context";
import { ChartSkeleton } from "@/components/shared/Skeletons";
import {
  DollarSign,
  TrendingUp,
  Home,
  Sprout,
  Users,
  PieChart,
} from "lucide-react";

// Dynamically import charts to avoid SSR issues
const RevenueByAssetChart = dynamic(
  () =>
    import("@/components/dashboard/PortfolioCharts").then(
      (mod) => mod.RevenueByAssetChart,
    ),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
const OccupancyChart = dynamic(
  () =>
    import("@/components/dashboard/PortfolioCharts").then(
      (mod) => mod.OccupancyChart,
    ),
  { ssr: false, loading: () => <ChartSkeleton /> },
);
const AssetDistributionChart = dynamic(
  () =>
    import("@/components/dashboard/PortfolioCharts").then(
      (mod) => mod.AssetDistributionChart,
    ),
  { ssr: false, loading: () => <ChartSkeleton /> },
);

// Helper to parse currency values
const parseCurrency = (value?: string): number => {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, "");
  return parseFloat(cleaned) || 0;
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};
export default function Dashboard() {
  const { data: session, isPending } = authClient.useSession();

  // Safe context access
  let properties: Property[] = [];
  try {
    const reCtx = useRealEstateContext();
    properties = reCtx.properties;
  } catch {
    // Context not available
  }

  let lands: Land[] = [];
  try {
    const agCtx = useAgricultureContext();
    lands = agCtx.lands;
  } catch {
    // Context not available
  }

  // Calculate portfolio metrics
  const totalMonthlyRevenue =
    properties.reduce((sum, p) => sum + parseCurrency(p.price), 0) +
    lands.reduce((sum, l) => sum + parseCurrency(l.profit) / 12, 0);

  const totalPropertyValue =
    properties.reduce(
      (sum, p) => sum + parseCurrency(p.currentValue || p.purchasePrice),
      0,
    ) +
    lands.reduce(
      (sum, l) => sum + parseCurrency(l.currentValue || l.purchasePrice),
      0,
    );

  const occupiedProperties = properties.filter(
    (p) => p.status === "Occupied",
  ).length;
  const occupancyRate =
    properties.length > 0
      ? Math.round((occupiedProperties / properties.length) * 100)
      : 0;

  const totalTenants = properties.reduce(
    (acc, curr) => acc + (curr.tenants?.length || 0),
    0,
  );

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-gray-700 dark:text-gray-300 animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  const hasAssets = properties.length > 0 || lands.length > 0;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 max-w-5xl mx-auto">
        {/* Mobile Menu Button */}
        <button
          onClick={() => {
            const event = new CustomEvent("toggleMobileSidebar");
            window.dispatchEvent(event);
          }}
          className="lg:hidden mb-6 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:bg-gray-100 dark:hover:bg-gray-900"
        >
          <svg
            className="w-5 h-5 text-gray-900 dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-2">
            Welcome back
            {session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Here’s a quick look at your investments. Add new assets or review
            your portfolio below.
          </p>
        </div>

        {/* Empty State */}
        {!hasAssets ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#101010] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
            <div className="mb-6">
              <span className="text-5xl">📊</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No assets yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm text-center">
              Start building your portfolio by adding your first real estate or
              agriculture asset.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard/realestate"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Add Real Estate
              </Link>
              <Link
                href="/dashboard/agriculture"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
              >
                Add Agriculture
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Portfolio Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#181818] rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Portfolio Value
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(totalPropertyValue)}
                </p>
              </div>

              <div className="bg-white dark:bg-[#181818] rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Monthly Revenue
                  </span>
                </div>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalMonthlyRevenue)}
                </p>
              </div>

              <div className="bg-white dark:bg-[#181818] rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <PieChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Occupancy Rate
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {occupancyRate}%
                </p>
              </div>

              <div className="bg-white dark:bg-[#181818] rounded-xl p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Users className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Total Tenants
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {totalTenants}
                </p>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue by Asset */}
              <div className="bg-white dark:bg-[#181818] rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Revenue by Asset
                </h3>
                <RevenueByAssetChart properties={properties} lands={lands} />
              </div>

              {/* Asset Distribution */}
              <div className="bg-white dark:bg-[#181818] rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Asset Distribution
                </h3>
                <AssetDistributionChart properties={properties} lands={lands} />
              </div>

              {/* Occupancy Status (only show if there are properties) */}
              {properties.length > 0 && (
                <div className="bg-white dark:bg-[#181818] rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Occupancy Status
                  </h3>
                  <OccupancyChart properties={properties} />
                </div>
              )}
            </div>

            {/* Asset Cards */}
            <div
              className={`grid gap-6 ${properties.length > 0 && lands.length > 0 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}
            >
              {/* Real Estate Card */}
              {properties.length > 0 && (
                <Link
                  href="/dashboard/realestate"
                  className="block bg-white dark:bg-[#181818] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900 rounded-xl">
                      <Home className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Real Estate
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {properties.length} properties
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {occupiedProperties}/{properties.length}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Occupied
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {totalTenants}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Tenants
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                    View Properties <span>→</span>
                  </div>
                </Link>
              )}

              {/* Agriculture Card */}
              {lands.length > 0 && (
                <Link
                  href="/dashboard/agriculture"
                  className="block bg-white dark:bg-[#181818] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-xl">
                      <Sprout className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Agriculture
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {lands.length} plots
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {lands.length}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Total Plots
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(
                          lands.reduce(
                            (sum, l) => sum + parseCurrency(l.profit),
                            0,
                          ),
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Annual Revenue
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    View Lands <span>→</span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
