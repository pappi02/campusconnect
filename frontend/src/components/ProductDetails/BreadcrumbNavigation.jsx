// src/components/ProductDetails/BreadcrumbNavigation.jsx
import React from "react";
import { Link } from "react-router-dom";

const BreadcrumbNavigation = () => {
  return (
    <div className="text-sm text-gray-500 mb-4">
      <Link to="/" className="hover:underline text-gray-600">Home</Link>
      <span className="mx-2">/</span>
      <span>Products</span>
    </div>
  );
};

export default BreadcrumbNavigation;
