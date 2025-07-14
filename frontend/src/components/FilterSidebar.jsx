
import React, { useState, useEffect, useCallback } from "react"; 
import Slider from "rc-slider";


import "rc-slider/assets/index.css";
import api from "../api";

const FilterSidebar = () => {
  const [selectedCategories, setSelectedCategories] = useState({});
  const [categories, setCategories] = useState({ product: [], service: [] });

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedReviews, setSelectedReviews] = useState([5]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories/");
        const data = response.data;
        const grouped = data.reduce(
          (acc, cat) => {
            if (cat.category_type === "product") {
              acc.product.push(cat.name);
            } else if (cat.category_type === "service") {
              acc.service.push(cat.name);
            }
            return acc;
          },
          { product: [], service: [] }
        );
        setCategories(grouped);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories({ product: [], service: [] });
      }
    };
    fetchCategories();
  }, []);

  // Fix infinite loop by memoizing updatePriceRange with useCallback
  const updatePriceRange = useCallback((val) => {
    if (Array.isArray(val) && val.length === 2) {
      setPriceRange(val);
    }
  }, []);

  const handleCategoryChange = (group, category) => {
    setSelectedCategories((prev) => {
      const groupCategories = prev?.[group] || [];
      if (groupCategories.includes(category)) {
        return {
          ...prev,
          [group]: groupCategories.filter((cat) => cat !== category),
        };
      } else {
        return {
          ...prev,
          [group]: [...groupCategories, category],
        };
      }
    });
  };

  const handleReviewChange = (star) => {
    setSelectedReviews((prev) =>
      prev.includes(star) ? prev.filter((s) => s !== star) : [...prev, star]
    );
  };

  return (
    <aside className="w-64 bg-white rounded-lg p-4 shadow-md h-[calc(100vh-96px)] overflow-y-auto sticky top-24">
      <h2 className="text-lg font-semibold mb-4">Filter Options</h2>

      {/* Product Categories */}
      <div className="mb-6 max-h-40 overflow-y-auto">
        <h3 className="font-bold mb-2">Product Categories</h3>
        <div className="flex flex-col gap-1">
          {categories.product.map((cat) => {
            const groupCats = selectedCategories?.product || [];
            return (
              <label key={cat} className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-gray-600"
                  checked={groupCats.includes(cat)}
                  onChange={() => handleCategoryChange("product", cat)}
                />
                <span className="ml-2 text-gray-700">{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Service Categories */}
      <div className="mb-6 max-h-40 overflow-y-auto">
        <h3 className="font-bold mb-2">Service Categories</h3>
        <div className="flex flex-col gap-1">
          {categories.service.map((cat) => {
            const groupCats = selectedCategories?.service || [];
            return (
              <label key={cat} className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-gray-600"
                  checked={groupCats.includes(cat)}
                  onChange={() => handleCategoryChange("service", cat)}
                />
                <span className="ml-2 text-gray-700">{cat}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Price</h3>
        <div className="mb-2 text-gray-700">Ksh {priceRange[0]} - {priceRange[1]}</div>
        <Slider
          min={0}
          max={10000}
          step={1}
          allowCross={false}
          value={priceRange}
          onChange={updatePriceRange}
          trackStyle={[{ backgroundColor: "#facc15" }]}
          handleStyle={[
            { borderColor: "#facc15" },
            { borderColor: "#facc15" },
          ]}
          railStyle={{ backgroundColor: "#d1d5db" }}
        />
      </div>

      {/* Review */}
      <div className="mb-6 max-h-40 overflow-y-auto">
        <h3 className="font-bold mb-2">Rating</h3>
        <div className="flex flex-col gap-1">
          {[5,4,3,2,1].map((star) => (
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
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
