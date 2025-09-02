import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/product.Api.js";

export const useProducts = (queryParams) => {
  const {
    data: productsData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => fetchProducts(queryParams),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  return {
    products: productsData?.products || [],
    totalProducts: productsData?.totalProducts || 0,
    isLoading,
    error,
    isFetching,
  };
};
