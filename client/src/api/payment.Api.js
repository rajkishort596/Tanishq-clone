import axios from "../axios";

export const createRazorpayOrder = async (payload) => {
  try {
    const response = await axios.post("/users/payment/create", payload);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create razorpay order:", error);
    throw error;
  }
};

export const verifyRazorpayPayment = async (payload) => {
  try {
    const response = await axios.post("/users/payment/verify", payload);
    return response.data;
  } catch (error) {
    console.error("Failed to verify Razorpay payment:", error);
    throw error;
  }
};
