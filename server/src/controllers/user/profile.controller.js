import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import {
  deleteImageFromCloudinary,
  uploadOnCloudinary,
} from "../../utils/cloudinary.js"; // Import for deleting old avatar on user deletion

/**
 * @desc Get the authenticated user's profile details.
 * @route GET /api/v1/users/me
 * @access Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is populated by the verifyJWT middleware
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile fetched successfully"));
});

/**
 * @desc Update the authenticated user's profile details (e.g., first name, last name, phone).
 * @route PUT /api/v1/users/me
 * @access Private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
  // req.user is populated by the verifyJWT middleware
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const { firstName, lastName, phone, dob, anniversary, gender } = req.body;

  // Basic validation: ensure at least one field is provided for update
  if (
    [firstName, lastName, phone].every(
      (field) => field === undefined || field === null || field.trim() === ""
    )
  ) {
    throw new ApiError(
      400,
      "Please provide fields to update (firstName, lastName, or phone)"
    );
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Update fields only if they are provided in the request body
  if (firstName && firstName.trim() !== "") {
    user.firstName = firstName.trim();
  }
  if (lastName && lastName.trim() !== "") {
    user.lastName = lastName.trim();
  }
  if (phone && phone.trim() !== "") {
    user.phone = phone.trim();
  }
  if (dob && dob.trim() !== "") {
    user.dob = dob.trim();
  }
  if (anniversary && anniversary.trim() !== "") {
    user.anniversary = anniversary.trim();
  }
  if (gender && gender.trim() !== "") {
    user.gender = gender.trim();
  }

  await user.save({ validateBeforeSave: true });

  // Return the updated user profile, excluding sensitive data
  const updatedUser = await User.findById(req.user._id)
    .select("-password -refreshToken -otp -otpExpiry")
    .populate("wishlist addresses");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User profile updated successfully")
    );
});

/**
 * @desc Update the authenticated user's avatar.
 * @route PUT /api/v1/users/me/avatar
 * @access Private
 */
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path; // Path to the uploaded file by Multer

  // req.user is populated by the verifyJWT middleware
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing from the request.");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Delete the old avatar from Cloudinary if it exists and is not a default/placeholder avatar
  if (
    user.avatar &&
    user.avatar.publicId &&
    user.avatar.publicId !== "default_avatar"
  ) {
    try {
      await deleteImageFromCloudinary(user.avatar.publicId);
      console.log(
        `Old avatar ${user.avatar.publicId} deleted from Cloudinary for user ${user._id}`
      );
    } catch (error) {
      console.error(`Error deleting old avatar for user ${user._id}:`, error);
    }
  }

  // Upload the new avatar to Cloudinary
  const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);

  if (!uploadedAvatar || !uploadedAvatar.url) {
    throw new ApiError(
      500,
      "Failed to upload new avatar to Cloudinary. Please try again."
    );
  }

  // Update user's avatar information in the database
  user.avatar = {
    url: uploadedAvatar.url,
    publicId: uploadedAvatar.public_id,
  };
  await user.save({ validateBeforeSave: false });

  // Fetch the updated user data
  const updatedUser = await User.findById(req.user._id).select(
    "-password -refreshToken -otp -otpExpiry"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully."));
});

/**
 * @desc Delete the authenticated user's profile and associated data.
 * @route DELETE /api/v1/users/me
 * @access Private
 */
const deleteUserProfile = asyncHandler(async (req, res) => {
  // req.user is populated by the verifyJWT middleware
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated");
  }

  const userToDelete = await User.findById(req.user._id);

  if (!userToDelete) {
    throw new ApiError(404, "User not found");
  }

  // Delete user's avatar from Cloudinary
  if (
    userToDelete.avatar &&
    userToDelete.avatar.publicId &&
    userToDelete.avatar.publicId !== "default_avatar"
  ) {
    try {
      await deleteImageFromCloudinary(userToDelete.avatar.publicId);
      console.log(
        `Cloudinary avatar ${userToDelete.avatar.publicId} deleted for user ${userToDelete._id}`
      );
    } catch (error) {
      console.error(
        `Failed to delete avatar from Cloudinary for user ${userToDelete._id}:`,
        error
      );
    }
  }

  // Delete the user document from the database
  await userToDelete.deleteOne();

  // Clear authentication cookies from the client
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };

  return res
    .status(200)
    .clearCookie("UserAccessToken", options)
    .clearCookie("UserRefreshToken", options)
    .json(new ApiResponse(200, {}, "User account deleted successfully."));
});

export {
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  deleteUserProfile,
};
