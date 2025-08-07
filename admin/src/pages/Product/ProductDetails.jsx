import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../../api/product.Api";
import { formatCurrency } from "../../utils/formatters";
import { ChevronDown } from "lucide-react";
import Spinner from "../../components/Spinner";
import DetailsAccordian from "../../components/DetailsAccordian";
import PriceBreakupTable from "../../components/Table/PriceBreakupTable";
import { useMetalRate } from "../../hooks/useMetalRates";

const ProductDetails = () => {
  const { productId } = useParams();
  const [activeTab, setActiveTab] = useState("details");

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

  const { metalRate } = useMetalRate(product?.metal);

  const handleAccordionClick = (accordionName) => {
    setActiveAccordion(
      activeAccordion === accordionName ? null : accordionName
    );
  };

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
    <div className="glass-card py-15">
      {/* Title & Price */}
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-3xl font-semibold text-[#413f3a] font-fraunces">
          {product?.name}
        </h1>
        <p className="text-2xl font-medium text-[#0b0b0a] font-fraunces flex justify-center items-center gap-2">
          {formatCurrency(product?.price?.final)}
          <ChevronDown onClick={scrollToPrice} className="cursor-pointer" />
        </p>
        <span className="-mt-4 text-xs font-extralight text-[#413f3a]">
          Incl. taxes and charges
        </span>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-2 gap-15 py-10 px-15 w-full">
        {product?.images?.map((img) => (
          <div key={img.url} className="rounded-md overflow-hidden shadow-md">
            <img src={img.url} alt={product?.name} className="w-full h-full" />
          </div>
        ))}
      </div>

      {/* Jewellery Details */}
      <div className="text-center mb-6">
        <span className="text-3xl font-fraunces text-[#300708]">
          Jewellery Details
        </span>
      </div>

      {/* Tabs */}
      <div className="relative flex w-1/2 h-15 justify-center mx-auto rounded-full mb-6 p-1 border border-[#e0e0e0] overflow-hidden">
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
      <div className="flex flex-col px-15 md:flex-row gap-8">
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
        <div className="w-full md:w-1/3 text-center">
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
  );
};

export default ProductDetails;
