import axios from "../axios.js";

export const fetchCategories = async (params) => {
  try {
    const response = await axios.get(`/public/categories`, { params: params });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching categories:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch categories."
    );
  }
};
