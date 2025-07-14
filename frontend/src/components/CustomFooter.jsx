import React from "react";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";

const CustomFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-4 gap-8">
        {/* Left Section */}
        <div className="space-y-4">
          <div className="text-2xl font-bold text-white">Tailwind Blocks</div>
          <p className="text-sm max-w-xs">
            Chillwave tumeric sriracha taximy chia microdosing
          </p>
        </div>

        {/* Category Columns */}
        {Array(3).fill(null).map((_, idx) => (
          <div key={idx}>
            <h3 className="text-white font-semibold mb-4">CATEGORY</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-white hover:text-white">First Link</a></li>
              <li><a href="#" className="text-white hover:text-white">Second Link</a></li>
              <li><a href="#" className="text-white hover:text-white">Third Link</a></li>
              <li><a href="#" className="text-white hover:text-white">Fourth Link</a></li>
              <li><a href="#" className="text-white hover:text-white">Fifth Link</a></li>
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-800 border-t border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div>© Copyright @ 2025 Campus Delivery. All rights reserved</div>
          <div className="flex space-x-6 mt-3 md:mt-0">
            <a href="#" aria-label="Facebook" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white"><FaLinkedinIn /></a>
            <a href="#" aria-label="X" className="hover:text-white"><FaTwitter /></a>
            <a href="#" aria-label="Instagram" className="hover:text-white"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;
