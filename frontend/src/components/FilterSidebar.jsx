
import React, { useState, useEffect, useCallback } from "react"; 
import Slider from "rc-slider";
import axios from "../api";

import "rc-slider/assets/index.css";

const FilterSidebar = ({
  selectedCategories,
  handleCategoryChange,
  priceRange,
  setPriceRange,
  reviewStars,
  selectedReviews,
  handleReviewChange,
}) => {
  const [categories, setCategories] = useState({ product: [], service: [] });
  const [loading, setLoading] = useState(true);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/categories/");
        const categoriesData = response.data;

        // Group categories by type
        const groupedCategories = {
          product: categoriesData.filter(cat => cat.category_type === 'product'),
          service: categoriesData.filter(cat => cat.category_type === 'service')
        };

        setCategories(groupedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Set empty categories on error
        setCategories({ product: [], service: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fix infinite loop by memoizing updatePriceRange with useCallback
  const updatePriceRange = useCallback((val) => {
    if (Array.isArray(val) && val.length === 2) {
      setPriceRange(val);
    }
  }, [setPriceRange]);

  return (
    <aside className="w-64 bg-white rounded-lg p-4 shadow-md h-[calc(100vh-96px)] overflow-y-auto sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Filter Options</h2>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading filters...</span>
        </div>
      ) : (
        <>
          {/* Product Categories */}
          <div className="mb-6 max-h-40 overflow-y-auto">
            <h3 className="font-bold mb-2">Product Categories</h3>
            <div className="flex flex-col gap-1">
              {categories.product.length > 0 ? (
                categories.product.map((category) => {
                  const groupCats = selectedCategories?.product || [];
                  return (
                    <label key={category.id} className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-gray-600"
                        checked={groupCats.includes(category.id)}
                        onChange={() => handleCategoryChange("product", category.id)}
                      />
                      <span className="ml-2 text-gray-700">{category.name}</span>
                    </label>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">No product categories available</p>
              )}
            </div>
          </div>

          {/* Service Categories */}
          <div className="mb-6 max-h-40 overflow-y-auto">
            <h3 className="font-bold mb-2">Service Categories</h3>
            <div className="flex flex-col gap-1">
              {categories.service.length > 0 ? (
                categories.service.map((category) => {
                  const groupCats = selectedCategories?.service || [];
                  return (
                    <label key={category.id} className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-gray-600"
                        checked={groupCats.includes(category.id)}
                        onChange={() => handleCategoryChange("service", category.id)}
                      />
                      <span className="ml-2 text-gray-700">{category.name}</span>
                    </label>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">No service categories available</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Price */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Price Range</h3>
        <div className="mb-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Min: Ksh {priceRange[0].toLocaleString()}</span>
            <span className="text-sm text-gray-600">Max: Ksh {priceRange[1].toLocaleString()}</span>
          </div>
          <div className="px-2">
            <Slider
              range
              min={0}
              max={50000}
              step={100}
              allowCross={false}
              value={priceRange}
              onChange={updatePriceRange}
              trackStyle={[{ backgroundColor: "#3b82f6", height: 6 }]}
              handleStyle={[
                { 
                  borderColor: "#3b82f6", 
                  backgroundColor: "#3b82f6",
                  width: 18,
                  height: 18,
                  marginTop: -6,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                },
                { 
                  borderColor: "#3b82f6", 
                  backgroundColor: "#3b82f6",
                  width: 18,
                  height: 18,
                  marginTop: -6,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                },
              ]}
              railStyle={{ backgroundColor: "#e5e7eb", height: 6 }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Ksh 0</span>
            <span>Ksh 50,000</span>
          </div>
        </div>
        
        {/* Manual Input Fields */}
        <div className="flex gap-2 mt-3">
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">Min Price</label>
            <input
              type="number"
              min="0"
              max="50000"
              step="100"
              value={priceRange[0]}
              onChange={(e) => {
                const newMin = Math.max(0, Math.min(parseInt(e.target.value) || 0, priceRange[1] - 100));
                updatePriceRange([newMin, priceRange[1]]);
              }}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-600 mb-1">Max Price</label>
            <input
              type="number"
              min="0"
              max="50000"
              step="100"
              value={priceRange[1]}
              onChange={(e) => {
                const newMax = Math.min(50000, Math.max(parseInt(e.target.value) || 50000, priceRange[0] + 100));
                updatePriceRange([priceRange[0], newMax]);
              }}
              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="50000"
            />
          </div>
        </div>
      </div>

      {/* Review */}
      <div className="mb-6 max-h-40 overflow-y-auto">
        <h3 className="font-bold mb-2">Rating</h3>
        <div className="flex flex-col gap-1">
      {(reviewStars || [5,4,3,2,1]).map((starObj) => {
        const star = typeof starObj === 'object' ? starObj.stars : starObj;
        return (
          <label key={star} className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-yellow-500"
              checked={selectedReviews.includes(star)}
              onChange={() => handleReviewChange(star)}
            />
            <div className="flex ml-2">
              {[...Array(star)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.54 1.118l-3.39-2.462a1 1 0 00-1.175 0l-3.39 2.462c-.784.57-1.838-.196-1.539-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-gray-700">{star} star</span>
          </label>
        );
      })}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
