import { toast } from "react-toastify";
import { getAdminSettings, updateAdminSettings } from "../api/setting.Api.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useSettings = () => {
  const queryClient = useQueryClient();

  const {
    data: settingsData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: getAdminSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settingsData) => updateAdminSettings(settingsData),
    onSuccess: () => {
      queryClient.invalidateQueries(["settings"]);
      toast.success("Settings updated successfully!");
    },
  });

  return {
    settingsData: settingsData,
    updateSettings: updateSettingsMutation.mutateAsync,
    isLoading,
    isFetching,
    error,
    isUpdating: updateSettingsMutation.isPending,
  };
};
