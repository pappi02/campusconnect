import React from "react";
import { FaShoppingCart, FaDollarSign, FaBoxOpen } from "react-icons/fa";

const SummaryCards = ({ totalOrders, totalSell, totalProducts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
          <FaShoppingCart size={24} />
        </div>
        <div>
          <p className="text-gray-500">Total Orders</p>
          <p className="text-2xl font-semibold">{totalOrders}</p>
          <p className="text-green-500 text-sm">10% vs last month</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
          <FaDollarSign size={24} />
        </div>
        <div>
          <p className="text-gray-500">Total Sell</p>
          <p className="text-2xl font-semibold">₹{totalSell}L</p>
          <p className="text-red-500 text-sm">5% vs last month</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
          <FaBoxOpen size={24} />
        </div>
        <div>
          <p className="text-gray-500">Total Products</p>
          <p className="text-2xl font-semibold">{totalProducts}</p>
          <p className="text-green-500 text-sm">+23 vs last month</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
