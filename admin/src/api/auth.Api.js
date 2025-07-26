import axios from "../axios.js";

export const loginAdmin = async (adminData) => {
  try {
    const response = await axios.post("/admin/login", adminData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to login Admin:", error);
    throw error;
  }
};
export const logoutAdmin = async () => {
  try {
    const response = await axios.post("/admin/logout");
    return response.data.data;
  } catch (error) {
    console.error("Failed to logout Admin:", error);
    throw error;
  }
};
