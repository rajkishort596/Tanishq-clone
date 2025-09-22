import { asyncHandler } from "../../utils/asyncHandler.js";
import { razorpay } from "../../utils/razorpay.js";
import crypto from "crypto";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

// Step 1: Create Razorpay Order
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body; // in INR

  if (!amount || amount <= 0) throw new ApiError(400, "Invalid amount");

  const options = {
    amount: Math.round(amount * 100), // Razorpay needs paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  return res.status(200).json(
    new ApiResponse(200, {
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
      key: process.env.RAZORPAY_API_KEY, // sending key to frontend
    })
  );
});

// Step 2: Verify Payment
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET);
  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  const generatedSignature = hmac.digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, "Payment verification failed");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { verified: true }, "Payment verified successfully")
    );
});
