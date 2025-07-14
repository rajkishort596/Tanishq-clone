import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Review } from "../../models/review.model.js";
import { Product } from "../../models/product.model.js";
/**
 * @desc Submit a new review for a product.
 * @route POST /api/v1/users/products/:productId/reviews
 * @access Private (User only)
 */
const submitReview = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { productId } = req.params;
  const { rating, comment } = req.body;

  // 2. Basic Validation
  if (!rating || rating < 1 || rating > 5) {
    throw new ApiError(400, "Rating is required and must be between 1 and 5.");
  }
  if (!comment || comment.trim() === "") {
    throw new ApiError(400, "Comment cannot be empty.");
  }

  // 3. Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // 4. Check if user has already reviewed this product
  const existingReview = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (existingReview) {
    throw new ApiError(
      409,
      "You have already submitted a review for this product. Please update your existing review instead."
    );
  }

  // 5. Create the new review
  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating,
    comment: comment.trim(),
    isApproved: false, // Reviews might need admin approval before being public
  });

  if (!review) {
    throw new ApiError(500, "Failed to submit review. Please try again.");
  }

  // 6. Update product's aggregated ratings (optional, but good for performance)
  // This will calculate new average rating and total count
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

  if (stats.length > 0) {
    product.ratings.average = stats[0].averageRating;
    product.ratings.count = stats[0].numberOfReviews;
  } else {
    product.ratings.average = 0;
    product.ratings.count = 0;
  }

  // Add the review ID to the product's reviews array
  product.reviews.push(review._id);
  await product.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        review,
        "Review submitted successfully. It may be subject to approval."
      )
    );
});

/**
 * @desc Get all reviews for a specific product.
 * @route GET /api/v1/users/products/:productId/reviews
 * @access Public
 */
const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  const query = { product: productId, isApproved: false }; // Only fetch unapproved reviews for now

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: {
      path: "user",
      select: "firstName lastName avatar.url",
    },
    customLabels: {
      totalDocs: "totalReviews",
      docs: "reviews",
    },
  };

  const reviews = await Review.paginate(query, options);

  if (!reviews || reviews.reviews.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, [], "No reviews found for this product."));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, reviews, "Product reviews fetched successfully.")
    );
});

/**
 * @desc Update an authenticated user's own review.
 * @route PUT /api/v1/users/reviews/:reviewId
 * @access Private (User only)
 */
const updateReview = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  // 2. Validate input
  if (!rating && (!comment || comment.trim() === "")) {
    throw new ApiError(400, "Please provide rating or comment to update.");
  }
  if (rating && (rating < 1 || rating > 5)) {
    throw new ApiError(400, "Rating must be between 1 and 5.");
  }

  // 3. Find the review and ensure it belongs to the authenticated user
  const review = await Review.findOne({ _id: reviewId, user: req.user._id });

  if (!review) {
    throw new ApiError(404, "Review not found or does not belong to you.");
  }

  // 4. Update the review fields
  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment.trim();
  review.isApproved = false;

  await review.save();

  // 5. Re-calculate product's aggregated ratings if rating was changed
  if (rating !== undefined) {
    const product = await Product.findById(review.product);
    if (product) {
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
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        review,
        "Review updated successfully. It may be subject to re-approval."
      )
    );
});

/**
 * @desc Delete an authenticated user's own review.
 * @route DELETE /api/v1/users/reviews/:reviewId
 * @access Private (User only)
 */
const deleteReview = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { reviewId } = req.params;

  // 2. Find the review and ensure it belongs to the authenticated user
  const review = await Review.findOneAndDelete({
    _id: reviewId,
    user: req.user._id,
  });

  if (!review) {
    throw new ApiError(404, "Review not found or does not belong to you.");
  }

  // 3. Update product's aggregated ratings and remove review ID from product
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

export { submitReview, getProductReviews, updateReview, deleteReview };
