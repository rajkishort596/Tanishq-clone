import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Product } from "../../models/product.model.js";

/**
 * @desc Get all products with filtering, search, sorting, and pagination
 * @route GET /api/v1/public/products
 * @access Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    search = "",
    category,
    subCategory,
    collections,
    metal,
    metalColor,
    purity,
    occasion,
    gender,
    minPrice,
    maxPrice,
  } = req.query;

  const query = {
    isActive: true,
    stock: { $gt: 0 },
  };

  // Text search on name and description
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Filtering by category, subCategory, and collections
  if (category) {
    query.category = category;
  }
  if (subCategory) {
    query.subCategory = subCategory;
  }
  if (collections) {
    query.collections = { $in: collections.split(",") };
  }

  // Filtering by other product attributes
  if (metal) {
    query.metal = {
      $in: metal.split(",").map((m) => new RegExp(`^${m}$`, "i")),
    };
  }
  if (metalColor) {
    query.metalColor = {
      $in: metalColor.split(",").map((mc) => new RegExp(`^${mc}$`, "i")),
    };
  }

  if (purity) {
    query.purity = {
      $in: purity.split(",").map((p) => new RegExp(`^${p}$`, "i")),
    };
  }
  if (occasion) {
    query.occasion = {
      $in: occasion.split(",").map((o) => new RegExp(`^${o}$`, "i")),
    };
  }

  if (gender) {
    query.gender = {
      $in: gender.split(",").map((g) => new RegExp(`^${g}$`, "i")),
    };
  }

  // Price filtering
  if (minPrice || maxPrice) {
    query["price.final"] = {};
    if (minPrice) {
      query["price.final"].$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      query["price.final"].$lte = parseFloat(maxPrice);
    }
  }

  // Sorting options
  const sort = {};
  sort[sortBy] = sortOrder === "desc" ? -1 : 1;

  // Pagination options
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort,
    populate: [
      { path: "category", select: "name slug" },
      { path: "subCategory", select: "name slug" },
      { path: "collections", select: "name" },
    ],
    customLabels: {
      totalDocs: "totalProducts",
      docs: "products",
    },
  };

  const products = await Product.paginate(query, options);

  if (!products || products.products.length === 0) {
    return res
      .status(404)
      .json(
        new ApiResponse(404, [], "No products found matching the criteria.")
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully."));
});

/**
 * @desc Get a single product by its ID
 * @route GET /api/v1/public/products/:productId
 * @access Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId)
    .populate("category")
    .populate("subCategory")
    .populate("collections");

  if (!product || !product.isActive || product.stock <= 0) {
    throw new ApiError(404, "Product not found or is not available.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully."));
});

export { getProducts, getProductById };
