import React from "react";
import heroImg from "../assets/hero.jpg";

const Hero = () => {
  return (
    <section
      className="relative w-full min-h-[40vh] bg-cover bg-center bg-no-repeat flex items-center justify-start pt-24"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      {/* Optional dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20 z-0" />

      {/* Hero content */}
      <div className="container relative z-10 text-center max-w-xl text-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 leading-tight">
          Don’t miss <br />
          <span className="text-blue-800">amazing grocery deals</span>
        </h1>
        <p className="text-sm mb-3 text-black">
          Sign up for the daily newsletter and never miss out.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-2 py-1.5 rounded-full bg-white text-black placeholder-gray-500 shadow w-full sm:w-60 text-sm mb-4"
          />
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm mb-4">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
