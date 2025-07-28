import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import AuthContext from "../contexts/AuthContext";
import heroImg from "../assets/hero.jpg";
import { FaTruck, FaMotorcycle, FaBicycle } from "react-icons/fa";
import CustomFooter from "../components/CustomFooter";
import { showToast } from "../utils/toastUtils";

const DeliveryLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [keepLogin, setKeepLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required");
      return;
    }

    try {
      const result = await login({ 
        email: trimmedEmail, 
        password: trimmedPassword,
        userType: 'delivery' 
      });

      if (result.success) {
        // Redirect to delivery dashboard after successful login
        navigate("/delivery/dashboard", { replace: true });
      } else {
        setError(`Login failed: ${result.message}`);
      }
    } catch (err) {
      console.error("Delivery login error:", err);
      setError("Login failed: Network or server error");
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-start px-4 md:px-20"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="mt-20 bg-white rounded-lg shadow-lg max-w-md w-full flex flex-col items-start p-8">
          <div className="form-container w-full">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-600 mb-6">
              <Link to="/" className="hover:underline">Home</Link> {">"}
              <Link to="/delivery" className="hover:underline">Delivery</Link> {">"}
              <span className="text-blue-600 font-semibold">Delivery Login</span>
            </nav>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <FaTruck className="text-yellow-500 text-2xl mr-2" />
                <h2 className="text-xl font-bold">Delivery Partner Login</h2>
              </div>
              <p className="text-sm mb-4">
                Welcome back! Login to start accepting delivery orders.
              </p>
              <p className="text-xs text-gray-600">
                Don't have a delivery account?{" "}
                <Link to="/delivery/apply" className="text-orange-600 hover:underline">
                  Apply to become a delivery partner
                </Link>
              </p>
            </div>

            {/* Delivery Icons */}
            <div className="flex justify-center space-x-4 mb-6">
              <FaTruck className="text-3xl text-gray-400" />
              <FaMotorcycle className="text-3xl text-gray-400" />
              <FaBicycle className="text-3xl text-gray-400" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-600"
                  placeholder="delivery@example.com"
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="password" className="block mb-1 font-medium">
                  Password
                  <Link to="/forgot-password" className="text-xs text-gray-500 float-right hover:underline">
                    Forgot Password?
                  </Link>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-600"
                  placeholder="********"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="keepLogin"
                  type="checkbox"
                  checked={keepLogin}
                  onChange={() => setKeepLogin(!keepLogin)}
                  className="form-checkbox"
                />
                <label htmlFor="keepLogin" className="text-xs">Keep me logged in</label>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 text-black py-2 rounded-md font-semibold hover:bg-yellow-600 transition"
              >
                Login as Delivery Partner
              </button>
            </form>

            {error && (
              <p className="text-red-600 mt-2 text-xs font-semibold">{error}</p>
            )}
          </div>
        </div>
      </div>
      <CustomFooter />
    </>
  );
};

export default DeliveryLoginPage;
