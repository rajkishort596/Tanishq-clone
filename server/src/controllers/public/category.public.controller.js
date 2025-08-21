import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Category } from "../../models/category.model.js";

/**
 * @desc Get all categories (top-level and sub-categories) for public display.
 * @route GET /api/v1/public/categories
 * @access Public
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({})
    .populate("parent", "name slug")
    .sort({ name: 1 })
    .select("name slug description icon parent");

  if (!categories || categories.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No categories found."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully."));
});

/**
 * @desc Get a single category by ID or slug for public display.
 * @route GET /api/v1/public/categories/:identifier
 * @access Public
 */
const getCategoryByIdOrSlug = asyncHandler(async (req, res) => {
  const { identifier } = req.params; // Can be ID or slug

  let category;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    // Try to find by ID
    category = await Category.findById(identifier)
      .populate("parent", "name slug")
      .select("name slug description icon parent");
  } else {
    // Try to find by slug
    category = await Category.findOne({ slug: identifier })
      .populate("parent", "name slug")
      .select("name slug description icon parent");
  }

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, category, "Category details fetched successfully.")
    );
});

/**
 * @desc Get all sub-categories of a specific parent category for public display.
 * @route GET /api/v1/public/categories/:categoryId/subcategories
 * @access Public
 */
const getSubCategoriesOfParent = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  // First, check if the parent category exists
  const parentCategory = await Category.findById(categoryId);
  if (!parentCategory) {
    throw new ApiError(404, "Parent category not found.");
  }

  // Find all categories where their 'parent' field contains the given categoryId
  const subcategories = await Category.find({ parent: { $in: [categoryId] } })
    .sort({ name: 1 })
    .select("name slug description icon");

  if (!subcategories || subcategories.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, [], "No subcategories found for this parent.")
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, subcategories, "Subcategories fetched successfully.")
    );
});

export { getAllCategories, getCategoryByIdOrSlug, getSubCategoriesOfParent };
