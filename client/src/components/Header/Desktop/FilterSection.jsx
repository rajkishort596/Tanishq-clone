import React from "react";
import { Link } from "react-router-dom";

const FilterSection = ({ options, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6">
      {options.map((opt, i) => (
        <button
          key={i}
          onClick={() => onSelect(opt.value)}
          className="flex flex-col cursor-pointer items-center p-[5px] text-center group rounded-xl hover:border-1 hover:border-[#c09293] hover:shadow-[0_20px_26px_-15px_#490a0c45]"
        >
          <div className="w-full h-full rounded-xl overflow-hidden shadow-md border border-gray-200 group-hover:shadow-lg transition">
            <img
              src={opt.img}
              alt={opt.label}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="mt-3 text-sm font-medium text-gray-700 group-hover:text-black">
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterSection;
