import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Collection } from "../../models/collection.model.js";
import { Product } from "../../models/product.model.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../../utils/cloudinary.js";

/**
 * @desc Create a new collection.
 * @route POST /api/v1/admin/collections
 * @access Private (Admin only)
 */
const createCollection = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can create collections."
    );
  }

  const { name, description, startDate, endDate, isActive } = req.body;

  if (!name) {
    throw new ApiError(400, "Collection name is required.");
  }

  const existingCollection = await Collection.findOne({
    name: { $regex: new RegExp(`^${name}$`, "i") },
  });
  if (existingCollection) {
    throw new ApiError(409, "Collection with this name already exists.");
  }

  const mainImageLocalPath = req.files?.image?.[0]?.path;
  const bannerImageLocalPath = req.files?.bannerImage?.[0]?.path;

  if (!mainImageLocalPath) {
    throw new ApiError(400, "Main collection image is required.");
  }

  let uploadedMainImage = {};
  let uploadedBannerImage = {};

  // Upload main image
  try {
    const result = await uploadOnCloudinary(mainImageLocalPath);
    if (result && result.url && result.public_id) {
      uploadedMainImage = { url: result.url, publicId: result.public_id };
    } else {
      throw new Error("Cloudinary upload failed for main image.");
    }
  } catch (error) {
    console.error("Error uploading main collection image:", error);
    throw new ApiError(500, "Failed to upload main collection image.");
  }

  if (bannerImageLocalPath) {
    try {
      const result = await uploadOnCloudinary(bannerImageLocalPath);
      if (result && result.url && result.public_id) {
        uploadedBannerImage = { url: result.url, publicId: result.public_id };
      } else {
        throw new Error("Cloudinary upload failed for banner image.");
      }
    } catch (error) {
      console.error("Error uploading banner image:", error);
      await deleteImageFromCloudinary(uploadedMainImage.publicId);
      throw new ApiError(500, "Failed to upload banner image.");
    }
  }

  const collection = await Collection.create({
    name,
    description: description || "",
    image: uploadedMainImage,
    bannerImage: bannerImageLocalPath ? uploadedBannerImage : undefined,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    isActive: isActive !== undefined ? isActive : true,
  });

  if (!collection) {
    await deleteImageFromCloudinary(uploadedMainImage.publicId);
    if (bannerImageLocalPath) {
      await deleteImageFromCloudinary(uploadedBannerImage.publicId);
    }
    throw new ApiError(500, "Failed to create collection. Please try again.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, collection, "Collection created successfully."));
});

/**
 * @desc Get all collections (for admin view, potentially with more details/filters).
 * @route GET /api/v1/admin/collections
 * @access Private (Admin only)
 */
const getAllCollectionsAdmin = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view collections."
    );
  }

  const { page = 1, limit = 10, search, isActive } = req.query;

  const query = {};
  if (search) {
    // query.$or = [
    //   { name: { $regex: search, $options: "i" } },
    //   { description: { $regex: search, $options: "i" } },
    // ];
    query.name = { $regex: search, $options: "i" };
  }
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 }, // Default sort by newest
    customLabels: {
      totalDocs: "totalCollections",
      docs: "collections",
    },
  };

  // Using mongoose-paginate-v2 for simple find queries
  const collections = await Collection.paginate(query, options);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        collections,
        "Collections fetched successfully for admin."
      )
    );
});

/**
 * @desc Get a single collection by ID (for admin view).
 * @route GET /api/v1/admin/collections/:collectionId
 * @access Private (Admin only)
 */
const getCollectionByIdAdmin = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view collection details."
    );
  }

  const { collectionId } = req.params;

  const collection = await Collection.findById(collectionId);

  if (!collection) {
    throw new ApiError(404, "Collection not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        collection,
        "Collection details fetched successfully."
      )
    );
});

/**
 * @desc Update an existing collection by ID.
 * @route PUT /api/v1/admin/collections/:collectionId
 * @access Private (Admin only)
 */
const updateCollection = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can update collections."
    );
  }

  const { collectionId } = req.params;
  const {
    name,
    description,
    startDate,
    endDate,
    isActive,
    clearMainImage,
    clearBannerImage,
  } = req.body;

  const mainImageLocalPath = req.files?.image?.[0]?.path;
  const bannerImageLocalPath = req.files?.bannerImage?.[0]?.path;

  const collection = await Collection.findById(collectionId);
  if (!collection) {
    throw new ApiError(404, "Collection not found.");
  }

  if (name && name.trim() !== "" && name.trim() !== collection.name) {
    const existingCollectionWithNewName = await Collection.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
      _id: { $ne: collectionId }, // Exclude current collection
    });
    if (existingCollectionWithNewName) {
      throw new ApiError(409, "Collection with this name already exists.");
    }
    collection.name = name.trim();
  }

  if (description !== undefined) collection.description = description;
  if (startDate !== undefined)
    collection.startDate = startDate ? new Date(startDate) : undefined;
  if (endDate !== undefined)
    collection.endDate = endDate ? new Date(endDate) : undefined;
  if (isActive !== undefined) collection.isActive = isActive;

  if (mainImageLocalPath) {
    if (collection.image && collection.image.publicId) {
      try {
        await deleteImageFromCloudinary(collection.image.publicId);
      } catch (error) {
        console.warn(
          `Failed to delete old main image ${collection.image.publicId}:`,
          error.message
        );
      }
    }
    try {
      const result = await uploadOnCloudinary(mainImageLocalPath);
      if (result && result.url && result.public_id) {
        collection.image = { url: result.url, publicId: result.public_id };
      } else {
        throw new Error("Cloudinary upload failed for new main image.");
      }
    } catch (error) {
      console.error("Error uploading new main collection image:", error);
      throw new ApiError(500, "Failed to upload new main collection image.");
    }
  } else if (
    clearMainImage === "true" &&
    collection.image &&
    collection.image.publicId
  ) {
    try {
      await deleteImageFromCloudinary(collection.image.publicId);
      collection.image = {};
    } catch (error) {
      console.warn(
        `Failed to delete main image during explicit clear ${collection.image.publicId}:`,
        error.message
      );
    }
  }

  if (bannerImageLocalPath) {
    if (collection.bannerImage && collection.bannerImage.publicId) {
      try {
        await deleteImageFromCloudinary(collection.bannerImage.publicId);
      } catch (error) {
        console.warn(
          `Failed to delete old banner image ${collection.bannerImage.publicId}:`,
          error.message
        );
      }
    }
    try {
      const result = await uploadOnCloudinary(bannerImageLocalPath);
      if (result && result.url && result.public_id) {
        collection.bannerImage = {
          url: result.url,
          publicId: result.public_id,
        };
      } else {
        throw new Error("Cloudinary upload failed for new banner image.");
      }
    } catch (error) {
      console.error("Error uploading new banner image:", error);
      throw new ApiError(500, "Failed to upload new banner image.");
    }
  } else if (
    clearBannerImage === "true" &&
    collection.bannerImage &&
    collection.bannerImage.publicId
  ) {
    try {
      await deleteImageFromCloudinary(collection.bannerImage.publicId);
      collection.bannerImage = {};
    } catch (error) {
      console.warn(
        `Failed to delete banner image during explicit clear ${collection.bannerImage.publicId}:`,
        error.message
      );
    }
  } else if (
    bannerImageLocalPath === undefined &&
    collection.bannerImage &&
    collection.bannerImage.publicId &&
    req.body.bannerImage === null
  ) {
    try {
      await deleteImageFromCloudinary(collection.bannerImage.publicId);
      collection.bannerImage = {};
    } catch (error) {
      console.warn(
        `Failed to delete banner image via null body field ${collection.bannerImage.publicId}:`,
        error.message
      );
    }
  }

  await collection.save();

  return res
    .status(200)
    .json(new ApiResponse(200, collection, "Collection updated successfully."));
});

/**
 * @desc Delete a collection by ID.
 * @route DELETE /api/v1/admin/collections/:collectionId
 * @access Private (Admin only)
 */
const deleteCollection = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can delete collections."
    );
  }

  const { collectionId } = req.params;

  const collection = await Collection.findById(collectionId);
  if (!collection) {
    throw new ApiError(404, "Collection not found.");
  }

  const hasProducts = await Product.exists({ collections: collectionId });
  if (hasProducts) {
    throw new ApiError(
      400,
      "Cannot delete collection: Products are associated with this collection. Please reassign or delete products first."
    );
  }

  if (collection.image && collection.image.publicId) {
    try {
      await deleteImageFromCloudinary(collection.image.publicId);
    } catch (error) {
      console.error(
        `Failed to delete main image ${collection.image.publicId} for collection ${collectionId}:`,
        error
      );
    }
  }
  if (collection.bannerImage && collection.bannerImage.publicId) {
    try {
      await deleteImageFromCloudinary(collection.bannerImage.publicId);
    } catch (error) {
      console.error(
        `Failed to delete banner image ${collection.bannerImage.publicId} for collection ${collectionId}:`,
        error
      );
    }
  }

  await collection.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Collection deleted successfully."));
});

export {
  createCollection,
  getAllCollectionsAdmin,
  getCollectionByIdAdmin,
  updateCollection,
  deleteCollection,
};
