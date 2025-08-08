import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Review } from "../../models/review.model.js";
import { Product } from "../../models/product.model.js";

/**
 * @desc Get all reviews for admin view with filtering, sorting, and pagination.
 *       Admins can see all reviews, including unapproved ones.
 * @route GET /api/v1/admin/reviews
 * @access Private (Admin only)
 */
const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view all reviews."
    );
  }

  const {
    page = 1,
    limit = 10,
    search = "",
    productId,
    userId,
    rating,
    isApproved,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const query = {};

  if (search) {
    // Aggregation pipeline to search on populated fields
    const searchPipeline = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $match: {
          $or: [
            { "user.firstName": { $regex: search, $options: "i" } },
            { "user.lastName": { $regex: search, $options: "i" } },
            { "product.name": { $regex: search, $options: "i" } },
          ],
        },
      },
      {
        $group: {
          _id: "$_id",
        },
      },
    ];

    const matchedReviews = await Review.aggregate(searchPipeline);
    const matchedReviewIds = matchedReviews.map((r) => r._id);

    // If no reviews match the search, the result is an empty array.
    if (matchedReviewIds.length === 0) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { docs: [], totalDocs: 0, limit, page: parseInt(page, 10) },
            "No reviews found matching the search criteria."
          )
        );
    }
    // Add the list of matching IDs to the main query
    query._id = { $in: matchedReviewIds };
  }

  // Filter by product ID
  if (productId) {
    query.product = productId;
  }

  // Filter by user ID
  if (userId) {
    query.user = userId;
  }

  // Filter by rating
  if (rating) {
    query.rating = parseInt(rating, 10);
  }

  // Filter by approval status
  if (isApproved?.toLowerCase() === "true") {
    query.isApproved = true;
  } else if (isApproved?.toLowerCase() === "false") {
    query.isApproved = false;
  }

  // Sorting options
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Pagination options
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort,
    populate: [
      { path: "user", select: "firstName lastName email" },
      { path: "product", select: "name images" },
    ],
    customLabels: {
      totalDocs: "totalReviews",
      docs: "reviews",
    },
  };

  const reviews = await Review.paginate(query, options);

  if (!reviews || reviews.reviews.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { docs: [], totalDocs: 0, limit, page: parseInt(page, 10) },
          "No reviews found."
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, reviews, "Reviews fetched successfully for admin.")
    );
});

/**
 * @desc Get details of a specific review by ID for admin view.
 * @route GET /api/v1/admin/reviews/:reviewId
 * @access Private (Admin only)
 */
const getReviewByIdAdmin = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view review details."
    );
  }

  const { reviewId } = req.params;

  const review = await Review.findById(reviewId)
    .populate({ path: "user", select: "firstName lastName email" })
    .populate({ path: "product", select: "name images sku" });

  if (!review) {
    throw new ApiError(404, "Review not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review details fetched successfully."));
});

/**
 * @desc Approve or Reject a review.
 * @route PUT /api/v1/admin/reviews/:reviewId/status
 * @access Private (Admin only)
 */
const updateReviewApprovalStatus = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can update review approval status."
    );
  }

  const { reviewId } = req.params;
  const { isApproved } = req.body; // Expecting boolean true/false

  console.log(isApproved);
  if (typeof isApproved !== "boolean") {
    throw new ApiError(
      400,
      "isApproved must be a boolean value (true or false)."
    );
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found.");
  }

  review.isApproved = isApproved;
  await review.save();

  // Re-calculate product's aggregated ratings if the approval status changed
  // and this review contributes to the public average
  const product = await Product.findById(review.product);
  if (product) {
    const stats = await Review.aggregate([
      { $match: { product: product._id, isApproved: true } }, // Only approved reviews
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          numberOfReviews: { $sum: 1 },
        },
      },
    ]);
    product.ratings.average = stats.length > 0 ? stats[0].averageRating : 0;
    product.ratings.count = stats.length > 0 ? stats[0].numberOfReviews : 0;
    await product.save({ validateBeforeSave: false });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        review,
        `Review ${isApproved ? "approved" : "rejected"} successfully.`
      )
    );
});

/**
 * @desc Delete a specific review by ID (Admin can delete any review).
 * @route DELETE /api/v1/admin/reviews/:reviewId
 * @access Private (Admin only)
 */
const deleteReviewAdmin = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can delete reviews."
    );
  }

  const { reviewId } = req.params;

  const review = await Review.findByIdAndDelete(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found.");
  }

  // Update product's aggregated ratings and remove review ID from product
  const product = await Product.findById(review.product);
  if (product) {
    // Remove the review ID from the product's reviews array
    product.reviews = product.reviews.filter(
      (id) => id.toString() !== reviewId
    );

    // Re-calculate average rating and count
    const stats = await Review.aggregate([
      { $match: { product: product._id, isApproved: true } },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          numberOfReviews: { $sum: 1 },
        },
      },
    ]);
    product.ratings.average = stats.length > 0 ? stats[0].averageRating : 0;
    product.ratings.count = stats.length > 0 ? stats[0].numberOfReviews : 0;
    await product.save({ validateBeforeSave: false });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully."));
});

export {
  getAllReviewsAdmin,
  getReviewByIdAdmin,
  updateReviewApprovalStatus,
  deleteReviewAdmin,
};
