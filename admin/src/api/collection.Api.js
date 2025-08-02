import axios from "../axios";

export const fetchCollections = async (params) => {
  try {
    const response = await axios.get(`/admin/collections`, { params: params });
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

export const fetchCollectionById = async (collectionId) => {
  try {
    const response = await axios.get(`/admin/collections/${collectionId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      `Error fetching collection ${collectionId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch collection details."
    );
  }
};

export const createCollection = async (formData) => {
  try {
    const response = await axios.post("/admin/collections", formData);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error creating collection:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create collection."
    );
  }
};

export const updateCollection = async ({ collectionId, formData }) => {
  try {
    const response = await axios.patch(
      `/admin/collections/${collectionId}`,
      formData
    );
    return response.data.data;
  } catch (error) {
    console.error(
      `Error updating collection ${collectionId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update collection."
    );
  }
};

export const deleteCollection = async (collectionId) => {
  try {
    const response = await axios.delete(`/admin/collections/${collectionId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      `Error deleting collection ${collectionId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete collection."
    );
  }
};
