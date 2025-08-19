import React from "react";
import images from "../../../utils/images";
import { Link } from "react-router-dom";

const Promotion = () => {
  return (
    <div className="Promotion-content w-full mb-6">
      <div className="w-full relative">
        {/* Background Image */}
        <img
          src={images.subtractBack}
          alt="Promotion Background"
          className="w-full h-auto object-cover max-h-[400px] lg:max-h-[500px]"
        />
        <div className="absolute inset-0 flex gap-8 sm:gap-30 md:gap-40 items-center p-4 sm:px-8">
          <img src={images.promotionBagIcon} className="px-4 sm:px-8 h-[90%]" />
          <div className="px-4 md:px-8 h-auto">
            <div className="flex flex-col items-left gap-2 sm-gap-4 md:gap-6">
              <div>
                <p className="font-fraunces text-sm sm:text-xl md:text-3xl">
                  Flat Rs. 500 off
                </p>
                <p className="font-IBM-Plex text-xs sm:text-sm md:text-2xl">
                  on your first order
                </p>
              </div>
              <div className="text-primary uppercase font-nunito text-xs sm:text-sm md:font-semibold md:text-lg flex gap-2">
                <Link
                  to="#"
                  className="pr-2 border-r border-primary inline-block leading-none"
                >
                  LOGIN
                </Link>
                <Link href="#" className="inline-block leading-none">
                  SIGN UP
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotion;
