import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Banner } from "../../models/banner.model.js";
import {
  deleteImageFromCloudinary,
  uploadOnCloudinary,
} from "../../utils/cloudinary.js";

/**
 * @desc Create a new banner.
 * @route POST /api/v1/admin/banners
 * @access Private (Admin only)
 */
const createBanner = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can create banners."
    );
  }

  const { title, description, linkUrl, isActive } = req.body;

  // 2. Basic Validation
  if (!title) {
    throw new ApiError(400, "Banner title is required.");
  }

  // 3. Handle Image Upload
  const imageLocalPath = req.file?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Banner image is required.");
  }

  let uploadedImage = {};
  try {
    const result = await uploadOnCloudinary(imageLocalPath);
    if (result && result.url && result.public_id) {
      uploadedImage = { url: result.url, publicId: result.public_id };
    } else {
      throw new Error("Cloudinary upload failed for banner image.");
    }
  } catch (error) {
    console.error("Error uploading banner image:", error);
    throw new ApiError(500, "Failed to upload banner image.");
  }

  // 4. Create the Banner
  const banner = await Banner.create({
    title: title.trim(),
    description: description ? description.trim() : "",
    image: uploadedImage,
    link: linkUrl ? linkUrl.trim() : "#", // Default link to homepage or '#'
    isActive: isActive !== undefined ? isActive : true, // Default to active
  });

  if (!banner) {
    // Clean up uploaded image if banner creation fails
    await deleteImageFromCloudinary(uploadedImage.publicId);
    throw new ApiError(500, "Failed to create banner. Please try again.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, banner, "Banner created successfully."));
});

/**
 * @desc Get all banners for admin view (including inactive ones).
 * @route GET /api/v1/admin/banners
 * @access Private (Admin only)
 */
const getAllBannersAdmin = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view all banners."
    );
  }

  const { page = 1, limit = 10, search = "", isActive } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    customLabels: {
      totalDocs: "totalBanners",
      docs: "banners",
    },
  };

  const banners = await Banner.paginate(query, options);

  if (!banners || banners.banners.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { docs: [], totalDocs: 0, limit, page: parseInt(page, 10) },
          "No banners found."
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, banners, "Banners fetched successfully for admin.")
    );
});

/**
 * @desc Get a single banner by ID for admin view.
 * @route GET /api/v1/admin/banners/:bannerId
 * @access Private (Admin only)
 */
const getBannerByIdAdmin = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view banner details."
    );
  }

  const { bannerId } = req.params;

  const banner = await Banner.findById(bannerId);

  if (!banner) {
    throw new ApiError(404, "Banner not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, banner, "Banner details fetched successfully."));
});

/**
 * @desc Update an existing banner by ID.
 * @route PUT /api/v1/admin/banners/:bannerId
 * @access Private (Admin only)
 */
const updateBanner = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can update banners."
    );
  }

  const { bannerId } = req.params;
  const { title, description, linkUrl, order, isActive } = req.body;
  const imageLocalPath = req.file?.path;

  const banner = await Banner.findById(bannerId);
  if (!banner) {
    throw new ApiError(404, "Banner not found.");
  }

  // 2. Update fields
  if (title !== undefined) banner.title = title.trim();
  if (description !== undefined) banner.description = description.trim();
  if (linkUrl !== undefined) banner.link = linkUrl.trim();
  if (order !== undefined) banner.order = parseInt(order, 10);
  if (isActive !== undefined) banner.isActive = isActive;

  // 3. Handle Image Update
  if (imageLocalPath) {
    // Delete old image from Cloudinary if it exists
    if (banner.publicId) {
      try {
        await deleteImageFromCloudinary(banner.publicId);
      } catch (error) {
        console.warn(
          `Failed to delete old banner image ${banner.publicId}:`,
          error.message
        );
      }
    }
    // Upload new image
    let uploadedImage = {};
    try {
      const result = await uploadOnCloudinary(imageLocalPath);
      if (result && result.url && result.public_id) {
        uploadedImage = { url: result.url, publicId: result.public_id };
      } else {
        throw new Error("Cloudinary upload failed for new banner image.");
      }
    } catch (error) {
      console.error("Error uploading new banner image:", error);
      throw new ApiError(500, "Failed to upload new banner image.");
    }
    banner.image = uploadedImage;
  } else if (req.body.clearImage === "true" && banner.publicId) {
    // Allow explicit clearing of image
    try {
      await deleteImageFromCloudinary(banner.publicId);
      banner.image.url = ""; // Clear URL
      banner.image.publicId = ""; // Clear publicId
    } catch (error) {
      console.warn(
        `Failed to delete banner image during explicit clear ${banner.publicId}:`,
        error.message
      );
    }
  }

  // 4. Save the updated banner
  await banner.save();

  return res
    .status(200)
    .json(new ApiResponse(200, banner, "Banner updated successfully."));
});

/**
 * @desc Delete a specific banner by ID.
 * @route DELETE /api/v1/admin/banners/:bannerId
 * @access Private (Admin only)
 */
const deleteBanner = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can delete banners."
    );
  }

  const { bannerId } = req.params;

  const banner = await Banner.findById(bannerId);
  if (!banner) {
    throw new ApiError(404, "Banner not found.");
  }

  // Delete associated image from Cloudinary
  if (banner.publicId) {
    try {
      await deleteImageFromCloudinary(banner.publicId);
    } catch (error) {
      console.error(`Failed to delete banner image ${banner.publicId}:`, error);
    }
  }

  // Delete the banner document
  await banner.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Banner deleted successfully."));
});

export {
  createBanner,
  getAllBannersAdmin,
  getBannerByIdAdmin,
  updateBanner,
  deleteBanner,
};
