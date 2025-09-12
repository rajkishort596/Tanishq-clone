import React, { useEffect, useState } from "react";
import { useCollections } from "../../hooks/useCollections";
import Breadcrumb from "../../components/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";

const Collections = () => {
  const [limit, setLimit] = useState(100);
  const navigate = useNavigate();
  const {
    collections,
    totalCollections,
    isLoading: isCollectionLoading,
    isFetching,
    error,
  } = useCollections({ limit });

  const handleCollectionClick = (collection) => {
    navigate(`/shop/${collection?.slug}`);
  };

  if (isCollectionLoading) {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );
  }
  if (error)
    return (
      <p className="text-center py-4 text-red-500">
        Failed to load collections
      </p>
    );
  console.log(collections);
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 font-fraunces">
      <section className="hidden md:block w-full overflow-hidden rounded-xl">
        <img
          src="/CollectionsBanner.png"
          alt={`Collections Banner`}
          className="
                      w-full 
                      h-auto
                      object-contain 
                      transition-opacity 
                      duration-1000 
                      ease-in-out 
                      opacity-100
                      rounded-xl
                    "
        />
      </section>

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Collections", to: "/shop/collections" },
        ]}
        className="mb-6 py-5"
      />
      {/* Heading */}
      <h1 className="text-2xl text-[#300708] mb-6">
        All Collections{" "}
        <span className="text-gray-500 text-lg font-IBM-Plex">
          ({totalCollections} results)
        </span>
      </h1>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {collections.map((collection) => (
          <button
            key={collection?._id}
            onClick={() => handleCollectionClick(collection)}
            className="flex flex-col cursor-pointer items-center p-[5px] text-center group rounded-xl hover:border-1 hover:border-[#c09293] hover:shadow-[0_20px_26px_-15px_#490a0c45]"
          >
            <div className="w-full h-full rounded-xl overflow-hidden shadow-md border border-gray-200 group-hover:shadow-lg transition">
              <img
                src={collection?.image?.url}
                alt={collection?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-3 text-sm sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-700 group-hover:text-black">
              {collection?.name}
            </span>
          </button>
        ))}
      </div>
      {/* Load More Button */}
      {collections?.length < totalCollections && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setLimit(limit + 12)}
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

export default Collections;
