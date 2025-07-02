import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "./ApiError.js";
import { ApiResponse } from "./ApiResponse.js";
import { asyncHandler } from "./asyncHandler.js";
import { generateAccessAndRefereshTokens } from "./generateToken.js";
import jwt from "jsonwebtoken";

const refreshUserAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.userRefreshToken || req.body.userRefreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    };
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    return res
      .status(200)
      .cookie("userAccessToken", accessToken, options)
      .cookie("userRefreshToken", refreshToken, {
        ...options,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});
const refreshAdminAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.adminRefreshToken || req.body.adminRefreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const admin = await Admin.findById(decodedToken?._id);

    if (!admin) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== admin?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    };
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      admin._id,
      Admin
    );

    return res
      .status(200)
      .cookie("adminAccessToken", accessToken, options)
      .cookie("adminRefreshToken", refreshToken, {
        ...options,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      })
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { refreshUserAccessToken, refreshAdminAccessToken };
