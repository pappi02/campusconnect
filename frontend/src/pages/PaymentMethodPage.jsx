import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const PaymentMethodPage = () => {
  const location = useLocation();
  const cartItems = location.state?.cartItems || [];

  // Order summary data (can be derived from cartItems or static for now)
  const orderSummary = {
    items: cartItems.reduce((acc, item) => acc + item.quantity, 0),
    subTotal: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    shipping: 100,
    couponDiscount: 29,
  };
  orderSummary.total = orderSummary.subTotal + orderSummary.shipping - orderSummary.couponDiscount;

  const [selectedPayment, setSelectedPayment] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+254");

  const handleCheckoutNow = () => {
    // Implement checkout logic here
    alert("Checkout now clicked with payment method: " + selectedPayment + ", phone: " + countryCode + " " + phoneNumber);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        Home {'>'} Shopping Cart {'>'} Payment Method
      </nav>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-bold mb-1">Payment Method</h2>
          <p className="text-gray-400 mb-4">Trusted Payment, 100% Money Back Guarantee</p>

          {/* Payment Options */}
          <div className="space-y-4">
            {/* Wallet */}
            <label className="flex items-center justify-between border rounded p-4 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                </div>
                <span className="font-semibold text-gray-700">Wallet</span>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={selectedPayment === "wallet"}
                onChange={() => setSelectedPayment("wallet")}
                className="form-radio"
              />
            </label>

            {/* Mpesa */}
            <label className="flex items-center justify-between border rounded p-4 cursor-pointer">
              <div className="flex items-center space-x-3">
                <img src="/src/assets/mpesa.webp" alt="Mpesa" className="h-6" />
                <span className="font-semibold text-gray-700">Via LEGACY CORE LTD</span>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="mpesa"
                checked={selectedPayment === "mpesa"}
                onChange={() => setSelectedPayment("mpesa")}
                className="form-radio"
              />
            </label>

            {/* Phone input for Mpesa */}
            {selectedPayment === "mpesa" && (
              <div className="flex items-center space-x-2 border rounded p-3">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="+254">+254</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                </select>
                <input
                  type="tel"
                  placeholder="123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                />
              </div>
            )}

            {/* Airtel, Equity, Vooma & More */}
            <label className="flex items-center justify-between border rounded p-4 cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                </div>
                <span className="font-semibold text-gray-700">Airtel, Equity, Vooma & More</span>
              </div>
              <input
                type="radio"
                name="paymentMethod"
                value="airtel"
                checked={selectedPayment === "airtel"}
                onChange={() => setSelectedPayment("airtel")}
                className="form-radio"
              />
            </label>
          </div>

          {/* Checkout Now Button */}
          <button
            onClick={handleCheckoutNow}
            className="mt-6 w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition font-semibold"
          >
            CHECKOUT NOW &rarr;
          </button>
        </div>

        {/* Right Column - Order Summary */}
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
