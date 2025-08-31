import axios from "../axios.js";

export const fetchPublicSettings = async () => {
  try {
    const response = await axios.get(`/public/settings`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching Public Settings:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Public Settings."
    );
  }
};
