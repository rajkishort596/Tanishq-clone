import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCategoryById,
  createCategory,
  updateCategory,
  fetchCategories,
} from "../api/category.Api";

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
    enabled: isEditMode,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Query to fetch all categories (for parent dropdown)
  const {
    data: allCategoriesData,
    isLoading: isAllCategoriesLoading,
    error: allCategoriesError,
  } = useQuery({
    queryKey: ["allCategories"],
    queryFn: () => fetchCategories({ limit: 1000 }),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });

  // Mutation for creating a category
  const createMutation = useMutation({
    mutationFn: (formData) => createCategory(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["allCategories"]);
    },
  });

  // Mutation for updating a category
  const updateMutation = useMutation({
    mutationFn: ({ categoryId, formData }) =>
      updateCategory({ categoryId, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["category", categoryId]);
      queryClient.invalidateQueries(["allCategories"]);
    },
  });

  // Combined loading and error states
  const isLoadingForm =
    isCategoryLoading ||
    isAllCategoriesLoading ||
    createMutation.isPending ||
    updateMutation.isPending;

  const formError =
    categoryError ||
    allCategoriesError ||
    createMutation.error ||
    updateMutation.error;

  return {
    categoryData,
    allCategories: allCategoriesData?.categories || [],
    isLoadingForm,
    formError,
    createCategory: createMutation.mutateAsync,
    updateCategory: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};
