import React, { useState, useEffect } from "react";
import images from "../../utils/images";

const OfferBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const banners = [
    {
      id: 2,
      circleBg: "from-[#f0dbbc] to-[#fffcf7]",
      circleImage: images.loginSecondScreen,
      ribbonImage: images.loginRibbon,
      heading: "Explore curations based on your interests",
      subHeading: "Personalized",
      highlight: "Curations",
    },
    {
      id: 1,
      circleBg: "from-[#f0dbbc] to-[#fffcf7]",
      circleImage: images.loginFirstScreen,
      ribbonImage: images.loginRibbon,
      heading: "And other benefits",
      subHeading: "On your first order get",
      highlight: "₹500 off",
      features: [
        { label: "Encircle & Tata Neu coins", icon: images.loginEncircle },
        { label: "Unlock wishlist", icon: images.loginWishlist },
        { label: "Personalized shopping", icon: images.loginShopping },
      ],
    },
  ];

  // Auto toggle every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const banner = banners[activeIndex];

  return (
    <div className="hidden relative lg:flex flex-1 p-8 bg-transparent flex-col items-center rounded-xl border border-[#e2b579] transition-all duration-700">
      {/* Stars background */}
      <div className="absolute inset-0 px-5">
        <img
          src={images.loginStarBg}
          alt="Stars background"
          className="w-full h-[230px] object-contain"
        />
      </div>

      {/* Circle with gradient */}
      <div
        className={`w-[215px] h-[215px] bg-gradient-to-b ${banner.circleBg} rounded-full flex items-center justify-center p-5`}
      >
        <img
          src={banner.circleImage}
          className={`w-auto object-contain ${
            banner.id === 1 ? "h-full" : "h-1/2"
          }`}
          alt="circle"
        />
      </div>

      {/* Ribbon */}
      <div className="relative w-full h-[100px] -mt-10">
        <div className="absolute inset-0 px-5 z-50">
          <img
            src={banner.ribbonImage}
            alt="ribbon"
            className="w-full h-full object-contain"
          />
        </div>
        {banner.subHeading && (
          <div className="relative z-50 flex flex-col items-center justify-center h-full pt-1">
            <p className="text-sm text-[#413f3a]">{banner.subHeading}</p>
            {banner.highlight && (
              <p className={`text-3xl font-bold text-[#a76f25]`}>
                {banner.highlight}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom content */}
      <div className="w-full mt-2 text-center">
        {banner.id === 1 ? (
          <>
            <h3 className="text-[#a76f25] font-IBM-Plex text-lg mb-2">
              {banner.heading}
            </h3>
            <div className="w-full flex flex-wrap 2xl:flex-nowrap gap-4 justify-center text-xs text-[#631517]">
              {banner.features?.map((f, idx) => (
                <div key={idx} className="flex items-center gap-1">
                  <img src={f.icon} className="w-4 h-4" alt={f.label} />
                  <span>{f.label}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-[#a76f25] font-IBM-Plex text-xl">
              {banner.heading}
            </h3>
          </>
        )}
      </div>
    </div>
  );
};

export default OfferBanner;
