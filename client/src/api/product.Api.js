import axios from "../axios";

export const fetchProducts = async (params) => {
  try {
    const response = await axios.get(`/public/products`, { params: params });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching products:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch products."
    );
  }
};

export const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(`/public/products/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      `Error fetching product ${productId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch product details."
    );
  }
};

export const getMetalRate = async (metal = "Gold") => {
  try {
    const response = await axios.get("/public/metal-rate", {
      params: { metal },
    });
    return response.data.data;
  } catch (error) {
    console.error(
      `Error fetching ${metal} rate`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || `Failed to fetch ${metal} rate`
    );
  }
};
