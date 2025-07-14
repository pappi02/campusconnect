import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import SidebarMenu from "../components/MyAccountPage/SidebarMenu";
import PersonalInformationForm from "../components/MyAccountPage/PersonalInformationForm";
import OrdersList from "../components/MyAccountPage/OrdersList";
import AddressManager from "../components/MyAccountPage/AddressManager";
import PaymentMethod from "../components/MyAccountPage/PaymentMethod";
import PasswordManager from "../components/MyAccountPage/PasswordManager";
import Logout from "../components/MyAccountPage/Logout";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext";

const MyAccountPage = () => {
  const { token } = useContext(AuthContext);
  console.log("MyAccountPage token from AuthContext:", token);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
  });

  const [activeMenu, setActiveMenu] = useState("Personal Information");

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

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
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/api/profile/");
        console.log("Profile API response data:", response.data);
        const data = response.data;
        setFormData({
          firstName: data.full_name ? data.full_name.split(" ")[0] : "",
          lastName: data.full_name ? data.full_name.split(" ")[1] || "" : "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
        });
        console.log("Form data set to:", {
          firstName: data.full_name ? data.full_name.split(" ")[0] : "",
          lastName: data.full_name ? data.full_name.split(" ")[1] || "" : "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    const fetchUserOrders = async () => {
      try {
        // Fetch user-specific orders from backend
        const response = await api.get("/api/orders/");
        console.log("Orders API response data:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch user orders:", error);
      }
    };

    const fetchUserAddresses = async () => {
      try {
        const response = await api.get("/api/addresses/");
        console.log("Addresses API response data:", response.data);
        setAddresses(response.data);
      } catch (error) {
        console.error("Failed to fetch user addresses:", error);
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await api.get("/api/payment-methods/");
        console.log("Payment Methods API response data:", response.data);
        setPaymentMethods(response.data);
      } catch (error) {
        console.error("Failed to fetch payment methods:", error);
      }
    };

    if (token) {
      fetchUserProfile();
      fetchUserOrders();
      fetchUserAddresses();
      fetchPaymentMethods();
    }
  }, [token]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        full_name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
      };
      const response = await api.put("/api/profile/", updateData);
      alert("Changes updated!");
      console.log("Profile update response:", response.data);
      // Optionally update formData with response data
      setFormData({
        firstName: response.data.full_name ? response.data.full_name.split(" ")[0] : "",
        lastName: response.data.full_name ? response.data.full_name.split(" ")[1] || "" : "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        gender: response.data.gender || "",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const id = addresses.length ? addresses[addresses.length - 1].id + 1 : 1;
    const fullName = newAddress.firstName + " " + newAddress.lastName;
    const fullAddress = newAddress.streetAddress + ", " + newAddress.city + ", " + newAddress.state + " " + newAddress.zipCode;
    const addressEntry = { id, name: fullName, address: fullAddress };
    setAddresses([...addresses, addressEntry]);
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
  };

  const handleEditAddress = (id) => {
    alert("Edit address with id " + id);
  };

  const handleDeleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Account</h1>
        <nav className="text-sm text-gray-600">
          <Link to="/" className="hover:underline">Home</Link> / My Account
        </nav>
      </div>

      <div className="flex gap-12 max-w-5xl mx-auto">
        <SidebarMenu activeMenu={activeMenu} onMenuClick={handleMenuClick} />

        <main className="flex-1 bg-white p-6 rounded-lg shadow">
          {activeMenu === "Personal Information" && (
            <PersonalInformationForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />
          )}

          {activeMenu === "My Orders" && <OrdersList />}

          {activeMenu === "Manage Address" && (
            <AddressManager
              addresses={addresses}
              newAddress={newAddress}
              onNewAddressChange={handleNewAddressChange}
              onAddAddress={handleAddAddress}
              onEditAddress={handleEditAddress}
              onDeleteAddress={handleDeleteAddress}
            />
          )}

          {activeMenu === "Payment Method" && <PaymentMethod />}
          {activeMenu === "Password Manager" && <PasswordManager />}
          {activeMenu === "Logout" && <Logout />}
        </main>
      </div>

      <section className="mt-16 flex justify-between max-w-4xl mx-auto text-gray-700">
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-yellow-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3h18v18H3z" />
            <path d="M3 12h18" />
          </svg>
          <div>{/* You can add footer info here */}</div>
        </div>
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-yellow-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11a4 4 0 01-8 0" />
            <line x1="12" y1="7" x2="12" y2="11" />
            <line x1="14" y1="7" x2="14" y2="11" />
          </svg>
          <div>Flexible Payment<br /><small>Multiple secure payment options</small></div>
        </div>
        <div className="flex items-center gap-3">
          <svg
            className="w-8 h-8 text-yellow-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 12h-4l-3 9-4-18-3 9H2" />
          </svg>
          <div>24x7 Support<br /><small>We support online all days.</small></div>
        </div>
      </section>
    </div>
  );
};

export default MyAccountPage;
