// src/components/ProductDetails/DescriptionTabsSection.jsx
import React, { useState } from "react";

const tabs = ["Description", "Additional Information", "Review"];

const DescriptionTabsSection = ({ product }) => {
  const [active, setActive] = useState("Description");

  return (
    <div className="mt-10">
      <div className="flex gap-6 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`pb-2 text-sm font-medium border-b-2 ${
              active === tab ? "border-black text-black" : "border-transparent text-gray-400"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="text-sm text-gray-600 leading-6">
        {active === "Description" && (
          <p>{product.description_long || "No additional description available."}</p>
        )}
        {active === "Additional Information" && (
          <ul className="list-disc pl-6">
            <li>Storage info, shelf life, etc.</li>
            <li>Weight, ingredients, etc.</li>
          </ul>
        )}
        {active === "Review" && (
          <div>
            <p>{product.reviews_count || 0} reviews</p>
            <p className="text-yellow-500">⭐⭐⭐☆☆</p>
            <p>Sample review placeholder...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DescriptionTabsSection;
