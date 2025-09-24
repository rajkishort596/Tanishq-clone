import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { generateAccessAndRefereshTokens } from "../../utils/generateToken.js";
import { Admin } from "../../models/admin.model.js";
import {
  genericChangePassword,
  genericForgotPassword,
  genericResetPassword,
} from "../../services/auth.service.js";

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }

  const admin = await Admin.findOne({
    email,
  });

  if (!admin) {
    throw new ApiError(404, "Admin does not exist");
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    admin._id,
    Admin
  );

  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000,
  };
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
        {
          user: loggedInAdmin,
          accessToken,
          refreshToken,
        },
        "Admin logged In Successfully"
      )
    );
});

const getMeAdmin = asyncHandler(async (req, res) => {
  // req.admin is attached by verifyAdminJWT
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.admin, "Admin details fetched successfully")
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  await Admin.findByIdAndUpdate(req.admin._id, {
    $unset: { refreshToken: 1 },
  });
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .clearCookie("adminAccessToken", options)
    .clearCookie("adminRefreshToken", options)
    .status(200)
    .json(new ApiResponse(200, {}, "Admin logged out"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email, frontendUrl } = req.body;
  // Call the generic service with the User model
  const response = await genericForgotPassword(Admin, email, frontendUrl);
  return res.status(response.statusCode).json(response);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  // Call the generic service with the User model
  const response = await genericResetPassword(Admin, token, password);
  return res.status(response.statusCode).json(response);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Call the generic service with the User model
  const response = await genericChangePassword(
    Admin,
    req.admin._id,
    currentPassword,
    newPassword
  );
  return res.status(response.statusCode).json(response);
});

export {
  loginAdmin,
  getMeAdmin,
  logoutAdmin,
  forgotPassword,
  resetPassword,
  changePassword,
};
