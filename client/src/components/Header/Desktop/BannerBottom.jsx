import React from "react";
import { Link } from "react-router-dom";

const BannerBottom = ({ category, setActiveCategory }) => {
  return (
    <div className="mt-8 p-3 mx-6 bg-[#fffcf7] border border-[#fff2e0] rounded-lg flex items-center justify-between">
      <div>
        <h4 className="font-medium">
          From Everyday Glow to Extraordinary Sparkle.
        </h4>
        <p className="text-sm text-gray-600">3000+ Designs Await.</p>
      </div>
      <Link
        to={`/shop/${category?.slug}`}
        onClick={() => setActiveCategory(null)}
        className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium"
      >
        View All
      </Link>
    </div>
  );
};

export default BannerBottom;
