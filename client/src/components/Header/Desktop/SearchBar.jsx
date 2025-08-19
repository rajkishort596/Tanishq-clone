import React from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="hidden lg:flex items-center w-full max-w-xl rounded-full border border-gray-300 px-4 py-2 focus-within:ring-1 focus-within:ring-primary">
      {/* Search Icon */}
      <Search className="text-primary mr-2" size={18} />

      {/* Input */}
      <input
        type="text"
        placeholder="Search for Gold Jewellery, Diamond Jewellery and more…"
        maxLength="70"
        onInput={(e) =>
          (e.target.value = e.target.value.replace(/[^A-Za-z0-9\s]/g, ""))
        }
        className="w-full font-['IBM Plex Sans'] text-sm placeholder-gray-400 outline-none "
      />
    </div>
  );
};

export default SearchBar;
