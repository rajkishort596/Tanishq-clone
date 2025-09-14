// ClientLayout.jsx
import React, { useEffect } from "react";
import Container from "../components/Container/Container";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ScrollToTop from "../components/ScrollToTop";
import Spinner from "../components/Spinner";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../api/auth.Api";
import { setCredentials, setAuthStatus } from "../features/authSlice";

const ClientLayout = () => {
  const dispatch = useDispatch();

  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(setAuthStatus("loading"));
    } else if (isSuccess && data) {
      dispatch(setCredentials({ user: data, isAuthenticated: true }));
      dispatch(setAuthStatus("succeeded"));
    } else if (error) {
      dispatch(setAuthStatus("failed"));
    }
  }, [isLoading, isSuccess, error, data, dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  return (
    <Container>
      <div className="min-h-screen">
        <main className="relative p-4 lg:p-6 min-h-screen bg-white rounded-tl-xl">
          <ScrollToTop />
          <Header />
          <div className="min-h-screen">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </Container>
  );
};

export default ClientLayout;
