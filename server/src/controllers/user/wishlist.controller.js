import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import { Product } from "../../models/product.model.js";

/**
 * @desc Add a product to the authenticated user's wishlist.
 * @route POST /api/v1/users/me/wishlist/:productId
 * @access Private
 */
const addProductToWishlist = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { productId } = req.params;

  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Find the user and add the product to their wishlist
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Check if the product is already in the wishlist
  if (user.wishlist.includes(productId)) {
    throw new ApiError(409, "Product is already in the wishlist.");
  }

  user.wishlist.push(productId);
  await user.save({ validateBeforeSave: false }); // No need to validate other user fields

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.wishlist,
        "Product added to wishlist successfully."
      )
    );
});

/**
 * @desc Get the authenticated user's wishlist.
 * @route GET /api/v1/users/me/wishlist
 * @access Private
 */
const getUserWishlist = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const user = await User.findById(req.user._id).populate({
    path: "wishlist",
    select: "name images price",
    model: "Product",
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user.wishlist.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "Your wishlist is empty."));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.wishlist, "Wishlist fetched successfully.")
    );
});

/**
 * @desc Remove a product from the authenticated user's wishlist.
 * @route DELETE /api/v1/users/me/wishlist/:productId
 * @access Private
 */
const removeProductFromWishlist = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { productId } = req.params;

  // Find the user and remove the product from their wishlist
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Check if the product exists in the wishlist
  const initialLength = user.wishlist.length;
  user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);

  if (user.wishlist.length === initialLength) {
    throw new ApiError(404, "Product not found in your wishlist.");
  }

  await user.save({ validateBeforeSave: false }); // Save the changes

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.wishlist,
        "Product removed from wishlist successfully."
      )
    );
});

export { addProductToWishlist, getUserWishlist, removeProductFromWishlist };
