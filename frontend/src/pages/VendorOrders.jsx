import React, { useEffect, useState, useContext } from "react";
import OrdersSection from "../components/VendorDashboard/OrdersSection";
import AuthContext from "../contexts/AuthContext";
import axios from "../api";
import { toast } from "react-toastify";

const VendorOrders = () => {
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
    newOrders: [],
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
          newOrders: data.latest_orders,
          sellingProducts: data.selling_products,
          topTowns: data.top_towns,
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
    <main className="mt-10 p-6">
      <OrdersSection
        summaryData={{
          totalOrders: dashboardData.totalOrders,
          totalSell: dashboardData.totalSell,
          totalProducts: dashboardData.totalProducts,
        }}
        orderSummary={dashboardData.orderSummary}
        newOrders={dashboardData.newOrders}
        sellingProducts={dashboardData.sellingProducts}
        topTowns={dashboardData.topTowns}
      />
    </main>
  );
};

export default VendorOrders;
