import { useQuery } from "@tanstack/react-query";
import { getMetalRate } from "../api/product.Api";

export const useMetalRate = (metal = "Gold") => {
  const {
    data: metalRate,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["metalRate", metal],
    queryFn: () => getMetalRate(metal),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
  return {
    metalRate,
    isLoading,
    error,
    isFetching,
  };
};
