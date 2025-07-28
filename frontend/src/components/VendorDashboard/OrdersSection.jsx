import React from "react";
import SummaryCards from "./SummaryCards";
import OrderSummary from "./OrderSummary";
import LatestOrders from "./LatestOrders";
import SellingProducts from "./SellingProducts";
import TopTowns from "./TopTowns";

const OrdersSection = ({
  summaryData,
  orderSummary,
  latestOrders,
  sellingProducts,
  topTowns,
}) => {
  return (
    <div className="p-6 space-y-6">
      {/* Top Summary Cards */}
      <SummaryCards
        totalOrders={summaryData.totalOrders}
        totalSell={summaryData.totalSell}
        totalProducts={summaryData.totalProducts}
      />

      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Order Summary */}
        <div className="lg:w-1/3 mb-6 lg:mb-0">
          <OrderSummary orderSummary={orderSummary} />
        </div>

        {/* Latest Orders List */}
        <div className="lg:w-2/3">
          <LatestOrders latestOrders={latestOrders} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-6">
        {/* Selling Products */}
        <div className="lg:w-2/3 mb-6 lg:mb-0">
          <SellingProducts products={sellingProducts} />
        </div>

        {/* Top Towns */}
        <div className="lg:w-1/3">
          <TopTowns towns={topTowns} />
        </div>
      </div>
    </div>
  );
};

export default OrdersSection;
