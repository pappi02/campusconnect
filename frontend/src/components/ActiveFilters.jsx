// src/components/ActiveFilters.jsx
import React from "react";

const ActiveFilters = ({
  activeFilters,
  clearAllFilters,
  removeFilter,
}) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {activeFilters.map((filter, idx) => (
        <span
          key={idx}
          className="bg-yellow-400 text-white rounded-full px-3 py-1 text-sm flex items-center gap-1"
        >
          {filter}
          <button
            onClick={() => removeFilter(filter)}
            className="ml-1 focus:outline-none"
          >
            &times;
          </button>
        </span>
      ))}
      {activeFilters.length > 0 && (
        <button
          onClick={clearAllFilters}
          className="ml-4 text-yellow-600 underline"
        >
          Clear All
        </button>
      )}
    </div>
  );
};

export default ActiveFilters;
