import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategoryById,
  createCategory,
  updateCategory,
  fetchCategories,
} from "../api/category.Api"; // Ensure fetchCategories is also imported

/**
 * Custom hook for managing category form data (fetch single, create, update).
 * @param {string | undefined} categoryId - The ID of the category if in edit mode, otherwise undefined.
 */
export const useCategoryForm = (categoryId) => {
  const queryClient = useQueryClient();
  const isEditMode = !!categoryId;

  // Query to fetch a single category for editing
  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    error: categoryError,
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => fetchCategoryById(categoryId),
    enabled: isEditMode, // Only run this query if categoryId is provided (edit mode)
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Query to fetch all categories (for parent dropdown)
  const {
    data: allCategoriesData,
    isLoading: isAllCategoriesLoading,
    error: allCategoriesError,
  } = useQuery({
    queryKey: ["allCategories"],
    queryFn: () => fetchCategories({ limit: 1000 }), // Fetch a large number to get all for dropdown
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Mutation for creating a category
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      // Invalidate relevant caches on success
      queryClient.invalidateQueries(["categories"]); // Invalidate the list of categories
      queryClient.invalidateQueries(["allCategories"]); // Invalidate all categories for dropdowns
    },
    // onError will be handled by the component using the mutation's error state
  });

  // Mutation for updating a category
  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      // Invalidate relevant caches on success
      queryClient.invalidateQueries(["category", categoryId]); // Invalidate the specific category
      queryClient.invalidateQueries(["categories"]); // Invalidate the list of categories
      queryClient.invalidateQueries(["allCategories"]); // Invalidate all categories for dropdowns
    },
    // onError will be handled by the component using the mutation's error state
  });

  // Combined loading and error states
  const isLoadingForm =
    isCategoryLoading ||
    isAllCategoriesLoading ||
    createMutation.isLoading ||
    updateMutation.isLoading;
  const formError =
    categoryError ||
    allCategoriesError ||
    createMutation.error ||
    updateMutation.error;

  return {
    categoryData, // Data for the specific category (if in edit mode)
    allCategories: allCategoriesData?.categories || [], // All categories for the parent dropdown
    isLoadingForm,
    formError,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
  };
};
