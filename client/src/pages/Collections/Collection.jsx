import React, { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useCollections } from "../../hooks/useCollections";
import ProductCard from "../../components/ProductCard";
import FilterSection from "../../components/Filter/FilterSection";
import Spinner from "../../components/Spinner";
import Breadcrumb from "../../components/Breadcrumb";

const Collection = () => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);

  const { collections } = useCollections({ limit: 100 });
  const { collection } = useParams();

  console.log(collection);
  const Collection = collections.find((col) => col.slug === collection);
  const collectionId = Collection?._id;

  console.log(Collection);

  const [searchParams] = useSearchParams();
  const occasion = searchParams.get("occasion");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const metal = searchParams.get("metal");
  const purity = searchParams.get("purity");
  const gender = searchParams.get("gender");
  const metalColor = searchParams.get("metalColor");

  const { products, totalProducts, isLoading, isFetching, error } = useProducts(
    {
      limit,
      collections: collectionId,
      occasion,
      minPrice,
      maxPrice,
      metal,
      metalColor,
      purity,
      gender,
    }
  );

  const handleClick = (product) => {
    const basePath = `/shop/collections`;
    const path = collection
      ? `${basePath}/${collection}/product/${product._id}`
      : `${basePath}/product/${product._id}`;
    navigate(path);
  };

  if (isLoading || isFetching)
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-white/80 z-50">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <p className="text-center py-4 text-red-500">Failed to load collection</p>
    );
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 font-fraunces">
      <section className="hidden md:block w-full overflow-hidden rounded-xl">
        <img
          key={Collection?._id}
          src={Collection?.bannerImage?.url}
          alt={`Banner for ${Collection?.name}`}
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
          Collection ? { label: `${Collection?.name}` } : {},
        ]}
        className="mb-6 py-5"
      />
      {/* Heading */}
      <h1 className="text-2xl text-[#300708] mb-6">
        {Collection?.name}{" "}
        <span className="text-gray-500 text-lg font-IBM-Plex">
          ({totalProducts} results)
        </span>
      </h1>

      {/* Reusable Filter Section */}
      <FilterSection />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onClick={() => handleClick(product)}
          />
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

export default Collection;
