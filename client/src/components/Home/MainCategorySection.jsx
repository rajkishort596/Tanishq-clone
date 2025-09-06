import React from "react";
import images from "../../utils/images";
import { Link } from "react-router-dom";
const categories = [
  {
    title: "EARRINGS",
    image: images.earringsCat,
    link: "/shop/earrings",
  },
  {
    title: "RINGS",
    image: images.ringsCat,
    link: "/shop/rings",
  },
  {
    title: "PENDANTS",
    image: images.pendentCat,
    link: "/shop/necklaces/pendents",
  },
  {
    title: "MANGALSUTRA",
    image: images.mangalsutraCat,
    link: "/shop/necklaces/gold-mangalsutra",
  },
  {
    title: "BRACELETS",
    image: images.braceletCat,
    link: "/shop/bracelets-and-bangles/diamond-bracelets",
  },
  {
    title: "BANGLES",
    image: images.banglesCat,
    link: "/shop/bracelets-and-bangles/gold-bangles",
  },
  {
    title: "CHAINS",
    image: images.chainsCat,
    link: "/shop/all-jewellery/chains",
  },
  {
    title: "VIEW ALL",
    viewAll: true,
    link: "/shop/all-jewellery",
  },
];

const MainCategorySection = () => {
  return (
    <section className="py-12 px-4 sm:px-2 md:px-3 lg:px-4 font-fraunces">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl leading-[48px] mb-2">
          Find Your Perfect Match
        </h2>
        <p className="text-xl font-light text-[#56544e]">Shop by Categories</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) =>
          cat.viewAll ? (
            <Link
              to={cat.link}
              key={idx}
              className="flex flex-col items-center transition cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center w-full h-full border border-grey2 rounded-lg bg-white shadow-sm hover:shadow-md">
                <span className="text-3xl font-bold text-primary">10+</span>
                <p className="text-gray-600 text-sm text-center">
                  Categories to choose from
                </p>
              </div>
              <h3 className="mt-4 text-sm md:text-base font-medium uppercase">
                {cat.title}
              </h3>
            </Link>
          ) : (
            <Link
              key={idx}
              to={cat.link}
              className="flex flex-col items-center rounded-lg overflow-hidden transition cursor-pointer"
            >
              <div className="w-full h-auto overflow-hidden rounded-2xl shadow-sm hover:shadow-md">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
              <h3 className="mt-4 text-sm md:text-base font-medium uppercase">
                {cat.title}
              </h3>
            </Link>
          )
        )}
      </div>
    </section>
  );
};

export default MainCategorySection;
