import axios from "../axios";

export const fetchBanners = async () => {
  try {
    const response = await axios.get("/admin/banners");
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
export const fetchBannerById = async (bannerId) => {
  try {
    const response = await axios.get(`/admin/banners/${bannerId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching banner:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch banner.");
  }
};

export const createBanner = async (formData) => {
  try {
    const response = await axios.post("/admin/banners", formData);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error creating banner:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create banner."
    );
  }
};

export const updateBanner = async ({ bannerId, formData }) => {
  try {
    const response = await axios.patch(`/admin/banners/${bannerId}`, formData);
    return response.data.data;
  } catch (error) {
    console.error(
      `Error updating banner ${bannerId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update banner."
    );
  }
};

export const deleteBanner = async (bannerId) => {
  try {
    const response = await axios.delete(`/admin/banners/${bannerId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      `Error deleting banner ${bannerId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete banner."
    );
  }
};
