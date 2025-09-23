// src/components/Form/CategorySelect.jsx
import React, { useMemo, forwardRef } from "react";

const CategorySelect = forwardRef(
  (
    { categories = [], error, label = "Category", required = false, ...props },
    ref
  ) => {
    const mainCategories = useMemo(
      () =>
        categories.filter((c) => {
          const parentId =
            c.parent && typeof c.parent === "object"
              ? c.parent._id
              : c.parent || null;
          return parentId === null;
        }),
      [categories]
    );

    return (
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <select
          ref={ref}
          {...props} // includes onChange/onBlur/name/value from register
          className={`px-4 py-2 rounded-md border transition outline-none
            ${
              error
                ? "border-red-500"
                : "border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)]"
            }`}
        >
          <option value="">-- Select Category --</option>
          {mainCategories.map((c) => (
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

export default CategorySelect;
