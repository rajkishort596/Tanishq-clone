import React from "react";
import { User, CircleUserRound, Gift, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openAuthModal } from "../../../../features/authModalSlice";
import { useAuth } from "../../../../hooks/useAuth";
import Spinner from "../../../Spinner";

const UserIcon = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleUserClick = () => {
    if (isAuthenticated && user) {
      navigate("/myaccount");
    } else {
      dispatch(openAuthModal(false));
    }
  };

  const { logoutUser, isLoggingOut } = useAuth();

  const handleLogout = async () => {
    await logoutUser();
  };

  if (isLoggingOut) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative group inline-block">
      <button
        onClick={handleUserClick}
        className="p-2 text-primary cursor-pointer transition-colors duration-200 
             after:scale-x-0 group-hover:after:scale-x-100
             after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 
             after:bottom-0 after:h-[2px] after:w-full after:bg-primary after:rounded-sm
             after:origin-center after:transition-transform after:duration-300"
      >
        {isAuthenticated && user ? (
          <CircleUserRound size={20} strokeWidth={1} />
        ) : (
          <User size={20} strokeWidth={1} />
        )}
      </button>
      <div
        className="absolute left-1/2 -translate-x-1/2 -mt-0.5 whitespace-nowrap font-fraunces 
             bg-white shadow-lg rounded-xl p-5 text-sm text-[#413f3a] 
             opacity-0 pointer-events-none 
             group-hover:opacity-100 group-hover:translate-y-1 group-hover:pointer-events-auto 
             transition-all duration-200 z-50"
      >
        {isAuthenticated && user ? (
          <>
            <button
              onClick={handleUserClick}
              className="w-full flex p-2 cursor-pointer rounded-md gap-2 items-center 
                 hover:bg-[#f2e7e9] hover:border hover:border-[#631517] hover:text-[#631517] 
                 hover:shadow-[0_8px_24px_-5px_#490a0c33]"
            >
              <CircleUserRound strokeWidth={1} className="text-primary" />
              <span>
                {user?.firstName.charAt(0).toUpperCase() +
                  user?.firstName.split(1)}
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex p-2 cursor-pointer rounded-md gap-2 items-center 
                 hover:bg-[#f2e7e9] hover:border hover:border-[#631517] hover:text-[#631517] 
                 hover:shadow-[0_8px_24px_-5px_#490a0c33]"
            >
              <LogOut strokeWidth={1} className="text-primary" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => dispatch(openAuthModal(false))}
            className="flex p-2 cursor-pointer rounded-md gap-2 items-center 
                 hover:bg-[#f2e7e9] hover:border hover:border-[#631517] hover:text-[#631517] 
                 hover:shadow-[0_8px_24px_-5px_#490a0c33]"
          >
            <Gift strokeWidth={1} className="text-[#413f3a]" />
            <span>Log in / Sign up</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserIcon;
