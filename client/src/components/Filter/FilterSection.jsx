import React, { useState, useMemo } from "react";
import { FunnelIcon, ChevronDown, Plus, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import FilterModal from "./FilterModal";
import FilterContent from "./FilterContent";

const FilterSection = () => {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAll, setShowAll] = useState(false);

  //  filter list (you can extend this dynamically later)
  const filters = [
    { key: "price", label: "₹25000 - ₹50000", type: "range" },
    { key: "gender", label: "Women", value: "women" },
    { key: "gender", label: "Men", value: "men" },
    { key: "gender", label: "Kids", value: "kids" },
    { key: "gender", label: "Unisex", value: "unisex" },
    { key: "metal", label: "Gold Jewellery", value: "gold" },
    { key: "metal", label: "Platinum Jewellery", value: "platinum" },
    { key: "purity", label: "18K", value: "18k" },
    { key: "purity", label: "22K", value: "22k" },
    { key: "occasion", label: "Modern Wear", value: "modern wear" },
    { key: "occasion", label: "Daily Wear", value: "daily wear" },
    { key: "occasion", label: "Bridal Wear", value: "bridal wear" },
    { key: "occasion", label: "Engagement", value: "engagement" },
  ];

  // Reorder: Active filters first
  const orderedFilters = useMemo(() => {
    return [...filters].sort((a, b) => {
      const aActive =
        a.type === "range"
          ? searchParams.get("minPrice") && searchParams.get("maxPrice")
          : searchParams.get(a.key) === a.value;
      const bActive =
        b.type === "range"
          ? searchParams.get("minPrice") && searchParams.get("maxPrice")
          : searchParams.get(b.key) === b.value;
      return bActive - aActive; // active ones first
    });
  }, [filters, searchParams]);

  const activeFilters = Array.from(searchParams.keys());
  const activeFilterCount = activeFilters.length;

  const handleFilterClick = (filter) => {
    setSearchParams((prevParams) => {
      if (filter.type === "range") {
        if (prevParams.get("minPrice")) {
          prevParams.delete("minPrice");
          prevParams.delete("maxPrice");
        } else {
          prevParams.set("minPrice", "25000");
          prevParams.set("maxPrice", "50000");
        }
      } else {
        if (prevParams.get(filter.key) === filter.value) {
          prevParams.delete(filter.key);
        } else {
          prevParams.set(filter.key, filter.value);
        }
      }
      return prevParams;
    });
  };

  const isFilterActive = (filter) => {
    if (filter.type === "range") {
      return searchParams.get("minPrice") && searchParams.get("maxPrice");
    }
    return searchParams.get(filter.key) === filter.value;
  };

  // Decide how many filters to show
  const visibleFilters = showAll ? orderedFilters : orderedFilters.slice(0, 4);

  return (
    <>
      <div className="flex flex-wrap gap-3 items-center justify-between mb-8 font-IBM-Plex">
        <div className="flex flex-wrap items-center gap-4">
          {/* Filter Button */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center border border-[#e0e0e0] rounded-4xl text-black cursor-pointer relative
             text-xs sm:text-sm lg:text-base
             px-3 py-1.5 sm:px-6 sm:py-2 lg:px-8 lg:py-[10px]"
          >
            <FunnelIcon
              size={14}
              strokeWidth={1}
              className="inline-block mr-1 sm:mr-2 lg:size-4"
            />
            Filter
            {activeFilterCount > 0 && (
              <span
                className="absolute top-1/2 transform -translate-y-1/2 right-7 sm:right-12 lg:right-14 
                     bg-red text-white rounded-full flex items-center justify-center
                     text-[6px] sm:text-[10px] lg:text-[12px] 
                     h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5"
              >
                {activeFilterCount}
              </span>
            )}
            <ChevronDown
              size={14}
              strokeWidth={1}
              className="inline-block ml-5 sm:ml-8 lg:ml-10 lg:size-4 text-primary"
            />
          </button>

          {/* Dynamic filter buttons */}
          {visibleFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => handleFilterClick(filter)}
              className={`flex items-center border border-[#e0e0e0] rounded-4xl text-black cursor-pointer
                text-xs sm:text-sm lg:text-base
                px-2.5 py-1.5 sm:px-4 sm:py-2 lg:px-8 lg:py-[10px]
                ${isFilterActive(filter) ? "bg-[#f6f6f6]" : "bg-transparent"}`}
            >
              <span
                className="bg-[#fbe9ea] flex justify-center items-center rounded-full mr-1 sm:mr-2
                 p-0.5 sm:p-1 lg:p-1.5"
              >
                {isFilterActive(filter) ? (
                  <X strokeWidth={1} size={12} className="text-primary" />
                ) : (
                  <Plus strokeWidth={1} size={12} className="text-primary" />
                )}
              </span>
              {filter.label}
            </button>
          ))}

          {/* See More / See Less toggle */}
          {orderedFilters.length > 4 && (
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="text-primary text-sm font-semibold cursor-pointer"
            >
              {showAll ? "-See Less" : "+See More"}
            </button>
          )}
        </div>
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      >
        <FilterContent onApplyFilter={() => setIsFilterModalOpen(false)} />
      </FilterModal>
    </>
  );
};

export default FilterSection;
