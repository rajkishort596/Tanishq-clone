import axios from "../axios";

export const fetchProducts = async (params) => {
  try {
    const response = await axios.get(`/admin/products`, { params: params });
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
    const response = await axios.get(`/admin/products/${productId}`);
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

export const createProduct = async (formData) => {
  try {
    const response = await axios.post(`/admin/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error creating product:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create product."
    );
  }
};

export const updateProduct = async ({ productId, formData }) => {
  try {
    const response = await axios.put(`/admin/products/${productId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(
      `Error updating product ${productId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update product."
    );
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`/admin/products/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      `Error deleting product ${productId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete product."
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
