import React from "react";

const SidebarMenu = ({ activeMenu, onMenuClick }) => {
  const menus = [
    "Personal Information",
    "My Orders",
    "Manage Address",
    "Payment Method",
    "Password Manager",
    "Logout",
  ];

  return (
    <aside className="flex flex-col gap-4 max-w-50">
      {menus.map((menu) => {
        const isActive = activeMenu === menu;
        const className =
          "rounded-lg py-2 px-4 text-left font-semibold " +
          (isActive
            ? "bg-yellow-400 text-black"
            : "border border-gray-300 text-gray-700 hover:bg-gray-100");
        return (
          <button key={menu} onClick={() => onMenuClick(menu)} className={className}>
            {menu}
          </button>
        );
      })}
    </aside>
  );
};

export default SidebarMenu;
