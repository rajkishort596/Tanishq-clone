import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import images from "../../utils/images";
import { useWishlist } from "../../hooks/useWishlist";
import Spinner from "../../components/Spinner";

const Wishlist = () => {
  const navigate = useNavigate();

  const {
    wishlist,
    isLoading,
    removeFromWishlist,
    isRemoving,
    error,
    isFetching,
  } = useWishlist();

  const handleRemove = async (productId) => {
    console.log("Remove item from wishlist:", productId);
    // TODO: call API and update redux
    await removeFromWishlist(productId);
  };

  const handleMoveToCart = (id) => {
    console.log("Move to cart:", id);
    // TODO: call API
  };

  const handleWishlistCardClick = (product, e) => {
    e.stopPropagation();
    const path = `/shop/all-jewellery/product/${product._id}`;
    navigate(path);
  };

  if (isLoading || isFetching || isRemoving) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        Error loading wishlist. Please try again later.
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="bg-white rounded-lg font-nunito text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-left">
          Wishlist
        </h2>
        <div className="flex flex-col sm:flex-row items-center max-w-3xl mx-auto justify-between gap-6">
          <img
            src={images.emptyWishlistIcon}
            alt="Empty Wishlist"
            className="w-40 sm:w-72"
          />
          <div>
            <p className="text-lg font-bold text-primary mb-2">
              Your Wishlist Is Empty !
            </p>
            <p className="text-sm font-semibold mb-4">
              Add items to your jewellery wardrobe
            </p>
            <button
              onClick={() => navigate("/shop/all-jewellery")}
              className="mt-8 px-6 py-2 bg-primary text-white rounded-sm cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg font-nunito">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div
            key={item?._id}
            onClick={(e) => handleWishlistCardClick(item, e)}
            className="border border-gray-200 rounded-lg p-4 relative shadow-sm cursor-pointer hover:shadow-md transition"
          >
            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(item?._id);
              }}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white border border-red-200 text-red-500 rounded-full hover:bg-red-50 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>

            {/* Image */}
            <img
              src={item?.images?.[0]?.url || "/images/default-product.png"}
              alt={item?.name}
              className="w-full h-48 object-contain mb-4"
            />

            {/* Name */}
            <h3 className="text-sm sm:text-base font-semibold mb-2">
              {item?.name}
            </h3>

            {/* Price */}
            <p className="text-primary font-bold text-base sm:text-lg mb-4">
              ₹ {item?.price?.final.toFixed(2)}
            </p>

            {/* Move to Cart */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveToCart(item?._id);
              }}
              className="w-full py-2 bg-primary text-white rounded-sm cursor-pointer hover:bg-red-700"
            >
              Move To Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
