import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";

const PaymentMethodPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const cartItems = location.state?.cartItems || [];
  const deliveryFee = location.state?.deliveryFee || 0;
  const deliveryCoords = location.state?.deliveryCoords || null; // From CheckoutPage.jsx

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  // Validate and calculate order summary
  const orderSummary = {
    items: cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0),
    subTotal: cartItems.reduce(
      (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
      0
    ),
    shipping: Number(deliveryFee) || 0,
    couponDiscount: 30,
  };

  orderSummary.total = (
    orderSummary.subTotal + orderSummary.shipping - orderSummary.couponDiscount
  ).toFixed(2); // Ensure 2 decimal places for KES

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      setError("User not logged in. Please log in to continue.");
      navigate("/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  const handlePayNow = async () => {
    if (!window.PaystackPop) {
      setError("Paystack is not ready. Please refresh the page.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token || !user || !user.email) {
      setError("Authentication session error. Please log in again.");
      navigate("/login", { replace: true });
      return;
    }

    // Validate cart items
    if (!cartItems.length) {
      setError("Cart is empty. Please add items to proceed.");
      return;
    }



    setLoading(true);
    setError(null);

    try {
      const itemsPayload = cartItems.map((item) => ({
        product_id: Number(item.id),
        quantity: Number(item.quantity),
        price: Number(item.price).toFixed(2), // Ensure price is a decimal
      }));

      // Calculate total in KES for backend (2 decimal places)
      const totalPrice = Number(orderSummary.total);

      const orderRes = await axios.post(
        "http://localhost:8000/api/orders/",
        {
          items: itemsPayload,
          total_price: totalPrice,
          delivery_fee: orderSummary.shipping,
          delivery_coords: deliveryCoords
            ? `Lat: ${deliveryCoords.lat.toFixed(6)}, Lng: ${deliveryCoords.lng.toFixed(6)}`
            : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newOrderId = orderRes.data.id;
      setOrderId(newOrderId);

      // Calculate amount in kobo for Paystack - ensure it's a valid integer
      const validatedTotalPrice = parseFloat(totalPrice) || 0;
      const amountInKobo = Math.round(Math.round(validatedTotalPrice * 100) / 100 * 100); // Double rounding to ensure integer
      console.log("Amount in kobo:", amountInKobo); // Debug
      
      // Ensure amount is a positive integer
      if (!Number.isInteger(amountInKobo) || amountInKobo <= 0) {
        throw new Error(`Invalid amount: ${amountInKobo}. Please check your order total.`);
      }

      const paystack = window.PaystackPop.setup({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: user.email,

        amount: amountInKobo,
        currency: "KES",
        ref: `ref-${newOrderId}-${Date.now()}`,
        metadata: {
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: newOrderId,
            },
          ],
        },
        callback: function(response) {
          if (!response || !response.reference) {
            console.error("Invalid Paystack response:", response);
            setLoading(false);
            return;
          }
          
          // Ensure this is a proper function
          const processPayment = async () => {
            try {
              const verifyRes = await axios.post(
                "http://localhost:8000/api/verify-payment/",
                { reference: response.reference, order_id: newOrderId },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              
              // Clear cart
              await axios.post(
                "http://localhost:8000/api/cart/clear/",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              
              navigate(`/order-success/${newOrderId}`, {
                state: { cartItems },
              });
              alert("✅ Payment verified and saved!");
            } catch (err) {
              console.error("❌ Verification error:", err.response?.data || err.message);
              setError("Payment made but verification failed. Please contact support.");
            } finally {
              setLoading(false);
            }
          };
          
          // Execute the payment processing
          processPayment();
        },
        onClose: () => {
          setError("Payment popup closed. You can try again.");
          setLoading(false);
        },
      });

      paystack.openIframe();
    } catch (err) {
      console.error("❌ Order creation or Paystack error:", err.response?.data || err.message);
      setError(
        err.response?.data?.error ||
        err.response?.data?.total_price?.[0] ||
        "Failed to create order. Please try again."
      );
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <nav className="text-sm text-gray-600 mb-6">
        Home {">"} Shopping Cart {">"} Payment Method
      </nav>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-bold mb-1">Pay</h2>
          <p className="text-gray-400 mb-4">
            Secure Payment via Mobile Money or Bank Transfer
          </p>
          <button
            onClick={handlePayNow}
            disabled={loading}
            className="w-60 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition duration-200"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>

        <div className="w-80 border border-gray-300 rounded-lg p-4 h-fit">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Items</span>
            <span>{orderSummary.items}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Sub Total</span>
            <span>Ksh {Number(orderSummary.subTotal).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>Ksh {Number(orderSummary.shipping).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Coupon Discount</span>
            <span className="text-red-600">
              -Ksh {Number(orderSummary.couponDiscount).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between font-semibold text-lg mb-4">
            <span>Total</span>
            <span>Ksh {Number(orderSummary.total).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodPage;
