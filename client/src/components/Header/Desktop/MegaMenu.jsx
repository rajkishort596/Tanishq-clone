import React, { useState } from "react";
import images from "../../../utils/images";
import { TrendingUp } from "lucide-react";
import Banner from "./Banner";
import { Link } from "react-router-dom";

const MegaMenu = ({ category, categories = [] }) => {
  const [activeTab, setActiveTab] = useState("Category");

  // Recursive function to get all subcategories of a category
  const getSubCategories = (categories, parentId) => {
    const directSubs = categories.filter((cat) => cat.parent?._id === parentId);

    return directSubs.flatMap((sub) => [
      sub,
      ...getSubCategories(categories, sub._id),
    ]);
  };

  const subCategories = category
    ? getSubCategories(categories, category._id)
    : [];

  return (
    <div className="absolute left-0 top-full min-h-[558.35px] w-full bg-white shadow-lg">
      <div className="flex gap-6 p-6 border-t border-[#ececea]">
        {/* LEFT NAVIGATION */}
        <div className="w-40">
          {["Category", "Price", "Occasion", "Gender", "Metals & Stones"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-3 py-2 rounded-lg mb-2 font-medium font-fraunces cursor-pointer ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-[#f3e9e9] to-[#f2e7e9] text-primary font-semibold border border-[#d9bdbe]"
                    : "text-gray-700 hover:text-primary"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* CENTER CONTENT */}
        <div className="flex-1 border-l border-[#ececea] px-6">
          {activeTab === "Category" && (
            <>
              {/* Subcategories Grid */}
              <div className="grid grid-cols-3 divide-x divide-[#ececea]">
                {[0, 1, 2].map((colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-6 p-4">
                    {subCategories
                      .filter((_, i) => i % 3 === colIndex) // Distribute items into 3 cols
                      .map((sub) => (
                        <Link
                          key={sub._id}
                          to={`/shop/${category.slug}/${sub.slug}`}
                          className="flex items-center gap-3 group hover:text-primary hover:bg-[#f5f5f4] transition-colors duration-200 p-4 hover:rounded-lg hover:shadow-lg"
                        >
                          <div className="bg-[#f5f5f4] rounded-full p-2 w-11 h-11 overflow-hidden flex-shrink-0 border border-transparent group-hover:border-primary transition-colors duration-200">
                            <img
                              src={sub.icon?.url}
                              alt={sub.name}
                              className="w-full h-full object-contain rounded-full"
                            />
                          </div>
                          <span className="text-sm font-medium">
                            {sub.name}
                          </span>
                        </Link>
                      ))}
                  </div>
                ))}
              </div>

              {/* Small banner below subcategories */}
              <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    From Everyday Glow to Extraordinary Sparkle.
                  </h4>
                  <p className="text-sm text-gray-600">3000+ Designs Await.</p>
                </div>
                <a
                  href={`/shop/${category.slug}`}
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  View All
                </a>
              </div>
            </>
          )}

          {activeTab === "Price" && (
            <>
              <div className="p-4 text-gray-600">Price filters go here</div>
              {/* Small banner below subcategories */}
              <div className="mt-6 p-4 bg-red-50 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="font-medium">
                    From Everyday Glow to Extraordinary Sparkle.
                  </h4>
                  <p className="text-sm text-gray-600">3000+ Designs Await.</p>
                </div>
                <a
                  href={`/shop/${category.slug}`}
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  View All
                </a>
              </div>
            </>
          )}

          {activeTab === "Occasion" && (
            <div className="p-4 text-gray-600">Occasion filters go here</div>
          )}
          {activeTab === "Gender" && (
            <div className="p-4 text-gray-600">Gender filters go here</div>
          )}
          {activeTab === "Metals & Stones" && (
            <div className="p-4 text-gray-600">
              Metals & Stones filters go here
            </div>
          )}
        </div>

        {/* RIGHT SIDE BANNER */}
        <div className="w-1/4">
          <div className="h-[300px] w-[300px] mb-3">
            {/* <img
              src={images.elanDesktopBanner}
              alt="Banner"
              className="rounded-lg h-full w-full object-center object-cover"
            /> */}
            <Banner categoryName={category?.name} />
          </div>

          <h3 className="font-normal text-xl font-fraunces">
            Effortless style to make everyday sparkle.
          </h3>
          <a
            href={`/shop/${category.slug}`}
            className="text-primary underline mt-2 text-lg font-fraunces flex items-center gap-1"
          >
            <span>Shop now</span>
            <TrendingUp strokeWidth={1} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
