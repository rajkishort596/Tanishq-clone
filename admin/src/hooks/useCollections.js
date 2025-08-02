import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCollections, deleteCollection } from "../api/collection.Api.js";
import { toast } from "react-toastify";

export const useCollections = (queryParams) => {
  const queryClient = useQueryClient();

  const {
    data: collectionsData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["collections", queryParams],
    queryFn: () => fetchCollections(queryParams),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: (collectionId) => deleteCollection(collectionId),
    onSuccess: () => {
      queryClient.invalidateQueries(["collections"]); // Invalidate collections cache on successful deletion
      toast.success("Collection deleted successfully!");
    },
    onError: (error) => {
      toast.error(err?.message || "Failed to delete collection.");
      console.error("Delete collection error:", error);
    },
  });

  return {
    collections: collectionsData?.collections || [],
    totalCollections: collectionsData?.totalCollections || 0,
    isLoading,
    error,
    isFetching,
    deleteCollection: deleteCollectionMutation.mutateAsync,
    isDeleting: deleteCollectionMutation.isPending,
  };
};
