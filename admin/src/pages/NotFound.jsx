import { Gem } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#6b0f1a] to-[#1a0d0d] text-gray-100 p-4 font-IBM-Plex">
      <div className="text-center space-y-8 max-w-2xl animate-fadeIn">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <Gem
            className="w-20 h-20 text-gold drop-shadow-lg animate-pulse"
            strokeWidth={1.5}
          />
        </div>
        {/* 404 Heading */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-gold drop-shadow-[0_0_15px_rgba(255,215,0,0.6)]">
          404
        </h1>
        {/* Sub Heading */}
        <h2 className="text-3xl md:text-4xl font-light text-gray-200 tracking-wide italic">
          Page Not Found
        </h2>
        {/* Description */}
        <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
          This admin page could not be found. Please check the URL or return to
          the dashboard to continue managing your store.
        </p>
        {/* Button to Homepage */}
        <Link
          to="/"
          className="inline-block px-10 py-3 mt-6 font-semibold tracking-wide 
                     bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 rounded-full shadow-lg
                     transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl
                     focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          Go to Homepage
        </Link>
        {/* Decorative Border */}
        <div className="mt-8 border-t border-yellow-700 w-2/3 mx-auto"></div>
      </div>
    </div>
  );
};

export default NotFound;
