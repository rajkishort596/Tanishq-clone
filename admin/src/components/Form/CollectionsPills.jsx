// src/components/Form/CollectionsPills.jsx
import React from "react";

const CollectionsPills = ({
  options = [],
  value = [],
  onChange,
  label,
  error,
}) => {
  const toggle = (val) => {
    if (Array.isArray(value) && value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...(Array.isArray(value) ? value : []), val]);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-wrap gap-2 mt-1">
        {options.map((opt) => {
          const selected = Array.isArray(value) && value.includes(opt.value);
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className={`px-2 py-1 rounded-md border text-sm font-medium transition flex items-center gap-1
                ${
                  selected
                    ? "bg-[var(--color-primary)] text-white border-transparent shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:shadow-sm"
                }`}
            >
              {opt.label}
              {selected && <span className="ml-1 text-xs">×</span>}
            </button>
          );
        })}
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default CollectionsPills;
