import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../contexts/AuthContext";
import axios from "../api";
import { toast } from "react-toastify";

const VendorSettings = () => {
  const { user, token } = useContext(AuthContext);

  const [settings, setSettings] = useState({
    email: "",
    phone: "",
    address: "",
    notificationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
    },
  });

  useEffect(() => {
    if (!user || !token) return;

    const fetchSettings = async () => {
      try {
        const response = await axios.get("/api/vendor/settings/");
        const data = response.data;
        setSettings({
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          notificationPreferences: {
            emailNotifications: data.email_notifications ?? true,
            smsNotifications: data.sms_notifications ?? false,
          },
        });
      } catch (error) {
        console.error("Failed to fetch settings", error);
        if (error.response && error.response.status === 401) {
          toast.error("Vendor account not found");
        }
      }
    };

    fetchSettings();
  }, [user, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/vendor/settings/", {
        email: settings.email,
        phone: settings.phone,
        address: settings.address,
        email_notifications: settings.notificationPreferences.emailNotifications,
        sms_notifications: settings.notificationPreferences.smsNotifications,
      });
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Failed to update settings", error);
      toast.error("Failed to update settings");
    }
  };

  return (
    <main className="mt-20 p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={settings.email}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="phone">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={settings.phone}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" htmlFor="address">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            value={settings.address}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
          />
        </div>
        <fieldset>
          <legend className="font-semibold mb-2">Notification Preferences</legend>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.notificationPreferences.emailNotifications}
                onChange={handleCheckboxChange}
              />
              <span>Email Notifications</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={settings.notificationPreferences.smsNotifications}
                onChange={handleCheckboxChange}
              />
              <span>SMS Notifications</span>
            </label>
          </div>
        </fieldset>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </main>
  );
};

export default VendorSettings;
