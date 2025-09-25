import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Category } from "../../models/category.model.js";
import { Product } from "../../models/product.model.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../../utils/cloudinary.js";
import slugify from "slugify";
import mongoose from "mongoose";

/**
 * @desc Create a new category.
 * @route POST /api/v1/admin/categories
 * @access Private (Admin only)
 */
const createCategory = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can create categories."
    );
  }

  const { name, description, parent } = req.body;

  // Basic validation
  if (!name || !description) {
    throw new ApiError(400, "Category name and description are required.");
  }

  // Generate slug
  const slug = slugify(name, { lower: true, strict: true });

  // Check if category with same name or slug already exists
  const existingCategory = await Category.findOne({
    $or: [{ name: name }, { slug: slug }],
  });
  if (existingCategory) {
    throw new ApiError(409, "Category with this name or slug already exists.");
  }

  // Handle parent categories (if provided)
  const parentIds = Array.isArray(parent) ? parent : parent ? [parent] : [];

  // Validate that all parent IDs exist and are valid
  if (parentIds.length > 0) {
    const parentCategories = await Category.find({
      _id: { $in: parentIds },
    });

    if (parentCategories.length !== parentIds.length) {
      throw new ApiError(404, "One or more parent categories not found.");
    }
  }

  // Handle icon upload
  const iconLocalPath = req.file?.path;

  if (!iconLocalPath) {
    throw new ApiError(400, "Category icon image is required.");
  }

  let uploadedIcon = {};
  try {
    const result = await uploadOnCloudinary(iconLocalPath);
    if (result && result.url && result.public_id) {
      uploadedIcon = { url: result.url, publicId: result.public_id };
    } else {
      throw new Error("Cloudinary upload failed for icon.");
    }
  } catch (error) {
    console.error("Error uploading category icon:", error);
    throw new ApiError(500, "Failed to upload category icon.");
  }

  // Create the category
  const category = await Category.create({
    name,
    slug,
    description,
    parent: parentIds,
    icon: uploadedIcon,
  });

  if (!category) {
    // Clean up uploaded icon if category creation fails
    await deleteImageFromCloudinary(uploadedIcon.publicId);
    throw new ApiError(500, "Failed to create category. Please try again.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully."));
});

/**
 * @desc Get all categories (for admin view, potentially with nesting).
 * @route GET /api/v1/admin/categories
 * @access Private (Admin only)
 */
const getAllCategoriesAdmin = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view categories."
    );
  }

  const {
    page = 1,
    limit = 10,
    search = "",
    parent,
    sortBy = "name",
    sortOrder = "asc",
  } = req.query;

  const query = {};

  // Search filter
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  // Parent category filter
  if (parent && parent !== "null" && parent !== "undefined") {
    // If a specific parent ID is provided, find all children that have this ID in their parent array
    query.parent = {
      $in: [mongoose.Types.ObjectId.createFromHexString(parent)],
    };
  } else if (parent === "null") {
    // This now queries for root categories, which have an empty parent array
    query.parent = { $size: 0 };
  }

  // Sorting options
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Pagination options
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort,
    populate: {
      path: "parent",
      select: "name slug",
    },
    customLabels: {
      totalDocs: "totalCategories",
      docs: "categories",
    },
  };

  const categories = await Category.paginate(query, options);

  if (!categories || categories.categories.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          categories: [],
          totalCategories: 0,
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null,
        },
        "No categories found."
      )
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        categories,
        "Categories fetched successfully for admin."
      )
    );
});

/**
 * @desc Get a single category by ID (for admin view).
 * @route GET /api/v1/admin/categories/:categoryId
 * @access Private (Admin only)
 */
const getCategoryByIdAdmin = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view category details."
    );
  }

  const { categoryId } = req.params;

  const category = await Category.findById(categoryId).populate(
    "parent",
    "name slug"
  );

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
 * @desc Update an existing category by ID.
 * @route PUT /api/v1/admin/categories/:categoryId
 * @access Private (Admin only)
 */
const updateCategory = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can update categories."
    );
  }

  const { categoryId } = req.params;
  const { name, description, parent } = req.body;
  const iconLocalPath = req.file?.path; // New icon image if provided

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  if (name && name.trim() !== "" && name.trim() !== category.name) {
    const newSlug = slugify(name, { lower: true, strict: true });
    const existingCategoryWithNewNameOrSlug = await Category.findOne({
      $or: [{ name: name }, { slug: newSlug }],
      _id: { $ne: categoryId },
    });
    if (existingCategoryWithNewNameOrSlug) {
      throw new ApiError(
        409,
        "Another category with this name or slug already exists."
      );
    }
    category.name = name.trim();
    category.slug = newSlug;
  }

  if (description !== undefined) {
    category.description = description.trim();
  }

  // Handle the parent array update logic

  const parentIds = Array.isArray(parent) ? parent : parent ? [parent] : [];

  // Check if the category is trying to be its own parent
  if (parentIds.some((pId) => pId === categoryId)) {
    throw new ApiError(400, "A category cannot be its own parent.");
  }

  // Validate that all parent IDs exist
  if (parentIds.length > 0) {
    const parentCategories = await Category.find({ _id: { $in: parentIds } });
    if (parentCategories.length !== parentIds.length) {
      throw new ApiError(404, "One or more parent categories not found.");
    }
  }

  // Update the parent field with the new array
  category.parent = parentIds;

  // Handle icon update
  if (iconLocalPath) {
    if (category.icon && category.icon.publicId) {
      try {
        await deleteImageFromCloudinary(category.icon.publicId);
      } catch (error) {
        console.warn(
          `Could not delete old category icon ${category.icon.publicId}:`,
          error
        );
      }
    }

    let uploadedIcon = {};
    try {
      const result = await uploadOnCloudinary(iconLocalPath);
      if (result && result.url && result.public_id) {
        uploadedIcon = { url: result.url, publicId: result.public_id };
      } else {
        throw new Error("Cloudinary upload failed for new icon.");
      }
    } catch (error) {
      console.error("Error uploading new category icon:", error);
      throw new ApiError(500, "Failed to upload new category icon.");
    }
    category.icon = uploadedIcon;
  } else if (req.body.clearIcon === "true") {
    if (category.icon && category.icon.publicId) {
      try {
        await deleteImageFromCloudinary(category.icon.publicId);
      } catch (error) {
        console.warn(
          `Could not delete old category icon ${category.icon.publicId}:`,
          error
        );
      }
    }
    category.icon = {};
  }

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully."));
});

/**
 * @desc Delete a category by ID.
 * @route DELETE /api/v1/admin/categories/:categoryId
 * @access Private (Admin only)
 */
const deleteCategory = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can delete categories."
    );
  }

  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  // Check if category has any child categories by checking if any other category
  // has this ID in their parent array
  const hasChildren = await Category.exists({ parent: { $in: [categoryId] } });
  if (hasChildren) {
    throw new ApiError(
      400,
      "Cannot delete category: It has child categories. Please reassign or delete children first."
    );
  }

  // Check if any products are associated with this category
  const hasProducts = await Product.exists({
    $or: [{ category: categoryId }, { subCategory: categoryId }],
  });
  if (hasProducts) {
    throw new ApiError(
      400,
      "Cannot delete category: Products are associated with this category. Please reassign or delete products first."
    );
  }

  // Delete associated icon from Cloudinary
  if (category.icon && category.icon.publicId) {
    try {
      await deleteImageFromCloudinary(category.icon.publicId);
    } catch (error) {
      console.error(
        `Failed to delete category icon ${category.icon.publicId}:`,
        error
      );
    }
  }

  // Delete the category from the database
  await category.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully."));
});

export {
  createCategory,
  getAllCategoriesAdmin,
  getCategoryByIdAdmin,
  updateCategory,
  deleteCategory,
};
