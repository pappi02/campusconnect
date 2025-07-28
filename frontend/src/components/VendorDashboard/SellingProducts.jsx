import React from "react";

const SellingProducts = ({ products }) => {
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow w-full lg:w-2/3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Selling Products</h2>
        <div className="flex items-center space-x-2 text-gray-600 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10h18M3 16h18M3 22h18"
            />
          </svg>
          <span>8 Jan - 2 Feb</span>
        </div>
      </div>

      {safeProducts.length > 0 ? (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4">Product Name</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Sold</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {safeProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-4 flex items-center space-x-3">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded" />
                  )}
                  <span>{product.name}</span>
                </td>
                <td className="py-2 px-4">${product.price}</td>
                <td className="py-2 px-4">{product.sold} pcs</td>
                <td className="py-2 px-4 flex items-center space-x-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      product.status === "In Stock" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span>{product.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-sm text-gray-500 mt-4">No products available.</div>
      )}
    </div>
  );
};

export default SellingProducts;
