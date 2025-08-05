import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, deleteProduct } from "../api/product.Api.js";

export const useProducts = (queryParams) => {
  const queryClient = useQueryClient();

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

  const deleteProductMutation = useMutation({
    mutationFn: (productId) => deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
    onError: (error) => {
      console.error("Delete product error:", error);
    },
  });

  return {
    products: productsData?.products || [],
    totalProducts: productsData?.totalProducts || 0,
    isLoading,
    error,
    isFetching,
    deleteProduct: deleteProductMutation.mutateAsync,
    isDeleting: deleteProductMutation.isLoading,
  };
};
