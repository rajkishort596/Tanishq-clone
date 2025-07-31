import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCategories, deleteCategory } from "../api/category.Api.js";
import { toast } from "react-toastify";

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
    mutationFn: (categoryId) => deleteCategory(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]); // Invalidate categories cache on successful deletion
      toast.success("Category deleted successfully!");
    },
    onError: (error) => {
      toast.error(err?.message || "Failed to delete category.");
      console.error("Delete category error:", error);
    },
  });

  return {
    categories: categoriesData?.categories || [],
    totalCategories: categoriesData?.totalCategories || 0,
    isLoading,
    error,
    isFetching,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isDeleting: deleteCategoryMutation.isPending,
  };
};
