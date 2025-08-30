import React from "react";
import images from "../../utils/images";
import { Link } from "react-router-dom";

const TanishqWorldSection = () => {
  return (
    <section className="py-12 px-4 sm:px-2 md:px-3 lg:px-4 font-fraunces">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Tanishq World
        </h2>
        <p className="text-gray-600">A companion for every occasion</p>
      </div>

      {/* Custom Layout */}
      <div className="flex gap-2 md:gap-4 justify-center">
        <div className="flex flex-col gap-2 md:gap-4 ">
          {/* Top-left Image (Horizontal) */}
          <Link to="/all-jewellery?occasion=wedding">
            <div className="relative rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={images.weddingWorld}
                alt="Wedding"
                className="w-full h-auto object-contain transform transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/70 via-transparent to-transparent"></div>
              <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg md:text-2xl font-medium">
                Wedding
              </h3>
            </div>
          </Link>
          {/* Bottom-left Image (Horizontal) */}
          <Link to="/shop/gold">
            <div className="relative rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={images.goldWorld}
                alt="Gold"
                className="w-full h-auto object-contain transform transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/70 via-transparent to-transparent"></div>
              <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg md:text-2xl font-medium">
                Gold
              </h3>
            </div>
          </Link>
        </div>

        <div className="flex flex-col  gap-2 md:gap-4">
          {/* Top-right Image (Horizontal) */}
          <Link to="/shop/diamond">
            <div className="relative rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={images.diamondWorld}
                alt="Diamond"
                className="w-full h-auto object-contain transform transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/70 via-transparent to-transparent"></div>
              <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg md:text-2xl font-medium">
                Diamond
              </h3>
            </div>
          </Link>
          {/* Bottom-right Image (Horizontal) */}
          <Link to="/all-jewellery?occasion=dailyWear">
            <div className="relative rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={images.dailyWearWorld}
                alt="Dailywear"
                className="w-full h-auto object-contain transform transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-900/70 via-transparent to-transparent"></div>
              <h3 className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg md:text-2xl font-medium">
                Dailywear
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TanishqWorldSection;
