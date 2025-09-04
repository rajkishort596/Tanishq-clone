import React, { useMemo, forwardRef } from "react";

/**
 * Recursively gathers all descendant categories of categoryId.
 */
const findSubCategories = (categoryId, allCategories, acc = []) => {
  allCategories.forEach((c) => {
    // normalize parents into an array of IDs
    const parentIds = Array.isArray(c.parent)
      ? c.parent.map((p) => (typeof p === "object" ? p._id : p))
      : [];

    if (parentIds.includes(categoryId) && !acc.find((a) => a._id === c._id)) {
      acc.push(c);
      findSubCategories(c._id, allCategories, acc);
    }
  });

  return acc;
};

const SubCategorySelect = forwardRef(
  ({ categories = [], selectedCategory, error, label, ...props }, ref) => {
    const subCategories = useMemo(() => {
      if (!selectedCategory) return [];
      return findSubCategories(selectedCategory, categories);
    }, [selectedCategory, categories]);

    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          {selectedCategory
            ? label || "Sub Category"
            : "Select Category to show subcategories"}
        </label>
        <select
          ref={ref}
          {...props}
          disabled={!selectedCategory || subCategories.length === 0}
          className={`px-4 py-2 rounded-md border transition outline-none
            ${
              error
                ? "border-red-500"
                : "border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)]"
            }
            ${
              !selectedCategory || subCategories.length === 0
                ? "disabled:bg-gray-100"
                : ""
            }`}
        >
          <option value="">
            {selectedCategory
              ? subCategories.length
                ? "-- Select Sub Category --"
                : "No subcategories available"
              : "-- Select Category first --"}
          </option>
          {subCategories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

export default SubCategorySelect;
