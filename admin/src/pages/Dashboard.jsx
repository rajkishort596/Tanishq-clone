import React, { useEffect } from "react";
import { DollarSign, ShoppingCart, Users, Star, Package } from "lucide-react";
import Spinner from "../components/Spinner";
import StatCard from "../components/Card/StatCard";
import OrdersTable from "../components/Table/OrdersTable";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { toast } from "react-toastify";
import { formatCurrency, formatNumber } from "../utils/formatters";

const Dashboard = () => {
  const { data: dashboardData, isPending, error } = useDashboardStats();

  useEffect(() => {
    if (error) {
      toast.error(error?.message || "Failed to load dashboard data.");
    }
  }, [error]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-120px)] text-red-600">
        <p>Error: {error.message || "Could not load dashboard data."}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h2 className="text-2xl text-primary font-semibold font-fraunces mb-6">
        Overview Statistics
      </h2>

      {dashboardData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 xl:col-span-1">
            <StatCard
              title="Total Sales"
              value={formatCurrency(dashboardData?.totalSales)}
              icon={DollarSign}
              iconBgColor="bg-rose-100"
              iconTextColor="text-rose-600"
              glowClass="glow-rose"
            />
          </div>

          <StatCard
            title="Total Orders"
            value={formatNumber(dashboardData?.totalOrders)}
            icon={ShoppingCart}
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
            glowClass="glow-blue"
          />

          <StatCard
            title="New Customers"
            value={formatNumber(dashboardData?.newCustomers)}
            icon={Users}
            iconBgColor="bg-green-100"
            iconTextColor="text-green-600"
            glowClass="glow-green"
          />

          <StatCard
            title="Pending Reviews"
            value={formatNumber(dashboardData?.pendingReviews)}
            icon={Star}
            iconBgColor="bg-yellow-100"
            iconTextColor="text-yellow-600"
            glowClass="glow-yellow"
          />
          <StatCard
            title="Out of Stock Products"
            value={formatNumber(dashboardData?.outOfStockProducts)}
            icon={Package}
            iconBgColor="bg-red-100"
            iconTextColor="text-red-600"
            glowClass="glow-red"
          />
        </div>
      )}

      {/* Recent Orders Table */}
      <div>
        <h2 className="text-xl font-semibold text-primary font-fraunces mb-4">
          Recent Orders
        </h2>
        <div className="h-auto overflow-auto">
          <OrdersTable orders={dashboardData?.recentOrders || []} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
