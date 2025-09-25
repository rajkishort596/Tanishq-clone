import axios from "../axios";

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axios.post("/users/me/cart", {
      productId,
      quantity,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to add product to cart:", error);
    throw error;
  }
};

export const fetchCart = async () => {
  try {
    const response = await axios.get("/users/me/cart");
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    throw error;
  }
};

export const updateItemQuantity = async (productId, quantity) => {
  try {
    const response = await axios.put(`/users/me/cart/${productId}`, {
      quantity,
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to update item quantity:", error);
    throw error;
  }
};

export const removeCartItem = async (productId) => {
  try {
    const response = await axios.delete(`/users/me/cart/${productId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await axios.delete("/users/me/cart");
    return response.data.data;
  } catch (error) {
    console.error("Failed to clear cart:", error);
    throw error;
  }
};
