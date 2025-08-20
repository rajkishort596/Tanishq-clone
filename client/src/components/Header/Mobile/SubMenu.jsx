import React from "react";
import { ArrowLeft, X } from "lucide-react";
import Banner from "./Banner";
import { filters } from "../../../utils/filterConfig";
import FilterSection from "./FilterSection";
import { useNavigate } from "react-router-dom";
import images from "../../../utils/images";

const SubMenu = ({
  selectedCategory,
  setSelectedCategory,
  subCategories,
  onClose,
  isCollection = false,
}) => {
  const navigate = useNavigate();

  const handleFilterSelect = (filterKey, value) => {
    const queryParams = new URLSearchParams({ [filterKey]: value }).toString();
    navigate(`/shop/${selectedCategory?.slug}?${queryParams}`);
    onClose();
  };

  const handleSubCategoryClick = (sub) => {
    navigate(`/shop/${selectedCategory?.slug}/${sub?.slug}`);
    onClose();
  };

  const handleCollectionClick = (collection) => {
    const slug = collection?.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    navigate(`/shop/${slug}`);
    onClose();
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center">
        {/* Back button */}
        <button
          onClick={() => setSelectedCategory(null)}
          className="flex items-center text-sm font-medium"
        >
          <ArrowLeft strokeWidth={1} />
        </button>
        {/* Title */}
        <div className="flex items-center mx-auto gap-2">
          {isCollection ? (
            <img src={images.collectionIcon} className="w-6 h-6" />
          ) : (
            <img src={selectedCategory?.icon?.url} className="w-6 h-6" />
          )}
          <h2 className="font-fraunces text-lg">
            {isCollection ? "Collections" : selectedCategory?.name}
          </h2>
        </div>
        {/* Close button */}
        <button onClick={onClose} className="p-1 rounded-full bg-gray-100">
          <X size={24} />
        </button>
      </div>

      {/* Collections view */}
      {isCollection ? (
        <div className="my-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
            {subCategories.map((collection) => (
              <button
                key={collection._id}
                onClick={() => handleCollectionClick(collection)}
                className="border border-[#e2e1df] rounded-lg py-2 px-[10px] text-sm font-IBM-Plex font-normal"
              >
                {collection.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Subcategories */}
          <div className="my-4">
            <span className="text-lg font-fraunces font-normal">Category</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              {subCategories.map((sub) => (
                <button
                  key={sub._id}
                  onClick={() => handleSubCategoryClick(sub)}
                  className="border border-[#e2e1df] rounded-lg py-2 px-[10px] text-sm font-IBM-Plex font-normal"
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>

          {/* Banner */}
          <div className="w-full mb-4 rounded-lg overflow-hidden">
            <Banner categoryName={selectedCategory?.name} onClose={onClose} />
          </div>

          {/* Filters */}
          <FilterSection
            title="Price"
            options={filters.price(selectedCategory?.name)}
            onSelect={(val) => handleFilterSelect("price", val)}
          />
          <FilterSection
            title="Occasion"
            options={filters.occasion}
            onSelect={(val) => handleFilterSelect("occasion", val)}
          />
          <FilterSection
            title="Gender"
            options={filters.gender(selectedCategory?.name)}
            onSelect={(val) => handleFilterSelect("gender", val)}
          />
          <FilterSection
            title="Metals & Stones"
            options={filters.metals}
            onSelect={(val) => handleFilterSelect("metal", val)}
          />
        </>
      )}
    </div>
  );
};

export default SubMenu;
