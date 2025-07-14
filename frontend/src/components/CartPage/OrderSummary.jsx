import React from "react";

const OrderSummary = ({ itemsCount, subTotal, shippingCost, couponDiscount, total, onProceedToCheckout }) => {
  return (
    <div className="w-full max-w-xs border border-gray-300 rounded p-4 h-fit mx-auto sm:mx-0">
      <h3 className="font-semibold mb-4 text-sm sm:text-base">Order Summary</h3>
      <div className="flex justify-between mb-2 text-xs sm:text-sm">
        <span>Items</span>
        <span>{itemsCount}</span>
      </div>
      <div className="flex justify-between mb-2 text-xs sm:text-sm">
        <span>Sub Total</span>
        <span>Ksh {subTotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between mb-2 text-xs sm:text-sm">
        <span>Shipping</span>
        <span>Ksh {shippingCost.toLocaleString()}</span>
      </div>
      <div className="flex justify-between mb-4 text-xs sm:text-sm">
        <span>Coupon Discount</span>
        <span className="text-red-600">-Ksh {couponDiscount.toLocaleString()}</span>
      </div>
      <div className="flex justify-between font-semibold text-lg mb-4">
        <span>Total</span>
        <span>Ksh {total.toLocaleString()}</span>
      </div>
      <button
        onClick={onProceedToCheckout}
        className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition text-sm sm:text-base"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default OrderSummary;
