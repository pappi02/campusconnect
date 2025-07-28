import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../api";
import { showToast } from "../utils/toastUtils";
import CustomFooter from "../components/CustomFooter";
import  AuthContext  from "../contexts/AuthContext";

const VerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(""); // Ideally, get this from context or props
  const [userData, setUserData] = useState(null);
  const [verified, setVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
      setUserData(location.state.userData || null);
    }
  }, [location]);

  const handleVerify = async () => {
    try {
      const response = await axios.post("/api/verify-code/", { email, code: otp });
      if (response.status === 200) {
        setVerified(true);
        // Redirect to vendor dashboard if role is vendor
        if (response.data.role === "vendor") {
          navigate("/vendor-dashboard");
        }
      }
    } catch (error) {
      console.error("Verification error response:", error.response?.data);
      showToast(error.response?.data?.detail || "Verification failed. Please try again.", "error");
    }
  };

  const handleResend = async () => {
    try {
      await axios.post("/api/send-verification-code/", { email });
      showToast("Verification code resent.", "success");
    } catch (error) {
      showToast("Failed to resend verification code. Please try again.", "error");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");

    try {
      const payload = { email, code: otp, password, userData };
      const response = await axios.post("/api/set-password/", payload);
      console.log("Set password response:", response);
      if (response.status === 201 || response.status === 200) {
        const { user, token } = response.data;
        if (user && token) {
          login(user, token);
        }
        navigate("/home");
      }
    } catch (error) {
      console.error("Set password error:", error.response ? error.response.data : error.message);
      setError("Failed to set password. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-20">
        <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full flex p-8">
          {/* Left Side - Verification or Password Form */}
          <div className="w-1/2 pr-8">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-600 mb-6">
              <Link to="/" className="hover:underline">Home</Link> {'>'}{" "}
              <Link to="/user-account" className="hover:underline">User Account</Link> {'>'}{" "}
              <Link to="/signup" className="hover:underline">Sign Up</Link> {'>'}{" "}
              <span className="text-blue-600 font-semibold">{verified ? "Set Password" : "Verification"}</span>
            </nav>

            {/* Step Indicator */}
            <div className="flex items-center mb-6 space-x-4">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${verified ? "bg-orange-600 text-white" : "bg-orange-600 text-white"}`}>1</div>
              <div className={`flex-1 h-1 rounded ${verified ? "bg-orange-600" : "bg-orange-600"}`}></div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${verified ? "bg-orange-600 text-white" : "bg-orange-600 text-white"}`}>2</div>
              <div className={`flex-1 h-1 rounded ${verified ? "bg-orange-600" : "bg-gray-300"}`}></div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${verified ? "bg-gray-300 text-gray-600" : "bg-gray-300 text-gray-600"}`}>3</div>
            </div>

            {!verified ? (
              <>
                <h2 className="text-base font-semibold mb-2">Please enter OTP to verify your account</h2>
                <p className="text-xs mb-6">
                  An OTP has been sent your email <span className="font-semibold">{email}</span>
                </p>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-95% border border-gray-300 rounded-md px-3 py-2 mb-6 outline-none focus:border-blue-600"
                />

                <button
                  onClick={handleVerify}
                  className="w-95% bg-orange-600 text-white py-2 rounded-md font-semibold hover:bg-orange-700 transition mb-4"
                >
                  Verify
                </button>

                <p className="text-xs text-center">
                  Did not receive code?{" "}
                  <button
                    onClick={handleResend}
                    className="text-orange-600 p-1 underline hover:text-orange-700 cursor-pointer"
                  >
                    Resend OTP
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-2">Enter your password</h2>
                <p className="text-sm mb-6">Kindly enter your password to confirm</p>

                <form onSubmit={handlePasswordSubmit} className="space-y-6 text-sm">
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
              </>
            )}
          </div>

          {/* Right Side - Shopping Cart Illustration */}
          <div className="w-1/2 flex items-center justify-center relative">
            {/* Shopping cart and bags illustration */}
            <div className="relative w-64 h-64">
              {/* Cart */}
              <div className="w-40 h-40 bg-blue-300 rounded-lg shadow-lg relative">
                <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded shadow"></div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded shadow"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-white rounded shadow"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-white rounded shadow"></div>
              </div>
              {/* Bags floating */}
              <div className="absolute top-0 left-32 w-12 h-12 bg-pink-400 rounded shadow animate-bounce"></div>
              <div className="absolute top-16 left-48 w-12 h-12 bg-yellow-400 rounded shadow animate-bounce delay-200"></div>
              <div className="absolute top-32 left-40 w-12 h-12 bg-purple-400 rounded shadow animate-bounce delay-400"></div>
            </div>
          </div>
        </div>
      </div>
      <CustomFooter />
    </>
  );
};

export default VerifyPage;