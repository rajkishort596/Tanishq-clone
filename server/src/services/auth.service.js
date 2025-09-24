import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendEmail } from "../utils/sendEmail.js"; // Ensure this utility is correctly implemented
import bcrypt from "bcrypt";

/**
 * Generic function to handle forgot password requests.
 * It sends a password reset link (containing a JWT token) to the user's email.
 *
 * @param {mongoose.Model} Model - The Mongoose Model (e.g., User, Admin) to operate on.
 * @param {string} email - The email address of the user/admin requesting password reset.
 * @returns {Promise<ApiResponse>} A Promise that resolves to an ApiResponse object.
 * @throws {ApiError} If email is missing or email sending fails.
 */

export const genericForgotPassword = async (Model, email, frontendUrl) => {
  if (!email || !frontendUrl) {
    throw new ApiError(400, "Email and frontend URL are required.");
  }

  const entity = await Model.findOne({ email });

  if (!entity) {
    throw new ApiError(404, "Account with this email does not exist.");
  }

  // Generate JWT reset token using the model's method
  const resetToken = await entity.generatePasswordResetToken();

  // Use the passed frontendUrl to construct the reset link
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  try {
    await sendEmail(
      entity.email,
      "Password Reset Request",
      `
      <div style="font-family: Arial, sans-serif; color: #222; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
        <p>Hello ${entity.fullName || entity.firstName || "User"},</p>
        <p>We received a request to reset your password for your Tanishq account. Click the button below to reset it:</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#a11e3b;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold;text-align:center;">Reset Password</a>
        <p style="margin-top: 20px;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
        <p style="margin-top:32px;font-size:12px;color:#888;">If the button doesn't work, copy and paste this link into your browser:<br><a href="${resetUrl}" style="color:#a11e3b;word-break: break-all;">${resetUrl}</a></p>
        <p style="margin-top: 20px; font-size: 14px; color: #555;">Thank you,<br>The Tanishq Team</p>
      </div>
      `
    );
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new ApiError(
      500,
      "Failed to send password reset email. Please try again later."
    );
  }

  return new ApiResponse(
    200,
    { resetUrl }, // Do not expose resetUrl in production response
    "Password reset link sent to your email."
  );
};

/**
 * Generic function to handle password reset requests using a JWT token.
 *
 * @param {mongoose.Model} Model - The Mongoose Model (e.g., User, Admin) to operate on.
 * @param {string} token - The JWT reset token received from the frontend.
 * @param {string} newPassword - The new password provided by the user/admin.
 * @returns {Promise<ApiResponse>} A Promise that resolves to an ApiResponse object.
 * @throws {ApiError} If token or new password is missing, or token is invalid/expired, or user not found.
 */
export const genericResetPassword = async (Model, token, newPassword) => {
  if (!token || !newPassword) {
    throw new ApiError(400, "Token and new password are required.");
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters long.");
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new ApiError(
        400,
        "Password reset token has expired. Please request a new one."
      );
    }
    throw new ApiError(400, "Invalid password reset token.");
  }

  const entity = await Model.findById(payload._id);
  if (!entity || !entity.resetPasswordTokenHash) {
    throw new ApiError(400, "Token already used or invalid");
  }

  // Compare bcrypt hash
  const isMatch = await bcrypt.compare(token, entity.resetPasswordTokenHash);
  if (!isMatch) {
    throw new ApiError(400, "Token already used or invalid");
  }
  // Update password and clear reset token hash
  entity.password = newPassword;
  entity.resetPasswordTokenHash = undefined;
  await entity.save();
  return new ApiResponse(200, {}, "Password has been reset successfully.");
};

/**
 * Generic function to handle changing password for an authenticated user/admin.
 *
 * @param {mongoose.Model} Model - The Mongoose Model (e.g., User, Admin) to operate on.
 * @param {string} entityId - The ID of the authenticated user/admin (from req.user._id).
 * @param {string} currentPassword - The current password provided by the user/admin.
 * @param {string} newPassword - The new password provided by the user/admin.
 * @returns {Promise<ApiResponse>} A Promise that resolves to an ApiResponse object.
 * @throws {ApiError} If passwords are missing, current password is incorrect, or user/admin not found.
 */
export const genericChangePassword = async (
  Model,
  entityId,
  currentPassword,
  newPassword
) => {
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new password are required.");
  }

  if (newPassword.length < 8) {
    throw new ApiError(400, "New password must be at least 8 characters long.");
  }

  const entity = await Model.findById(entityId);

  if (!entity) {
    throw new ApiError(404, "User/Admin not found.");
  }

  const isPasswordValid = await entity.isPasswordCorrect(currentPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  entity.password = newPassword;
  await entity.save();
  return new ApiResponse(200, {}, "Password changed successfully.");
};
