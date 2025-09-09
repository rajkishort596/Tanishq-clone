import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const FloatingWidget = ({ shownCount, totalCount }) => {
  const [showCount, setShowCount] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowCount(window.scrollY > 300);
      setShowScrollTop(window.scrollY > 5000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Product Count at Top Center */}
      {showCount && (
        <div className="fixed left-1/2 transform -translate-x-1/2 top-40 z-50 font-IBM-Plex">
          <div className="bg-[#ffffff59] border border-[#e0e0e0] backdrop-blur-sm px-6 py-2 rounded-full shadow-md text-sm font-medium text-[#300708]">
            Showing <span className="font-bold">{shownCount}</span>/{totalCount}
          </div>
        </div>
      )}

      {/* Back to Top at Bottom Center */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed left-1/2 transform -translate-x-1/2 bottom-6 bg-[#ffffff59] border border-[#e0e0e0] backdrop-blur-sm px-6 py-2 text-[#300708] rounded-full shadow-lg transition cursor-pointer z-50"
        >
          Back to Top <ArrowUp size={18} className="inline-block ml-1" />
        </button>
      )}
    </>
  );
};

export default FloatingWidget;
