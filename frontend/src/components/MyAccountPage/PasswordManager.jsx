import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import api from "../../api";

const PasswordManager = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    try {
      const response = await api.put("/api/update-password/", {
        current_password: password,
        new_password: newPassword,
      });
      if (response.status === 204) {
        alert("Password updated successfully.");
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        const data = response.data;
        alert("Failed to update password: " + JSON.stringify(data));
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert("Error updating password: " + JSON.stringify(error.response.data));
      } else {
        alert("Error updating password: " + error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block font-semibold mb-1">Password *</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="text-right mt-1">
          <a href="/forgot-password" className="text-sm text-green-900 hover:underline">
            Forgot Password?
          </a>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">New Password</label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            aria-label={showNewPassword ? "Hide password" : "Show password"}
          >
            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">Confirm New Password</label>
        <div className="relative">
          <input
            type={showConfirmNewPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
            aria-label={showConfirmNewPassword ? "Hide password" : "Show password"}
          >
            {showConfirmNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-900 text-white rounded-full px-6 py-2 hover:bg-green-800 transition"
      >
        Update Password
      </button>
    </form>
  );
};

export default PasswordManager;
