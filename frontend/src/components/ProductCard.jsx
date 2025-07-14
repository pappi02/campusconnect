import React, { useContext } from "react";
import { Heart } from "lucide-react";
import { FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProductCard = ({ product }) => {
  const { token } = useContext(AuthContext);

  return (
    <Link to={`/product/${product.id}`} className="bg-white rounded-2xl shadow p-4 relative group block">
      {/* Discount badge */}
      <div className="absolute top-3 left-3 bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-1 rounded-full">
        {product.discount}% off
      </div>

      {/* Product image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-contain mb-2 rounded-2xl"
      />

      {/* Wishlist and cart icons */}
      <div className="absolute top-3 right-3 flex flex-col gap-3">
        <button className="text-black hover:text-yellow-400" aria-label="Add to wishlist">
          <Heart className="w-6 h-6" />
        </button>
        <button
          className="text-black hover:text-yellow-400"
          aria-label="Add to cart"
          onClick={async (e) => {
            e.preventDefault();
            try {
              console.debug(`Adding product ${product.id} to cart...`);
              const response = await fetch('http://localhost:8000/api/cart/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                },
                credentials: 'include', 
                body: JSON.stringify({ product_id: product.id, quantity: 1 }),
              });

              if (response.ok) {
                console.debug(`Product ${product.id} added to cart successfully.`);
                alert(`Added product ${product.name} to cart`);
              } else {
                console.error(`Failed to add product ${product.id} to cart. Status: ${response.status}`);
                alert('Failed to add product to cart');
              }
            } catch (error) {
              console.error('Error adding product to cart:', error);
              alert('Error adding product to cart');
            }
          }}
        >
          <FiShoppingCart className="w-6 h-6" />
        </button>
      </div>

      {/* Category and rating */}
      <div className="flex justify-between items-center mb-1">
        <p className="text-gray-400 font-semibold">
          {product.category ? product.category.name : ''}
        </p>
        <div className="flex items-center gap-1">
          <svg
            className="w-5 h-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.175 0l-3.39 2.462c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
          </svg>
          <span className="font-bold text-black">{product.rating}</span>
        </div>
      </div>

      {/* Product name */}
      <h3 className="font-bold text-black text-lg mb-1">{product.name}</h3>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="font-bold text-black text-base">
          Ksh {product.price ? product.price.toLocaleString() : 'N/A'} per kg
        </span>
        <span className="text-gray-400 line-through text-base">
          Ksh {product.originalPrice ? product.originalPrice.toLocaleString() : 'N/A'} per kg
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
