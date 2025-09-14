import React, { useState } from "react";
import images from "../../../utils/images";
import { TrendingUp, View } from "lucide-react";
import Banner from "./Banner";
import { Link, useNavigate } from "react-router-dom";
import { filters } from "../../../utils/filterConfig";
import FilterSection from "./FilterSection";
import BannerBottom from "./BannerBottom";
import MetalsFilterSection from "./MetalsFilterSection";

const MegaMenu = ({
  category,
  categories = [],
  collections,
  setActiveCategory,
  isCollections,
}) => {
  const [activeTab, setActiveTab] = useState("Category");
  const navigate = useNavigate();

  //  recursive function to get all subcategories, including nested ones.
  const getSubCategories = (allCategories, parentId) => {
    // Find categories whose parent is the given parentId
    const directSubs = allCategories.filter((cat) => {
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
      ...getSubCategories(allCategories, sub._id),
    ]);
  };

  const subCategories = category
    ? getSubCategories(categories, category._id)
    : [];

  const handleFilterSelect = (filterKey, value) => {
    let queryParams = {};
    if (filterKey === "price" && value.includes("=")) {
      // Parse the value string into key-value pairs
      value.split("&").forEach((pair) => {
        const [k, v] = pair.split("=");
        queryParams[k] = v;
      });
    } else if (
      filterKey === "metal" &&
      ["rose gold", "white gold", "white", "diamond"].includes(value)
    ) {
      if (value === "diamond") {
        queryParams.productType = value;
      } else {
        queryParams[filterKey] = "gold";
        queryParams.metalColor = value;
      }
    } else {
      queryParams[filterKey] = value;
    }
    const search = new URLSearchParams(queryParams).toString();
    navigate(`/shop/${category?.slug}?${search}`);
    setActiveCategory(null);
  };

  const handleCollectionClick = (collection) => {
    navigate(`/shop/${collection?.slug}`);
    setActiveCategory(null);
  };

  // Conditionally render based on isCollections prop
  if (isCollections) {
    return (
      <div className="flex gap-6 border-t border-[#ececea]">
        {/* LEFT NAVIGATION */}
        <div className="w-45 py-6 pl-6">
          <button
            onClick={() => {
              navigate("/shop/collections");
              setActiveCategory(null);
            }}
            className={`w-full text-left px-4 py-3 rounded-lg mb-2 font-fraunces cursor-pointer leading-none bg-gradient-to-r from-[#f3e9e9] to-[#f2e7e9] text-primary font-semibold border border-[#d9bdbe]`}
          >
            View All
          </button>
        </div>
        {/* CENTER CONTENT */}
        <div className="flex-1 border-l border-r border-[#ececea]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6">
            {collections
              ?.sort(() => Math.random() - 0.5)
              .slice(0, 8)
              .map((collection) => (
                <button
                  key={collection?._id}
                  onClick={() => handleCollectionClick(collection)}
                  className="flex flex-col cursor-pointer items-center p-[5px] text-center group rounded-xl hover:border-1 hover:border-[#c09293] hover:shadow-[0_20px_26px_-15px_#490a0c45]"
                >
                  <div className="w-full h-full rounded-xl overflow-hidden shadow-md border border-gray-200 group-hover:shadow-lg transition">
                    <img
                      src={collection?.image?.url}
                      alt={collection?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="mt-3 text-sm font-medium text-gray-700 group-hover:text-black">
                    {collection?.name}
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* RIGHT SIDE BANNER */}
        <div className="w-1/4 p-6">
          <div className="h-[300px] w-[300px] mb-3 bg-red-50">
            <Link to={"/shop/elan"} onClick={() => setActiveCategory(null)}>
              <img
                className="rounded-lg h-full w-full object-center object-cover"
                src={images.elanDesktopBanner}
                alt="Elan"
              />
            </Link>
          </div>

          <h3 className="font-normal text-xl font-fraunces">
            Elan - My World. My Story.
          </h3>
          <Link
            to={`/shop/elan`}
            onClick={() => setActiveCategory(null)}
            className="text-primary underline mt-2 text-lg font-fraunces flex items-center gap-1"
          >
            <span>Explore Now</span>
            <TrendingUp strokeWidth={1} />
          </Link>
        </div>
      </div>
    );
  }

  // Original MegaMenu code for categories
  return (
    <div className="flex gap-6 border-t border-[#ececea]">
      {/* LEFT NAVIGATION */}
      <div className="w-45 py-6 pl-6">
        {["Category", "Price", "Occasion", "Gender", "Metals & Stones"]
          .filter(
            (tab) =>
              !(tab === "Metals & Stones" && category?.name === "Diamond")
          )
          .map((tab) => (
            <button
              key={tab}
              onMouseEnter={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 font-medium font-fraunces cursor-pointer leading-none ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#f3e9e9] to-[#f2e7e9] text-primary font-semibold border border-[#d9bdbe]"
                  : "text-gray-700 hover:text-primary"
              }`}
            >
              {tab}
            </button>
          ))}
      </div>

      {/* CENTER CONTENT */}
      <div className="flex-1 border-l border-r border-[#ececea]">
        {activeTab === "Category" && (
          <>
            {/* Subcategories Grid */}
            <div className="grid grid-cols-3 ">
              {[0, 1, 2].map((colIndex) => (
                <div
                  key={colIndex}
                  className="flex flex-col gap-2 p-4 border-r border-b border-[#ececea]"
                >
                  {subCategories
                    .filter((_, i) => i % 3 === colIndex) // Distribute items into 3 cols
                    .map((sub) => (
                      <Link
                        key={sub._id}
                        to={`/shop/${category.slug}/${sub.slug}`}
                        onClick={() => setActiveCategory(null)}
                        className="flex items-center gap-3 group hover:text-primary hover:bg-[#f5f5f4] transition-colors duration-200 p-4 hover:rounded-lg hover:shadow-lg"
                      >
                        <div className="bg-[#f5f5f4] rounded-full p-2 w-11 h-11 overflow-hidden flex-shrink-0 border border-transparent group-hover:border-primary transition-colors duration-200">
                          <img
                            src={sub.icon?.url}
                            alt={sub.name}
                            className="w-full h-full object-contain rounded-full"
                          />
                        </div>
                        <span className="text-sm font-medium">{sub.name}</span>
                      </Link>
                    ))}
                </div>
              ))}
            </div>

            {/* Small banner below subcategories */}
            <BannerBottom
              category={category}
              setActiveCategory={setActiveCategory}
            />
          </>
        )}

        {activeTab === "Price" && (
          <>
            <FilterSection
              options={filters.price(category?.name)}
              onSelect={(val) => handleFilterSelect("price", val)}
            />
            {/* Small banner below subcategories */}
            <BannerBottom category={category} />
          </>
        )}

        {activeTab === "Occasion" && (
          <>
            <FilterSection
              options={filters.occasion}
              onSelect={(val) => handleFilterSelect("occasion", val)}
            />
            {/* Small banner below subcategories */}
            <BannerBottom category={category} />
          </>
        )}
        {activeTab === "Gender" && (
          <>
            <FilterSection
              options={filters.gender(category?.name)}
              onSelect={(val) => handleFilterSelect("gender", val)}
            />
            {/* Small banner below subcategories */}
            <BannerBottom category={category} />
          </>
        )}
        {activeTab === "Metals & Stones" && category?.name !== "Diamond" && (
          <>
            <MetalsFilterSection
              options={filters.metals(category?.name)}
              onSelect={(val) => handleFilterSelect("metal", val)}
            />
            {/* Small banner below subcategories */}
            <BannerBottom category={category} />
          </>
        )}
      </div>

      {/* RIGHT SIDE BANNER */}
      <div className="w-1/4 p-6">
        <div className="h-[300px] w-[300px] mb-3">
          <Banner
            categoryName={category?.name}
            setActiveCategory={setActiveCategory}
          />
        </div>

        <h3 className="font-normal text-xl font-fraunces">
          Effortless style to make everyday sparkle.
        </h3>
        <Link
          to={`/shop/${category.slug}`}
          onClick={() => setActiveCategory(null)}
          className="text-primary underline mt-2 text-lg font-fraunces flex items-center gap-1"
        >
          <span>Shop now</span>
          <TrendingUp strokeWidth={1} />
        </Link>
      </div>
    </div>
  );
};

export default MegaMenu;
