// Central export for all Kibabii mock data
export { kibabiiLocations } from './kibabiiLocations.js';
export { kibabiiMockOrders, kibabiiDeliveryPersonnel } from './kibabiiMockOrders.js';
export { kibabiiProducts, productsByVendor, productsByCategory } from './kibabiiProducts.js';

// Helper function to get all Kibabii data
export const getKibabiiData = () => ({
  locations: kibabiiLocations,
  orders: kibabiiMockOrders,
  deliveryPersonnel: kibabiiDeliveryPersonnel,
  products: kibabiiProducts,
  productsByVendor,
  productsByCategory
});

// Helper function to filter products by price range
export const filterProductsByPrice = (minPrice, maxPrice) => {
  return kibabiiProducts.filter(product => 
    product.price >= minPrice && product.price <= maxPrice
  );
};

// Helper function to get products by rating
export const getTopRatedProducts = (minRating = 4.0) => {
  return kibabiiProducts.filter(product => product.rating >= minRating);
};

// Helper function to get orders by status
export const getOrdersByStatus = (status) => {
  return kibabiiMockOrders.filter(order => order.status === status);
};

// Helper function to get delivery points near a location
export const getNearbyDeliveryPoints = (userLocation, maxDistanceKm = 5) => {
  // Simple distance calculation (Haversine formula would be more accurate)
  return kibabiiLocations.deliveryPoints.filter(point => {
    const distance = Math.sqrt(
      Math.pow(point.coordinates[0] - userLocation[0], 2) + 
      Math.pow(point.coordinates[1] - userLocation[1], 2)
    ) * 111; // Convert degrees to km approximation
    return distance <= maxDistanceKm;
  });
};

// Default export for convenience
export default {
  locations: kibabiiLocations,
  orders: kibabiiMockOrders,
  deliveryPersonnel: kibabiiDeliveryPersonnel,
  products: kibabiiProducts,
  productsByVendor,
  productsByCategory,
  getKibabiiData,
  filterProductsByPrice,
  getTopRatedProducts,
  getOrdersByStatus,
  getNearbyDeliveryPoints
};
