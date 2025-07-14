import React from "react";

const SortAndResults = ({ count, filteredCount, sortBy, handleSortChange, sortOptions }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-sm text-gray-600">
        Showing {count} of {filteredCount} results
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm text-gray-700">
          Sort by:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={handleSortChange}
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.value}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortAndResults;
