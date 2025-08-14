import axios from "axios";
import store from "./app/store.js";
import { logout as adminLogout } from "./features/authSlice.js";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

const AUTH_WHITELIST = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
  "/admin/change-password",
  "/admin/refresh-token",
];

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error response exists, status is 401, not already retried,
    // and the original request URL is not in the whitelist.
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !AUTH_WHITELIST.some((path) => originalRequest.url.includes(path))
    ) {
      originalRequest._retry = true;

      try {
        const refreshEndpoint = "/admin/refresh-token";

        await axiosInstance.post(refreshEndpoint);

        // Retry the original request with the new access token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh token fails (e.g., refresh token expired or invalid),
        // log out the admin and reject the promise.
        console.error("Refresh token failed:", refreshError);

        // Dispatch the appropriate logout action
        store.dispatch(adminLogout());

        // IMPORTANT: Mark the original request as not retryable if refresh failed,
        // to prevent potential subsequent attempts if the error propagates
        originalRequest._retry = true; // Already set, but reinforcing the state
        return Promise.reject(refreshError);
      }
    }

    // For any other error or if the 401 was for a whitelisted route or already retried,
    // just reject the promise with the original error.
    return Promise.reject(error);
  }
);

export default axiosInstance;
