import React from "react";
// import { logoutAdmin } from "../../api/auth.Api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../../features/authSlice.js";
import images from "../../constants/images.js";

const Header = ({ isAuthenticated = false, user, image }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //   const handleLogout = async () => {
  //     const res = await logoutAdmin();
  //     dispatch(logoutAction());
  //     navigate("/admin/login");
  //   };

  return (
    <div className="relative group cursor-pointer w-[200px] px-8 flex  ml-auto items-center">
      {/* Profile image */}
      <img
        src={images.profile}
        alt="Profile"
        className="h-10 w-10 rounded-full object-cover"
      />
      <img src={images.tanishq} alt="tanishq" />
    </div>
  );
};

export default Header;
