import React from "react";
import Container from "../components/Container/Container";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ScrollToTop from "../components/ScrollToTop";
const ClientLayout = () => {
  return (
    <Container>
      <div className="min-h-screen">
        <main className="relative p-4 lg:p-6 min-h-screen bg-white rounded-tl-xl">
          <ScrollToTop />
          <Header />
          <Outlet />
          <Footer />
        </main>
      </div>
    </Container>
  );
};

export default ClientLayout;
