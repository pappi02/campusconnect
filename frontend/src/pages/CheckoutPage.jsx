import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [showItems, setShowItems] = useState(false);

  // Dummy order summary
  const orderSummary = {
    items: cartItems.reduce((acc, item) => acc + item.quantity, 0),
    subTotal: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    shipping: 100,
    couponDiscount: 29,
  };
  orderSummary.total = orderSummary.subTotal + orderSummary.shipping - orderSummary.couponDiscount;

  const handleProceedToPayment = () => {
    navigate("/payment-method", { state: { cartItems } });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:underline">Home</Link> {'>'} <Link to="/cart" className="hover:underline">Shopping Cart</Link> {'>'} <span>Checkout</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Delivery Method */}
          <div className="border rounded p-4">
            <div className="flex space-x-4 mb-4">
              <button
                className={`flex-1 p-4 border rounded ${deliveryMethod === "delivery" ? "bg-yellow-400" : "bg-white"}`}
                onClick={() => setDeliveryMethod("delivery")}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                  <span>Delivery</span>
                </div>
                <div className="text-xs text-gray-600">Ready within 2hrs</div>
              </button>
              <button
                className={`flex-1 p-4 border rounded ${deliveryMethod === "store" ? "bg-gray-200" : "bg-white"}`}
                onClick={() => setDeliveryMethod("store")}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                  <span>Pick at a store</span>
                </div>
                <div className="text-xs text-gray-600">Within an hour</div>
              </button>
            </div>

            {/* Delivery Address */}
            {deliveryMethod === "delivery" && (
              <div className="bg-yellow-400 p-4 rounded mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18"/></svg>
                  <span className="font-semibold">Delivery Address</span>
                </div>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded resize-none"
                  rows={3}
                  placeholder="Enter your delivery address"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
                <button className="mt-2 px-4 py-1 border rounded text-sm hover:bg-gray-100">CHANGE ADDRESS</button>
              </div>
            )}

            {/* Schedule a delivery */}
            {deliveryMethod === "delivery" && (
              <div className="bg-yellow-400 p-4 rounded mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                  <span className="font-semibold">Schedule a delivery</span>
                </div>
                <div className="text-gray-600 mb-2">Saturday 25th June 2025</div>
                <div className="text-gray-600 mb-2">10:00AM - 12:00AM</div>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded resize-none"
                  rows={3}
                  placeholder="Additional Delivery Information"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                />
                <div className="text-xs text-gray-500 text-right">Remaining Characters: {255 - additionalInfo.length}</div>
                <button className="mt-2 px-4 py-1 border rounded text-sm hover:bg-gray-100">CHANGE SLOT</button>
              </div>
            )}

            {/* Items Details */}
            <div className="bg-yellow-400 p-4 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18"/></svg>
                <span className="font-semibold">Items Details</span>
              </div>
              <div className="flex justify-between items-center">
                <div>{cartItems.map(item => item.name).join(", ")}</div>
                <button className="px-4 py-1 border rounded text-sm hover:bg-gray-100" onClick={() => setShowItems(!showItems)}>{showItems ? "Hide Items" : "Show Items"}</button>
              </div>
              {showItems && (
                <div className="mt-2 p-2 border border-gray-300 rounded bg-white text-sm">
                  {cartItems.map(item => item.name).join(", ")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
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
          <button
            onClick={handleProceedToPayment}
            className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

