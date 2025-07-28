import React, { useEffect, useState, useContext } from "react";
import SummaryCards from "../components/VendorDashboard/SummaryCards";
import OrderSummary from "../components/VendorDashboard/OrderSummary";
import SellingProducts from "../components/VendorDashboard/SellingProducts";
import TopTowns from "../components/VendorDashboard/TopTowns";
import AuthContext from "../contexts/AuthContext";
import axios from "../api";
import { toast } from "react-toastify";

const VendorAnalytics = () => {
  const { user, token } = useContext(AuthContext);

  const [analyticsData, setAnalyticsData] = useState({
    totalOrders: 0,
    totalSell: 0,
    totalProducts: 0,
    orderSummary: {
      pending: 0,
      shipped: 0,
      delivered: 0,
      total: 0,
    },
    sellingProducts: [],
    topTowns: [],
  });

  useEffect(() => {
    if (!user || !token) return;

    const fetchAnalyticsData = async () => {
      try {
        const response = await axios.get("/api/analytics/");
        const data = response.data;

        setAnalyticsData({
          totalOrders: data.total_orders,
          totalSell: data.total_sell,
          totalProducts: data.total_products,
          orderSummary: {
            pending: data.pending_orders,
            shipped: data.shipped_orders,
            delivered: data.delivered_orders,
            total: data.total_orders,
          },
          sellingProducts: data.selling_products,
          topTowns: data.top_towns,
        });
      } catch (error) {
        console.error("Failed to fetch analytics data", error);
        if (error.response && error.response.status === 401) {
          toast.error("Vendor account not found");
        }
      }
    };

    fetchAnalyticsData();
  }, [user, token]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="mb-6 w-full">
        <SummaryCards
          totalOrders={analyticsData.totalOrders}
          totalSell={analyticsData.totalSell}
          totalProducts={analyticsData.totalProducts}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <OrderSummary orderSummary={analyticsData.orderSummary} />
          {/* You can add more analytics components here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <SellingProducts products={analyticsData.sellingProducts} />
          <TopTowns towns={analyticsData.topTowns} />
        </div>
      </div>
    </main>
  );
};

export default VendorAnalytics;
