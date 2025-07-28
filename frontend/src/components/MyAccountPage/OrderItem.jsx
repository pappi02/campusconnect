import React from "react";
import { useNavigate, Link } from "react-router-dom";

const OrderItem = ({ order }) => {
  const navigate = useNavigate();

  if (!order) return null; // Handle undefined order

  const {
    id,
    total_price,
    paymentMethod,
    deliveryDate,
    status,
    statusText,
    products = [],
    actions = [],
  } = order;

  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      {/* Header Row */}
      <div className="bg-yellow-400 text-black px-2 py-1 grid grid-cols-4 text-sm font-semibold">
        <div>Order ID</div>
        <div>Total Payment</div>
        <div>Payment Method</div>
        <div>{status === "Delivered" ? "Delivered Date" : "Estimated Delivery D."}</div>
      </div>

      {/* Order Summary Row */}
      <div className="bg-yellow-400 text-black px-2 py-1 grid grid-cols-4 text-sm font-semibold">
        <div>{id}</div>
        <div>{total_price}</div>
        <div>{paymentMethod}</div>
        <div>{deliveryDate}</div>
      </div>

      {/* Product List */}
      <ul className="divide-y divide-gray-200">
        {products.length > 0 ? (
          products.map(({ imgSrc, alt, name, description, productId }, index) => (
            <li key={index} className="flex items-center gap-4 px-6 py-3 cursor-pointer">
              <Link to={`/product/${productId}`} className="flex items-center gap-4">
                <img src={imgSrc} alt={alt} className="w-12 h-12 object-cover" />
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <li className="px-6 py-3 text-gray-500 text-sm">No products in this order.</li>
        )}
      </ul>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
        {/* Order Status */}
        {(() => {
          const baseClass = "text-xs rounded-full px-3 py-1 ";
          const statusClass =
            status === "Accepted"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-green-100 text-green-600";
          return <span className={baseClass + statusClass}>{status}</span>;
        })()}

        {/* Status Text */}
        <span className="text-sm">{statusText}</span>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {actions.length > 0 ? (
            actions.map(({ label, onClick, className }, index) => (
              <button key={index} onClick={onClick} className={className}>
                {label}
              </button>
            ))
          ) : (
            <button
              className="text-xs bg-green-100 p-1 rounded-full text-blue-600 hover:text-blue-800"
              onClick={() => navigate(`/order-success/${id}`)}
            >
              Order Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
