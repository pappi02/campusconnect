import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import axios from "../api";
import { toast } from "react-toastify";
import SummaryCards from "../components/VendorDashboard/SummaryCards";
import OrderSummary from "../components/VendorDashboard/OrderSummary";
import OrdersSection from "../components/VendorDashboard/OrdersSection";
import SellingProducts from "../components/VendorDashboard/SellingProducts";
import TopTowns from "../components/VendorDashboard/TopTowns";

const VendorDashboardHome = () => {
  const { user, token } = useContext(AuthContext);

  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    totalSell: 0,
    totalProducts: 0,
    orderSummary: {
      pending: 0,
      shipped: 0,
      delivered: 0,
      total: 0,
    },
    latestOrders: [],
    sellingProducts: [],
    topTowns: [],
  });

  useEffect(() => {
    if (!user || !token) return;

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("/api/vendor/dashboard/");
        const data = response.data;

        setDashboardData({
          totalOrders: data.total_orders,
          totalSell: data.total_sell,
          totalProducts: data.total_products,
          orderSummary: {
            pending: data.pending_orders,
            shipped: data.shipped_orders,
            delivered: data.delivered_orders,
            total: data.total_orders,
          },
          latestOrders: data.latest_orders || [],
          sellingProducts: data.selling_products || [],
          topTowns: data.top_towns || [],
        });
      } catch (error) {
        console.error("Failed to fetch vendor dashboard data", error);
        if (error.response && error.response.status === 401) {
          toast.error("Vendor account not found");
        }
      }
    };

    fetchDashboardData();
  }, [user, token]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <OrdersSection
        summaryData={{
          totalOrders: dashboardData.totalOrders,
          totalSell: dashboardData.totalSell,
          totalProducts: dashboardData.totalProducts,
        }}
        orderSummary={dashboardData.orderSummary}
        latestOrders={dashboardData.latestOrders}
        sellingProducts={dashboardData.sellingProducts}
        topTowns={dashboardData.topTowns}
      />
    </main>
  );
};

export default VendorDashboardHome;
