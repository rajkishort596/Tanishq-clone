import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchBanners, deleteBanner } from "../api/banner.Api";

export const useBanners = () => {
  const queryClient = useQueryClient();

  // Query to fetch all banners
  const {
    data: bannersData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
    staleTime: 5 * 60 * 1000,
  });

  // Mutation to delete a banner
  const deleteBannerMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(["banners"]);
      toast.success("Banner deleted successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete banner.");
      console.error("Delete Banner error:", err);
    },
  });

  return {
    banners: bannersData?.banners || [],
    isLoading,
    isFetching,
    error,
    deleteBanner: deleteBannerMutation.mutateAsync,
    isDeleting: deleteBannerMutation.isPending,
  };
};
