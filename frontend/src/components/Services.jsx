// src/components/Services.jsx
import React from "react";
import laundryImg from "../assets/laundry.png";
import repairImg from "../assets/repair.jpg";
import beautyImg from "../assets/beauty.jpg";

const services = [
  { name: "Laundry", image: laundryImg },
  { name: "Phone Repair", image: repairImg },
  { name: "Nail & Beauty", image: beautyImg },
  { name: "Laundry", image: laundryImg },
  { name: "Phone Repair", image: repairImg },
  { name: "Nail & Beauty", image: beautyImg },
  { name: "Laundry", image: laundryImg },
  { name: "Phone Repair", image: repairImg },
  { name: "Nail & Beauty", image: beautyImg },
  
];

const Services = () => {
  return (
    <section className="px-6 md:px-20 py-12 bg-white">
      {/* Title Row */}
      <div className="flex justify-between items-center mb-8">
        <button className="bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition">
          View All Services →
        </button>
        <h2 className="text-2xl md:text-3xl font-bold text-right text-gray-800">
          Our Top Seller Services
        </h2>
      </div>

      {/* Scrollable Cards */}
      <div className="flex overflow-x-auto gap-4 pb-2">
        {services.map((service, idx) => (
          <div
            key={idx}
            className="min-w-[220px] h-[160px] relative rounded-2xl overflow-hidden flex-shrink-0 shadow-lg"
          >
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <p className="text-white text-12 font-bold text-center">
                {service.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
