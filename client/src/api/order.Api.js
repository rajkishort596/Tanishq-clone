import axios from "../axios";

export const fetchAllOrders = async (queryParams) => {
  try {
    const response = await axios.get("/users/me/orders", {
      params: queryParams,
    });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};

export const fetchOrderById = async (orderId) => {
  try {
    const response = await axios.get(`/users/me/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to fetch order with Id:${orderId}`, error);
    throw error;
  }
};

export const createNewOrder = async (orderData) => {
  try {
    const response = await axios.post(`/users/me/orders/`, orderData);
    return response.data.data;
  } catch (error) {
    console.error(`Failed to create order`, error);
    throw error;
  }
};
