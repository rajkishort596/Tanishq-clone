import React, { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, FunnelIcon, Plus } from "lucide-react";

const AllJewellery = () => {
  const [limit, setLimit] = useState(10);
  const { products, totalProducts, isLoading, isFetching, error } = useProducts(
    { limit }
  );
  const navigate = useNavigate();

  if (isLoading || isFetching)
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <p className="text-center py-4 text-red-500">Failed to load products</p>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 font-fraunces">
      {/* Breadcrumb */}
      <div className="flex gap-2 items-center w-full text-sm text-gray-500 mb-6 bg-white py-5">
        <Link to="/">Home</Link>
        <span>&gt;</span>
        <span className="text-primary font-medium font-IBM-Plex">
          All Jewellery
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-2xl text-[#300708] mb-6">
        All Jewellery{" "}
        <span className="text-gray-500 text-lg font-IBM-Plex">
          ({totalProducts} results)
        </span>
      </h1>

      {/* Filter + Sort (Placeholder) */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-8 font-IBM-Plex">
        <div className="flex flex-wrap items-center gap-4">
          <button className="px-8 py-[10px] border border-[#e0e0e0] rounded-4xl text-sm text-black cursor-pointer">
            <FunnelIcon
              size={20}
              strokeWidth={1}
              className="inline-block mr-2"
            />
            Filter
            <ChevronDown
              size={20}
              strokeWidth={1}
              className="inline-block ml-2 text-primary"
            />
          </button>
          <button className="px-4 py-[10px] border flex items-center border-[#e0e0e0]  rounded-4xl text-sm text-black cursor-pointer">
            <span className="bg-[#fbe9ea] p-1 flex justify-center items-center rounded-full mr-2">
              <Plus
                strokeWidth={1}
                size={14}
                className="text-primary inline-block"
              />
            </span>
            ₹25,000 - ₹50,000
          </button>
          <button className="px-4 py-[10px] border flex items-center border-[#e0e0e0]  rounded-4xl text-sm text-black cursor-pointer">
            <span className="bg-[#fbe9ea] p-1 flex justify-center items-center rounded-full mr-2">
              <Plus
                strokeWidth={1}
                size={14}
                className="text-primary inline-block"
              />
            </span>
            Women
          </button>
          <button className="px-4 py-[10px] border flex items-center border-[#e0e0e0]  rounded-4xl text-sm text-black cursor-pointer">
            <span className="bg-[#fbe9ea] p-1 flex justify-center items-center rounded-full mr-2">
              <Plus
                strokeWidth={1}
                size={14}
                className="text-primary inline-block"
              />
            </span>
            Men
          </button>
          <button className="px-4 py-[10px] border flex items-center border-[#e0e0e0]  rounded-4xl text-sm text-black cursor-pointer">
            <span className="bg-[#fbe9ea] p-1 flex justify-center items-center rounded-full mr-2">
              <Plus
                strokeWidth={1}
                size={14}
                className="text-primary inline-block"
              />
            </span>
            Gold Jewellery
          </button>
          <button className="text-primary text-sm font-semibold cursor-pointer">
            +See More
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Load More Button */}
      {products?.length < totalProducts && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setLimit(limit + 24)}
            disabled={isFetching}
            className="btn-primary rounded-full py-5 px-8 shadow-md hover:scale-105 transition-transform disabled:opacity-50"
          >
            {isFetching ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AllJewellery;
