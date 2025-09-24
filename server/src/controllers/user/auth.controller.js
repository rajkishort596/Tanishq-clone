import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { User } from "../../models/user.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { generateAccessAndRefereshTokens } from "../../utils/generateToken.js";
import { sendEmail } from "../../utils/sendEmail.js";
import { generateOTP } from "../../utils/generateOTP.js";
import jwt from "jsonwebtoken";
import {
  genericChangePassword,
  genericForgotPassword,
  genericResetPassword,
} from "../../services/auth.service.js";

const OTP_EXPIRY_MINUTES = 10;

/**
  Step 1: Initiates user registration by sending an OTP to the provided email.
 * - Checks for existing, verified users.
 * - Generates and saves OTP.
 * - Sends OTP via email.
 * - Returns a temporary token allowing the user to proceed to OTP verification.
 */
const registerUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email || email.trim() === "") {
    throw new ApiError(400, "Email is required.");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser && existingUser.verified) {
    throw new ApiError(409, "User with this email already exists");
  }

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  let user;
  if (existingUser && !existingUser.verified) {
    user = existingUser;
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    user.verified = false;
    user.otpAttempts = 5; // Reset attempts on resend
  } else {
    user = new User({
      email,
      otp,
      otpExpiry,
      verified: false,
      otpAttempts: 5, // Set attempts on new user
    });
  }

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail(
      email,
      "Your OTP for Tanishq Registration",
      `<p>Your One-Time Password (OTP) for Tanishq registration is: <strong>${otp}</strong>.</p><p>It is valid for ${OTP_EXPIRY_MINUTES} minutes.</p>`
    );
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new ApiError(500, "Failed to send OTP. Please try again later.");
  }

  const tempToken = jwt.sign(
    { _id: user._id, email: user.email, type: "registration_otp_sent" },
    process.env.TEMP_REGISTRATION_SECRET,
    { expiresIn: `${OTP_EXPIRY_MINUTES + 2}m` }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("tempRegistrationToken", tempToken, options)
    .json(
      new ApiResponse(
        200,
        { tempToken, attemptsLeft: user.otpAttempts },
        "OTP sent successfully to your email. Please verify to continue registration."
      )
    );
});

/**
 * Step 2: Verifies the OTP provided by the user.
 * - Requires the temporary token from `registerUser` for authorization.
 * - Checks if OTP matches and is not expired.
 * - Marks user as verified.
 * - Returns a new temporary token for completing registration.
 */
const verifyUserOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  // const tempToken = req.headers.authorization?.split(" ")[1];

  const tempToken =
    req.cookies.tempRegistrationToken ||
    req.headers.authorization?.split(" ")[1];

  if (!email || email.trim() === "" || !otp || otp.trim() === "") {
    throw new ApiError(400, "Email and OTP are required.");
  }
  if (!tempToken) {
    throw new ApiError(401, "Unauthorized: Temporary token missing.");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(tempToken, process.env.TEMP_REGISTRATION_SECRET);

    if (decodedToken.email !== email) {
      throw new ApiError(
        403,
        "Forbidden: Email mismatch with verification token."
      );
    }

    if (decodedToken.type !== "registration_otp_sent") {
      throw new ApiError(
        403,
        "Forbidden: Invalid token type for OTP verification."
      );
    }
  } catch (error) {
    throw new ApiError(
      401,
      error.message || "Unauthorized: Invalid or expired temporary token."
    );
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(404, "User not found. Please re-initiate registration.");
  }

  if (user.otpAttempts === undefined) user.otpAttempts = 5;
  if (user.otpAttempts === 0) {
    throw new ApiError(
      429,
      "Maximum OTP attempts reached. Please resend OTP.",
      { attemptsLeft: 0 }
    );
  }
  if (user.otp !== otp) {
    user.otpAttempts -= 1;

    if (user.otpAttempts <= 0) {
      user.otpAttempts = 0;
      await user.save({ validateBeforeSave: false });
      throw new ApiError(
        429,
        "Maximum OTP attempts reached. Please resend OTP.",
        { attemptsLeft: 0 }
      );
    }

    await user.save({ validateBeforeSave: false });
    throw new ApiError(
      400,
      `Invalid OTP. ${user.otpAttempts} attempt(s) left.`,
      { attemptsLeft: user.otpAttempts }
    );
  }

  if (user.otpExpiry < Date.now()) {
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }

  user.verified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  user.otpAttempts = undefined;

  await user.save({ validateBeforeSave: false });

  const verificationSuccessToken = jwt.sign(
    { _id: user._id, email: user.email, type: "registration_verified" },
    process.env.TEMP_REGISTRATION_SECRET,
    { expiresIn: "15m" }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("tempVerificationToken", verificationSuccessToken, options)
    .json(
      new ApiResponse(
        200,
        { tempToken: verificationSuccessToken, attemptsLeft: 5 },
        "Email verified successfully. You can now complete your registration."
      )
    );
});

/**
 * Step 3: Completes the user registration by collecting remaining details.
 * - Requires the temporary token from `verifyUserOTP` for authorization.
 * - Collects phone, firstName, lastName, avatar, and password.
 * - Uploads avatar to Cloudinary.
 * - Generates and returns access/refresh tokens for immediate login.
 */
const completeUserRegistration = asyncHandler(async (req, res) => {
  // const verificationToken = req.headers.authorization?.split(" ")[1];
  const verificationToken =
    req.cookies.tempVerificationToken ||
    req.headers.authorization?.split(" ")[1];

  if (!verificationToken) {
    throw new ApiError(
      401,
      "Unauthorized: Verification token missing. Please verify your email first."
    );
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(
      verificationToken,
      process.env.TEMP_REGISTRATION_SECRET
    );
    if (decodedToken.type !== "registration_verified") {
      throw new ApiError(
        403,
        "Forbidden: Invalid token type for registration completion."
      );
    }
  } catch (error) {
    throw new ApiError(
      401,
      error.message ||
        "Unauthorized: Invalid or expired verification token. Please restart registration."
    );
  }

  const { phone, firstName, lastName, password } = req.body;

  if (
    [phone, firstName, lastName, password].some(
      (field) => field?.trim() === "" || field === undefined
    )
  ) {
    throw new ApiError(
      400,
      "All fields (phone, firstName, lastName, password) are required."
    );
  }

  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new ApiError(404, "User not found. Please restart registration.");
  }

  if (!user.verified) {
    throw new ApiError(
      403,
      "Email not verified. Please complete OTP verification first."
    );
  }

  const avatarLocalPath = req.file?.path;
  // if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");
  let avatar = {};
  if (avatarLocalPath) {
    try {
      const uploadedAvatar = await uploadOnCloudinary(avatarLocalPath);
      if (!uploadedAvatar || !uploadedAvatar.url) {
        throw new ApiError(500, "Failed to upload avatar image.");
      }
      avatar = {
        url: uploadedAvatar.url,
        publicId: uploadedAvatar.public_id,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new ApiError(500, "Error uploading avatar. Please try again.");
    }
  } else {
    avatar = {
      url: "https://placehold.co/200x200/cccccc/ffffff?text=User",
      publicId: "default_avatar",
    };
  }

  user.phone = phone;
  user.firstName = firstName;
  user.lastName = lastName;
  user.avatar = avatar;
  user.password = password;

  user.otp = undefined;
  user.otpExpiry = undefined;

  await user.save();

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000,
  };

  return res
    .status(201)
    .cookie("userAccessToken", accessToken, options)
    .cookie("userRefreshToken", refreshToken, {
      ...options,
      maxAge: 10 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(
        201,
        {
          user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatar: user.avatar.url,
          },
          accessToken,
          refreshToken,
        },
        "User registered and logged in successfully!"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).populate("wishlist addresses");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 24 * 60 * 60 * 1000,
  };

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
        {
          user: {
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            gender: user.gender,
            wishlist: user.wishlist,
            addresses: user.addresses,
            dob: user.dob,
            anniversary: user.anniversary,
            avatar: user.avatar?.url,
          },
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };

  return res
    .status(200)
    .clearCookie("userAccessToken", options)
    .clearCookie("userRefreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email, frontendUrl } = req.body;
  // Call the generic service with the User model
  const response = await genericForgotPassword(User, email, frontendUrl);
  return res.status(response.statusCode).json(response);
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  // Call the generic service with the User model
  const response = await genericResetPassword(User, token, password);
  return res.status(response.statusCode).json(response);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Call the generic service with the User model
  const response = await genericChangePassword(
    User,
    req.user._id,
    currentPassword,
    newPassword
  );
  return res.status(response.statusCode).json(response);
});

export {
  registerUser,
  verifyUserOTP,
  completeUserRegistration,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changePassword,
};
