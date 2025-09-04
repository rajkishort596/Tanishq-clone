import React from "react";
import images from "../utils/images";
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
          className="flex justify-between w-full text-sm sm:text-lg md:text-xl font-normal cursor-pointer"
        >
          <h2 className="flex gap-3 items-center">
            <img
              src={images.goldBlocks}
              alt=""
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            />
            <span> METAL DETAILS</span>
          </h2>
          {isOpen("metalDetails") ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          )}
        </button>
        {isOpen("metalDetails") && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full h-full mt-6">
            <div>
              <h4 className="text-sm sm:text-lg md:text-xl mb-[10px] font-fraunces text-black">
                {product.purity}
              </h4>
              <p className="text-xs sm:text-sm">Karatage</p>
            </div>

            <div>
              <h4 className="text-sm sm:text-lg md:text-xl mb-[10px] font-fraunces text-black">
                {product.metalColor}
              </h4>
              <p className="text-xs sm:text-sm">Material Colour</p>
            </div>

            <div>
              <h4 className="text-sm sm:text-lg md:text-xl mb-[10px] font-fraunces text-black">
                {product.weight}g
              </h4>
              <p className="text-xs sm:text-sm">Gross Weight</p>
            </div>

            <div>
              <h4 className="text-sm sm:text-lg md:text-xl mb-[10px] font-fraunces text-black">
                {product.metal}
              </h4>
              <p className="text-xs sm:text-sm">Metal</p>
            </div>

            <div className="col-span-2">
              <h4 className="text-sm sm:text-lg md:text-xl mb-[10px] font-fraunces text-black">
                {product.size || "NA"}
              </h4>
              <p className="text-xs sm:text-sm">Size</p>
            </div>
          </div>
        )}
      </div>

      {/* General Details */}
      <div
        className={`-mt-4 border p-6 border-[#e0e0e0]  ${
          isOpen("generalDetails") ? "pb-6" : "pb-10"
        } overflow-hidden rounded-t-[20px] border-b-0 transition-all duration-500 ease-in-out`}
      >
        <button
          onClick={() => handleAccordionClick("generalDetails")}
          className="flex justify-between w-full text-sm sm:text-lg md:text-xl font-normal cursor-pointer"
        >
          <h2 className="flex gap-3 items-center">
            <img
              src={images.generalDetails}
              alt=""
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            />
            <span>GENERAL DETAILS</span>
          </h2>
          {isOpen("generalDetails") ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          )}
        </button>
        {isOpen("generalDetails") && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full h-full mt-6">
            <div>
              <h4 className="text-sm sm:text-lg md:text-xl mb-[10px] font-fraunces text-black">
                {product.metal + " Jewellery"}
              </h4>
              <p className="text-xs sm:text-sm">Jewellery Type</p>
            </div>

            <div>
              <h4 className="text-sm sm:text-lg md:text-xl mb-[10px] font-fraunces text-black">
                Tanisq
              </h4>
              <p className="text-xs sm:text-sm">Brand</p>
            </div>

            <div>
              <h4 className="text-sm sm:text-lg md:text-xl mb-[10px] font-fraunces text-black">
                {product?.collections.map((c) => c.name).join(", ") || "N/A"}
              </h4>
              <p className="text-xs sm:text-sm">Collection</p>
            </div>

            <div>
              <h4 className="text-sm sm:text-lg md:text-xl mb-[10px] font-fraunces text-black">
                {product.gender}
              </h4>
              <p className="text-xs sm:text-sm">Gender</p>
            </div>

            <div className="col-span-2">
              <h4 className="text-sm sm:text-lg md:text-xl mb-[10px] font-fraunces text-black">
                {product?.occasion.map((oca) => oca).join(", ") || "N/A"}
              </h4>
              <p className="text-xs sm:text-sm">Occasions</p>
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
          className="flex justify-between w-full text-sm sm:text-lg md:text-xl font-normal cursor-pointer"
        >
          <h2 className="flex gap-3 items-center">
            <img
              src={images.descriptionIcon}
              alt=""
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
            />
            <span>DESCRIPTION</span>
          </h2>
          {isOpen("description") ? (
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          ) : (
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          )}
        </button>
        {isOpen("description") && (
          <p className="mt-3 text-xs sm:text-sm md:text-base text-gray-700">
            {product?.description || "No description available."}
          </p>
        )}
      </div>
    </div>
  );
};

export default DetailsAccordian;
