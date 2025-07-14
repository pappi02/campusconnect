// src/components/ProductDetails/DeliveryReturnsSidebar.jsx
import React from "react";

const DeliveryReturnsSidebar = ({ product }) => {
  return (
    <div className="space-y-4 text-sm border p-4 rounded-xl">
      <div>
        <h3 className="font-semibold text-lg">DELIVERY & RETURNS</h3>
        <label className="block mt-2 mb-1">Choose your location</label>
        <select className="w-full border rounded px-2 py-1 mb-2">
          <option>Kibabii</option>
          <option>University Gate</option>
        </select>
      </div>

      <div className="space-y-2">
        <div className="border-t pt-2">
          <strong>Pick up Station</strong><br />
          <span>Delivery Fees Ksh 120</span><br />
          <span className="text-xs text-gray-500">Ready for pickup within 30 mins</span>
        </div>

        <div className="border-t pt-2">
          <strong>Return Policy</strong><br />
          <span className="text-xs text-gray-500">Easy return. Quick refund</span>
        </div>
      </div>

      <div className="border-t pt-2">
        <h3 className="font-semibold text-lg">SELLER INFORMATION</h3>
        <p>{product.seller_name || "Legacy Tech Shop"}</p>
        <p className="text-xs text-gray-500">92% Seller Score</p>
        <p className="text-xs text-gray-500">25 Followers</p>
        <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm">Follow</button>
      </div>
    </div>
  );
};

export default DeliveryReturnsSidebar;
