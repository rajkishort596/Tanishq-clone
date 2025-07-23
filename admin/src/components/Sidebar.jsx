import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import images from "../constants/images.js";
import Spinner from "./Spinner.jsx";

const Sidebar = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    console.log("Logout action triggered");
  };
  return (
    <aside className="h-screen bg-bg text-gray-800 shadow-md p-4 flex flex-col gap-6 md:w-[250px]">
      {/* Logo */}
      <div className="flex items-center">
        <img src={images.logo} alt="Logo" className="w-20 h-20" />
      </div>
      {/* Navigation */}
      <nav className="flex flex-col gap-4 text-base">
        <NavItem
          to="/"
          label="Dashboard"
          icon={{ active: images.houseIcon, inactive: images.blackHouseIcon }}
        />
        <NavItem
          to="/categories"
          label="Categories"
          icon={{ active: images.houseIcon, inactive: images.blackHouseIcon }}
        />
        <NavItem
          to="/collections"
          label="Collections"
          icon={{
            active: images.collectionIcon,
            inactive: images.blackCollectionIcon,
          }}
        />
        <NavItem
          to="/products"
          label="Products"
          icon={{ active: images.ringIcon, inactive: images.blackRingIcon }}
        />
        <NavItem
          to="/reviews"
          label="Reviews"
          icon={{ active: images.starIcon, inactive: images.blackStarIcon }}
        />
        <NavItem
          to="/orders"
          label="Orders"
          icon={{ active: images.orderIcon, inactive: images.blackOrderIcon }}
        />
        <NavItem
          to="/banners"
          label="Banners"
          icon={{ active: images.bannerIcon, inactive: images.blackBannerIcon }}
        />
        <NavItem
          to="/settings"
          label="Settings"
          icon={{ active: images.gearIcon, inactive: images.blackGearIcon }}
        />
      </nav>
      <button
        onClick={() => {
          handleLogout();
        }}
        className="mt-auto mb-10 text-left flex gap-3 px-3 py-2 rounded-md font-medium transition-colors items-center cursor-pointer hover:bg-primary/20"
      >
        <img src={images.logoutIcon} className="h-5 w-5" alt={`icon`} />
        logout
        {loading ? (
          <span className="ml-auto">
            <Spinner />
          </span>
        ) : (
          ""
        )}
      </button>
    </aside>
  );
};

const NavItem = ({ to, label, icon }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
        isActive ? "bg-primary text-white" : "hover:bg-primary/20"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <img
          src={isActive ? icon.active : icon.inactive}
          className="h-5 w-5"
          alt={`${label} icon`}
        />
        <span>{label}</span>
      </>
    )}
  </NavLink>
);

export default Sidebar;
