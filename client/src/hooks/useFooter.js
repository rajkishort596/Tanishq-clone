import { useQuery } from "@tanstack/react-query";
import { fetchPublicSettings } from "../api/footer.Api";

export const useFooter = () => {
  const {
    data: publicSettingsData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: fetchPublicSettings,
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });
  return {
    storeInfo: publicSettingsData?.storeInfo,
    contactInfo: publicSettingsData?.contactInfo,
    socialLinks: publicSettingsData?.socialLinks,
    isLoading,
    error,
    isFetching,
  };
};
