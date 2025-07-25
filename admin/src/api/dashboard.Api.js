import axios from "../axios.js";

export const fetchDashboardStats = async () => {
  try {
    const response = await axios.get("/admin/stats");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    throw error;
  }
};
