import axios from "../axios";

/**
 * Fetches a list of all orders with optional filtering, searching, and pagination.
 * @param {object} queryParams - An object containing query parameters (e.g., page, limit, search, status).
 * @returns {Promise<object>} A promise that resolves to the orders data.
 */
export const fetchOrders = async (queryParams) => {
  try {
    const response = await axios.get(`/admin/orders`, { params: queryParams });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching orders:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch orders.");
  }
};

/**
 * Deletes a specific order by its ID.
 * @param {string} orderId - The ID of the order to delete.
 * @returns {Promise<object>} A promise that resolves to the deleted order data.
 */
export const deleteOrder = async (orderId) => {
  try {
    const response = await axios.delete(`/admin/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      `Error deleting order ${orderId}:`,
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to delete order.");
  }
};

/**
 * Updates the status of a specific order.
 * @param {string} orderId - The ID of the order to update.
 * @param {string} status - The new status of the order (e.g., "confirmed", "completed").
 * @returns {Promise<object>} A promise that resolves to the updated order data.
 */
export const updateOrderStatus = async (orderId, status, paymentStatus) => {
  try {
    const response = await axios.put(`/admin/orders/${orderId}/status`, {
      status,
      paymentStatus,
    });
    return response.data.data;
  } catch (error) {
    console.error(
      `Error changing order status for ${orderId}:`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to change order status."
    );
  }
};
