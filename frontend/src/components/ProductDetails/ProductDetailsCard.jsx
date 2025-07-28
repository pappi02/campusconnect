// src/components/ProductDetails/ProductDetailsCard.jsx
import { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { Heart } from "lucide-react";
import axios from "../../api";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import  AuthContext  from "../../contexts/AuthContext";

const ProductDetailsCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
    useContext(AuthContext);

  const handleAddToCart = async () => {
    try {
      const response = await axios.post("/api/cart/", {
        product_id: product.id,
        quantity: quantity,
      });
      alert(`Added ${quantity} of ${product.name} to cart.`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-gray-400 text-sm"><p>{product.category.name}</p></div>
      <h1 className="font-bold text-xl">{product.name}</h1>
      <div className="text-yellow-600 flex items-center gap-1">
        <span className="font-semibold">{product.rating}</span>
        <span>({product.reviews_count} REVIEWS)</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-lg font-bold">Ksh {product.price} {product.unit}</span>
        <span className="text-gray-400 line-through">Ksh {product.discount_price}</span>
      </div>

      <p className="text-gray-500 text-sm">{product.description}</p>

      <div className="text-gray-500 text-sm">Sold by: {product.market}</div>

      {/* Quantity & Buttons */}
      <div className="flex items-center gap-3 mt-2">
        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2 py-1 border rounded">-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)} className="px-2 py-1 border rounded">+</button>
      </div>

      <div className="flex items-center gap-3 mt-4">
        <button onClick={handleAddToCart} className="bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
          <FiShoppingCart /> Add to Cart
        </button>
        <button onClick={() => navigate("/checkout")}className="bg-black text-white px-4 py-2 rounded-full">Buy Now</button>
        <button className="text-gray-600 hover:text-yellow-400">
          <Heart />
        </button>
      </div>

      <div className="text-sm text-gray-400">
        Tags: {product.tags ? (Array.isArray(product.tags) ? product.tags.join(", ") : product.tags.split(',').filter(tag => tag.trim()).map(tag => tag.trim()).join(", ")) : 'No tags'}
      </div>
    </div>
  );
};

export default ProductDetailsCard;
