import { useState, useEffect, useContext } from "react";
import axios from "../api";
import FilterSidebar from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import SortAndResults from "../components/SortAndResults";
import ActiveFilters from "../components/ActiveFilters";
import Pagination from "../components/Pagination";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { AuthContext } from "../contexts/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  const [productsData, setProductsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [reviewStars, setReviewStars] = useState([]);
  const [sortOptions, setSortOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState({});
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedReviews, setSelectedReviews] = useState([]);
  const [sortBy, setSortBy] = useState("Default Sorting");
  const [activeFilters, setActiveFilters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes, reviewStarsRes, sortOptionsRes] = await Promise.all([
          axios.get("/api/products/"),
          axios.get("/api/categories/"),
          axios.get("/api/review-stars/"),
          axios.get("/api/sort-options/"),
        ]);
        setProductsData(productsRes.data);
        setCategoriesData(categoriesRes.data);
        setReviewStars(reviewStarsRes.data);
        setSortOptions(sortOptionsRes.data);
        setError(null);
      } catch (err) {
        setError("Failed to load data.");
        setProductsData([]);
        setCategoriesData([]);
        setReviewStars([]);
        setSortOptions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = productsData.filter((product) => {
    const selectedCatsArrays = Object.values(selectedCategories);
    const categorySelected =
      selectedCatsArrays.length === 0 ||
      selectedCatsArrays.some((cats) => cats.includes(product.category));
    if (!categorySelected) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    if (selectedReviews.length > 0 && !selectedReviews.includes(Math.floor(product.rating))) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "Price: Low to High":
        return a.price - b.price;
      case "Price: High to Low":
        return b.price - a.price;
      case "Rating: High to Low":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleCategoryChange = (group, category) => {
    setSelectedCategories((prev) => {
      const groupCategories = prev[group] || [];
      if (groupCategories.includes(category)) {
        const newCats = groupCategories.filter((cat) => cat !== category);
        return { ...prev, [group]: newCats };
      } else {
        return { ...prev, [group]: [...groupCategories, category] };
      }
    });
  };

  const handleReviewChange = (star) => {
    setSelectedReviews((prev) => {
      if (prev.includes(star)) {
        return prev.filter((s) => s !== star);
      } else {
        return [...prev, star];
      }
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const clearAllFilters = () => {
    setSelectedCategories({});
    setPriceRange([0, 100000]);
    setSelectedReviews([]);
  };

  const removeFilter = (filter) => {
    if (filter.startsWith("Price:")) {
      setPriceRange([0, 100000]);
    } else if (filter.endsWith("Star")) {
      const star = Number(filter[0]);
      setSelectedReviews((prev) => prev.filter((s) => s !== star));
    } else {
      setSelectedCategories((prev) => {
        const newCats = { ...prev };
        Object.keys(newCats).forEach((group) => {
          newCats[group] = newCats[group].filter((cat) => cat !== filter);
        });
        return newCats;
      });
    }
  };

  useEffect(() => {
    const filters = [];
    Object.entries(selectedCategories).forEach(([, cats]) => {
      cats.forEach((cat) => filters.push(cat));
    });
    if (priceRange[0] !== 0 || priceRange[1] !== 10000) {
      filters.push(`Price: Ksh ${priceRange[0]} - Ksh ${priceRange[1]}`);
    }
    selectedReviews.forEach((star) => filters.push(`${star} Star`));
    setActiveFilters(filters);
  }, [selectedCategories, priceRange, selectedReviews]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 min-h-screen p-6">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<p>Something went wrong.</p>}>
      <Navbar/>
+     <Navbar user={user} />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="flex gap-6 mt-30">
-          
           <FilterSidebar
             categoriesData={categoriesData}
             selectedCategories={selectedCategories}
             handleCategoryChange={handleCategoryChange}
             priceRange={priceRange}
             setPriceRange={setPriceRange}
             reviewStars={reviewStars}
             selectedReviews={selectedReviews}
             handleReviewChange={handleReviewChange}
           />

           <main className="flex-1 ">
             <SortAndResults
               count={paginatedProducts.length}
               filteredCount={filteredProducts.length}
               sortBy={sortBy}
               handleSortChange={handleSortChange}
               sortOptions={sortOptions}
             />

             <ActiveFilters
               activeFilters={activeFilters}
               clearAllFilters={clearAllFilters}
               removeFilter={removeFilter}
             />

             <div className="grid grid-cols-4 gap-6">
               {paginatedProducts.map((product) => (
                 <ProductCard key={product.id} product={product} />
               ))}
             </div>

             <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={handlePageChange}
             />
           </main>
         </div>
       </div>
+      <Footer />
     </ErrorBoundary>
   );
 };

export default Home;
