import React, { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import Spinner from "../components/Spinner";
import DetailsAccordian from "../components/DetailsAccordian";
import PriceBreakupTable from "../components/Table/PriceBreakupTable";
import { useMetalRate } from "../hooks/useMetalRates";
import { fetchProductById } from "../api/product.Api";
import { formatCurrency } from "../utils/formatters";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const ProductDetails = () => {
  const { productId, category, subCategory, collection } = useParams();
  const [activeTab, setActiveTab] = useState("details");

  console.log(collection, productId, category, subCategory);

  const formatSubCategory = (slug) => {
    if (!slug) return "";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const priceRef = useRef(null);
  const [activeAccordion, setActiveAccordion] = useState("metalDetails");

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    staleTime: 5 * 60 * 1000,
  });

  const categoryMap = {
    "all-jewellery": "All Jewellery",
    "bracelets-and-bangles": "Bracelets & Bangles",
    earrings: "Earrings",
    necklaces: "Necklaces",
    rings: "Rings",
    gold: "Gold",
    diamond: "Diamond",
  };

  const breadcrumbItems = [
    { label: "Home", to: "/" },
    category
      ? { label: categoryMap[category] || category, to: `/shop/${category}` }
      : null,
    subCategory && subCategory !== "undefined"
      ? {
          label: formatSubCategory(subCategory),
          to: `/shop/${category}/${subCategory}`,
        }
      : null,
    collection ? { label: "Collections", to: `/shop/collection` } : null,
    collection
      ? { label: formatSubCategory(collection), to: `/shop/${collection}` }
      : null,
    { label: product?.name || "..." },
  ].filter(Boolean);

  const { metalRate } = useMetalRate(product?.metal);

  const handleAccordionClick = (accordionName) => {
    setActiveAccordion(
      activeAccordion === accordionName ? null : accordionName
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full min-h-[calc(100vh-120px)] text-red-600">
        <p>Error: {error.message || "Could not load products."}</p>
      </div>
    );
  }

  const isOpen = (accordionName) => activeAccordion === accordionName;

  const scrollToPrice = () => {
    setActiveTab("price");
    setTimeout(() => {
      priceRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="w-full relative">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />
      <div className="py-15">
        {/* Title & Price */}
        <div className="flex flex-col gap-2 md:gap-4 items-center">
          <h1 className="text-base sm:text-xl font-medium md:text-3xl md:font-semibold text-[#413f3a] font-fraunces text-center">
            {product?.name}
          </h1>
          <p className="text-sm sm:text-lg md:text-2xl md:font-medium text-[#0b0b0a] font-fraunces flex justify-center items-center gap-2">
            {formatCurrency(product?.price?.final)}
            <ChevronDown
              onClick={scrollToPrice}
              size={16}
              className="cursor-pointer"
            />
          </p>
          <span className="-mt-2 md:-mt-4 text-xs font-extralight text-[#413f3a]">
            Incl. taxes and charges
          </span>
        </div>

        {/* Image Gallery */}
        <div className="w-full pt-10 pb-15 lg:px-15 overflow-hidden">
          {/* Swiper for Mobile & Tablet */}
          <div className="block lg:hidden">
            <Swiper
              modules={[Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              pagination={{ clickable: true }}
              className="rounded-lg overflow-hidden"
            >
              {product?.images?.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img.url}
                    alt={product?.name}
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Grid for Large Screens */}
          <div
            className={`hidden lg:grid gap-15 
      ${
        product?.images?.length === 1
          ? "grid-cols-1 place-items-center"
          : product?.images?.length === 3
          ? "grid-cols-2"
          : "grid-cols-2"
      }`}
          >
            {product?.images?.map((img, index) => (
              <div
                key={img.url}
                className={`rounded-md overflow-hidden shadow-md
          ${
            product?.images?.length === 1
              ? "col-span-1"
              : product?.images?.length === 3 && index === 2
              ? "col-span-2 flex justify-center"
              : ""
          }`}
              >
                <img
                  src={img.url}
                  alt={product?.name}
                  className={`${
                    product?.images?.length === 1
                      ? "w-full h-auto"
                      : product?.images?.length === 3 && index === 2
                      ? "w-1/2 h-auto"
                      : "w-full h-full"
                  } object-contain`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Jewellery Details */}
        <div className="text-center mb-6">
          <span className="text-3xl font-fraunces text-[#300708]">
            Jewellery Details
          </span>
        </div>

        {/* Tabs */}
        <div className="relative flex w-full md:w-1/2 h-15 justify-center mx-auto rounded-full mb-6 p-1 border border-[#e0e0e0] overflow-hidden">
          {/* Sliding Indicator */}
          <div
            className={`absolute inset-y-1 w-1/2 bg-gradient-to-r from-[#832729] to-[#631517] rounded-full transition-transform duration-300 ease-in-out ${
              activeTab === "details" ? "left-1" : "translate-x-full -left-1"
            }`}
          ></div>

          {/* Buttons */}
          <button
            onClick={() => setActiveTab("details")}
            className={`relative z-10 w-full h-full px-[6px] py-1 font-normal text-[1rem] rounded-full font-IBM-Plex cursor-pointer transition-colors ${
              activeTab === "details" ? "text-white" : "text-black"
            }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab("price")}
            className={`relative z-10 w-full h-full px-[6px] py-1 font-normal text-[1rem] rounded-full font-IBM-Plex cursor-pointer transition-colors ${
              activeTab === "price" ? "text-white" : "text-black"
            }`}
          >
            Price Breakup
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full flex flex-col lg:px-15 md:flex-row gap-8">
          {/* Left Content */}
          <div className="flex-1 rounded-lg">
            {activeTab === "details" && (
              <DetailsAccordian
                product={product}
                isOpen={isOpen}
                handleAccordionClick={handleAccordionClick}
              />
            )}

            {activeTab === "price" && (
              <PriceBreakupTable
                priceRef={priceRef}
                product={product}
                metalRate={metalRate}
              />
            )}
          </div>

          {/* Right Side Image & SKU */}
          <div className="w-full hidden lg:block md:w-1/3 text-center">
            <img
              src={product?.images?.[0]?.url}
              alt={product?.name}
              className="w-full rounded-lg shadow mb-4"
            />
            <p className="text-gray-500 mt-2">
              Enjoy sparkling jewellery! We provide free jewellery cleaning
              services!
            </p>
          </div>
        </div>
      </div>
      {/* Fixed Add to Cart Bar */}
      <div className="fixed bottom-0 md:bottom-4 left-1/2 -translate-x-1/2 w-full md:w-[90%] font-fraunces lg:w-1/2 bg-white shadow-lg md:rounded-lg flex items-center justify-between gap-4 px-8 py-4 z-50">
        {/* Price */}
        <p className="hidden md:block text-lg font-semibold text-gray-900">
          {formatCurrency(product?.price?.final)}
        </p>

        {/* Weight */}
        <span className="hidden md:flex mx-4 flex-1 text-sm py-2 px-4 bg-[#f8f8f8] rounded-lg items-center font-IBM-Plex gap-1">
          <span className="text-gold">⚖</span> Weight:{" "}
          <span className="font-semibold">{product?.weight}g</span>
        </span>

        {/* Add to Cart Button */}
        <button className="ml-4 w-full md:w-auto rounded-full btn-primary">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
