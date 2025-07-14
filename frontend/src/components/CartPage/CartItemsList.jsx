import React from "react";
import CartItem from "./CartItem";

const CartItemsList = ({ cartItems, onRemoveItem, onQuantityChange }) => {
  if (cartItems.length === 0) {
    return <div className="p-4 text-center text-gray-500 text-sm">Your cart is empty.</div>;
  }

  return (
    <>
      {cartItems.map((item) => (
        <CartItem
          key={item.id} 
          item={item} 
          onRemove={onRemoveItem}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </>
  );
};

export default CartItemsList;
