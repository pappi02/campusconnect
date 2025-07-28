import React, { useState, useEffect, useContext } from "react";
import { Component } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api";
import AuthContext from "../contexts/AuthContext";
import AddressManager from "../components/MyAccountPage/AddressManager";
import Map from "../components/map.jsx";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo?.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, token, loading: authLoading } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [deliveryCoords, setDeliveryCoords] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [authError, setAuthError] = useState(null);

  const [additionalInfo, setAdditionalInfo] = useState("");
  const [scheduleType, setScheduleType] = useState("once");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [showItems, setShowItems] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (!authLoading && !token) {
      setAuthError("Please log in to continue with checkout");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
      return;
    }

    if (token && !cartItems.length && !addresses.length) {
      fetchCart();
      fetchAddresses();
    }
  }, [token, authLoading, navigate, cartItems.length, addresses.length]);

  const fetchCart = async () => {
    try {
      console.debug("Fetching cart data for checkout page...");
      const response = await axios.get("/api/cart/");
      console.debug("Cart API response:", response.data);
      setCartId(response.data?.cart?.id);
      const rawItems = response.data?.cart?.items || [];

      console.debug("Raw cart items:", rawItems);
      const items = Array.isArray(rawItems)
        ? rawItems.map(({ product, quantity }) => {
            console.debug("Processing product:", product);
            return {
              id: product?.id ?? Math.random(),
              name: product?.name ?? "Unnamed Product",
              category: product?.category?.name ?? "Uncategorized",
              price: !isNaN(product?.price) ? parseFloat(product.price) : 0,
              quantity: quantity ?? 1,
              image:
                product?.image_url ||
                product?.image ||
                `https://via.placeholder.com/60x60?text=${encodeURIComponent(
                  product?.name ?? "Product"
                )}`,
            };
          })
        : [];
      console.debug("Parsed cart items:", items);
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      if (error.response?.status === 401) {
        setAuthError("Authentication session expired. Please log in again.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
      setCartItems([]);
    }
  };

  const fetchAddresses = async () => {
    try {
      console.debug("Fetching user addresses...");
      const response = await axios.get("/api/addresses/");
      console.debug("Addresses API response:", response.data);
      const fetchedAddresses = response.data || [];
      setAddresses(fetchedAddresses);
      if (fetchedAddresses.length > 0) {
        const addr = fetchedAddresses[0];
        const formattedAddress = `${addr.street_address}, ${addr.city}, ${addr.state}, ${addr.zip_code}, ${addr.country}`;
        setDeliveryAddress(formattedAddress);
      } else {
        setDeliveryAddress("No address found");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      if (error.response?.status === 401) {
        setAuthError("Authentication session expired. Please log in again.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
      setDeliveryAddress("No address found");
    }
  };

  const handleLocationSelect = async (latlng) => {
    try {
      setDeliveryCoords(latlng);
      
      if (!cartId) {
        console.error("Cart ID not found. Cannot calculate delivery fee.");
        setAuthError("Could not calculate delivery fee. Please try refreshing the page.");
        return;
      }
      const response = await axios.post(
        "/api/delivery/calculate-fee/",
        {
          lat: latlng.lat,
          lng: latlng.lng,
          cart_id: cartId,
        }
      );

      setDeliveryFee(response.data.delivery_fee);
    } catch (error) {
      console.error("Error calculating delivery fee:", error);
      if (error.response?.status === 401) {
        setAuthError("Authentication session expired. Please log in again.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
      setDeliveryFee(30); // Fallback fee
    }
  };

  const handleScheduleDelivery = async () => {
    try {
      const orderId = 1; // TODO: Replace with actual order id after order creation
      const payload = {
        delivery: orderId,
        schedule_type: scheduleType,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        additional_info: additionalInfo,
      };

      const response = await axios.post("/api/delivery/schedule/", payload);
      alert("Delivery scheduled successfully.");
    } catch (error) {
      console.error("Error scheduling delivery:", error);
      if (error.response?.status === 401) {
        setAuthError("Authentication session expired. Please log in again.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      } else {
        alert("Failed to schedule delivery.");
      }
    }
  };

  const handleEditSchedule = async () => {
    try {
      alert("Edit schedule functionality to be implemented.");
    } catch (error) {
      console.error("Error editing schedule:", error);
      alert("Failed to edit schedule.");
    }
  };

  const toSnakeCase = (str) =>
    str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

  const transformKeysToSnakeCase = (obj) => {
    const newObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        newObj[toSnakeCase(key)] = obj[key];
      }
    }
    return newObj;
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const payload = transformKeysToSnakeCase(newAddress);
      const response = await axios.post("/api/addresses/", payload);
      setAddresses((prev) => [...prev, response.data]);
      setShowAddressForm(false);
      const addr = response.data;
      const formattedAddress = `${addr.street_address}, ${addr.city}, ${addr.state}, ${addr.zip_code}, ${addr.country}`;
      setDeliveryAddress(formattedAddress);
      setNewAddress({
        firstName: "",
        lastName: "",
        companyName: "",
        country: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        phone: "",
        email: "",
      });
    } catch (error) {
      console.error("Error adding address:", error);
      if (error.response?.status === 401) {
        setAuthError("Authentication session expired. Please log in again.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    }
  };

  const onEditAddress = async (id, updatedAddress) => {
    try {
      const payload = transformKeysToSnakeCase(updatedAddress);
      const response = await axios.put(`/api/addresses/${id}/`, payload);
      setAddresses((prev) =>
        prev.map((addr) => (addr.id === id ? response.data : addr))
      );
      const addr = response.data;
      const formattedAddress = `${addr.street_address}, ${addr.city}, ${addr.state}, ${addr.zip_code}, ${addr.country}`;
      setDeliveryAddress(formattedAddress);
    } catch (error) {
      console.error("Error editing address:", error);
      if (error.response?.status === 401) {
        setAuthError("Authentication session expired. Please log in again.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    }
  };

  const onDeleteAddress = async (id) => {
    try {
      await axios.delete(`/api/addresses/${id}/`);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      if (addresses.length > 1) {
        const addr = addresses.find((addr) => addr.id !== id);
        const formattedAddress = `${addr.street_address}, ${addr.city}, ${addr.state}, ${addr.zip_code}, ${addr.country}`;
        setDeliveryAddress(formattedAddress);
      } else {
        setDeliveryAddress("No address found");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      if (error.response?.status === 401) {
        setAuthError("Authentication session expired. Please log in again.");
        setTimeout(() => navigate("/login", { replace: true }), 2000);
      }
    }
  };

  // Calculate order summary
  const orderSummary = {
    items: cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0),
    subTotal: cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0),
    shipping: deliveryFee || 0,
    couponDiscount: 30,
  };

  orderSummary.total = (orderSummary.subTotal || 0) + (orderSummary.shipping || 0) - (orderSummary.couponDiscount || 0);

  const handleProceedToPayment = () => {
    if (!token) {
      setAuthError("Authentication session expired. Please log in again.");
      setTimeout(() => navigate("/login", { replace: true }), 2000);
      return;
    }
    navigate("/payment-method", { state: { cartItems, scheduleType, scheduledDate, scheduledTime, additionalInfo, deliveryFee } });

  };

  const handleChangeAddressClick = () => {
    setShowAddressForm(!showAddressForm);
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {authError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {authError}
        </div>
      )}

      <nav className="text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:underline">Home</Link> {'>'} <Link to="/cart" className="hover:underline">Shopping Cart</Link> {'>'} <span>Checkout</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-1 space-y-6">
          {/* Delivery Method */}
          <div className="border rounded p-4">
            <div className="flex space-x-4 mb-4">
              <button
                className={`flex-1 p-4 border rounded ${deliveryMethod === "delivery" ? "bg-yellow-400" : "bg-white"}`}
                onClick={() => setDeliveryMethod("delivery")}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
                  <span>Delivery</span>
                </div>
                <div className="text-xs text-gray-600">Ready within 2hrs</div>
              </button>
              <button
                className={`flex-1 p-4 border rounded ${deliveryMethod === "store" ? "bg-gray-200" : "bg-white"}`}
                onClick={() => setDeliveryMethod("store")}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
                  <span>Pick at a store</span>
                </div>
                <div className="text-xs text-gray-600">Within an hour</div>
              </button>
            </div>

            {/* Delivery Address */}
            {deliveryMethod === "delivery" && (
              <div className="bg-yellow-400 p-4 rounded mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18"/></svg>
                  <span className="font-semibold">Delivery Location</span>
                </div>
                <p className="text-sm mb-2">Select your delivery location on the map or choose from saved addresses.</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowMapModal(true)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>Choose from Map</span>
                  </button>
                  
                  {deliveryCoords && deliveryCoords.lat != null && deliveryCoords.lng != null && (
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Selected Location:</p>
                      <p className="text-xs text-gray-600">
                        Lat: {(typeof deliveryCoords.lat === 'number' ? deliveryCoords.lat : 0).toFixed(4)}, 
                        Lng: {(typeof deliveryCoords.lng === 'number' ? deliveryCoords.lng : 0).toFixed(4)}
                      </p>
                    </div>
                  )}
                </div>
                
                <button onClick={handleChangeAddressClick} className="mt-3 px-4 py-2 border rounded-lg text-sm hover:bg-gray-100 transition duration-200">
                  Manage Stored Addresses
                </button>
                {showAddressForm && (
                  <AddressManager
                    addresses={addresses}
                    newAddress={newAddress}
                    onNewAddressChange={handleNewAddressChange}
                    onAddAddress={handleAddAddress}
                    onEditAddress={onEditAddress}
                    onDeleteAddress={onDeleteAddress}
                  />
                )}
              </div>
            )}

            {/* Schedule a delivery */}
            {deliveryMethod === "delivery" && (
              <div className="bg-yellow-400 p-4 rounded mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
                  <span className="font-semibold">Schedule a delivery</span>
                </div>
                <div className="mb-2">
                  <label htmlFor="scheduleType" className="block text-sm font-medium text-gray-700 mb-1">Schedule Type</label>
                  <select
                    id="scheduleType"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={scheduleType}
                    onChange={(e) => setScheduleType(e.target.value)}
                  >
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    id="scheduledDate"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-1">Scheduled Time</label>
                  <input
                    type="time"
                    id="scheduledTime"
                    className="w-full p-2 border border-gray-300 rounded"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded resize-none"
                  rows={3}
                  placeholder="Additional Delivery Information"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                />
                <div className="text-xs text-gray-500 text-right">Remaining Characters: {255 - additionalInfo.length}</div>
                <div className="flex space-x-2 mt-2">
                  <button
                    className="px-4 py-1 border rounded text-sm hover:bg-gray-100"
                    onClick={handleScheduleDelivery}
                  >
                    Schedule
                  </button>
                  <button
                    className="px-4 py-1 border rounded text-sm hover:bg-gray-100"
                    onClick={handleEditSchedule}
                  >
                    Edit Schedule
                  </button>
                </div>
              </div>
            )}

            {/* Items Details */}
            <div className="bg-yellow-400 p-4 rounded">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18"/></svg>
                <span className="font-semibold">Items Details</span>
              </div>
              <div className="flex justify-between items-center">
                <div>{cartItems.map(item => item.name).join(", ")}</div>
                <button className="px-4 py-1 border rounded text-sm hover:bg-gray-100" onClick={() => setShowItems(!showItems)}>{showItems ? "Hide Items" : "Show Items"}</button>
              </div>
              {showItems && (
                <div className="mt-2 p-2 border border-gray-300 rounded bg-white text-sm">
                  {cartItems.map(item => item.name).join(", ")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-80 border border-gray-300 rounded p-4 h-fit">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Items</span>
            <span>{orderSummary.items || 0}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Sub Total</span>
            <span>Ksh {(orderSummary.subTotal || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>Ksh {(orderSummary.shipping || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Coupon Discount</span>
            <span className="text-red-600">-Ksh {(orderSummary.couponDiscount || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg mb-4">
            <span>Total</span>
            <span>Ksh {(orderSummary.total || 0).toLocaleString()}</span>
          </div>
          <button
            onClick={handleProceedToPayment}
            disabled={authLoading || !token}
            className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition disabled:opacity-50"
          >
            {authLoading ? "Loading..." : "Proceed to Payment"}
          </button>
        </div>
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">Select Delivery Location</h2>
              <button
                onClick={() => setShowMapModal(false)}
                className="text-gray-500 hover:text-gray-700 transition duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Click on the map or enter a location name to set your delivery location.</p>
              <div className="h-96 w-full rounded-lg overflow-hidden">
                <Map setLocation={handleLocationSelect} />
              </div>
              {deliveryCoords && deliveryCoords.lat != null && deliveryCoords.lng != null && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Selected Location:</p>
                  <p className="text-sm text-blue-600">
                    Latitude: {(typeof deliveryCoords.lat === 'number' ? deliveryCoords.lat : 0).toFixed(6)}, 
                    Longitude: {(typeof deliveryCoords.lng === 'number' ? deliveryCoords.lng : 0).toFixed(6)}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-4 p-6 border-t">
              <button
                onClick={() => setShowMapModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowMapModal(false);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
