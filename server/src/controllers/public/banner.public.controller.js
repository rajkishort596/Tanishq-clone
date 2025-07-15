import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Banner } from "../../models/banner.model.js";

/**
 * @desc Get all active banners for public display (e.g., homepage carousels).
 * @route GET /api/v1/public/banners
 * @access Public
 */
const getActiveBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find({
    active: true,
  })
    .sort({ createdAt: 1 })
    .select("title image link");

  if (!banners || banners.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No active banners found."));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, banners, "Active banners fetched successfully.")
    );
});

export { getActiveBanners };
