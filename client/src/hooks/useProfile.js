import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchUserProfile } from "../api/auth.Api";
import { updateProfile } from "../api/profile.Api";

export const useProfile = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    isFetching,
    isSuccess,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Profile updated successfully!");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update profile.");
    },
  });

  return {
    user,
    isLoading,
    isFetching,
    isSuccess,
    error,
    updateUser: updateUserMutation.mutateAsync,
    isUpdating: updateUserMutation.isPending,
  };
};
