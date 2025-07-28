import React from "react";

const TopTowns = ({ towns }) => {
  // Safely ensure `towns` is an array
  if (!Array.isArray(towns)) {
    return (
      <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/3">
        <h2 className="text-lg font-semibold mb-4">Top Towns</h2>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full lg:w-1/3">
      <h2 className="text-lg font-semibold mb-4">Top Towns</h2>
      <ol className="list-decimal list-inside space-y-2 font-semibold">
        {towns.map((town, index) => (
          <li key={index} className="flex justify-between">
            <span>{town.name}</span>
            <span>{town.percentage}%</span>
          </li>
        ))}
      </ol>
      <button className="mt-4 w-full border border-gray-300 rounded py-2 text-sm font-semibold hover:bg-gray-100">
        Load More
      </button>
    </div>
  );
};

export default TopTowns;
