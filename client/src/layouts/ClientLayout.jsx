import React from "react";
import Container from "../components/Container/Container";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
const ClientLayout = () => {
  return (
    <Container>
      <div className="min-h-screen">
        <main className="relative p-4 lg:p-6 min-h-screen bg-white rounded-tl-xl overflow-auto">
          <Header />
          <Outlet />
        </main>
      </div>
    </Container>
  );
};

export default ClientLayout;
