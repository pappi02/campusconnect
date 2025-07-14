// src/components/ProductDetails/ProductMainInfoSection.jsx
import React from "react";
import ProductImageGallery from "./ProductImageGallery";
import ProductDetailsCard from "./ProductDetailsCard";

const ProductMainInfoSection = ({ product }) => {
  // Map detail_images to array of image URLs
  const images = product.detail_images && product.detail_images.length > 0
    ? product.detail_images.map((imgObj) => imgObj.image)
    : product.image
      ? [product.image]
      : [];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <ProductImageGallery images={images} />
      <ProductDetailsCard product={product} />
    </div>
  );
};

export default ProductMainInfoSection;
