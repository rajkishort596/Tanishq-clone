import axios from "../axios.js";

export const fetchCollections = async (params) => {
  try {
    const response = await axios.get(`/public/collections`, { params: params });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching collections:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch collections."
    );
  }
};
