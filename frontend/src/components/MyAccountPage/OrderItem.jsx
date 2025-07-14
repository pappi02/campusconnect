import React from "react";

const OrderItem = ({ order }) => {
  const { id, totalPayment, paymentMethod, deliveryDate, status, statusText, products, actions } = order;

  return (
    <div className="border rounded-lg overflow-hidden mb-6">
      <div className="bg-yellow-400 text-black px-6 py-3 grid grid-cols-4 text-sm font-semibold">
        <div>Order ID</div>
        <div>Total Payment</div>
        <div>Payment Method</div>
        <div>{status === "Delivered" ? "Delivered Date" : "Estimated Delivery D."}</div>
      </div>
      <div className="bg-yellow-400 text-black px-6 py-3 grid grid-cols-4 text-sm font-semibold">
        <div>{id}</div>
        <div>{totalPayment}</div>
        <div>{paymentMethod}</div>
        <div>{deliveryDate}</div>
      </div>
      <ul className="divide-y divide-gray-200">
        {products.map(({ imgSrc, alt, name, description }, index) => (
          <li key={index} className="flex items-center gap-4 px-6 py-3">
            <img src={imgSrc} alt={alt} className="w-12 h-12 object-cover" />
            <div>
              <p className="font-semibold">{name}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
        {(() => {
          const baseClass = "text-xs rounded-full px-3 py-1 ";
          const statusClass = status === "Accepted" ? "bg-yellow-100 text-yellow-600" : "bg-green-100 text-green-600";
          return (
            <span className={baseClass + statusClass}>
              {status}
            </span>
          );
        })()}
        <span className="text-sm">{statusText}</span>
        <div className="flex gap-3">
          {actions.map(({ label, onClick, className }, index) => (
            <button
              key={index}
              onClick={onClick}
              className={className}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
