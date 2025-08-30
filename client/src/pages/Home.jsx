import React from "react";
import Carousel from "../components/Carousel";
import MainCategorySection from "../components/Home/MainCategorySection";
import { useBanners } from "../hooks/useBanners";
import Spinner from "../components/Spinner";
import TanishqWorldSection from "../components/Home/TanishqWorldSection";
const Home = () => {
  const { banners, isLoading, error } = useBanners();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center absolute inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-120px)] text-red-600">
        <p>Error: {error.message || "Could not load Banners."}</p>
      </div>
    );
  }
  return (
    <div>
      <Carousel banners={banners} />
      <MainCategorySection />
      <TanishqWorldSection />
    </div>
  );
};

export default Home;
