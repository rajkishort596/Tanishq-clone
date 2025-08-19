import React, { useState } from "react";
import { Link } from "react-router-dom";
import images from "../../../utils/images";
import MegaMenu from "./MegaMenu";

export const NavCategories = ({ categories }) => {
  const ParentCategories = categories.filter((cat) => cat.parent === null);

  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <ul className="flex w-full space-x-6 justify-between items-start text-sm font-medium">
      {ParentCategories.map((cat) => (
        <li
          key={cat?._id}
          onMouseEnter={() => setActiveCategory(cat)}
          onMouseLeave={() => setActiveCategory(null)}
        >
          <Link
            to={`/shop/${cat?.slug}`}
            onClick={() => setActiveCategory(null)}
            className={`flex items-center transition-colors duration-200 py-4 ${
              activeCategory?.slug === cat.slug
                ? "text-primary"
                : "text-[#413f3a] hover:text-primary"
            }`}
          >
            <span className="inline-block mr-2">
              <img src={cat?.icon?.url} className="w-5 h-auto" />
            </span>
            {cat?.name}
          </Link>

          {activeCategory?.slug === cat.slug && (
            <div className="absolute left-0 top-full w-full">
              <MegaMenu category={cat} categories={categories} />
            </div>
          )}
        </li>
      ))}

      {/* Collections */}
      <li key="collections">
        <Link
          to={`/shop/collections`}
          className="hover:text-primary text-[#413f3a] transition-colors duration-200 flex items-center py-4"
        >
          <span className="inline-block mr-2">
            <img src={images.collectionIcon} className="w-5 h-auto" />
          </span>
          Collections
        </Link>
      </li>
    </ul>
  );
};
