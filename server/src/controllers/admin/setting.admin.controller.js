import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import Setting from "../../models/setting.model.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../../utils/cloudinary.js";

/**
 * @desc Get all settings for admin
 * @route GET /api/v1/admin/settings
 * @access Private (Admin only)
 */
const getAdminSettings = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view settings."
    );
  }

  // Finding the single settings document or creating a new one if it doesn't exist
  // We use upsert for a single source of truth.
  const settings = await Setting.findOneAndUpdate(
    {}, // Find the single document
    {}, // No update, just upsert
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, settings, "Settings fetched successfully."));
});

/**
 * @desc Update all store settings
 * @route PATCH /api/v1/admin/settings
 * @access Private (Admin only)
 */
const updateAdminSettings = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can update settings."
    );
  }

  let settingsData = req.body;
  const logoLocalPath = req.file?.path;

  const existingSettings = await Setting.findOne();

  if (!existingSettings) {
    throw new ApiError(404, "Settings not found.");
  }

  // If new logo uploaded
  if (logoLocalPath) {
    if (existingSettings?.storeInfo?.logo?.publicId) {
      await deleteImageFromCloudinary(existingSettings.storeInfo.logo.publicId);
    }

    const uploadedLogo = await uploadOnCloudinary(logoLocalPath);
    if (!uploadedLogo) {
      throw new ApiError(500, "Failed to upload new logo.");
    }

    settingsData.storeInfo = {
      ...existingSettings.storeInfo, // keep other existing storeInfo fields
      ...settingsData.storeInfo,
      logo: {
        url: uploadedLogo.url,
        publicId: uploadedLogo.public_id,
      },
    };
  } else {
    settingsData.storeInfo = {
      ...existingSettings.storeInfo,
      ...settingsData.storeInfo,
    };
  }

  const updatedSettings = await Setting.findOneAndUpdate(
    {},
    { $set: settingsData },
    { new: true, runValidators: true }
  );

  if (!updatedSettings) {
    throw new ApiError(500, "Failed to update settings.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedSettings, "Settings updated successfully.")
    );
});

export { getAdminSettings, updateAdminSettings };
