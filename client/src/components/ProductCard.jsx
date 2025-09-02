import React from "react";
import { Heart } from "lucide-react";

const ProductCard = ({ product }) => {
  return (
    <div className="group relative cursor-pointer bg-white rounded-lg overflow-hidden transition-all duration-300">
      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-lg">
        <div className="w-full h-full flex transition-transform duration-500 ease-in-out group-hover:-translate-x-full">
          {/* First Image */}
          <img
            src={product?.images?.[0]?.url}
            alt={product?.name}
            className="w-full h-full object-contain flex-shrink-0"
          />
          {/* Second Image */}
          {product?.images?.[1] && (
            <img
              src={product?.images?.[1]?.url}
              alt={`${product?.name} second`}
              className="w-full h-full object-contain flex-shrink-0"
            />
          )}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:scale-110 transition">
          <Heart size={16} className="text-gray-600 cursor-pointer" />
        </button>
      </div>

      {/* Product Info */}
      <div className="px-3 py-4">
        <h3 className="text-lg text-gray-800 truncate">{product?.name}</h3>
        <p className="text-xl text-gray-900 mt-1">
          ₹ {Math.floor(product?.price?.final)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
