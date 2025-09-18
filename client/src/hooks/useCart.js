import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCart,
  addToCart,
  removeCartItem,
  updateItemQuantity,
} from "../api/cart.Api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export const useCart = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const {
    data: cart,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: fetchCart,
    staleTime: 5 * 60 * 1000,
    retry: false,
    enabled: isAuthenticated,
  });

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: ({ productId, quantity }) => addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item added to cart");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to add items to the cart";
      toast.error(errorMessage);
    },
  });

  // Remove item mutation
  const removeItemMutation = useMutation({
    mutationFn: (itemId) => removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed from cart");
    },
    onError: () => {
      toast.error("Failed to remove item from cart");
    },
  });

  // Update quantity mutation
  const updateItemQuantityMutation = useMutation({
    mutationFn: ({ itemId, quantity }) => updateItemQuantity(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart updated successfully");
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update cart";
      toast.error(errorMessage);
    },
  });

  return {
    cart,
    isLoading,
    error,
    isFetching,

    addToCart: addItemMutation.mutateAsync,
    removeFromCart: removeItemMutation.mutateAsync,
    updateQuantity: updateItemQuantityMutation.mutateAsync,

    isAdding: addItemMutation.isPending,
    isRemoving: removeItemMutation.isPending,
    isUpdating: updateItemQuantityMutation.isPending,
  };
};
