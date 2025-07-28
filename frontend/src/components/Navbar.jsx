import { useContext } from "react";
import {
  ShoppingCart,
  Search,
  Bell,
  MapPin,
  Heart,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import  AuthContext from "../contexts/AuthContext";



const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleCartClick = () => {
     {
      navigate("/cart");
    } 
  };
  return (
    <header className="text-sm">
      {/* Top Bar */}
      <div className="flex justify-end space-x-6 bg-[#e6e9f8] text-gray-600 text-xs px-4 py-2">
        <a href="/vendorlogin" className="hover:underline">Sell With Us</a>
        <a href="#" className="hover:underline">Contact Us</a>
        <a href="#" className="hover:underline">Download App</a>
      </div>

      {/* Middle Nav Buttons */}
      <div className="bg-[#e6e9f8] px-4 py-1 shadow-sm flex justify-center space-x-8 font-medium text-gray-800">
        <button
          className="rounded-full hover:text-blue-600"
          onClick={() => navigate("/home")}
        >
          Products
        </button>
        <button className="rounded-full hover:text-blue-600">Services</button>
        <button className="rounded-full hover:text-blue-600">Market</button>
        <button className="rounded-full hover:text-blue-600">Packages</button>
      </div>

      {/* Main Navbar */}
      <div className="bg-[#e6e9f8] px-4 py-3 flex items-center justify-between flex-wrap shadow-md">
        {/* Left: Logo & Toggles */}
        <div className="flex items-center space-x-4">
          <div className="text-xl font-bold text-black">My logo</div>
          <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1">
            <button
              className="bg-white text-sm border border-gray-300 rounded-full px-3 py-1 font-medium shadow"
              onClick={() => navigate("/home")}
            >
              Products
            </button>
            <button className="text-sm text-gray-600 px-3 py-1 font-medium">
              Services
            </button>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 mx-4 max-w-7cm">
          <div className="flex items-center rounded-full bg-white px-4 py-2 shadow-inner">
            <input
              type="text"
              placeholder="Search products or services"
              className="rounded-full flex-1 outline-none bg-transparent text-sm"
            />
            <Search className="text-gray-500" />
          </div>
        </div>

        {/* Right: Icons and Login */}
        <div className="flex items-center gap-4">
          <Link to="/customer-map">
            <MapPin className="text-black cursor-pointer hover:text-blue-600 transition-colors" />
          </Link>
          <Bell className="text-black cursor-pointer" />
          <Heart className="text-black cursor-pointer" />
          <div onClick={handleCartClick} className="cursor-pointer">
            <ShoppingCart className="text-black" />
          </div>
          <Link to="/my-account">
            <User className="text-black cursor-pointer" />
          </Link>
          
        </div>
      </div>
    </header>
  );
};

export default Navbar;
