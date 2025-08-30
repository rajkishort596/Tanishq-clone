import React from "react";
import images from "../../utils/images";

const AssuranceFeaturesSection = () => {
  const features = [
    {
      icon: images.tanishqExchange,
      title: "Tanishq Exchange",
    },
    {
      icon: images.tanishqPurity,
      title: "The Purity Guarantee",
    },
    {
      icon: images.tanishqTransparency,
      title: "Complete Transparency and Trust",
    },
    {
      icon: images.tanishqLifetime,
      title: "Lifetime Maintenance",
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-2 md:px-3 lg:px-4 font-fraunces text-center">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-start">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Icon */}
            <img
              src={feature.icon}
              alt={feature.title}
              className="w-16 h-16 md:w-20 md:h-20 object-contain mb-4"
            />
            {/* Title */}
            <h3 className="text-sm md:text-base font-medium text-gray-800">
              {feature.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AssuranceFeaturesSection;
