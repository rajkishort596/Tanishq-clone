// src/components/Form/Select.jsx
import React, { forwardRef } from "react";

const Select = forwardRef(
  (
    { label, className = "", readonly = false, error, id, children, ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label htmlFor={id} className="font-IBM-Plex text-black text-sm mb-1">
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={id}
          disabled={readonly}
          className={`px-4 py-2 rounded-md border bg-white text-gray-800 transition-all duration-300 outline-none
          ${
            error
              ? "border-red-500 focus:ring-red-300 text-red-600"
              : "border-gray-300 focus:ring-primary"
          }
          ${
            readonly
              ? "bg-gray-100 cursor-not-allowed"
              : "focus:ring-2 focus:border-transparent shadow-sm hover:shadow-md"
          }
          ${className}`}
          {...props}
        >
          {children}
        </select>

        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
