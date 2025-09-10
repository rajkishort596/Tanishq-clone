import React from "react";
import { User, Heart, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const NavIcons = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center space-x-4">
      <button className="p-2 text-primary">
        <User size={20} strokeWidth={1} />
      </button>
      <button className="p-2 text-primary">
        <Heart size={20} strokeWidth={1} />
      </button>
      <button
        onClick={() => navigate("/cart")}
        className="p-2 cursor-pointer text-primary relative"
      >
        <ShoppingBag size={20} strokeWidth={1} />
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-1">
          0
        </span>
      </button>
    </div>
  );
};
