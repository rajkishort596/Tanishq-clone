import axios from "../axios";

export const fetchCategories = async (params) => {
  try {
    const response = await axios.get(`/admin/categories`, { params: params });
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

export const fetchCategoryById = async (categoryId) => {
  try {
    const response = await axios.get(`/admin/categories/${categoryId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      `Error fetching category ${categoryId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch category details."
    );
  }
};

export const createCategory = async (formData) => {
  try {
    const response = await axios.post(`/admin/categories`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating category:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create category."
    );
  }
};

export const updateCategory = async ({ categoryId, formData }) => {
  try {
    const response = await axios.put(
      `/admin/categories/${categoryId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating category ${categoryId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update category."
    );
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const response = await axios.delete(`/admin/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting category ${categoryId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete category."
    );
  }
};
