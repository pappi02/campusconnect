import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api";
import { toast } from "react-toastify";
import { showToast } from "../utils/toastUtils";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async () => {
    if (!email) {
      showToast("Please enter your email.", "error");
      return;
    }
    setLoading(true);
    try {
      await axios.post("/api/send-verification-code/", { email });
      showToast("Verification code has been sent to your email", "success");
      // Redirect to password reset page after sending code, passing email in state
      navigate("/password-reset?email=" + encodeURIComponent(email));
    } catch (error) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message;
      showToast("Failed to send verification code. Backend error: " + errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ml-10 flex items-center justify-start bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded shadow-md flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-full">
          <h2 className="text-xl font-semibold mb-2">Forgot Password</h2>
          <p className="text-sm mb-6 text-gray-600">
            Enter the email address or mobile phone number associated with your Campus Delivery account.
          </p>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            placeholder="you@example.com"
            required
          />
          <button
            onClick={handleSendCode}
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"
            }`}
          >
            {loading ? "Sending code..." : "SEND CODE →"}
          </button>
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Already have account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
            <p>
              Don&apos;t have account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
          <p className="mt-6 text-xs text-gray-500">
            You may contact{" "}
            <a href="mailto:customerservice@example.com" className="text-orange-600 hover:underline">
              Customer Service
            </a>{" "}
            for help restoring access to your account.
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
