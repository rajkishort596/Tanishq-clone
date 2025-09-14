import React from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../../../../features/authModalSlice";

const WishlistIcon = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleWishListClick = () => {
    if (isAuthenticated && user) {
      navigate("/wishlists");
    } else {
      dispatch(openAuthModal(false));
    }
  };

  return (
    <button
      onClick={handleWishListClick}
      className="p-2 text-primary cursor-pointer"
    >
      <Heart size={20} strokeWidth={1} />
    </button>
  );
};

export default WishlistIcon;
