import React, { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import Spinner from "../components/Spinner";
import ProductCard from "../components/ProductCard";
import Breadcrumb from "../components/Breadcrumb";
import { useCategories } from "../hooks/useCategories";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import FilterSection from "../components/Filter/FilterSection";

const Rings = () => {
  const [limit, setLimit] = useState(10);

  const { categories } = useCategories();
  const ringsCategory = categories.find((cat) => cat.name === "Rings");
  const categoryId = ringsCategory?._id;
  const categorySlug = ringsCategory?.slug;

  const { subCategory } = useParams();
  const Category = categories.find((cat) => cat.slug === subCategory);
  const subcategoryId = Category?._id;

  const [searchParams] = useSearchParams();
  const occasion = searchParams.get("occasion");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const metal = searchParams.get("metal");
  const purity = searchParams.get("purity");
  const gender = searchParams.get("gender");
  const metalColor = searchParams.get("metalColor");
  const productType = searchParams.get("productType");

  const { products, totalProducts, isLoading, isFetching, error } = useProducts(
    {
      limit,
      category: categoryId,
      subCategory: subcategoryId,
      occasion,
      minPrice,
      maxPrice,
      metal,
      metalColor,
      purity,
      gender,
      productType,
    }
  );

  const navigate = useNavigate();

  const handleClick = (product) => {
    const basePath = `/shop/${categorySlug}`;
    const path = subCategory
      ? `${basePath}/${subCategory}/product/${product._id}`
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
      <p className="text-center py-4 text-red-500">Failed to load products</p>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 font-fraunces">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          { label: "Rings", to: "/shop/rings" },
          subCategory ? { label: `${Category?.name}` } : {},
        ]}
        className="mb-6 py-5"
      />

      {/* Heading */}
      <h1 className="text-2xl text-[#300708] mb-6">
        Earrings{" "}
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

export default Rings;
