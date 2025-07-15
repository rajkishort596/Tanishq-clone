import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Collection } from "../../models/collection.model.js";
import mongoose from "mongoose";

/**
 * @desc Get all active collections for public display.
 * @route GET /api/v1/public/collections
 * @access Public
 */
const getAllCollections = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const query = {
    isActive: true,
  };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    select: "name description image bannerImage startDate endDate",
    customLabels: {
      totalDocs: "totalCollections",
      docs: "collections",
    },
  };

  const collections = await Collection.paginate(query, options);

  if (!collections || collections.collections.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { docs: [], totalDocs: 0, limit, page: parseInt(page, 10) },
          "No collections found."
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, collections, "Collections fetched successfully.")
    );
});

/**
 * @desc Get a single collection by ID or slug for public display.
 * @route GET /api/v1/public/collections/:identifier
 * @access Public
 */
const getCollectionById = asyncHandler(async (req, res) => {
  const { collectionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(collectionId)) {
    throw new ApiError(400, "Invalid collection ID format.");
  }
  const collection = await Collection.find({
    _id: collectionId,
    isActive: true,
  }).select("name description image bannerImage startDate endDate");

  if (!collection) {
    throw new ApiError(404, "Collection not found or is not active.");
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

export { getAllCollections, getCollectionById };
