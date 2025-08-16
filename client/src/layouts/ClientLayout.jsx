import React from "react";
import Container from "../components/Container/Container";
import { Outlet } from "react-router-dom";
const ClientLayout = () => {
  return (
    <Container>
      <div className="min-h-screen">
        <main className="relative p-6 min-h-screen bg-[#f3efea] rounded-tl-xl overflow-auto">
          <Outlet />
        </main>
      </div>
    </Container>
  );
};

export default ClientLayout;
