import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const PaymentMethodPage = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const cartItems = location.state?.cartItems || [];

  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const orderSummary = {
    items: cartItems.reduce((acc, item) => acc + item.quantity, 0),
    subTotal: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    shipping: 30,
    couponDiscount: 30,
  };
  orderSummary.total = orderSummary.subTotal + orderSummary.shipping - orderSummary.couponDiscount;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayNow = async () => {
    if (!window.PaystackPop || !user?.email) {
      alert("Paystack is not ready or user not logged in");
      return;
    }

    const token = localStorage.getItem("authToken"); // Corrected key to match AuthContext storage

    if (!token) {
      alert("User token not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Step 1: Create order with Authorization header
      // Prepare items payload with product_id and quantity only
      const itemsPayload = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const orderRes = await axios.post(
        "http://localhost:8000/api/orders/",
        {
          items: itemsPayload,
          total_price: orderSummary.total
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newOrderId = orderRes.data.id;
      setOrderId(newOrderId);

      // ✅ Step 2: Setup Paystack
      const paystack = window.PaystackPop.setup({
        key: "pk_live_d7fc744f5c675064ada774e4530c5ce55958a17b",
        email: user.email,
        amount: orderSummary.total * 100,
        currency: "KES",
        ref:  `ref-${Date.now()}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: newOrderId,
            },
          ],
        },
        callback: function (response) {
          console.log("✅ Payment complete! Reference:", response.reference);

          // ✅ Step 3: Verify payment with Auth header
          axios
            .post(
              "http://localhost:8000/api/verify-payment/",
              { reference: response.reference },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((res) => {
              alert("✅ Payment verified and saved!");
              console.log("🔁 Verification response:", res.data);
            })
            .catch((err) => {
              console.error("❌ Verification error:", err.response?.data || err.message);
              alert("Payment made but verification failed.");
            })
            .finally(() => setLoading(false));
        },
        onClose: function () {
          alert("Payment popup closed.");
          setLoading(false);
        },
      });

      paystack.openIframe();
    } catch (err) {
      console.error("❌ Order creation or Paystack error:", err.response?.data || err.message);
      alert("Failed to create order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <nav className="text-sm text-gray-600 mb-6">
        Home {'>'} Shopping Cart {'>'} Payment Method
      </nav>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-bold mb-1">Pay</h2>
          <p className="text-gray-400 mb-4">Secure Payment via Mobile Money or Bank Transfer</p>

          <button
            onClick={handlePayNow}
            disabled={loading}
            className="w-60 bg-green-600 text-white py-3 rounded hover:bg-green-700"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>

        <div className="w-80 border border-gray-300 rounded p-4 h-fit">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Items</span>
            <span>{orderSummary.items}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Sub Total</span>
            <span>Ksh {orderSummary.subTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>Ksh {orderSummary.shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Coupon Discount</span>
            <span className="text-red-600">-Ksh {orderSummary.couponDiscount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mb-4">
            <span>Total</span>
            <span>Ksh {orderSummary.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
