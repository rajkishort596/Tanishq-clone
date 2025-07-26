import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Container from "../components/container/Container";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  return (
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] min-h-screen">
        <Sidebar className="bg-tanishq-gradient subtle-gold-glow" />
        <main className="relative p-6 bg-[var(--color-secondary)] min-h-screen rounded-tl-xl">
          <Header />
          <Outlet />
        </main>
      </div>
    </Container>
  );
};

export default AdminLayout;
