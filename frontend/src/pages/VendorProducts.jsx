import React, { useEffect, useState, useContext } from "react";
import VendorProductCatalog from "../components/VendorDashboard/VendorProductCatalog";
import AuthContext from "../contexts/AuthContext";
import axios from "../api";
import { toast } from "react-toastify";

const VendorProducts = () => {
  const { user, token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user || !token) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products/");
        const data = response.data;

        // Transform data to match VendorProductCatalog props
        const transformedProducts = data.map((product) => ({
          id: product.id,
          name: product.name,
          brand: product.brand || "Brand X",
          orderedItems: product.ordered_items || 0,
          avgSellingPrice: product.avg_selling_price || 0,
          catalogStatus: product.catalog_status || "Active",
          stockStatus: product.stock_status || "In stock",
        }));

        setProducts(transformedProducts);
      } catch (error) {
        console.error("Failed to fetch vendor products", error);
        if (error.response && error.response.status === 401) {
          toast.error("Vendor account not found");
        }
      }
    };

    fetchProducts();
  }, [user, token]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">Product catalog</h1>
      <VendorProductCatalog products={products} />
    </main>
  );
};

export default VendorProducts;
