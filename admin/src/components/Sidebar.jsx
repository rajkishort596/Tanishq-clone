import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  Package,
  Star,
  ShoppingCart,
  Layers,
  Settings,
  LogOut,
  ImageIcon,
  X,
} from "lucide-react";

import images from "../constants/images";
import { logout } from "../features/authSlice";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../api/auth.Api";

const navLinks = [
  { to: "/", label: "Dashboard", icon: Home, end: true },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/collections", label: "Collections", icon: Layers },
  { to: "/products", label: "Products", icon: Package },
  { to: "/reviews", label: "Reviews", icon: Star },
  { to: "/orders", label: "Orders", icon: ShoppingCart },
  { to: "/banners", label: "Banners", icon: ImageIcon },
  { to: "/settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ className = "", onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutAdmin();
    console.log("Logout successful");
    dispatch(logout());
    navigate("/login");
    if (onClose) onClose();
  };

  return (
    <aside
      className={`w-64 flex flex-col justify-between py-6 px-4 border-r border-grey8 relative ${className}`}
    >
      {/* Close button (only mobile) */}
      <button
        className="absolute top-4 right-4 lg:hidden p-1 rounded-sm border border-grey1 hover:border-gold text-grey1 hover:text-gold"
        onClick={onClose}
      >
        <X size={20} />
      </button>

      <div>
        {/* Logo/Brand */}
        <div className="flex items-center justify-center mb-10">
          <img
            src={images.logo}
            alt="Tanishq Logo"
            className="h-20 w-auto mb-4"
          />
        </div>

        {/* Navigation Links */}
        <nav>
          <ul>
            {navLinks.map(({ to, label, icon: Icon, end }) => (
              <li className="mb-2" key={to}>
                <NavLink
                  to={to}
                  end={end}
                  onClick={onClose} // close sidebar on navigation
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-gold font-medium shadow-md active-sidebar-link-glow"
                        : "text-grey1 hover:bg-grey8 hover:text-gold"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`h-5 w-5 mr-3 ${
                          isActive ? "active-sidebar-icon-glow" : ""
                        }`}
                      />
                      {label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center cursor-pointer w-full p-3 rounded-lg text-grey3 hover:bg-primary hover:text-gold transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
