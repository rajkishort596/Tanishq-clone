import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/user.model.js";
import { Order } from "../../models/order.model.js";
import { Address } from "../../models/address.model.js";
import mongoose from "mongoose";

/**
 * @desc Create a new order from the user's cart.
 * @route POST /api/v1/users/me/orders
 * @access Private
 */
const createOrder = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.user?._id) throw new ApiError(401, "User not authenticated.");
    const { addressId, paymentMethod, transactionId } = req.body;

    const user = await User.findById(req.user._id)
      .populate({
        path: "cart.items.product",
        select: "name images price variants stock isActive",
      })
      .session(session);

    if (!user || !user.cart?.items?.length) {
      throw new ApiError(400, "Your cart is empty. Cannot create an order.");
    }

    const shippingAddress = await Address.findOne({
      _id: addressId,
      user: user._id,
    }).session(session);

    if (!shippingAddress) {
      throw new ApiError(
        404,
        "Provided address not found or does not belong to you."
      );
    }

    const orderItems = [];
    let totalOrderAmount = 0;
    const productsToUpdateStock = [];

    for (const cartItem of user.cart.items) {
      const product = cartItem.product;
      if (!product || !product.isActive) {
        throw new ApiError(
          400,
          `Product "${product?.name || cartItem.product}" is no longer available.`
        );
      }

      let availableStock = product.stock;
      let itemUnitPrice = product.price?.final ?? 0;
      let variantDetails = {};

      if (cartItem.variantId) {
        const selectedVariant = product.variants.find(
          (v) => v.variantId === cartItem.variantId
        );
        if (!selectedVariant) {
          throw new ApiError(
            400,
            `Variant "${cartItem.variantId}" for product "${product.name}" not found.`
          );
        }

        availableStock = selectedVariant.stock;
        itemUnitPrice += selectedVariant.priceAdjustment || 0;
        variantDetails = {
          size: selectedVariant.size,
          metalColor: selectedVariant.metalColor,
        };
      }

      if (cartItem.quantity > availableStock) {
        throw new ApiError(
          400,
          `Insufficient stock for "${product.name}" (Variant: ${cartItem.variantId || "N/A"}). Only ${availableStock} available.`
        );
      }

      orderItems.push({
        product: product._id,
        variantId: cartItem.variantId,
        name: product.name,
        quantity: cartItem.quantity,
        unitPrice: itemUnitPrice,
        totalItemPrice: itemUnitPrice * cartItem.quantity,
        image: product.images[0]?.url,
        ...variantDetails,
      });

      totalOrderAmount += itemUnitPrice * cartItem.quantity;

      productsToUpdateStock.push({
        productId: product._id,
        variantId: cartItem.variantId,
        quantity: cartItem.quantity,
        currentProduct: product,
      });
    }

    const isCOD =
      paymentMethod === "COD" || paymentMethod === "Cash on delivery";

    const newOrder = await Order.create(
      [
        {
          user: user._id,
          orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          items: orderItems,
          totalAmount: totalOrderAmount,
          status: "processing",
          paymentDetails: {
            method: paymentMethod,
            transactionId: isCOD
              ? null
              : transactionId ||
                `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            status: "pending",
            amountPaid: isCOD ? 0 : totalOrderAmount,
            paymentDate: isCOD ? null : new Date(),
          },
          shippingAddress: {
            pincode: shippingAddress.pincode,
            state: shippingAddress.state,
            city: shippingAddress.city,
            addressLine: shippingAddress.addressLine,
            landmark: shippingAddress.landmark,
            type: shippingAddress.type,
            country: "India",
          },
        },
      ],
      { session }
    );

    // Update stock
    for (const {
      variantId,
      quantity,
      currentProduct,
    } of productsToUpdateStock) {
      if (variantId) {
        const variantIndex = currentProduct.variants.findIndex(
          (v) => v.variantId === variantId
        );
        if (variantIndex !== -1) {
          currentProduct.variants[variantIndex].stock -= quantity;
        }
      } else {
        currentProduct.stock -= quantity;
      }
      await currentProduct.save({ session, validateBeforeSave: false });
    }

    // Clear cart
    user.cart = {
      items: [],
      totalQuantity: 0,
      totalPrice: 0,
      lastUpdated: new Date(),
    };
    user.orders = user.orders || [];
    user.orders.push(newOrder[0]._id);
    await user.save({ session, validateBeforeSave: false });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json(new ApiResponse(201, newOrder[0], "Order placed successfully!"));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

/**
 * @desc Get all orders for the authenticated user.
 * @route GET /api/v1/users/me/orders
 * @access Private
 */
const getUserOrders = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { page = 1, limit = 10, status } = req.query;
  const query = { user: req.user._id };
  if (status) {
    query.status = status;
  }

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);

  let orders, totalDocs;

  if (typeof Order.paginate === "function") {
    // If using mongoose-paginate-v2
    const options = {
      page: parsedPage,
      limit: parsedLimit,
      sort: { createdAt: -1 },
    };
    orders = await Order.paginate(query, options);
  } else {
    // Manual pagination fallback
    orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .lean();

    totalDocs = await Order.countDocuments(query);
    orders = {
      docs: orders,
      totalDocs,
      page: parsedPage,
      limit: parsedLimit,
    };
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        orders,
        orders?.docs?.length > 0
          ? "Orders fetched successfully."
          : "No orders found."
      )
    );
});

/**
 * @desc Get details of a specific order for the authenticated user.
 * @route GET /api/v1/users/me/orders/:orderId
 * @access Private
 */
const getUserOrderById = asyncHandler(async (req, res) => {
  if (!req.user?._id) {
    throw new ApiError(401, "User not authenticated.");
  }

  const { orderId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID.");
  }

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
  }).lean(); // Since data is denormalized, lean is safe and faster

  if (!order) {
    throw new ApiError(404, "Order not found or does not belong to you.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order details fetched successfully."));
});

export { createOrder, getUserOrders, getUserOrderById };
