import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewAddress,
  deleteAddress,
  fetchAllAddress,
  updateAddress,
} from "../api/profile.Api";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

export const useAddresses = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const {
    data: addresses,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAllAddress,
    refetchOnWindowFocus: false,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    refetchOnReconnect: true,
    retry: isAuthenticated ? 1 : 0,
  });

  const addAddressMutation = useMutation({
    mutationFn: addNewAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Address added successfully");
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ addressId, addressData }) =>
      updateAddress(addressId, addressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Address updated successfully");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId) => deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success("Address deleted successfully");
    },
  });

  return {
    addresses: addresses || [],
    addAddress: addAddressMutation.mutateAsync,
    updateAddress: updateAddressMutation.mutateAsync,
    deleteAddress: deleteAddressMutation.mutateAsync,
    isUpdating: updateAddressMutation.isPending,
    isAdding: addAddressMutation.isPending,
    isDeleting: deleteAddressMutation.isPending,
    isLoading,
    error,
    isFetching,
  };
};
