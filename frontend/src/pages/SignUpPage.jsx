import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api";
import heroImg from "../assets/hero.jpg";
import CustomFooter from "../components/CustomFooter";
import { showToast } from "../utils/toastUtils";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "Female",
    phoneCountryCode: "+254",
    phoneNumber: "",
    email: "",
    dob: "",
    country: "",
    city: "",
    zipCode: "",
    termsAccepted: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      showToast("Please accept the terms and conditions.", "error");
      return;
    }
    setLoading(true);
    try {
      // Only send verification code without saving user data
      await axios.post("/api/send-verification-code/", { email: formData.email });

      // Show toast notification
      showToast("Verification code has been sent to your email", "success");

      // Redirect to verify page with email in state
      navigate("/verify", { state: { email: formData.email, userData: formData } });
    } catch (error) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      showToast("Failed to send OTP. Backend error: " + errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center flex items-start justify-start px-20"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="mt-20 bg-white rounded-lg shadow-lg max-w-md w-auto flex flex-col items-start p-8">
          {/* Left Side - Registration Form */}
          <div className="form-container p-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-600 mb-6">
              <Link to="/" className="hover:underline">
                Home
              </Link>{" "}
              {'>'}{" "}
              <Link to="/user-account" className="hover:underline">
                User Account
              </Link>{" "}
              {'>'}{" "}
              <span className="text-blue-600 font-semibold">Sign Up</span>
            </nav>

            {/* Step Indicator */}
            <div className="flex items-center mb-6 space-x-4">
              <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-semibold">
                1
              </div>
              <div className="flex-1 h-1 bg-gray-300 rounded"></div>
              <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <div className="flex-1 h-1 bg-gray-300 rounded"></div>
              <div className="w-6 h-6 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-xs font-semibold">
                3
              </div>
            </div>

            <h2 className="text-lg font-bold mb-2">Registration</h2>
            <p className="text-sm mb-6">
              If you already have an account,{" "}
              <Link to="/login" className="text-orange-600 hover:underline">
                Login here
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div className="flex space-x-4 gap-6">
                <div className="flex-1">
                  <label htmlFor="firstName" className="block mb-1 font-medium">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-600"
                    placeholder="Aqib"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="lastName" className="block mb-1 font-medium">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-600"
                    placeholder="Javid"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-medium">Gender</label>
                <div className="flex space-x-4">
                  {["Male", "Female", "Other"].map((gender) => (
                    <label key={gender} className="inline-flex items-center space-x-1">
                      <input
                        type="radio"
                        name="gender"
                        value={gender}
                        checked={formData.gender === gender}
                        onChange={handleChange}
                        className="form-radio"
                      />
                      <span>{gender}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="phoneNumber" className="block mb-1 font-medium">
                    Phone no
                  </label>
                  <div className="flex">
                    <select
                      name="phoneCountryCode"
                      value={formData.phoneCountryCode}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-l-md px-2 py-2 outline-none focus:border-blue-600"
                    >
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+92">🇵🇰 +92</option>
                      <option value="+44">🇬🇧 +44</option>
                    </select>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="flex-1 border border-gray-300 rounded-r-md px-3 py-2 outline-none focus:border-blue-600"
                      placeholder="123456789"
                      required
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label htmlFor="email" className="block mb-1 font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-600"
                    placeholder="abc123@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 gap-6">
                <div className="flex-1">
                  <label htmlFor="dob" className="block mb-1 font-medium">
                    Date of birth
                  </label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-600"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="country" className="block mb-1 font-medium">
                    Country
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-600"
                    placeholder="Pakistan"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 gap-6">
                <div className="flex-1">
                  <label htmlFor="city" className="block mb-1 font-medium">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-600"
                    placeholder="Lahore"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="zipCode" className="block mb-1 font-medium">
                    Zip code
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-600"
                    placeholder="54000"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="termsAccepted" className="ml-2 text-xs">
                  I have read and accept 4Smile's Terms of Use, Privacy Policy, Terms & Conditions
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-md font-semibold transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                {loading ? "Sending verification code..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <CustomFooter />
    </>
  );
};

export default SignUpPage;
