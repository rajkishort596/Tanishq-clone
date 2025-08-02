import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCollection,
  fetchCollectionById,
  fetchCollections,
  updateCollection,
} from "../api/collection.Api";

export const useCollectionForm = (collectionId) => {
  const queryClient = useQueryClient();
  const isEditMode = !!collectionId;

  //Query to fetch a single collection for editing
  const {
    data: collectionData,
    isLoading: isCollectionLoading,
    error: collectionError,
  } = useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () => fetchCollectionById(collectionId),
    enabled: isEditMode,
    staleTime: 1000 * 60 * 5, //Cache for 5 minutes
  });

  //Query to fetch all collections
  const {
    data: allCollectionsData,
    isLoading: isAllCollectionsLoading,
    error: allCollectionsError,
  } = useQuery({
    queryKey: ["allCollections"],
    queryFn: () => fetchCollections({ limit: 100 }),
    staleTime: 1000 * 60 * 10, //Cache for 10 minute
  });

  //Mutation for creating a collection
  const createMutation = useMutation({
    mutationFn: (formData) => createCollection(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["allCollections"]);
    },
  });

  //Mutaion for updating a collection
  const updateMutation = useMutation({
    mutationFn: ({ collectionId, formData }) =>
      updateCollection({ collectionId, formData }),
    onSuccess: () => {
      queryClient.invalidateQueries(["collection", collectionId]);
      queryClient.invalidateQueries(["allCollections"]);
    },
  });

  //Combined loading and error states
  const isLoadingForm =
    isCollectionLoading ||
    isAllCollectionsLoading ||
    createMutation.isPending ||
    updateMutation.isPending;

  const formError =
    collectionError ||
    allCollectionsError ||
    createMutation.error ||
    updateMutation.error;

  return {
    collectionData,
    allCollections: allCollectionsData?.collections || [],
    isLoadingForm,
    formError,
    createCollection: createMutation.mutateAsync,
    updateCollection: updateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};
