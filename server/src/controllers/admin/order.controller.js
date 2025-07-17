import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Order } from "../../models/order.model.js";
import { User } from "../../models/user.model.js";

/**
 * @desc Get all orders for admin view with filtering, sorting, and pagination.
 * @route GET /api/v1/admin/orders
 * @access Private (Admin only)
 */
const getAllOrdersAdmin = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view all orders."
    );
  }

  const {
    page = 1,
    limit = 10,
    search = "",
    status,
    paymentStatus,
    userId,
    endDate,
    sortBy = "placedAt",
    sortOrder = "desc",
  } = req.query;

  const query = {};

  // Search by orderNumber
  if (search) {
    query.orderNumber = { $regex: search, $options: "i" };
  }

  // Filter by specific user
  if (userId) {
    query.user = userId;
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by payment status
  if (paymentStatus) {
    query["paymentDetails.status"] = paymentStatus;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.placedAt = {};
    if (startDate) {
      query.placedAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.placedAt.$lte = new Date(endDate);
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
      { path: "user", select: "firstName lastName email phone" },
      { path: "items.product", select: "name images" },
    ],
    customLabels: {
      totalDocs: "totalOrders",
      docs: "orders",
    },
  };

  const orders = await Order.paginate(query, options);

  if (!orders || orders.orders.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { docs: [], totalDocs: 0, limit, page: parseInt(page, 10) },
          "No orders found."
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, orders, "Orders fetched successfully for admin.")
    );
});

/**
 * @desc Get details of a specific order by ID for admin view.
 * @route GET /api/v1/admin/orders/:orderId
 * @access Private (Admin only)
 */
const getOrderByIdAdmin = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can view order details."
    );
  }

  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate({ path: "user", select: "firstName lastName email phone" })
    .populate({ path: "items.product", select: "name images" }); // Populate product details for each item

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order details fetched successfully."));
});

/**
 * @desc Update the status of a specific order.
 * @route PUT /api/v1/admin/orders/:orderId/status
 * @access Private (Admin only)
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can update order status."
    );
  }

  const { orderId } = req.params;
  const { status, paymentStatus } = req.body; // Can update either or both

  if (!status && !paymentStatus) {
    throw new ApiError(400, "Status or paymentStatus is required for update.");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  const updateFields = {};
  if (status) {
    // Validate if the new status is a valid enum value
    const validStatuses = Order.schema.path("status").enumValues;
    if (!validStatuses.includes(status)) {
      throw new ApiError(
        400,
        `Invalid order status. Must be one of: ${validStatuses.join(", ")}`
      );
    }
    updateFields.status = status;
  }

  if (paymentStatus) {
    // Validate if the new paymentStatus is a valid enum value
    const validPaymentStatuses = Order.schema.path(
      "paymentDetails.status"
    ).enumValues;
    if (!validPaymentStatuses.includes(paymentStatus)) {
      throw new ApiError(
        400,
        `Invalid payment status. Must be one of: ${validPaymentStatuses.join(", ")}`
      );
    }
    updateFields["paymentDetails.status"] = paymentStatus;
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!updatedOrder) {
    throw new ApiError(500, "Failed to update order status.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedOrder, "Order status updated successfully.")
    );
});

/**
 * @desc Delete a specific order by ID (use with extreme caution).
 * @route DELETE /api/v1/admin/orders/:orderId
 * @access Private (Admin only)
 */
const deleteOrderAdmin = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  if (!req.admin) {
    throw new ApiError(
      403,
      "Forbidden: Only administrators can delete orders."
    );
  }

  const { orderId } = req.params;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  // Remove the order ID from the user's orders array
  await User.findByIdAndUpdate(
    order.user,
    { $pull: { orders: order._id } },
    { new: true }
  );

  // Delete the order document
  await order.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Order deleted successfully."));
});

export {
  getAllOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatus,
  deleteOrderAdmin,
};
