import React from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { useSelector } from "react-redux";

const MyAccount = () => {
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);

  const accountRoutes = [
    { to: "/myaccount", label: "Overview", end: true },
    { to: "/myaccount/personal-info", label: "Personal Information" },
    { to: "/myaccount/wishlist", label: "Wishlist" },
    { to: "/myaccount/order-history", label: "Order History" },
    { to: "/myaccount/address-book", label: "Address Book" },
  ];

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    { label: "My Account", to: "/myaccount" },
  ];

  const current = accountRoutes.find((r) => r.to === location.pathname);
  if (current) {
    breadcrumbItems.push({ label: current.label });
  }

  return (
    <div className="flex flex-col gap-4 px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} className="!pt-0 !px-0" />
      <div className="grid grid-cols-2 divide-x divide-gray-200 justify-between items-center">
        <h3 className="font-nunito text-xl md:text-2xl lg:text-3xl mt-4">
          My Account
        </h3>
        <h3 className="font-nunito text-right text-xl md:text-2xl lg:text-3xl mt-4">
          Hello,{" "}
          {user?.firstName
            ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
            : "User"}
        </h3>
      </div>
      <div className="flex flex-col lg:flex-row bg-white border-t border-gray-200">
        {/* Sidebar */}
        <aside className="w-full lg:w-64">
          <nav className="flex flex-col">
            {accountRoutes.map((item, idx) => (
              <div
                className="w-full p-1 border-b border-r border-gray-200"
                key={idx}
              >
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `block px-4 py-3 font-medium rounded-sm
                    ${
                      isActive
                        ? "bg-red-50 text-primary"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </div>
            ))}
          </nav>
        </aside>
        {/* Right-side content */}
        <section className="flex-1 pl-4 lg:pl-6 py-4 lg:py-6">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default MyAccount;
