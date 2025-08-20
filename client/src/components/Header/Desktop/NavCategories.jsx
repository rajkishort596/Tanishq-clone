import React, { useState } from "react";
import { Link } from "react-router-dom";
import images from "../../../utils/images";
import MegaMenu from "./MegaMenu";

export const NavCategories = ({ categories, collctions }) => {
  const ParentCategories = categories.filter((cat) => cat.parent === null);

  const [activeCategory, setActiveCategory] = useState({ slug: "rings" });
  const [showCollectionsMegaMenu, setShowCollectionsMegaMenu] = useState(false);

  return (
    <ul className="flex w-full space-x-6 justify-between items-end text-sm font-medium">
      {ParentCategories.map((cat) => (
        <li
          key={cat?._id}
          onMouseEnter={() => {
            setActiveCategory(cat);
            setShowCollectionsMegaMenu(false);
          }}
          onMouseLeave={() => setActiveCategory(null)}
        >
          <Link
            to={`/shop/${cat?.slug}`}
            onClick={() => setActiveCategory(null)}
            className={`relative flex items-center transition-colors duration-200 py-4 px-2 
                        ${
                          activeCategory?.slug === cat.slug
                            ? "text-primary after:scale-x-100"
                            : "text-[#413f3a] hover:text-primary after:scale-x-0 hover:after:scale-x-100"
                        } 
                        after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 
                        after:bottom-0 after:h-[3px] after:w-full after:bg-primary after:rounded-sm
                        after:origin-center after:transition-transform after:duration-300`}
          >
            <span className="inline-block mr-2">
              <img src={cat?.icon?.url} className="w-5 h-auto" />
            </span>
            {cat?.name}
          </Link>

          {activeCategory?.slug === cat.slug && (
            <div className="absolute left-0 top-full min-h-[558.35px] w-full bg-white shadow-lg">
              <MegaMenu
                category={cat}
                categories={categories}
                setActiveCategory={setActiveCategory}
              />
            </div>
          )}
        </li>
      ))}

      {/* Collections */}
      <li
        key="collections"
        onMouseEnter={() => {
          setActiveCategory(null);
          setShowCollectionsMegaMenu(true);
        }}
        onMouseLeave={() => setShowCollectionsMegaMenu(false)}
      >
        <Link
          to={`/shop/collections`}
          onClick={() => {
            setActiveCategory(null);
            setShowCollectionsMegaMenu(false);
          }}
          className={`relative flex items-center transition-colors duration-200 py-4 px-2 
                      ${
                        showCollectionsMegaMenu
                          ? "text-primary after:scale-x-100"
                          : "text-[#413f3a] hover:text-primary after:scale-x-0 hover:after:scale-x-100"
                      } 
                      after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 
                      after:bottom-0 after:h-[3px] after:w-full after:bg-primary after:rounded-sm
                      after:origin-center after:transition-transform after:duration-300`}
        >
          <span className="inline-block mr-2">
            <img src={images.collectionIcon} className="w-5 h-auto" />
          </span>
          Collections
        </Link>

        {showCollectionsMegaMenu && (
          <div className="absolute left-0 top-full min-h-[558.35px] w-full bg-white shadow-lg">
            <MegaMenu
              isCollections={true}
              collections={collctions || []}
              setActiveCategory={() => setShowCollectionsMegaMenu(false)}
            />
          </div>
        )}
      </li>
    </ul>
  );
};
