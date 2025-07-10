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
 * @desc Get all products with advanced filtering, sorting, and pagination for admin view.
 * @route GET /api/v1/admin/products
 * @access Private (Admin only)
 */
const getAllProductsAdmin = asyncHandler(async (req, res) => {
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view all products with detailed filters."
    );
  }

  // Extract query parameters for filtering, sorting, and pagination
  const {
    page = 1,
    limit = 10,
    search,
    category,
    subCategory,
    collection,
    isActive,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  // Build the initial match query
  const matchQuery = {};
  if (search) {
    matchQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { metal: { $regex: search, $options: "i" } },
      { purity: { $regex: search, $options: "i" } },
    ];
  }
  if (category) {
    matchQuery.category = category;
  }
  if (subCategory) {
    matchQuery.subCategory = subCategory;
  }
  if (collection) {
    matchQuery.collections = collection;
  }
  if (isActive !== undefined) {
    matchQuery.isActive = isActive === "true";
  }

  // Define the sort stage
  const sortStage = {};
  sortStage[sortBy] = sortOrder === "desc" ? -1 : 1; // -1 for descending, 1 for ascending

  // Build the aggregation pipeline
  const aggregatePipeline = [
    // Stage 1: Filter products based on query parameters
    { $match: matchQuery },

    // Stage 2: Join with Category collection for main category name
    {
      $lookup: {
        from: Category.collection.name, // The actual collection name in MongoDB (e.g., 'categories')
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    // Unwind categoryDetails to deconstruct the array. Since 'category' is usually a single ref,
    // it's an array of one element.
    { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } }, // preserveNull... keeps products without a category

    // Stage 3: Join with Category collection for sub-category name
    {
      $lookup: {
        from: Category.collection.name,
        localField: "subCategory",
        foreignField: "_id",
        as: "subCategoryDetails",
      },
    },
    {
      $unwind: {
        path: "$subCategoryDetails",
        preserveNullAndEmptyArrays: true,
      },
    },

    // Stage 4: Join with Collection collection for collection names
    {
      $lookup: {
        from: Collection.collection.name,
        localField: "collections",
        foreignField: "_id",
        as: "collectionDetails",
      },
    },
    // No unwind for collections if you want them as an array of objects

    // Stage 5: Sort the results
    { $sort: sortStage },

    // Stage 6: Project (shape) the output documents
    {
      $project: {
        name: 1,
        description: 1,
        price: 1,
        stock: 1,
        weight: 1,
        images: 1,
        metal: 1,
        purity: 1,
        gender: 1,
        isActive: 1,
        ratings: 1,
        createdAt: 1,
        updatedAt: 1,
        // Include populated fields directly in the root document
        "category.name": "$categoryDetails.name",
        "category._id": "$categoryDetails._id",
        "subCategory.name": "$subCategoryDetails.name",
        "subCategory._id": "$subCategoryDetails._id",
        // Map collectionDetails to an array of just names and IDs
        collections: {
          $map: {
            input: "$collectionDetails",
            as: "coll",
            in: {
              _id: "$$coll._id",
              name: "$$coll.name",
            },
          },
        },
        // You can add or remove fields as needed for the admin view
        // For example, if you want specific variant details or only one image:
        // 'variants.variantId': 1,
        // 'variants.size': 1,
        // 'mainImage': { $arrayElemAt: ['$images.url', 0] }
      },
    },
  ];

  // Options for mongoose-aggregate-paginate-v2
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    customLabels: {
      totalDocs: "totalProducts",
      docs: "products",
    },
    // populate is NOT used here because we are doing explicit $lookup in the pipeline
    // populate: [
    //     { path: 'category', select: 'name' },
    //     { path: 'subCategory', select: 'name' },
    // ],
  };

  // Execute the aggregation with pagination
  const products = await Product.aggregatePaginate(
    Product.aggregate(aggregatePipeline),
    options
  );

  if (!products) {
    throw new ApiError(500, "Failed to fetch products.");
  }

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
    .populate("collections", "name image")
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
    clearImages,
  } = req.body;

  const imageLocalPaths = req.files?.images?.map((file) => file.path);

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  if (imageLocalPaths && imageLocalPaths.length > 0) {
    for (const img of product.images) {
      try {
        await deleteImageFromCloudinary(img.publicId);
      } catch (error) {
        console.warn(
          `Failed to delete old product image ${img.publicId}:`,
          error.message
        );
      }
    }
    product.images = [];

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
        console.error("Error uploading new product image:", error);
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
  } else if (clearImages === "true") {
    for (const img of product.images) {
      try {
        await deleteImageFromCloudinary(img.publicId);
      } catch (error) {
        console.warn(
          `Failed to delete old product image during explicit clear ${img.publicId}:`,
          error.message
        );
      }
    }
    product.images = [];
  }

  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (stock !== undefined) product.stock = stock;
  if (weight !== undefined) product.weight = weight;
  if (metal !== undefined) product.metal = metal;
  if (purity !== undefined) product.purity = purity;
  if (gender !== undefined) product.gender = gender;
  if (req.body.isActive !== undefined) product.isActive = req.body.isActive;

  if (price) {
    if (price.base !== undefined) product.price.base = price.base;
    if (price.makingCharges !== undefined)
      product.price.makingCharges = price.makingCharges;
    if (price.gst !== undefined) product.price.gst = price.gst;
    if (price.final !== undefined) product.price.final = price.final;
  }

  if (collections !== undefined) {
    // Validate Collections existence if updated
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
    product.collections = collections;
  }
  if (occasion !== undefined) product.occasion = occasion;

  if (variants !== undefined) {
    // Assuming 'variants' in req.body is an array of variant objects.
    // Each variant object should ideally have a 'variantId' for existing ones,
    // or be a new variant without a 'variantId' (or with null/undefined 'variantId').

    const updatedVariantsMap = new Map(
      product.variants.map((v) => [v.variantId, v])
    );
    const newProductVariants = [];

    for (const incomingVariant of variants) {
      if (incomingVariant.variantId) {
        // Attempt to find and update an existing variant
        const existingVariant = updatedVariantsMap.get(
          incomingVariant.variantId
        );
        if (existingVariant) {
          // Update properties of the existing variant
          if (incomingVariant.size !== undefined)
            existingVariant.size = incomingVariant.size;
          if (incomingVariant.metalColor !== undefined)
            existingVariant.metalColor = incomingVariant.metalColor;
          if (incomingVariant.priceAdjustment !== undefined)
            existingVariant.priceAdjustment = incomingVariant.priceAdjustment;
          if (incomingVariant.stock !== undefined)
            existingVariant.stock = incomingVariant.stock;
          newProductVariants.push(existingVariant); // Add updated variant to new list
          updatedVariantsMap.delete(incomingVariant.variantId); // Mark as processed
        } else {
          console.warn(
            `Incoming variant with variantId ${incomingVariant.variantId} not found. Adding as new.`
          );
          newProductVariants.push({ ...incomingVariant }); // Add as new
        }
      } else {
        newProductVariants.push({ ...incomingVariant });
      }
    }
    product.variants = variants || [];
  }

  if (category !== undefined) {
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      throw new ApiError(404, "Invalid Category ID provided for update.");
    }
    product.category = category;
  }
  if (subCategory !== undefined) {
    const existingSubCategory = await Category.findById(subCategory);
    if (!existingSubCategory) {
      throw new ApiError(404, "Invalid SubCategory ID provided for update.");
    }
    product.subCategory = subCategory;
  }

  await product.save();

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

  await product.deleteOne();

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
