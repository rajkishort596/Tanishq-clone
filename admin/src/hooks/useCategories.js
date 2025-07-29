import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, deleteCategory } from "../api/category.Api.js";

export const useCategories = (queryParams) => {
  const queryClient = useQueryClient();

  const {
    data: categoriesData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["categories", queryParams],
    queryFn: () => fetchCategories(queryParams),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]); // Invalidate categories cache on successful deletion
      // You might also want to show a toast notification here
    },
    onError: (error) => {
      // Handle error, e.g., show a toast notification
      console.error("Delete category error:", error);
    },
  });

  return {
    categories: categoriesData?.categories || [], // The array of category documents
    totalCategories: categoriesData?.totalCategories || 0, // Total count for pagination
    isLoading,
    error,
    isFetching,
    deleteCategory: deleteCategoryMutation.mutate, // Expose the delete function
    isDeleting: deleteCategoryMutation.isLoading, // Expose loading state of deletion
  };
};
