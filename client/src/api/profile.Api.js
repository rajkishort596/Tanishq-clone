import axios from "../axios";

export const updateProfile = async (userData) => {
  try {
    const response = await axios.put("/users/me", userData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to Update Profile:", error);
    throw error;
  }
};
