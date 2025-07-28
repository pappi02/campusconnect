import React from "react";
import { FaEdit, FaTrash, FaEllipsisH } from "react-icons/fa";

const statusColors = {
  Pending: "text-red-500",
  Shipping: "text-yellow-500",
  Refund: "text-yellow-500",
  Completed: "text-green-500",
};

const LatestOrders = ({ latestOrders = [] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Latest Orders</h2>
        <button className="text-blue-600 hover:underline">More &rarr;</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4">Products</th>
              <th className="py-2 px-4">QTY</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Revenue</th>
              <th className="py-2 px-4">Net Profit</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {latestOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-4 flex items-center space-x-3">
                  <img
                    src={`https://via.placeholder.com/40?text=${order.product.charAt(0)}`}
                    alt={order.product}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span>{order.product}</span>
                </td>
                <td className="py-2 px-4">x{order.qty}</td>
                <td className="py-2 px-4">{order.date}</td>
                <td className="py-2 px-4">${order.revenue.toFixed(2)}</td>
                <td className="py-2 px-4">${order.netProfit.toFixed(2)}</td>
                <td className={`py-2 px-4 font-semibold ${statusColors[order.status] || "text-gray-700"}`}>
                  {order.status}
                </td>
                <td className="py-2 px-4 flex space-x-3">
                  <button className="text-gray-600 hover:text-blue-600" title="Edit">
                    <FaEdit />
                  </button>
                  <button className="text-gray-600 hover:text-red-600" title="Delete">
                    <FaTrash />
                  </button>
                  <button className="text-gray-600 hover:text-gray-900" title="More">
                    <FaEllipsisH />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestOrders;
