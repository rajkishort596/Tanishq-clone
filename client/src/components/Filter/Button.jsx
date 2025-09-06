import { ChevronRight } from "lucide-react";
import React from "react";

const Button = ({ onClickHandler, className = "", label }) => {
  return (
    <button
      className={` cursor-pointer w-full font-semibold 
               text-xs sm:text-sm lg:text-base 
               py-1.5 px-3 sm:py-2 sm:px-4 
               rounded-full transition ${className}`}
      onClick={onClickHandler}
    >
      {/* Clear Filters */}
      {label}
      <ChevronRight size={14} className="inline-block ml-1 sm:ml-2 lg:ml-4" />
    </button>
  );
};

export default Button;
