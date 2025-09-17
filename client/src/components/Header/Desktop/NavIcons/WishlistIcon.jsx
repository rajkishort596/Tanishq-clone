import React from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../../../../features/authModalSlice";
import { useWishlist } from "../../../../hooks/useWishlist";

const WishlistIcon = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useWishlist();

  const handleWishListClick = () => {
    if (isAuthenticated) {
      navigate("/myaccount/wishlist");
    } else {
      dispatch(openAuthModal(false));
    }
  };

  return (
    <button
      onClick={handleWishListClick}
      className="relative p-2 text-primary cursor-pointer"
    >
      <Heart size={20} strokeWidth={1} />

      <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs rounded-full px-1">
        {wishlist?.length || 0}
      </span>
    </button>
  );
};

export default WishlistIcon;
