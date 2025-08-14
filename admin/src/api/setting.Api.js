import axios from "../axios";

export const getAdminSettings = async () => {
  try {
    const response = await axios.get("/admin/settings");
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching admin settings:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch admin settings."
    );
  }
};
export const updateAdminSettings = async (settingsData) => {
  console.log(settingsData);
  try {
    const response = await axios.patch("/admin/settings", settingsData);
    return response.data.data;
  } catch (error) {
    console.error(
      "Error updating admin settings:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update admin settings."
    );
  }
};
