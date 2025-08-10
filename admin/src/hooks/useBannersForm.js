import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBanner,
  fetchBannerById,
  fetchBanners,
  updateBanner,
} from "../api/banner.Api";
import { toast } from "react-toastify";

export const useBannersForm = (bannerId) => {
  const queryClient = useQueryClient();
  const isEditMode = !!bannerId;

  const {
    data: bannerData,
    isLoading: isBannerLoading,
    error: bannerError,
  } = useQuery({
    queryKey: ["banner", bannerId],
    queryFn: () => fetchBannerById(bannerId),
    enabled: isEditMode,
    staleTime: 1000 * 60 * 5, //Cache for 5 minutes
  });

  // Query to fetch all banners
  const {
    data: allBannersData,
    isLoading: isAllBannerLoading,
    error: allBannersError,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
    staleTime: 10 * 60 * 1000,
  });

  // Mutation to create a new banner
  const createBannerMutation = useMutation({
    mutationFn: (formData) => createBanner(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["banners"]);
      toast.success("Banner created successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to create banner.");
      console.error("Create Banner error:", err);
    },
  });

  // Mutation to update a banner
  const updateBannerMutation = useMutation({
    mutationFn: ({ bannerId, formData }) =>
      updateBanner({ bannerId, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["banner", bannerId]);
      queryClient.invalidateQueries(["banners"]);
      toast.success("Banner updated successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update banner.");
      console.error("Update Banner error:", err);
    },
  });

  return {
    banner: bannerData,
    isLoadingForm: isBannerLoading,
    formError: bannerError,
    createBanner: createBannerMutation.mutateAsync,
    isCreating: createBannerMutation.isPending,
    updateBanner: updateBannerMutation.mutateAsync,
    isUpdating: updateBannerMutation.isPending,
  };
};
