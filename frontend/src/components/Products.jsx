import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [productCategories, setProductCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products/");
        if (response.ok) {
          const data = await response.json();
          // Group products by category
          const categoriesMap = {};
          data.forEach((product) => {
            if (!categoriesMap[product.category]) {
              categoriesMap[product.category] = [];
            }
            categoriesMap[product.category].push(product);
          });
          const categoriesArray = Object.keys(categoriesMap).map((category) => ({
            title: category,
            products: categoriesMap[category],
          }));
          setProductCategories(categoriesArray);
        } else {
          console.error("Failed to fetch products");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleViewAllProducts = (category) => {
    navigate(`/home?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="bg-white py-2">
      <div className="container">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold text-gray-800">Our Top Seller Products</h2>
          <button
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
            onClick={() => handleViewAllProducts('All')}
          >
            View All Products →
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {productCategories.map((category, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-72 bg-gray-100 rounded-2xl shadow p-1"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-1">
                {category.title}
              </h3>

              <div className="grid grid-cols-2 gap-2 mb-2">
                {category.products.map((product, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-30 h-20 bg-gray-200" />
                    <p className="text-sm font-medium text-gray-800 mt-1 leading-tight">{product.name}</p>
                    <p className="text-sm text-gray-600 -mt-3 leading-none">${product.price}</p>
                  </div>
                ))}
              </div>

              <button
                className="bg-blue-500 text-white w-full py-2 rounded-full hover:bg-blue-600 transition mb-2"
                onClick={() => handleViewAllProducts(category.title)}
              >
                View All Products →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
