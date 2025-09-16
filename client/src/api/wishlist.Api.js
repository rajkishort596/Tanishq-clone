import axios from "../axios";

export const addToWishlist = async (productId) => {
  try {
    const response = await axios.post(`/users/me/wishlist/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to add Product to wishlist:", error);
    throw error;
  }
};

export const fetchWishlist = async () => {
  try {
    const response = await axios.get("/users/me/wishlist");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch wishlist:", error);
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const response = await axios.delete(`/users/me/wishlist/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to remove product from wishlist:", error);
    throw error;
  }
};
