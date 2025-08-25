import { useQuery } from "@tanstack/react-query";
import { fetchBanners } from "../api/banner.Api";

export const useBanners = () => {
  const {
    data: banners,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  return {
    banners: banners,
    isLoading,
    isFetching,
    error,
  };
};
