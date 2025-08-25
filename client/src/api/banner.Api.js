import axios from "../axios.js";

export const fetchBanners = async () => {
  try {
    const response = await axios.get(`/public/banners`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching banners:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch banners."
    );
  }
};
