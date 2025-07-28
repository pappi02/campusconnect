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
import  AuthContext  from "../contexts/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);

  const [productsData, setProductsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [reviewStars, setReviewStars] = useState([]);
  const [sortOptions, setSortOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState({});
  const [priceRange, setPriceRange] = useState([0, 50000]);
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
      selectedCatsArrays.some((cats) => cats.includes(product.category?.id || product.category));
    if (!categorySelected) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    if (selectedReviews.length > 0 && !selectedReviews.includes(Math.floor(product.rating || product.average_rating || 0))) return false;
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
    setPriceRange([0, 50000]);
    setSelectedReviews([]);
  };

  const removeFilter = (filter) => {
    // Handle both old string format and new object format
    const filterObj = typeof filter === 'object' ? filter : { display: String(filter), type: 'unknown', id: filter };
    
    if (filterObj.type === 'price' || filterObj.display.startsWith("Price:")) {
      setPriceRange([0, 50000]);
    } else if (filterObj.type === 'rating' || filterObj.display.endsWith("Star")) {
      const star = filterObj.type === 'rating' ? filterObj.id : Number(filterObj.display[0]);
      setSelectedReviews((prev) => prev.filter((s) => s !== star));
    } else {
      // Handle category filters
      const filterId = filterObj.id;
      setSelectedCategories((prev) => {
        const newCats = { ...prev };
        Object.keys(newCats).forEach((group) => {
          newCats[group] = newCats[group].filter((cat) => cat !== filterId);
        });
        return newCats;
      });
    }
  };

  useEffect(() => {
    const filters = [];
    
    // Add category filters with names instead of IDs
    Object.entries(selectedCategories).forEach(([, cats]) => {
      cats.forEach((catId) => {
        // Find category name from categoriesData
        const category = categoriesData.find(cat => cat.id === catId);
        if (category) {
          filters.push({
            id: catId,
            display: category.name,
            type: 'category'
          });
        } else {
          // Fallback for legacy string categories
          filters.push({
            id: catId,
            display: catId,
            type: 'category'
          });
        }
      });
    });
    
    if (priceRange[0] !== 0 || priceRange[1] !== 50000) {
      filters.push({
        id: 'price',
        display: `Price: Ksh ${priceRange[0].toLocaleString()} - Ksh ${priceRange[1].toLocaleString()}`,
        type: 'price'
      });
    }
    
    selectedReviews.forEach((star) => {
      filters.push({
        id: star,
        display: `${star} Star`,
        type: 'rating'
      });
    });
    
    setActiveFilters(filters);
  }, [selectedCategories, priceRange, selectedReviews, categoriesData]);

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
      <Navbar user={user} />
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="flex gap-6 mt-30">
           <FilterSidebar
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
      <Footer />
     </ErrorBoundary>
   );
 };

export default Home;
