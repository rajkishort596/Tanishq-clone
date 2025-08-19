import React from "react";
import { User, Heart, ShoppingBag } from "lucide-react";

export const NavIcons = () => {
  return (
    <div className="flex items-center space-x-4">
      <button className="p-2 text-primary">
        <User size={20} strokeWidth={1} />
      </button>
      <button className="p-2 text-primary">
        <Heart size={20} strokeWidth={1} />
      </button>
      <button className="p-2 text-primary relative">
        <ShoppingBag size={20} strokeWidth={1} />
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-1">
          2
        </span>
      </button>
    </div>
  );
};
