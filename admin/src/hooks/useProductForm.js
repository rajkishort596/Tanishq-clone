// src/hooks/useProductForm.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProductById,
  createProduct,
  updateProduct,
} from "../api/product.Api";
import { fetchCategories } from "../api/category.Api";
import { toast } from "react-toastify";

export const useProductForm = (productId) => {
  const queryClient = useQueryClient();
  const isEditMode = !!productId;

  // Query to fetch a single product for editing
  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: isEditMode,
    staleTime: 5 * 60 * 1000,
  });

  // Query to fetch all categories (for the category dropdown)
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["allCategories"],
    queryFn: () => fetchCategories({ limit: 1000 }),
    staleTime: 10 * 60 * 1000,
  });

  // Mutation for creating a product
  const createMutation = useMutation({
    mutationFn: (formData) => createProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Product Created Successfully.");
    },
  });

  // Mutation for updating a product
  const updateMutation = useMutation({
    mutationFn: ({ productId, formData }) =>
      updateProduct({ productId, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["product", productId]);
      queryClient.invalidateQueries(["products"]);
      toast.success("Product Updated Successfully.");
    },
  });

  const isLoadingForm =
    isProductLoading ||
    isCategoriesLoading ||
    createMutation.isLoading ||
    updateMutation.isLoading;
  const formError =
    productError ||
    categoriesError ||
    createMutation.error ||
    updateMutation.error;

  return {
    productData,
    categories: categoriesData?.categories || [],
    isLoadingForm,
    formError,
    createProduct: createMutation.mutateAsync,
    updateProduct: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};
