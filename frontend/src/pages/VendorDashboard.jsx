import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/VendorDashboard/Sidebar";
import Header from "../components/VendorDashboard/Header";

const VendorDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default VendorDashboard;
