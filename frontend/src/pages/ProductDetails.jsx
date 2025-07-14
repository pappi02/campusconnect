// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api";
import BreadcrumbNavigation from "../components/ProductDetails/BreadcrumbNavigation";
import ProductMainInfoSection from "../components/ProductDetails/ProductMainInfoSection";
import DescriptionTabsSection from "../components/ProductDetails/DescriptionTabsSection";
import PeopleAlsoViewedCarousel from "../components/ProductDetails/PeopleAlsoViewedCarousel";
import DeliveryReturnsSidebar from "../components/ProductDetails/DeliveryReturnsSidebar";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${id}/`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="text-center mt-10">Loading product...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <BreadcrumbNavigation />

      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <ProductMainInfoSection product={product} />
        </div>

        <div className="md:col-span-4">
          <DeliveryReturnsSidebar product={product} />
        </div>
      </div>

      <DescriptionTabsSection product={product} />

      <PeopleAlsoViewedCarousel products={product.related_products || []} />
    </div>
  );
};

export default ProductDetailPage;
