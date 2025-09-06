import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { filterOptions } from "./FilterOptions.js";
import RenderSection from "./RenderSection";
import Button from "./Button";
import { sections } from "./Sections.js";

const FilterContent = ({ onApplyFilter }) => {
  const [openSection, setOpenSection] = useState("price");
  const [searchParams, setSearchParams] = useSearchParams();
  const [localFilters, setLocalFilters] = useState({});

  useEffect(() => {
    const synced = {};
    Object.keys(filterOptions).forEach((key) => {
      if (key === "price") {
        const min = searchParams.get("minPrice");
        const max = searchParams.get("maxPrice");
        if (min || max) synced.price = { min, max };
      } else {
        const val = searchParams.get(key);
        if (val) synced[key] = val;
      }
    });
    setLocalFilters(synced);
  }, [searchParams]);

  const handleToggle = (section) => {
    setOpenSection(openSection === section ? "" : section);
  };

  const handlePriceFilter = (min, max) => {
    setLocalFilters((prev) => ({ ...prev, price: { min, max } }));
  };

  const handleFilter = (key, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const onClearFilter = () => {
    setLocalFilters({});
    setSearchParams({});
    onApplyFilter();
  };

  const onShowResults = () => {
    const params = {};
    Object.entries(localFilters).forEach(([key, val]) => {
      if (!val) return;
      if (key === "price") {
        if (val.min) params.minPrice = val.min;
        if (val.max) params.maxPrice = val.max;
      } else {
        params[key] = val;
      }
    });
    setSearchParams(params);
    onApplyFilter();
  };

  const getFilterCount = (key) => {
    if (key === "price") return localFilters.price ? 1 : 0;
    return localFilters[key] ? 1 : 0;
  };

  const isFilterActive = (key, option) => {
    if (key === "price") {
      return (
        localFilters.price?.min?.toString() === option.min?.toString() &&
        localFilters.price?.max?.toString() === option.max?.toString()
      );
    }
    return localFilters[key] === option.value;
  };

  return (
    <div className="lg:p-6 mx-4 rounded-xl border border-[#e2e1ec] flex flex-col items-center font-IBM-Plex">
      {sections.map(({ title, key, options }) => (
        <RenderSection
          key={key}
          title={title}
          sectionKey={key}
          options={options}
          getFilterCount={getFilterCount}
          handleFilter={handleFilter}
          handlePriceFilter={handlePriceFilter}
          handleToggle={handleToggle}
          isFilterActive={isFilterActive}
          openSection={openSection}
        />
      ))}

      {/* Footer Buttons */}
      <div className="fixed bottom-0 left-0 right-0 w-full lg:w-1/2 xl:w-1/3 p-2 sm:p-3 lg:p-4 bg-white flex gap-4 sm:gap-6 xl:gap-8 justify-between items-center">
        <Button
          onClickHandler={onClearFilter}
          className="text-black border border-primary hover:bg-red-50 bg-[#f2e7e9]"
          label="Clear Filters"
        />
        <Button
          onClickHandler={onShowResults}
          className="text-white bg-primary"
          label="Show Results"
        />
      </div>
    </div>
  );
};

export default FilterContent;
