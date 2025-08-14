import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import Setting from "../../models/setting.model.js";

/**
 * @desc Get public-facing store settings
 * @route GET /api/v1/public/settings
 * @access Public
 */
const getPublicSettings = asyncHandler(async (req, res) => {
  // Find the single settings document.
  const settings = await Setting.findOne();

  if (!settings) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, {}, "No settings found, returning default data.")
      );
  }

  // Destructuring and returning fields.
  const { storeInfo, contactInfo, socialLinks, paymentSettings } = settings;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { storeInfo, contactInfo, socialLinks, paymentSettings },
        "Public settings fetched successfully."
      )
    );
});

export { getPublicSettings };
