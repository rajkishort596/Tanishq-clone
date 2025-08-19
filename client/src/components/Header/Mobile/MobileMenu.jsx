import React, { useState } from "react";
import { ChevronRight, User, X } from "lucide-react";
import MainMenu from "./MainMenu";
import Promotion from "./Promotion";
import SubMenu from "./SubMenu";
import images from "../../../utils/images";

export const MobileMenu = ({ onClose, categories, collections }) => {
  const ParentCategories = categories.filter((cat) => cat.parent === null);

  // Track selected category / section
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewCollections, setViewCollections] = useState(false);

  // Recursive function to get all subcategories of a category
  const getSubCategories = (categories, parentId) => {
    const directSubs = categories.filter((cat) => cat.parent?._id === parentId);

    return directSubs.flatMap((sub) => [
      sub,
      ...getSubCategories(categories, sub._id),
    ]);
  };

  const subCategories = selectedCategory
    ? getSubCategories(categories, selectedCategory._id)
    : [];

  return (
    <div className="lg:hidden fixed inset-0 bg-white z-50 shadow-lg p-6 overflow-y-auto">
      {/* If inside a category */}
      {selectedCategory ? (
        <SubMenu
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          subCategories={subCategories}
          onClose={onClose}
        />
      ) : viewCollections ? (
        <SubMenu
          selectedCategory={{ name: "Collections" }}
          setSelectedCategory={() => setViewCollections(false)}
          subCategories={collections || []}
          onClose={onClose}
          isCollection={true}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <button className="p-2 hover:text-primary">
              <User size={24} strokeWidth={1} className="text-primary" />
            </button>
            <button onClick={onClose} className="p-1 rounded-full bg-gray-100">
              <X size={24} />
            </button>
          </div>

          {/* Promo */}
          <Promotion />

          {/* Main Categories */}
          <MainMenu
            categories={ParentCategories}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Collections */}
          <li
            key="collections"
            onClick={() => setViewCollections(true)}
            className="py-4 border-b text-sm md:text-lg border-[#f5f5f4] list-none"
          >
            <button className="w-full flex gap-4 items-center font-fraunces text-base hover:text-primary">
              <img src={images.collectionIcon} className="w-5 md:w-8" />
              Collections
              <ChevronRight strokeWidth={1} className="ml-auto" />
            </button>
          </li>
        </>
      )}
    </div>
  );
};
