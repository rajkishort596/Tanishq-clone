import React from "react";
import images from "../../constants/images";

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center bg-[var(--color-secondary)] px-6 py-4 shadow-sm rounded-md mb-6">
      <img src={images.tanishq} alt="Tanishq Logo" className="h-10" />
      <img
        src={images.profile}
        alt="Profile"
        className="h-10 w-10 rounded-full object-cover border-2 border-gold glow-yellow"
      />
    </header>
  );
};

export default Header;
