import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import TanishqIcon from "../assets/images/Spinner-Icon.png";
import { useWishlist } from "../hooks/useWishlist";
import Spinner from "./Spinner";

const ProductCard = ({ product, onClick }) => {
  const { wishlist, addToWishlist, isAdding, removeFromWishlist, isRemoving } =
    useWishlist();

  // check if this product is already in user's wishlist
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    if (wishlist?.some((item) => item._id === product._id)) {
      setInWishlist(true);
    }
  }, [wishlist, product._id]);

  const handleWishlistClick = async (e) => {
    e.stopPropagation();

    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
        setInWishlist(false);
      } else {
        await addToWishlist(product._id);
        setInWishlist(true);
      }
    } catch (error) {
      console.error("Wishlist toggle failed:", error);
    }
  };

  if (isAdding || isRemoving)
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer bg-white rounded-lg overflow-hidden transition-all duration-300"
    >
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
          {product?.images?.[1] ? (
            <img
              src={product?.images?.[1]?.url}
              alt={`${product?.name} second`}
              className="w-full h-full object-contain flex-shrink-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center flex-shrink-0 bg-primary/10">
              <img
                src={TanishqIcon}
                alt="Tanishq"
                className="w-15 h-15 object-center"
              />
            </div>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:scale-110 transition"
        >
          <Heart
            size={18}
            className={`cursor-pointer ${
              inWishlist ? "text-red-500 fill-red-500" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="px-3 py-4">
        <h3 className="text-base sm:text-lg text-gray-800 truncate">
          {product?.name}
        </h3>
        <p className="text-lg sm:text-xl text-gray-900 mt-1">
          ₹ {Math.floor(product?.price?.final)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
