import React from "react";
import TanishqIcon from "../assets/images/Spinner-Icon.png";

const Spinner = () => {
  return (
    <div className="flex justify-center items-center w-32 h-32 relative">
      {/* Arc spinner using SVG */}
      <svg className="w-full h-full animate-spin" viewBox="0 0 100 100">
        <defs>
          <linearGradient
            id="spinnerGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#7b2323" />
            <stop offset="100%" stopColor="#e6c6c6" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#spinnerGradient)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="240"
          strokeDashoffset="60"
        />
      </svg>

      {/* Center logo image */}
      <img
        src={TanishqIcon}
        alt="Tanishq Spinner Icon"
        className="absolute w-12 h-12 object-contain"
      />
    </div>
  );
};

export default Spinner;
