import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Logout</h2>
      <p className="mb-6">Are you sure you want to log out?</p>
      <button
        onClick={handleLogout}
        className="bg-green-900 text-white rounded-full px-6 py-2 hover:bg-green-800 transition"
      >
        Yes, Logout
      </button>
    </div>
  );
};

export default Logout;
