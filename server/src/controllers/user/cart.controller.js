import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js"; // Assuming your User model
import { Product } from "../../models/product.model.js"; // Assuming your Product model

/**
 * @desc Add a product to the authenticated user's cart.
 * @route POST /api/v1/users/me/cart
 * @access Private
 */
const addToCart = asyncHandler(async (req, res) => {
  // req.user is populated by the verifyJWT middleware
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { productId, quantity, variantId } = req.body;

  // 1. Basic Validation
  if (!productId || !quantity) {
    throw new ApiError(400, "Product ID and quantity are required.");
  }
  if (quantity <= 0) {
    throw new ApiError(400, "Quantity must be a positive number.");
  }

  // 2. Find the product and check stock
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    throw new ApiError(404, "Product not found or is not active.");
  }

  let availableStock = product.stock;
  let selectedVariant;

  if (variantId) {
    selectedVariant = product.variants.find((v) => v.variantId === variantId);
    if (!selectedVariant) {
      throw new ApiError(404, "Product variant not found.");
    }
    availableStock = selectedVariant.stock;
  }

  if (quantity > availableStock) {
    throw new ApiError(
      400,
      `Insufficient stock. Only ${availableStock} available.`
    );
  }

  // 3. Find the user
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Initialize cart if it doesn't exist
  if (!user.cart) {
    user.cart = { items: [], totalQuantity: 0, totalPrice: 0 };
  }

  // 4. Check if item already exists in cart
  let itemFound = false;
  user.cart.items = user.cart.items.map((item) => {
    const isSameProduct = item.product.toString() === productId;
    const isSameVariant =
      (variantId && item.variantId === variantId) ||
      (!variantId && !item.variantId);

    if (isSameProduct && isSameVariant) {
      itemFound = true;
      const newQuantity = item.quantity + quantity;
      if (newQuantity > availableStock) {
        throw new ApiError(
          400,
          `Cannot add more. Max available stock is ${availableStock}.`
        );
      }
      item.quantity = newQuantity;
      item.addedAt = new Date(); // Update timestamp
    }
    return item;
  });

  // 5. If item not found, add new item to cart
  if (!itemFound) {
    user.cart.items.push({
      product: productId,
      variantId: variantId || undefined, // Store undefined if no variant
      quantity: quantity,
      addedAt: new Date(),
    });
  }

  // 6. Recalculate total quantity and total price
  user.cart.totalQuantity = user.cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  user.cart.totalPrice = user.cart.items.reduce((sum, item) => {
    const cartProduct =
      product._id.toString() === item.product.toString() ? product : null; // Avoid re-fetching product if it's the one we just found
    if (!cartProduct) return sum; // Should not happen if product was found earlier

    let itemPrice = cartProduct.price.final;
    if (item.variantId) {
      const variant = cartProduct.variants.find(
        (v) => v.variantId === item.variantId
      );
      if (variant) {
        itemPrice += variant.priceAdjustment;
      }
    }
    return sum + itemPrice * item.quantity;
  }, 0);
  user.cart.lastUpdated = new Date();

  await user.save({ validateBeforeSave: false }); // Save user document

  // Populate product details for the response
  const updatedCart = await User.findById(req.user._id)
    .select("cart")
    .populate("cart.items.product", "name images price variants sku"); // Populate necessary product fields

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCart.cart,
        "Product added to cart successfully."
      )
    );
});

/**
 * @desc Get the authenticated user's cart details.
 * @route GET /api/v1/users/me/cart
 * @access Private
 */
const getCart = asyncHandler(async (req, res) => {
  // req.user is populated by the verifyJWT middleware
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const user = await User.findById(req.user._id)
    .select("cart")
    .populate("cart.items.product", "name images price variants sku"); // Populate product details

  if (!user || !user.cart) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { items: [], totalQuantity: 0, totalPrice: 0 },
          "Cart is empty."
        )
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user.cart, "Cart fetched successfully."));
});

/**
 * @desc Update the quantity of a specific item in the authenticated user's cart.
 * @route PUT /api/v1/users/me/cart/:productId
 * @access Private
 */
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { productId } = req.params;
  const { quantity, variantId } = req.body; // variantId might be needed to identify the exact item

  if (!quantity || quantity <= 0) {
    throw new ApiError(400, "Quantity must be a positive number.");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.cart || !user.cart.items || user.cart.items.length === 0) {
    throw new ApiError(404, "Cart is empty.");
  }

  const itemIndex = user.cart.items.findIndex((item) => {
    const isSameProduct = item.product.toString() === productId;
    const isSameVariant =
      (variantId && item.variantId === variantId) ||
      (!variantId && !item.variantId);
    return isSameProduct && isSameVariant;
  });

  if (itemIndex === -1) {
    throw new ApiError(404, "Product not found in cart.");
  }

  const cartItem = user.cart.items[itemIndex];

  // Check stock for the updated quantity
  const product = await Product.findById(cartItem.product);
  if (!product || !product.isActive) {
    throw new ApiError(404, "Product no longer available.");
  }

  let availableStock = product.stock;
  if (cartItem.variantId) {
    const selectedVariant = product.variants.find(
      (v) => v.variantId === cartItem.variantId
    );
    if (!selectedVariant) {
      throw new ApiError(404, "Product variant no longer available.");
    }
    availableStock = selectedVariant.stock;
  }

  if (quantity > availableStock) {
    throw new ApiError(
      400,
      `Insufficient stock. Only ${availableStock} available.`
    );
  }

  cartItem.quantity = quantity;
  user.cart.lastUpdated = new Date();

  // Recalculate totals
  user.cart.totalQuantity = user.cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  user.cart.totalPrice = await user.cart.items.reduce(
    async (sumPromise, item) => {
      const sum = await sumPromise;
      const cartProduct = await Product.findById(item.product);
      if (!cartProduct) return sum; // Product might have been deleted

      let itemPrice = cartProduct.price.final;
      if (item.variantId) {
        const variant = cartProduct.variants.find(
          (v) => v.variantId === item.variantId
        );
        if (variant) {
          itemPrice += variant.priceAdjustment;
        }
      }
      return sum + itemPrice * item.quantity;
    },
    Promise.resolve(0)
  );

  await user.save({ validateBeforeSave: false });

  const updatedCart = await User.findById(req.user._id)
    .select("cart")
    .populate("cart.items.product", "name images price variants sku");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCart.cart,
        "Cart item quantity updated successfully."
      )
    );
});

/**
 * @desc Remove a specific item from the authenticated user's cart.
 * @route DELETE /api/v1/users/me/cart/:productId
 * @access Private
 */
const removeCartItem = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { productId } = req.params;
  const { variantId } = req.query; // Use query for variantId in DELETE requests

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.cart || !user.cart.items || user.cart.items.length === 0) {
    throw new ApiError(404, "Cart is already empty.");
  }

  const initialItemCount = user.cart.items.length;

  // Filter out the item to be removed
  user.cart.items = user.cart.items.filter((item) => {
    const isSameProduct = item.product.toString() === productId;
    const isSameVariant =
      (variantId && item.variantId === variantId) ||
      (!variantId && !item.variantId);
    return !(isSameProduct && isSameVariant);
  });

  if (user.cart.items.length === initialItemCount) {
    throw new ApiError(404, "Product not found in cart.");
  }

  // Recalculate totals
  user.cart.totalQuantity = user.cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  user.cart.totalPrice = await user.cart.items.reduce(
    async (sumPromise, item) => {
      const sum = await sumPromise;
      const cartProduct = await Product.findById(item.product);
      if (!cartProduct) return sum; // Product might have been deleted

      let itemPrice = cartProduct.price.final;
      if (item.variantId) {
        const variant = cartProduct.variants.find(
          (v) => v.variantId === item.variantId
        );
        if (variant) {
          itemPrice += variant.priceAdjustment;
        }
      }
      return sum + itemPrice * item.quantity;
    },
    Promise.resolve(0)
  );
  user.cart.lastUpdated = new Date();

  await user.save({ validateBeforeSave: false });

  const updatedCart = await User.findById(req.user._id)
    .select("cart")
    .populate("cart.items.product", "name images price variants sku");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedCart.cart,
        "Product removed from cart successfully."
      )
    );
});

/**
 * @desc Clear the entire cart for the authenticated user.
 * @route DELETE /api/v1/users/me/cart
 * @access Private
 */
const clearCart = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (!user.cart || !user.cart.items || user.cart.items.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { items: [], totalQuantity: 0, totalPrice: 0 },
          "Cart is already empty."
        )
      );
  }

  user.cart = {
    items: [],
    totalQuantity: 0,
    totalPrice: 0,
    lastUpdated: new Date(),
  };

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user.cart, "Cart cleared successfully."));
});

export {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};
