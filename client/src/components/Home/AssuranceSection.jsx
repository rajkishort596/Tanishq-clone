import React from "react";
import images from "../../utils/images"; // store your icon paths here

const assuranceItems = [
  {
    icon: images.tanishqQualityCrafting,
    title: "Quality Craftsmanship",
  },
  {
    icon: images.tanishqEthicallySourced,
    title: "Ethically Sourced",
  },
  {
    icon: images.tanishqTransparency,
    title: "100% Transparency",
  },
];

const AssuranceSection = () => {
  return (
    <section className="py-12 px-4 sm:px-2 md:px-3 lg:px-4 font-fraunces bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center border-t divide-0 md:divide-x divide-[#e2e1df] border-[#e2e1df]">
        {/* Left Text */}
        <div className="py-10 md:py-30 text-center h-full px-5">
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif font-medium">
            Tanishq
            <span className="text-primary font-medium ml-1.5"> Assurance</span>
          </h2>
          <p className="text-gray-600 mt-2">
            Crafted by experts, cherished by you
          </p>
        </div>

        {/* Right Icons */}
        <div className="flex justify-center gap-8 sm:gap-12 py-10 md:py-30 px-5">
          {assuranceItems.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center space-y-2"
            >
              <img
                src={item.icon}
                alt={item.title}
                className="h-12 w-12 sm:h-15 sm:w-15 lg:w-20 lg:h-20 object-contain"
              />
              <p className="text-sm font-medium text-gray-800">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AssuranceSection;
