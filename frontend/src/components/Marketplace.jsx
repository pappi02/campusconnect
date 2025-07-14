import React from "react";
import { useNavigate } from "react-router-dom";
import freshImg from "../assets/fresh.jpg";
import servicesImg from "../assets/services.png";
import wholesaleImg from "../assets/wholesale.jpg";

const categories = [
  {
    title: "Fresh and Local",
    description: "Discover fresh produce and local specialties near you.",
    image: freshImg,
  },
  {
    title: "Explore Services",
    description: "Access delivery, catering, and other essential services.",
    image: servicesImg,
  },
  {
    title: "Wholesale Hub",
    description: "Buy in bulk at wholesale prices for your business or events.",
    image: wholesaleImg,
  },
];

const Marketplace = () => {
  const navigate = useNavigate();

  const handleCheckItOut = (category) => {
    // Navigate to /home with category filter as query param
    navigate(`/home?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="bg-gray-50 py-8">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
          Explore Our Marketplace
        </h2>

        <div className="grid grid-cols-3 gap-3 w-full">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white w-full rounded-xl shadow-md overflow-hidden hover:scale-[1.03] transition-transform duration-300 flex flex-col"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-32 sm:h-36 object-cover"
              />
              <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3">
                    {cat.description}
                  </p>
                </div>
                <button
                  className="mt-auto bg-orange-600 text-white text-sm px-3 py-1.5 rounded-full hover:bg-orange-700 transition"
                  onClick={() => handleCheckItOut(cat.title)}
                >
                  Check it Out →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
