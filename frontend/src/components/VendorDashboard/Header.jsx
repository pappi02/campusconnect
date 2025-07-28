import React, { useState } from "react";
import { FaSearch, FaPlus, FaBell, FaCommentDots } from "react-icons/fa";
import AddProductModal from "./AddProductModal";

const Header = ({ onProductAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleProductAdded = (newProduct) => {
    // Callback to parent component when product is added
    if (onProductAdded) {
      onProductAdded(newProduct);
    }
    closeModal();
  };

  return (
    <>
      <header className="flex items-center justify-between bg-white p-4 shadow">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search or type a command"
            className="border rounded-md px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={openModal}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" />
            Add Product
          </button>
        </div>
        <div className="flex items-center space-x-6">
          <FaCommentDots className="text-gray-600 cursor-pointer text-xl" />
          <FaBell className="text-gray-600 cursor-pointer text-xl" />
          <img
            src="https://randomuser.me/api/portraits/women/44.jpg"
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
          />
        </div>
      </header>

      {/* Enhanced Product Modal */}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onProductAdded={handleProductAdded}
      />
    </>
  );
};

export default Header;
