import React from "react";
import images from "../../utils/images";
import { Link } from "react-router-dom";

const CuratedForYouSection = () => {
  const items = [
    {
      image: images.womenJewellery,
      title: "Women Jewellery",
      link: "/shop/all-jewellery?gender=women",
    },
    {
      image: images.menJewellery,
      title: "Men Jewellery",
      link: "/shop/all-jewellery?gender=men",
    },
    {
      image: images.kidsJewellery,
      title: "Kids Jewellery",
      link: "/shop/all-jewellery?gender=kids",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-2 md:px-3 lg:px-4 font-fraunces text-center">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold">Curated For You</h2>
        <p className="text-gray-600 text-sm md:text-base">Shop By Gender</p>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <Link
            key={index}
            to={item.link}
            className="flex flex-col items-center group cursor-pointer"
          >
            {/* Image */}
            <div className="w-full overflow-hidden rounded-xl shadow-md">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-auto object-contain rounded-xl transform group-hover:scale-105 transition duration-300"
              />
            </div>

            {/* Title */}
            <h3 className="mt-4 text-base md:text-lg font-medium text-gray-800">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CuratedForYouSection;
