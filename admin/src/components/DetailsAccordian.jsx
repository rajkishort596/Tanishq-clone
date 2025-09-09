import React from "react";
import images from "../constants/images";
import { ChevronDown, ChevronUp } from "lucide-react";

const DetailsAccordian = ({ product, isOpen, handleAccordionClick }) => {
  return (
    <div>
      {/* Metal Details */}
      <div
        className={`border p-6 border-[#e0e0e0] ${
          isOpen("metalDetails") ? "pb-6" : "pb-10"
        } overflow-hidden rounded-t-[20px] border-b-0 transition-all duration-500 ease-in-out`}
      >
        <button
          onClick={() => handleAccordionClick("metalDetails")}
          className="flex justify-between w-full text-xl font-normal cursor-pointer"
        >
          <h2 className="flex gap-3">
            <img src={images.goldBlocks} alt="" />
            <span> METAL DETAILS</span>
          </h2>
          {isOpen("metalDetails") ? <ChevronUp /> : <ChevronDown />}
        </button>
        {isOpen("metalDetails") && (
          <div className="grid grid-cols-3 w-full h-full mt-6">
            <div className="mb-4">
              <h4 className="text-xl mb-[10px] font-fraunces text-black">
                {product.purity}
              </h4>
              <p>Karatage</p>
            </div>

            <div className="mb-4">
              <h4 className="text-xl mb-[10px] font-fraunces text-black">
                {product.metalColor}
              </h4>
              <p>Material Colour</p>
            </div>

            <div className="mb-4">
              <h4 className="text-xl mb-[10px] font-fraunces text-black">
                {product.weight}g
              </h4>
              <p>Gross Weight</p>
            </div>

            <div className=" mb-4">
              <h4 className="text-xl mb-[10px] font-fraunces text-black">
                {product.metal}
              </h4>
              <p>Metal</p>
            </div>

            <div className=" mb-4">
              <h4 className="text-xl mb-[10px] font-fraunces text-black">
                {product.size || "NA"}
              </h4>
              <p>Size</p>
            </div>
          </div>
        )}
      </div>

      {/* General Details */}
      <div
        className={`-mt-4 border p-6 border-[#e0e0e0]  ${
          isOpen("generalDetails") ? "pb-6" : "pb-10"
        } overflow-hidden rounded-t-[20px] border-b-0  transition-all duration-500 ease-in-out`}
      >
        <button
          onClick={() => handleAccordionClick("generalDetails")}
          className="flex justify-between w-full text-lg font-normal cursor-pointer"
        >
          <h2 className="flex gap-3">
            <img src={images.generalDetails} alt="" />
            <span>GENERAL DETAILS</span>
          </h2>
          {isOpen("generalDetails") ? <ChevronUp /> : <ChevronDown />}
        </button>
        {isOpen("generalDetails") && (
          <div className="grid grid-cols-3 w-full h-full mt-6">
            <div className="mb-4">
              <h4 className="text-xl mb-[10px] font-fraunces text-black">
                {product.productType.charAt(0).toUpperCase() +
                  product.productType.slice(1) +
                  " Jewellery"}
              </h4>
              <p>Jewellery Type</p>
            </div>

            <div className="mb-4">
              <h4 className="text-xl mb-[10px] font-fraunces text-black">
                Tanisq
              </h4>
              <p>Brand</p>
            </div>

            <div className="mb-4">
              <h4 className="text-xl mb-[10px] font-fraunces text-black">
                {product?.collections.map((c) => c.name).join(", ") || "N/A"}
              </h4>
              <p>Collection</p>
            </div>

            <div className=" mb-4">
              <h4 className="text-xl mb-[10px] font-fraunces text-black">
                {product.gender}
              </h4>
              <p>Gender</p>
            </div>

            <div className=" mb-4">
              <h4 className="text-xl mb-[10px] font-fraunces text-black">
                {product?.occasion.map((oca) => oca).join(", ") || "N/A"}
              </h4>
              <p>Occassions</p>
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div
        className={`-mt-4 border p-6 border-[#e0e0e0] ${
          isOpen("description") ? "pb-6" : "pb-10"
        } overflow-hidden rounded-t-[20px] transition-all duration-500 ease-in-out`}
      >
        <button
          onClick={() => handleAccordionClick("description")}
          className="flex justify-between w-full text-lg font-normal cursor-pointer"
        >
          <h2 className="flex gap-3">
            <img src={images.descriptionIcon} alt="" />
            <span>DESCRIPTION</span>
          </h2>
          {isOpen("description") ? <ChevronUp /> : <ChevronDown />}
        </button>
        {isOpen("description") && (
          <p className="mt-3 text-gray-700">
            {product?.description || "No description available."}
          </p>
        )}
      </div>
    </div>
  );
};

export default DetailsAccordian;
