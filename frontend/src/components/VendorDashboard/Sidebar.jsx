import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaBoxOpen,
  FaChartBar,
  FaUsers,
  FaUserCircle,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/vendor/dashboard" },
    { name: "Orders", icon: <FaShoppingCart />, path: "/vendor/orders" },
    { name: "Products", icon: <FaBoxOpen />, path: "/vendor/products" },
    { name: "Analytics", icon: <FaChartBar />, path: "/vendor/analytics" },
    { name: "Customers", icon: <FaUsers />, path: "/vendor/customers" },
    { name: "Profile", icon: <FaUserCircle />, path: "/vendor/profile" },
    { name: "Setting", icon: <FaCog />, path: "/vendor/setting" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen p-4 flex flex-col">
      <div className="mb-8 text-xl font-bold text-blue-700">LegacyC Seller</div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-blue-100 ${
                isActive ? "bg-blue-200 font-semibold" : "text-gray-700"
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
