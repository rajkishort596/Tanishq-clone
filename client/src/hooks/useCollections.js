import { useQuery } from "@tanstack/react-query";
import { fetchCollections } from "../api/collection.Api";

export const useCollections = (queryParams) => {
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
  return {
    collections: collectionsData?.collections || [],
    totalCollections: collectionsData?.totalCollections || 0,
    isLoading,
    error,
    isFetching,
  };
};
