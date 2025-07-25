import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "../api/dashboard.Api.js";
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });
};
