import { ChevronRight } from "lucide-react";
import React from "react";

const CategoryList = ({ categories, setSelectedCategory }) => {
  return (
    <ul>
      {categories.map((cat) => (
        <li
          key={cat._id}
          className="py-4 border-b text-sm md:text-lg border-[#f5f5f4]"
        >
          <button
            onClick={() => setSelectedCategory(cat)}
            className="w-full flex gap-4 items-center font-fraunces text-base hover:text-primary"
          >
            <img src={cat?.icon?.url} className="w-5 md:w-8" />
            {cat?.name}
            <ChevronRight strokeWidth={1} className="ml-auto" />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
