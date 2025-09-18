import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    if (!location.pathname.startsWith("/search")) {
      setSearchTerm("");
    }
  }, [location.pathname]);

  return (
    <div className="w-full relative flex items-center lg:max-w-xl rounded-xl border border-gray-300 px-4 py-2 focus-within:ring-1 focus-within:ring-primary">
      {/* Search Icon */}
      <Search className="text-primary mr-2" size={18} />

      {/* Input */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value.replace(/[^A-Za-z0-9\s]/g, ""))
        }
        onKeyDown={handleKeyDown}
        placeholder="Search for Gold Jewellery, Diamond Jewellery and more…"
        maxLength="70"
        className="w-full font-IBM-Plex text-sm placeholder-gray-400 outline-none"
      />
      {/* Clear Icon (X) */}
      {searchTerm && (
        <button
          onClick={clearSearch}
          className="absolute right-3 text-primary cursor-pointer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
