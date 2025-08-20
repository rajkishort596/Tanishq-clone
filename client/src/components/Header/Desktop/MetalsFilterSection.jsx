import React from "react";
import { Link } from "react-router-dom";

const MetalsFilterSection = ({ options, onSelect }) => {
  // Split options into two equal columns
  const mid = Math.ceil(options.length / 2);
  const leftCol = options.slice(0, mid);
  const rightCol = options.slice(mid);

  return (
    <div className="flex">
      {/* Left Column */}
      <div className="flex-1 p-6 border-r border-b border-[#ececea]">
        {leftCol.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(opt.value)}
            className="flex items-center cursor-pointer space-x-3 w-full text-left group hover:text-primary hover:bg-[#f5f5f4] transition-colors duration-200 p-4 hover:rounded-lg hover:shadow-lg"
          >
            <div className="bg-[#f5f5f4] flex items-center justify-center rounded-full p-2 w-11 h-11 overflow-hidden border border-transparent group-hover:border-primary transition-colors duration-200">
              <img
                src={opt.img}
                alt={opt.label}
                className="w-6 h-6 rounded-full"
              />
            </div>
            <span className="text-base font-medium text-gray-800 group-hover:text-primary">
              {opt.label}
            </span>
          </button>
        ))}
      </div>

      {/* Divider is handled by border-x on parent */}

      {/* Right Column */}
      <div className="flex-1 p-6 border-r border-b border-[#ececea]">
        {rightCol.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(opt.value)}
            className="flex items-center space-x-3 w-full text-left group hover:bg-[#f5f5f4] transition-colors duration-200 p-4 hover:rounded-lg hover:shadow-lg"
          >
            <div className="bg-[#f5f5f4] flex items-center justify-center rounded-full p-2 w-11 h-11 overflow-hidden border border-transparent group-hover:border-primary transition-colors duration-200">
              <img
                src={opt.img}
                alt={opt.label}
                className="w-6 h-6 rounded-full"
              />
            </div>
            <span className="text-base font-medium text-gray-800 group-hover:text-primary">
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MetalsFilterSection;
