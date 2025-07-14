import React from "react";
import { useNavigate, Link } from "react-router-dom";

const PasswordSuccessPage = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/home"); // or dashboard path
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col px-20 py-10">
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
        <span className="text-blue-600 font-semibold">Registration Successful</span>
      </nav>

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden flex">
        {/* Left side - message */}
        <div className="w-1/2 p-8 flex flex-col items-center justify-center">
          <div className="bg-orange-600 rounded-full p-4 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4M12 22a10 10 0 100-20 10 10 0 000 20z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center">Registration Successful</h2>
          <p className="text-center mb-6">
            You’ve complete registration and move to dashboard
          </p>
          <button
            onClick={handleContinue}
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition"
          >
            Continue
          </button>
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

export default PasswordSuccessPage;
