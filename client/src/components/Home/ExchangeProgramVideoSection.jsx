import React, { useRef, useState } from "react";
import TanishqExchangeVideo from "../../assets/videos/Tanishq.mp4";
import Thumbnail from "../../assets/images/Thumbnail.png";

const ExchangeProgramVideoSection = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="py-12 px-4 sm:px-2 md:px-3 lg:px-4 font-fraunces text-center">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl leading-[48px] mb-2">
          Exchange Program
        </h2>
        <h3 className="text-xl font-light text-[#56544e]">
          Trusted by 2.8M+ families
        </h3>
      </div>

      {/* Video Section */}
      <div className="relative rounded-xl overflow-hidden shadow-md">
        <video
          ref={videoRef}
          poster={Thumbnail}
          className="w-full object-cover h-[220px] sm:h-[300px] md:h-[400px] lg:h-auto md:rounded-xl"
        >
          <source src={TanishqExchangeVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Play/Pause Overlay Button */}
        <button
          onClick={handleVideoToggle}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-14 h-14 md:w-16 md:h-16 cursor-pointer bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition">
            {isPlaying ? (
              // Pause Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              // Play Icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-primary ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 22v-20l18 10-18 10z" />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Tagline */}
      <p className="mt-6 text-lg sm:text-xl italic font-IBM-Plex text-[#767469] max-w-2xl mx-auto">
        Trust us to be part of your precious moments and to deliver jewellery
        that you’ll cherish forever.
      </p>
    </section>
  );
};

export default ExchangeProgramVideoSection;
