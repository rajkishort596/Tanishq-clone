import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "../api/category.Api";

export const useCategories = (queryParams) => {
  const {
    data: categories,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["categories", queryParams],
    queryFn: () => fetchCategories(queryParams),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
  return {
    categories: categories || [],
    isLoading,
    error,
    isFetching,
  };
};
