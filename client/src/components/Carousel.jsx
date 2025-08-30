import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useBanners } from "../hooks/useBanners";
import { Link } from "react-router-dom";

const Carousel = ({ banners }) => {
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
            <Link to={banner?.link}>
              <img
                src={banner?.image?.url}
                alt={`Slide ${idx + 1}`}
                className="w-full h-64 sm:h-80 md:h-[488px] object-center rounded-xl"
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
