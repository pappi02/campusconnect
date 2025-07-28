import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import axios from "../api";
import { toast } from "react-toastify";

const VendorCustomers = () => {
  const { user, token } = useContext(AuthContext);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (!user || !token) return;

    const fetchCustomers = async () => {
      try {
        // Fetch orders and extract unique customers related to vendor
        const response = await axios.get("/api/orders/");
        const orders = response.data;

        // Filter orders for current vendor's products and extract customers
        // For simplicity, assuming orders API returns customer info and vendor info
        const vendorCustomersMap = new Map();

        orders.forEach((order) => {
          if (order.items.some(item => item.product.vendor_id === user.id)) {
            if (!vendorCustomersMap.has(order.customer.id)) {
              vendorCustomersMap.set(order.customer.id, {
                id: order.customer.id,
                name: order.customer.full_name || order.customer.email,
                avatar: order.customer.avatar || "",
                orderId: order.id,
                price: order.total_price,
                state: order.status,
                date: order.created_at,
              });
            }
          }
        });

        setCustomers(Array.from(vendorCustomersMap.values()));
      } catch (error) {
        console.error("Failed to fetch vendor customers", error);
        if (error.response && error.response.status === 401) {
          toast.error("Vendor account not found");
        }
      }
    };

    fetchCustomers();
  }, [user, token]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Customers</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4">Customers</th>
              <th className="py-2 px-4">OrderID</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">State</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-4 flex items-center space-x-2">
                  {customer.avatar ? (
                    <img src={customer.avatar} alt={customer.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{customer.name}</span>
                </td>
                <td className="py-2 px-4">{customer.orderId}</td>
                <td className="py-2 px-4">${customer.price}</td>
                <td className="py-2 px-4">{customer.state}</td>
                <td className="py-2 px-4">{new Date(customer.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default VendorCustomers;
