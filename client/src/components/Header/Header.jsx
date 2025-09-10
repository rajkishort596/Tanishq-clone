import React, { useState } from "react";
import { NavCategories } from "./Desktop/NavCategories";
import { NavIcons } from "./Desktop/NavIcons";
import { MobileMenu } from "./Mobile/MobileMenu";
import { Menu } from "lucide-react";
import SearchBar from "./Desktop/SearchBar";
import { useCategories } from "../../hooks/useCategories";
import { useCollections } from "../../hooks/useCollections";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { categories, isLoading: isCategoryLoading } = useCategories();
  const { collections, isLoading: isCollectionLoading } = useCollections({
    limit: 100,
  });

  if (isCategoryLoading || isCollectionLoading) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  return (
    <header className="w-full sticky bg-white top-0 z-50">
      <div className="px-4 sm:px-2 md:px-3 lg:px-4">
        <div className="flex justify-between items-center py-4">
          {/*Logo and Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu size={24} strokeWidth={1} className="text-black" />
            </button>

            {/* Left - Logo */}
            <div className="flex items-center">
              <Link to={"/"}>
                <img
                  src="/logo.svg"
                  alt="Tanishq Logo"
                  className="hidden lg:inline-block h-12 w-auto"
                />
                <img
                  src="/MobileLogo.svg"
                  alt="Tanishq Logo"
                  className="h-6 w-auto lg:hidden"
                />
              </Link>
            </div>
          </div>

          {/* Middle - Search Bar (desktop only) */}
          <SearchBar />

          {/* Right - Icons */}
          <div className="flex items-center space-x-4">
            <NavIcons />
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-2 lg:px-4 w-full relative">
        {/* Middle - Nav (desktop only) */}
        <nav className="hidden w-full lg:flex space-x-8 justify-between items-center">
          <NavCategories categories={categories} collctions={collections} />
        </nav>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <MobileMenu
          categories={categories}
          collections={collections}
          onClose={() => setMobileOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
