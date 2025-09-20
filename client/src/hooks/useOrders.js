import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllOrders,
  fetchOrderById,
  createNewOrder,
} from "../api/order.Api";
import { toast } from "react-toastify";

export const useOrders = (queryParams) => {
  const queryClient = useQueryClient();

  const {
    data: ordersData,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["orders", queryParams],
    queryFn: () => fetchAllOrders(queryParams),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (orderData) => createNewOrder(orderData),
    onSuccess: () => {
      toast.success("Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to place order.";
      toast.error(errorMessage);
    },
  });

  return {
    orders: ordersData?.orders || [],
    totalOrders: ordersData?.totalOrders || 0,
    page: ordersData?.page || 1,
    totalPages: ordersData?.totalPages || 1,
    isLoading,
    error,
    isFetching,

    createOrder: createOrderMutation.mutateAsync,
    isCreating: createOrderMutation.isPending,
  };
};

// For a single order
export const useOrder = (id) => {
  const {
    data: order,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrderById(id),
    enabled: !!id,
  });

  return {
    order: order || null,
    isLoading,
    error,
    isFetching,
  };
};
