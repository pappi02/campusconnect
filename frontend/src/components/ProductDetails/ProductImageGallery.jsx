// src/components/ProductDetails/ProductImageGallery.jsx
import React from "react";

const ProductImageGallery = ({ images }) => {
  return (
    <div>
      <img src={images[0]} alt="Main" className="rounded-xl w-full h-60 object-contain border border-gray-200" />
      <div className="flex gap-2 mt-2">
        {images.slice(1).map((img, i) => (
          <img key={i} src={img} alt="thumb" className="w-16 h-16 border rounded-md object-cover" />
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
