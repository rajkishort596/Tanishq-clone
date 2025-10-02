import React from "react";
import images from "../../constants/images";
import { Menu } from "lucide-react"; // icon

const Header = ({ onMenuClick }) => {
  return (
    <header className="w-full flex justify-between items-center bg-white/60 px-6 py-4 shadow-sm rounded-md mb-6">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        {/* Hamburger button (only mobile) */}
        <button
          className="lg:hidden p-2 rounded-md bg-[#f3efea] shadow-sm"
          onClick={onMenuClick}
        >
          <Menu size={22} className="text-primary" />
        </button>

        {/* Logo */}
        <img src={images.tanishq} alt="Tanishq Logo" className="h-10" />
      </div>

      {/* Right: Profile */}
      <img
        src={images.profile}
        alt="Profile"
        className="h-10 w-10 rounded-full object-cover border-2 border-gold glow-yellow"
      />
    </header>
  );
};

export default Header;
