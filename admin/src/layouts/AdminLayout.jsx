import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Container from "../components/Container/Container";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`
            fixed lg:static inset-y-0 left-0 z-50 
            w-64 transform bg-tanishq-gradient subtle-gold-glow
            transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0
          `}
        >
          <Sidebar onClose={() => setIsOpen(false)} />
        </div>

        {/* Backdrop for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 relative p-6 min-h-screen bg-[#f3efea] rounded-tl-xl overflow-auto">
          <Header onMenuClick={() => setIsOpen(!isOpen)} />
          <Outlet />
        </main>
      </div>
    </Container>
  );
};

export default AdminLayout;
