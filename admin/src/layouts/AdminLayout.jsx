import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Container from "../components/container/Container";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] min-h-screen">
        <Sidebar />
        <main className="relative p-6 bg-[#f3efea]">
          <Header />
          {/* Render nested admin routes */}
          <Outlet />
        </main>
      </div>
    </Container>
  );
};

export default AdminLayout;
