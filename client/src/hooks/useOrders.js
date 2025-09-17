import { useQuery } from "@tanstack/react-query";
import { fetchAllOrders, fetchOrderById } from "../api/order.Api";

export const useOrders = (queryParams) => {
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

  return {
    orders: ordersData?.orders || [],
    totalOrders: ordersData?.totalOrders || 0,
    page: ordersData?.page || 1,
    totalPages: ordersData?.totalPages || 1,
    isLoading,
    error,
    isFetching,
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
