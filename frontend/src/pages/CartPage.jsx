import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api";  // changed from "axios" to import axios instance
import { toast } from "react-toastify";
import CartItemsList from "../components/CartPage/CartItemsList";
import CouponForm from "../components/CartPage/CouponForm";
import OrderSummary from "../components/CartPage/OrderSummary";
import  AuthContext  from "../contexts/AuthContext";

axios.defaults.withCredentials = true;

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponAmount, setCouponAmount] = useState(0);
  const shippingCost = 31;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

useEffect(() => {
  const fetchCart = async () => {
    try {
      console.debug("Fetching cart from API...");

      const token = localStorage.getItem('authToken');

      const response = await axios.get("/api/cart/", {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        withCredentials: true,
      });

      console.debug("Cart API response:", response.data);

      const rawItems =
        response.data?.cart?.items ||
        response.data?.cart?.cart?.items ||
        [];

      console.log("Raw cart items:", rawItems);

      const items = Array.isArray(rawItems)
        ? rawItems.map(({ product, quantity }) => ({
            id: product?.id ?? Math.random(),
            name: product?.name ?? "Unnamed Product",
            category: product?.category?.name ?? "Uncategorized",
            price: !isNaN(product?.price) ? parseFloat(product.price) : 0,
            quantity: quantity ?? 1,
            image:
              product?.image_url ||
              product?.image ||
              `https://via.placeholder.com/60x60?text=${encodeURIComponent(
                product?.name ?? "Product"
              )}`,
          }))
        : [];

      console.debug("Parsed cart items:", items);
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    }
  };

  fetchCart();
}, []);

  const handleRemoveItem = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      // Remove item by sending DELETE request with product_id
      await axios.delete("/api/cart/", { 
        data: { product_id: id }
      });
      // Refetch cart after removal
      const response = await axios.get("/api/cart/");
      const cartData = response.data.cart?.items || [];
      const items = Array.isArray(cartData)
        ? cartData.map(({ product, quantity }) => ({
            id: product.id,
            name: product.name,
            category: product.category?.name || "Uncategorized",
            price: parseFloat(product.price),
            quantity,
            image: product.image_url || product.image || "https://via.placeholder.com/60x60?text=Product",
          }))
        : [];
      setCartItems(items);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleQuantityChange = async (id, delta) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;
    const newQuantity = Math.max(1, item.quantity + delta);
    try {
      const token = localStorage.getItem('authToken');
      // Update quantity by removing item and re-adding with new quantity
      await axios.delete("/api/cart/", { 
        data: { product_id: id }
      });
      await axios.post("/api/cart/", 
        { product_id: id, quantity: newQuantity }
      );
      // Refetch cart after update
      const response = await axios.get("/api/cart/");
      const cartData = response.data.cart?.items || [];
      const items = Array.isArray(cartData)
        ? cartData.map(({ product, quantity }) => ({
            id: product.id,
            name: product.name,
            category: product.category?.name || "Uncategorized",
            price: parseFloat(product.price),
            quantity,
            image: product.image || "https://via.placeholder.com/60x60?text=Product",
          }))
        : [];
      setCartItems(items);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleApplyCoupon = () => {
    toast.success(`Coupon "${couponCode}" applied!`, { autoClose: 3000 });
  };

  const applyCoupon = async (couponData) => {
    // Removed as coupon creation is handled in backend admin panel
  };

  const handleApplyCouponCode = async () => {
    try {
      if (!couponCode) {
        toast.error("Please enter a coupon code.");
        return;
      }
      const response = await axios.post("api/coupon/apply/", { code: couponCode });
      const discount = response.data.discount;
      if (discount.amount) {
        setCouponAmount(discount.amount);
        setCouponDiscount(0);
      } else if (discount.discount_percent) {
        setCouponDiscount(discount.discount_percent);
        setCouponAmount(0);
      }
      toast.success("Coupon applied successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to apply coupon.");
    }
  };

  const handleClearCart = async () => {
    try {
      // Clear all items by deleting each one
      for (const item of cartItems) {
        await axios.delete("/api/cart/", { data: { product_id: item.id } });
      }
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const calculateTotal = () => {
    const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let discountAmount = 0;
    if (couponAmount) {
      discountAmount = couponAmount;
    } else if (couponDiscount) {
      discountAmount = (couponDiscount / 100) * subTotal;
    }
    const total = subTotal - discountAmount;
    return { subTotal, discountAmount, total };
  };

  const { subTotal, discountAmount, total } = calculateTotal();

  const handleProceedToCheckout = () => {
    if (user) {
      navigate("/checkout", { state: { cartItems, couponCode, discountAmount } });
    } else {
      navigate("/login", { state: { from: "/checkout" } });
    }
  };

  const itemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-4">
        <a href="/" className="hover:underline">Home</a> {'>'} <span className="text-blue-600 font-semibold">Shopping Cart</span>
      </nav>

      <div className="flex flex-col gap-4">
        {/* Cart Items */}
        <div>
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-2 bg-yellow-400 text-black font-semibold rounded-t-md p-2 text-xs sm:text-sm">
            <div className="col-span-5">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          <CartItemsList
            cartItems={cartItems}
            onRemoveItem={handleRemoveItem}
            onQuantityChange={handleQuantityChange}
          />

          <CouponForm
            couponCode={couponCode}
            onCouponCodeChange={(e) => setCouponCode(e.target.value)}
            onApplyCoupon={handleApplyCoupon}
          />

          <button
            onClick={handleClearCart}
            className="text-sm text-gray-600 underline hover:text-gray-800 mt-2"
          >
            Clear Shopping Cart
          </button>
        </div>

        {/* Order Summary */}
        <OrderSummary
          itemsCount={itemsCount}
          subTotal={subTotal}
          shippingCost={0}
          couponDiscount={couponDiscount}
          total={total}
          onProceedToCheckout={handleProceedToCheckout}
        />
      </div>
    </div>
  );
};

export default CartPage;
