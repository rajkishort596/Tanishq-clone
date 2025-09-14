import React from "react";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CartIcon = () => {
  const navigate = useNavigate();
  // TODO: Replace 0 with cart item count from state if available
  return (
    <button
      onClick={() => navigate("/cart")}
      className="p-2 cursor-pointer text-primary relative"
    >
      <ShoppingBag size={20} strokeWidth={1} />
      <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-1">
        0
      </span>
    </button>
  );
};

export default CartIcon;
