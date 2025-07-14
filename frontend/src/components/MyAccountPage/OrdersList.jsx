import React from "react";
import OrderItem from "./OrderItem";



const OrdersList = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <p>No orders were found.</p>;
  }

  return (
    <section className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Orders ({orders.length})</h2>
        <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
          <option>All</option>
          <option>Pending</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} />
      ))}
    </section>
  );
};

export default OrdersList;
