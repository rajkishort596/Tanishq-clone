import axios from "../axios";

export const fetchReviews = async (queryParams) => {
  try {
    const response = await axios.get(`/admin/reviews`, { params: queryParams });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching reviews:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch reviews."
    );
  }
};
export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`/admin/reviews/${reviewId}`);
    return response.data.data;
  } catch (error) {
    console.error(
      `Error deleting reviews ${reviewId}`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete reviews."
    );
  }
};

export const updateReviewStatus = async (reviewId, isApproved) => {
  console.log(isApproved);
  try {
    const response = await axios.put(`/admin/reviews/${reviewId}/status`, {
      isApproved,
    });
    return response.data.data;
  } catch (error) {
    console.error(
      "Error Changing reviews status",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to change reviews status."
    );
  }
};
