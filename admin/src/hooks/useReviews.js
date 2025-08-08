import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteReview,
  fetchReviews,
  updateReviewStatus,
} from "../api/review.Api";
import { toast } from "react-toastify";

export const useReviews = (queryParams) => {
  const queryClient = useQueryClient();
  const {
    data: reviewsData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["reviews", queryParams],
    queryFn: () => fetchReviews(queryParams),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  const updateReviewMutation = useMutation({
    mutationFn: ({ reviewId, isApproved }) =>
      updateReviewStatus(reviewId, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      toast.success("Status updated successfully!");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update status.");
      console.error("Update Review Status error:", error);
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      toast.success("Review Deleted successfully!");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete review.");
      console.error("Delete Review error:", error);
    },
  });

  return {
    reviews: reviewsData?.reviews || [],
    totalReviews: reviewsData?.toralReviews || 0,
    isLoading,
    isFetching,
    error,
    deleteReview: deleteReviewMutation.mutateAsync,
    isDeleting: deleteReviewMutation.isPending,
    updateReviewStatus: updateReviewMutation.mutateAsync,
    isUpdating: updateReviewMutation.isPending,
  };
};
