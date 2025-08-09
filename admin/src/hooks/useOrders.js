import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteOrder, fetchOrders, updateOrderStatus } from "../api/order.Api";
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
    queryFn: () => fetchOrders(queryParams),
    staleTime: 5 * 60 * 1000,
    keepPreviousData: true,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: ({ orderId, status, paymentStatus }) =>
      updateOrderStatus(orderId, status, paymentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      toast.success("Order status updated successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to update order status.");
      console.error("Update Order Status error:", err);
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      toast.success("Order deleted successfully!");
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to delete order.");
      console.error("Delete Order error:", err);
    },
  });

  return {
    orders: ordersData?.orders || [],
    totalOrders: ordersData?.totalOrders || 0,
    isLoading,
    isFetching,
    error,
    deleteOrder: deleteOrderMutation.mutateAsync,
    isDeleting: deleteOrderMutation.isPending,
    updateStatus: updateOrderStatusMutation.mutateAsync,
    isUpdating: updateOrderStatusMutation.isPending,
  };
};
