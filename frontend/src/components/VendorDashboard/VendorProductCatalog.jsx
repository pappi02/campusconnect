import React, { useState } from "react";

const VendorProductCatalog = ({ products }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  const toggleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId)
        : [...prevSelected, productId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p.id));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-green-600 font-semibold">
          {selectedProducts.length} selected products
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 px-4">
                <input
                  type="checkbox"
                  checked={selectedProducts.length === products.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="py-2 px-4 cursor-pointer">Product name</th>
              <th className="py-2 px-4 cursor-pointer">Brand</th>
              <th className="py-2 px-4 cursor-pointer">Ordered Items</th>
              <th className="py-2 px-4 cursor-pointer">Avg selling price</th>
              <th className="py-2 px-4 cursor-pointer">Catalog status</th>
              <th className="py-2 px-4 cursor-pointer">Stock status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className={`border-b border-gray-200 hover:bg-gray-50 ${
                  selectedProducts.includes(product.id) ? "bg-blue-50" : ""
                }`}
              >
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleSelectProduct(product.id)}
                  />
                </td>
                <td className="py-2 px-4 font-semibold">{product.name}</td>
                <td className="py-2 px-4">{product.brand}</td>
                <td className="py-2 px-4">{product.orderedItems}</td>
                <td className="py-2 px-4">{product.avgSellingPrice}</td>
                <td
                  className={`py-2 px-4 ${
                    product.catalogStatus === "Active"
                      ? "text-green-600"
                      : product.catalogStatus === "Deleted"
                      ? "text-gray-400"
                      : product.catalogStatus === "Inactive"
                      ? "text-gray-500"
                      : "text-yellow-600"
                  }`}
                >
                  {product.catalogStatus}
                </td>
                <td className="py-2 px-4">{product.stockStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorProductCatalog;
