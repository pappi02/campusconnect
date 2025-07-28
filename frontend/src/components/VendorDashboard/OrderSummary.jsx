import React from "react";

const OrderSummary = ({ orderSummary }) => {
  const { pending, shipped, delivered, total } = orderSummary;

  const getPercentage = (count) => (total ? (count / total) * 100 : 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/3">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="mb-4">
        <p className="font-semibold">Pending Orders</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-yellow-400"
            style={{ width: `${getPercentage(pending)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {getPercentage(pending).toFixed(0)}% ({pending}/{total} Orders)
        </p>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Shipped Orders</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-purple-700"
            style={{ width: `${getPercentage(shipped)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {getPercentage(shipped).toFixed(0)}% ({shipped}/{total} Orders)
        </p>
      </div>
      <div>
        <p className="font-semibold">Delivered Orders</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-green-500"
            style={{ width: `${getPercentage(delivered)}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {getPercentage(delivered).toFixed(0)}% ({delivered}/{total} Orders)
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
