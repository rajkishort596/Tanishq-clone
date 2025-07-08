import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Product } from "../../models/product.model.js";
import { Category } from "../../models/category.model.js";
import { Collection } from "../../models/collection.model.js";
import {
  uploadOnCloudinary,
  deleteImageFromCloudinary,
} from "../../utils/cloudinary.js";

/**
 * @desc Create a new product.
 * @route POST /api/v1/admin/products
 * @access Private (Admin only)
 */
const createProduct = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can create products."
    );
  }

  const {
    name,
    description,
    price,
    variants,
    collections,
    occasion,
    stock,
    weight,
    category,
    subCategory,
    metal,
    purity,
    gender,
  } = req.body;

  // Basic validation
  if (
    [
      name,
      description,
      price?.base,
      price?.final,
      stock,
      weight,
      category,
      metal,
      purity,
      gender,
    ].some(
      (field) =>
        field === undefined ||
        (typeof field === "string" && field.trim() === "")
    )
  ) {
    throw new ApiError(400, "All required product fields must be provided.");
  }

  // Validate Category existence
  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    throw new ApiError(404, "Invalid Category ID provided.");
  }
  if (subCategory) {
    const existingSubCategory = await Category.findById(subCategory);
    if (!existingSubCategory) {
      throw new ApiError(404, "Invalid SubCategory ID provided.");
    }
  }

  // Validate Collections existence (if provided)
  if (collections && collections.length > 0) {
    const existingCollections = await Collection.find({
      _id: { $in: collections },
    });
    if (existingCollections.length !== collections.length) {
      throw new ApiError(
        400,
        "One or more provided Collection IDs are invalid."
      );
    }
  }

  // Handle product image uploads
  const imageLocalPaths = req.files?.images?.map((file) => file.path);

  if (!imageLocalPaths || imageLocalPaths.length === 0) {
    throw new ApiError(400, "At least one product image is required.");
  }

  const uploadedImages = [];
  for (const path of imageLocalPaths) {
    try {
      const result = await uploadOnCloudinary(path);
      if (result && result.url && result.public_id) {
        uploadedImages.push({ url: result.url, publicId: result.public_id });
      } else {
        throw new Error("Cloudinary upload failed for a file.");
      }
    } catch (error) {
      console.error("Error uploading product image:", error);
      // Clean up already uploaded images if one fails
      for (const img of uploadedImages) {
        await deleteImageFromCloudinary(img.publicId);
      }
      throw new ApiError(500, "Failed to upload one or more product images.");
    }
  }

  // Create the product
  const product = await Product.create({
    name,
    description,
    price,
    variants: variants || [],
    collections: collections || [],
    occasion: occasion || [],
    stock,
    weight,
    images: uploadedImages,
    category,
    subCategory,
    metal,
    purity,
    gender,
  });

  if (!product) {
    // Clean up uploaded images if product creation fails
    for (const img of uploadedImages) {
      await deleteImageFromCloudinary(img.publicId);
    }
    throw new ApiError(500, "Failed to create product. Please try again.");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully."));
});

/**
 * @desc Get all products (for admin view, potentially with more details/filters).
 * @route GET /api/v1/admin/products
 * @access Private (Admin only)
 */
const getAllProductsAdmin = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view all products."
    );
  }

  // Implement advanced filtering, sorting, pagination for admin view
  const {
    page = 1,
    limit = 10,
    search,
    category,
    collection,
    isActive,
  } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { metal: { $regex: search, $options: "i" } },
      { purity: { $regex: search, $options: "i" } },
    ];
  }
  if (category) {
    query.category = category;
  }
  if (collection) {
    query.collections = collection;
  }
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 }, // Default sort by newest
    populate: [
      { path: "category", select: "name" },
      { path: "subCategory", select: "name" },
    ],
  };

  const products = await Product.aggregatePaginate(
    Product.aggregate([
      { $match: query },
      // Add more aggregation stages if needed for complex filtering/joining
    ]),
    options
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "Products fetched successfully for admin.")
    );
});

/**
 * @desc Get a single product by ID (for admin view).
 * @route GET /api/v1/admin/products/:productId
 * @access Private (Admin only)
 */
const getProductByIdAdmin = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view product details."
    );
  }

  const { productId } = req.params;

  const product = await Product.findById(productId)
    .populate("category", "name")
    .populate("subCategory", "name")
    .populate("collections", "name imageUrl")
    .populate("reviews");

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product details fetched successfully.")
    );
});

/**
 * @desc Update an existing product by ID.
 * @route PUT /api/v1/admin/products/:productId
 * @access Private (Admin only)
 */
const updateProduct = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can update products."
    );
  }

  const { productId } = req.params;
  const updateFields = req.body;
  const imageLocalPaths = req.files?.images?.map((file) => file.path);

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Handle image updates
  if (imageLocalPaths && imageLocalPaths.length > 0) {
    // Option 1: Replace all existing images with new ones (simpler)
    // Delete all old images from Cloudinary
    for (const img of product.images) {
      await deleteImageFromCloudinary(img.publicId);
    }
    product.images = []; // Clear existing images

    // Upload new images
    const uploadedImages = [];
    for (const path of imageLocalPaths) {
      try {
        const result = await uploadOnCloudinary(path);
        if (result && result.url && result.public_id) {
          uploadedImages.push({ url: result.url, publicId: result.public_id });
        } else {
          throw new Error("Cloudinary upload failed for a file.");
        }
      } catch (error) {
        console.error(
          "Error uploading new product image during update:",
          error
        );
        // Clean up newly uploaded images if one fails
        for (const img of uploadedImages) {
          await deleteImageFromCloudinary(img.publicId);
        }
        throw new ApiError(
          500,
          "Failed to upload one or more new product images."
        );
      }
    }
    product.images = uploadedImages;
  } else if (updateFields.images === null || updateFields.images === "") {
    // Option 2: Allow clearing all images if explicitly requested (e.g., frontend sends images: null)
    for (const img of product.images) {
      await deleteImageFromCloudinary(img.publicId);
    }
    product.images = [];
    delete updateFields.images; // Remove from updateFields to avoid Mongoose error
  }
  // If no new images and no explicit clear, existing images remain unchanged.

  // Update other fields
  // Use Object.assign or iterate through updateFields to apply updates
  Object.assign(product, updateFields);

  // Specific validation for nested objects like 'price' or arrays like 'variants', 'collections', 'occasion'
  if (updateFields.price) {
    if (updateFields.price.base !== undefined)
      product.price.base = updateFields.price.base;
    if (updateFields.price.makingCharges !== undefined)
      product.price.makingCharges = updateFields.price.makingCharges;
    if (updateFields.price.gst !== undefined)
      product.price.gst = updateFields.price.gst;
    if (updateFields.price.final !== undefined)
      product.price.final = updateFields.price.final;
  }
  if (updateFields.variants) {
    // This is a complex update. You might need to merge, add, or remove variants.
    // For simplicity, this example assumes full replacement if 'variants' array is sent.
    // A more robust solution would handle individual variant updates based on variantId.
    product.variants = updateFields.variants;
  }
  if (updateFields.collections) {
    product.collections = updateFields.collections;
  }
  if (updateFields.occasion) {
    product.occasion = updateFields.occasion;
  }

  // Validate Category existence if updated
  if (updateFields.category) {
    const existingCategory = await Category.findById(updateFields.category);
    if (!existingCategory) {
      throw new ApiError(404, "Invalid Category ID provided for update.");
    }
  }
  if (updateFields.subCategory) {
    const existingSubCategory = await Category.findById(
      updateFields.subCategory
    );
    if (!existingSubCategory) {
      throw new ApiError(404, "Invalid SubCategory ID provided for update.");
    }
  }

  await product.save(); // Save the updated product. Mongoose will validate.

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully."));
});

/**
 * @desc Delete a product by ID.
 * @route DELETE /api/v1/admin/products/:productId
 * @access Private (Admin only)
 */
const deleteProduct = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can delete products."
    );
  }

  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  // Delete all associated images from Cloudinary
  for (const img of product.images) {
    try {
      await deleteImageFromCloudinary(img.publicId);
    } catch (error) {
      console.error(
        `Failed to delete image ${img.publicId} from Cloudinary for product ${productId}:`,
        error
      );
    }
  }

  // Delete the product from the database
  await product.deleteOne(); // Use deleteOne() on the document instance

  // Delete related reviews
  await Review.deleteMany({ product: productId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully."));
});

export {
  createProduct,
  getAllProductsAdmin,
  getProductByIdAdmin,
  updateProduct,
  deleteProduct,
};
