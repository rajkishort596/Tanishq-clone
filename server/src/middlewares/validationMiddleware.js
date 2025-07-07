import { body, validationResult, param } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Middleware to check validation results
const validate = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // If there are validation errors, format them and throw an ApiError
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  throw new ApiError(400, "Validation failed", extractedErrors);
});

// --- User Related Validations ---

// Validation for sending OTP (registerUser)
const registerUserValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  validate,
];

// Validation for verifying OTP (verifyUserOTP)
const verifyUserOTPValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("otp")
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits")
    .isNumeric()
    .withMessage("OTP must be numeric"),
  validate,
];

// Validation for completing user registration (completeUserRegistration)
const completeUserRegistrationValidation = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid Indian phone number format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  validate,
];

// --- Authentication Validations ---
const loginUserValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  validate,
];

const changeUserPasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  validate,
];

// --- Pofile Validations ---

const updateUserProfileValidation = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid Indian phone number format"),
  validate,
];

// --- Address Validations ---
const userAddressValidation = [
  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("Pincode is required.")
    .isLength({ min: 6, max: 6 })
    .withMessage("Pincode must be 6 digits.")
    .isNumeric()
    .withMessage("Pincode must contain only numbers."),
  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters."),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters."),

  body("addressLine")
    .trim()
    .notEmpty()
    .withMessage("Address line is required.")
    .isLength({ min: 5, max: 200 })
    .withMessage("Address line must be between 5 and 200 characters."),

  body("landmark")
    .trim()
    .optional({ checkFalsy: true })
    .isLength({ max: 100 })
    .withMessage("Landmark can be at most 100 characters."),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Address type is required.")
    .isIn(["home", "work", "other"])
    .withMessage("Invalid address type. Must be 'home', 'work', or 'other'."),
  validate,
];

export {
  registerUserValidation,
  verifyUserOTPValidation,
  completeUserRegistrationValidation,
  loginUserValidation,
  changeUserPasswordValidation,
  updateUserProfileValidation,
  userAddressValidation,
};
