import React from "react";

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-center border-b border-gray-300 py-2 text-xs sm:text-sm">
      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="col-span-1 text-gray-500 hover:text-red-600"
        aria-label="Remove item"
      >
        &#x2715;
      </button>

      {/* Product Image and Info */}
      <div className="col-span-4 flex items-center space-x-2 sm:space-x-4">
        <img src={item.image} alt={item.name} className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded" />
        <div>
          <div className="font-semibold">{item.name}</div>
          <div className="text-xs text-gray-500">{item.category}</div>
        </div>
      </div>

      {/* Price */}
      <div className="col-span-2 text-center font-semibold">${item.price.toFixed(2)}</div>

      {/* Quantity Controls */}
      <div className="col-span-3 flex items-center justify-center space-x-1 sm:space-x-2">
        <button
          onClick={() => onQuantityChange(item.id, -1)}
          className="border border-gray-300 rounded px-1 py-0.5 sm:px-2 sm:py-1 hover:bg-gray-200"
          aria-label="Decrease quantity"
        >
          &minus;
        </button>
        <span className="w-6 text-center text-xs sm:text-base">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.id, 1)}
          className="border border-gray-300 rounded px-1 py-0.5 sm:px-2 sm:py-1 hover:bg-gray-200"
          aria-label="Increase quantity"
        >
          &#43;
        </button>
      </div>

      {/* Subtotal */}
      <div className="col-span-2 text-right font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  );
};

export default CartItem;
