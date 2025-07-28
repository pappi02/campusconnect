import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import AuthContext from "../contexts/AuthContext";
import heroImg from "../assets/hero.jpg";
import { signInWithGoogle } from "../firebase";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import CustomFooter from "../components/CustomFooter";
import { showToast } from "../utils/toastUtils";

const LoginPage = ({ vendorLogin }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const searchParams = new URLSearchParams(window.location.search);
  const isVendorLogin = vendorLogin || searchParams.get("vendor") === "true";

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

    if (typeof trimmedEmail !== "string" || typeof trimmedPassword !== "string") {
      setError("Email and password must be strings");
      return;
    }

    try {
      const result = await login({ email: trimmedEmail, password: trimmedPassword });

      if (result.success) {
        if (!result.redirected) {
          // fallback in case AuthProvider did not navigate
          navigate("/home", { replace: true });
        }
      } else {
        setError(`Login failed: ${result.message}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed: Network or server error");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      window.location.href = "/home";
    } catch (error) {
      showToast("Google sign-in failed: " + error.message, "error");
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
              <Link to="/" className="hover:underline">Home</Link> &gt;{" "}
              <Link to={isVendorLogin ? "/vendorlogin" : "/user-account"} className="hover:underline">
                {isVendorLogin ? "Vendor Account" : "User Account"}
              </Link> &gt; <span className="text-blue-600 font-semibold">Login</span>
            </nav>

            {/* Header */}
            <div className="mb-6">
              <p className="text-orange-600 font-semibold mb-2">Legacy Core</p>
              <h2 className="text-xl font-bold mb-1">
                {isVendorLogin ? "Welcome back, Vendor" : "Welcome back,"}
              </h2>
              <p className="text-sm mb-4">
                {isVendorLogin ? (
                  <>Don’t have a vendor account?{" "}
                    <Link to="/vendor-register" className="text-orange-600 hover:underline">
                      Create new vendor account
                    </Link>
                  </>
                ) : (
                  <>Don’t have an account?{" "}
                    <Link to="/register" className="text-orange-600 hover:underline">
                      Create new account
                    </Link>
                  </>
                )}
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
              <button
                onClick={handleGoogleLogin}
                className="flex items-center justify-center border border-gray-300 rounded-md px-3 py-2 w-full text-sm hover:bg-gray-100"
              >
                <FaGoogle className="mr-2" /> Login with Google
              </button>
              <button
                className="flex items-center justify-center bg-blue-600 text-white rounded-md px-3 py-2 w-full text-sm hover:bg-blue-700"
              >
                <FaFacebookF className="mr-2" /> Login with Facebook
              </button>
            </div>

            {/* OR Divider */}
            <div className="flex items-center justify-center mb-4 text-gray-500 text-xs">
              <span className="border-b border-gray-300 w-full mr-2"></span>
              <span className="px-2">OR</span>
              <span className="border-b border-gray-300 w-full ml-2"></span>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-sm">
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">Email or Username</label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-600"
                  placeholder="abc123@gmail.com"
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
                className="w-full bg-orange-600 text-white py-2 rounded-md font-semibold hover:bg-orange-700 transition"
              >
                Login
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

export default LoginPage;
