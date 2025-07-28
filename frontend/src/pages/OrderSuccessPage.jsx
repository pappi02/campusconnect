import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "../api";
import CartItemsList from "../components/CartPage/CartItemsList";
import OrderSummary from "../components/CartPage/OrderSummary";

const statusSteps = [
  { key: "order_placed", label: "Order Placed" },
  { key: "accepted", label: "Accepted" },
  { key: "in_progress", label: "In Progress" },
  { key: "on_the_way", label: "On the Way" },
  { key: "delivered", label: "Delivered" },
];

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // cartItems passed via location state from PaymentMethodPage
  const cartItems = location.state?.cartItems || [];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`/api/orders/${orderId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(response.data);
      } catch (err) {
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    if (!orderId) {
      setError("Order ID is missing.");
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [orderId]);

  const getStatusIndex = () => {
    if (!order) return -1;
    return statusSteps.findIndex((step) => step.key === order.status);
  };

  const statusIndex = getStatusIndex();

  if (loading) {
    return <div className="p-6 text-center">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}{" "}
        <button
          onClick={() => navigate("/")}
          className="underline text-blue-600"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <nav className="text-sm text-gray-600 mb-6">
        Home {'>'} Track Delivery
      </nav>

      <h2 className="text-xl font-bold mb-4">Order Status</h2>
      <div className="mb-6">
        <span className="font-semibold">ORDER ID: </span>
        <span className="text-gray-700">#{order.reference || orderId}</span>
      </div>

      {/* Status Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        {statusSteps.map((step, idx) => {
          const isActive = idx <= statusIndex;
          const isLast = idx === statusSteps.length - 1;
          return (
            <div key={step.key} className="flex-1 flex flex-col items-center relative">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${
                  isActive ? "border-green-500 bg-green-500" : "border-gray-400 bg-gray-200"
                }`}
              >
                {isActive ? (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                )}
              </div>
              <div className="text-center text-xs font-semibold text-gray-700">{step.label}</div>
              {!isLast && (
                <div
                  className={`absolute top-5 right-0 w-full h-0.5 ${
                    isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                  style={{ left: "50%", right: "-50%" }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Cart Items */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Product</h3>
        <CartItemsList
          cartItems={cartItems}
          onRemoveItem={() => {}}
          onQuantityChange={() => {}}
        />
      </div>

      {/* Order Summary */}
      <OrderSummary
        itemsCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        subTotal={cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)}
        shippingCost={30}
        couponDiscount={30}
        total={cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + 30 - 30}
        onProceedToCheckout={null} // Hide button
      />
    </div>
  );
};

export default OrderSuccessPage;
