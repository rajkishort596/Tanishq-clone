import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";

export const verifyUserJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.userAccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken -otp -otpExpiry"
    );
    if (!user) throw new ApiError(401, "Invalid access token");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const verifyAdminJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.adminAccessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized request");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const admin = await Admin.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!admin) throw new ApiError(401, "Invalid access token");

    req.admin = admin;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
