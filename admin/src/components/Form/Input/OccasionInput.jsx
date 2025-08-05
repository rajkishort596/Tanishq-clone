// src/components/Form/OccasionInputSimple.jsx
import React, { useEffect, useState } from "react";

const OccasionInput = ({ value = [], onChange, error }) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!Array.isArray(value)) {
      onChange([]);
    }
  }, [value, onChange]);

  const add = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (!value.includes(trimmed)) {
      onChange([...(Array.isArray(value) ? value : []), trimmed]);
    }
    setInput("");
  };

  const remove = (occ) => {
    onChange((value || []).filter((v) => v !== occ));
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      add();
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Occasions</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type occasion and press Enter"
          className="flex-1 px-4 py-2 border rounded-md outline-none transition duration-200 focus:ring-2 focus:ring-[var(--color-primary)]"
        />
        <button
          type="button"
          onClick={add}
          className="px-2 py-1 bg-[var(--color-primary)] text-white rounded-md font-medium"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {Array.isArray(value) &&
          value.map((occ) => (
            <div
              key={occ}
              className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md text-sm"
            >
              <span>{occ}</span>
              <button
                type="button"
                onClick={() => remove(occ)}
                aria-label={`Remove ${occ}`}
                className="font-bold"
              >
                ×
              </button>
            </div>
          ))}
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default OccasionInput;
