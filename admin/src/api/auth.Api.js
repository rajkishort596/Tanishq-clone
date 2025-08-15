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
export const fetchAdminProfile = async () => {
  try {
    const response = await axios.get("/admin/me");
    return response.data.data;
  } catch (error) {
    console.error("Failed to Fetch Admin Profile:", error);
    throw error;
  }
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await axios.post("/admin/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data.data;
};
export const forgotPassword = async (email) => {
  const response = await axios.post("/admin/forgot-password", { email });
  return response.data.data;
};

export const resetPassword = async ({ token, password }) => {
  const response = await axios.post("/admin/reset-password", {
    token,
    password,
  });
  return response.data.data;
};
