import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api";

const CreatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (location.state) {
      setEmail(location.state.email || "");
      setUserData(location.state.userData || null);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");

    try {
      // Call backend API to save password with email, code, and user data
      const payload = { email, code, password, userData };
      const response = await api.post("/api/set-password/", payload);
      console.log("CreatePassword response:", response);

      // Redirect to password success page on success
      navigate("/password-success");
    } catch (error) {
      console.error("CreatePassword error:", error.response ? error.response.data : error.message);
      setError("Failed to save password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col px-20 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:underline" autoComplete="off">
          Home
        </Link>{" "}
        {'>'}{" "}
        <Link to="/user-account" className="hover:underline" autoComplete="off">
          User Account
        </Link>{" "}
        {'>'}{" "}
        <Link to="/sign-up" className="hover:underline" autoComplete="off">
          Sign up
        </Link>{" "}
        {'>'}{" "}
        <span className="text-blue-600 font-semibold">Confirm Password</span>
      </nav>

      <div className="flex max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left side - form */}
        <div className="w-1/2 p-8">
          {/* Step indicator */}
          <div className="flex items-center mb-8 space-x-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  step <= 3 ? "bg-orange-600 text-white" : "bg-gray-300 text-gray-600"
                }`}
              >
                {step}
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold mb-2">Enter your password</h2>
          <p className="text-sm mb-6">Kindly enter your password to confirm</p>

          <form onSubmit={handleSubmit} className="space-y-6 text-sm">
            
            <div>
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-600"
                required
                autoComplete="new-password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-1 font-medium">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-600"
                required
                autoComplete="new-password"
              />
            </div>

            {error && <p className="text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 rounded-md font-semibold hover:bg-orange-700 transition"
            >
              Confirm
            </button>
          </form>
        </div>

        {/* Right side - image */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center p-8">
          <img
            src="/assets/verification_image.png"
            alt="Shopping cart with bags"
            className="max-w-full max-h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePassword;
