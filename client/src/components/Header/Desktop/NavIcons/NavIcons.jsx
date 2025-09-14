import React from "react";
import AuthModal from "../../../Modal/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import {
  closeAuthModal,
  setIsLogin,
} from "../../../../features/authModalSlice";
import UserIcon from "./UserIcon";
import WishlistIcon from "./WishlistIcon";
import CartIcon from "./CartIcon";

export const NavIcons = () => {
  const dispatch = useDispatch();
  const { isOpen, isLogin } = useSelector((state) => state.authModal);
  return (
    <div className="flex items-center md:space-x-4">
      <UserIcon />
      <WishlistIcon />
      <CartIcon />
      {/* Auth Modal */}
      <AuthModal
        isOpen={isOpen}
        onClose={() => dispatch(closeAuthModal())}
        isLogin={isLogin}
        setIsLogin={(val) => dispatch(setIsLogin(val))}
      />
    </div>
  );
};
