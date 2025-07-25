import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Order } from "../../models/order.model.js";
import { User } from "../../models/user.model.js";
import { Review } from "../../models/review.model.js";
import { Product } from "../../models/product.model.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  // 1. Authorization Check
  //   if (!req.admin) {
  //     throw new ApiError(
  //       403,
  //       "Forbidden: Only administrators can access dashboard statistics."
  //     );
  //   }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 2. Calculate Total Sales
  const totalSales = await Order.aggregate([
    { $match: { "paymentDetails.status": "paid" } },
    {
      $group: {
        _id: null,
        total: { $sum: "$paymentDetails.amountPaid" },
      },
    },
  ]).then((result) => result[0]?.total || 0);

  // 3. Calculate Total Orders
  const totalOrders = await Order.countDocuments({});

  // 4. Calculate New Customers (e.g., registered in the last 30 days)
  const newCustomers = await User.countDocuments({
    createdAt: { $gte: thirtyDaysAgo },
  });

  // 5. Calculate Pending Reviews
  const pendingReviews = await Review.countDocuments({ isApproved: false });

  // 6. Calculate Out-of-Stock Products
  const outOfStockProducts = await Product.countDocuments({
    stock: { $lte: 0 },
  });

  // 7. Fetch recent 10 orders
  const recentOrders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .select("items orderNumber user paymentDetails placedAt status")
    .populate("user", "firstName lastName");

  // 8. Assemble the statistics object
  const stats = {
    totalSales: parseFloat(totalSales.toFixed(2)),
    totalOrders,
    newCustomers,
    pendingReviews,
    recentOrders,
    outOfStockProducts,
  };

  // 8. Send the response
  return res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Dashboard statistics fetched successfully.")
    );
});

export { getDashboardStats };
