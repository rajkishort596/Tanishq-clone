import React, { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Users, Star } from "lucide-react";
import Spinner from "../components/Spinner";
import StatCard from "../components/Card/StatCard";
import OrdersTable from "../components/Table/OrdersTable";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Mock data for demonstration purposes
        const mockData = {
          totalSales: "₹ 1,25,00,000",
          totalOrders: 1250,
          newCustomers: 85,
          pendingReviews: 15,
          outOfStockProducts: 20,
        };

        setTimeout(() => {
          setDashboardData(mockData);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <h2 className="text-2xl text-primary font-semibold font-fraunces mb-6">
        Overview Statistics
      </h2>

      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Using the reusable StatCard component */}
          <StatCard
            title="Total Sales"
            value={dashboardData.totalSales}
            icon={DollarSign}
            iconBgColor="bg-rose-100"
            iconTextColor="text-rose-600"
          />

          <StatCard
            title="Total Orders"
            value={dashboardData.totalOrders}
            icon={ShoppingCart}
            iconBgColor="bg-blue-100"
            iconTextColor="text-blue-600"
          />

          <StatCard
            title="New Customers"
            value={dashboardData.newCustomers}
            icon={Users}
            iconBgColor="bg-green-100"
            iconTextColor="text-green-600"
          />

          <StatCard
            title="Pending Reviews"
            value={dashboardData.pendingReviews}
            icon={Star}
            iconBgColor="bg-yellow-100"
            iconTextColor="text-yellow-600"
          />
        </div>
      )}

      {/* Recent Orders Table */}
      <div>
        <h2 className="text-xl font-semibold text-primary font-fraunces mb-4">
          Recent Orders
        </h2>
        <div className="w-full overflow-x-auto">
          <OrdersTable orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
