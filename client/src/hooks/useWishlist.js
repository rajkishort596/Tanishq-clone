import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToWishlist,
  fetchWishlist,
  removeFromWishlist,
} from "../api/wishlist.Api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export const useWishlist = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const {
    data: wishlist,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    refetchOnReconnect: true,
    retry: isAuthenticated ? 1 : 0,
  });

  const addWishlistMutation = useMutation({
    mutationFn: (productId) => addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Product added to Wishlist");
    },
  });

  const deleteWishlistMutation = useMutation({
    mutationFn: (productId) => removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Profuct Removed from Wishlist");
    },
  });

  return {
    wishlist: wishlist || [],
    addToWishlist: addWishlistMutation.mutateAsync,
    removeFromWishlist: deleteWishlistMutation.mutateAsync,
    isAdding: addWishlistMutation.isPending,
    isRemoving: deleteWishlistMutation.isPending,
    isLoading,
    error,
    isFetching,
  };
};
