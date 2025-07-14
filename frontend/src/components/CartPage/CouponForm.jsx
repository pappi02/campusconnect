import React, { useState } from "react";

const CouponForm = ({ onApplyCoupon }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Please enter a coupon code.");
      return;
    }

    onApplyCoupon(code.trim());
    setCode("");
  };

  return (
    <form onSubmit={handleSubmit} className="flexmb-4 p-4 border rounded bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Apply Coupon Code</h3>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <div className="mb-2">
        <label className="block mb-1 font-medium">Coupon Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-60 p-2 border rounded"
          placeholder="Enter coupon code"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Apply Coupon
      </button>
    </form>
  );
};

export default CouponForm;
