import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useBanners } from "../hooks/useBanners";

const Carousel = () => {
  const { banners, isLoading, error } = useBanners();

  if (isLoading)
    return (
      <div className="h-[400px] flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="h-[400px] flex items-center justify-center">
        Failed to load banners
      </div>
    );

  return (
    <div className="w-full overflow-hidden rounded-xl pb-10 my-8">
      <Swiper
        modules={[Autoplay, Pagination]}
        direction="horizontal"
        loop={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          reverseDirection: true,
        }}
        slidesPerView={1.2}
        centeredSlides={true}
        spaceBetween={20}
        breakpoints={{
          1024: {
            slidesPerView: 1.2,
            centeredSlides: true,
            spaceBetween: 20,
          },

          0: {
            slidesPerView: 1,
            centeredSlides: false,
            spaceBetween: 0,
          },
        }}
        pagination={{ clickable: true }}
        className="relative"
      >
        {banners.map((banner, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={banner?.image?.url}
              alt={`Slide ${idx + 1}`}
              className="w-full h-64 sm:h-80 md:h-[488px] object-center rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
