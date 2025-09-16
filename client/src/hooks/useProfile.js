import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addNewAddress,
  deleteAddress,
  fetchAllAddress,
  updateAddress,
} from "../api/profile.Api";
import { toast } from "react-toastify";

export const useProfile = () => {
  const queryClient = useQueryClient();
  const {
    data: addresses,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: fetchAllAddress,
    staleTime: 5 * 60 * 1000,
  });

  const addAddressMutation = useMutation({
    mutationFn: addNewAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address added successfully");
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: ({ addressId, addressData }) =>
      updateAddress(addressId, addressData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address updated successfully");
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: (addressId) => deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
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
