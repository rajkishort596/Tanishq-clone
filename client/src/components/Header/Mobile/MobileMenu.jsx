import React, { useState } from "react";
import { ChevronRight, User, X } from "lucide-react";
import MainMenu from "./MainMenu";
import Promotion from "./Promotion";
import SubMenu from "./SubMenu";
import images from "../../../utils/images";

export const MobileMenu = ({ onClose, categories, collections }) => {
  const ParentCategories = categories.filter(
    (cat) => !cat.parent || cat.parent.length === 0
  );

  // Track selected category / section
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [viewCollections, setViewCollections] = useState(false);

  // Updated recursive function to get all subcategories, including nested ones.
  // This now checks if the parent field is an object and extracts its ID.
  const getSubCategories = (categories, parentId) => {
    // Find categories whose parent is the given parentId
    const directSubs = categories.filter((cat) => {
      // Handle cases where parent is null or an empty array
      if (!cat.parent || cat.parent.length === 0) {
        return false;
      }
      // If parent is an array, use some() to check for the parentId
      if (Array.isArray(cat.parent)) {
        return cat.parent.some((p) => p._id === parentId);
      }
      // If parent is an object, check its _id
      return cat.parent._id === parentId;
    });

    // Recursively find sub-sub-categories
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
