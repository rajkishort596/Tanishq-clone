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
export const fetchAllAddress = async () => {
  try {
    const response = await axios.get("/users/me/addresses");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    throw error;
  }
};

export const addNewAddress = async (addressData) => {
  try {
    const response = await axios.post("/users/me/addresses", addressData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to add new address:", error);
    throw error;
  }
};

export const updateAddress = async (addressId, addressData) => {
  try {
    const response = await axios.put(
      `/users/me/addresses/${addressId}`,
      addressData
    );
    return response.data.data;
  } catch (error) {
    console.error("Failed to update address:", error);
    throw error;
  }
};
export const deleteAddress = async (addressId) => {
  try {
    const response = await axios.delete(`/users/me/addresses/${addressId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to delete address:", error);
    throw error;
  }
};
