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
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format.")
    .normalizeEmail(),
  validate,
];

// Validation for verifying OTP (verifyUserOTP)
const verifyUserOTPValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format."),
  body("otp")
    .notEmpty()
    .withMessage("OTP is required.")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits.")
    .isNumeric()
    .withMessage("OTP must be numeric."),
  validate,
];

// Validation for completing user registration (completeUserRegistration)
const completeUserRegistrationValidation = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required.")
    .isString()
    .withMessage("First name must be a string.")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters."),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required.")
    .isString()
    .withMessage("Last name must be a string.")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters."),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required.")
    .isMobilePhone("en-IN")
    .withMessage("Invalid Indian phone number format."),
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  validate,
];

// --- Authentication Validations ---
const loginUserValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Invalid email format."),
  body("password").notEmpty().withMessage("Password is required."),
  validate,
];

const changeUserPasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required."),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
  validate,
];

// --- Pofile Validations ---

const updateUserProfileValidation = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required.")
    .isString()
    .withMessage("First name must be a string.")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters."),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required.")
    .isString()
    .withMessage("Last name must be a string.")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters."),
  body("phone")
    .notEmpty()
    .withMessage("Phone number is required.")
    .isMobilePhone("en-IN")
    .withMessage("Invalid Indian phone number format."),
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

// --- Product Validations ---

const createProductValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ max: 255 })
    .withMessage("Product name cannot exceed 255 characters."),

  body("description")
    .trim()
    .isString()
    .withMessage("Description must be a string.")
    .optional(),

  body("price.base")
    .notEmpty()
    .withMessage("Base price is required.")
    .isNumeric()
    .withMessage("Base price must be a number."),

  body("price.makingCharges")
    .optional()
    .isNumeric()
    .withMessage("Making charges must be a number."),

  body("price.gst").optional().isNumeric().withMessage("GST must be a number."),

  body("price.final")
    .notEmpty()
    .withMessage("Final price is required.")
    .isNumeric()
    .withMessage("Final price must be a number."),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),

  body("weight")
    .notEmpty()
    .withMessage("Weight is required.")
    .isNumeric()
    .withMessage("Weight must be a number."),

  body("metal")
    .trim()
    .notEmpty()
    .withMessage("Metal is required.")
    .isString()
    .withMessage("Metal must be a string."),

  body("purity")
    .trim()
    .notEmpty()
    .withMessage("Purity is required.")
    .isString()
    .withMessage("Purity must be a string."),

  body("gender")
    .trim()
    .optional()
    .isString()
    .withMessage("Gender must be a string."),

  body("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isMongoId()
    .withMessage("Invalid category ID."),

  body("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subCategory ID."),

  body("variants")
    .isArray()
    .withMessage("Variants must be an array.")
    .optional(),
  body("variants.*.variantId")
    .isString()
    .withMessage("Variant ID must be a string."),
  body("variants.*.priceAdjustment")
    .isNumeric()
    .withMessage("Price adjustment must be a number."),
  body("variants.*.stock")
    .isInt({ min: 0 })
    .withMessage("Variant stock must be a non-negative integer."),

  body("collections")
    .isArray()
    .withMessage("Collections must be an array.")
    .optional(),
  body("collections.*").isMongoId().withMessage("Invalid collection ID."),

  body("occasion")
    .isArray()
    .withMessage("Occasion must be an array.")
    .optional(),
  body("occasion.*").isString().withMessage("Occasion must be a string."),

  validate,
];

const updateProductValidation = [
  param("id").isMongoId().withMessage("Invalid product ID in parameters."),
  body("name")
    .optional()
    .isString()
    .trim()
    .withMessage("Product name must be a string."),
  body("description")
    .optional()
    .isString()
    .trim()
    .withMessage("Description must be a string."),
  body("price.base")
    .optional()
    .isNumeric()
    .withMessage("Base price must be a number."),
  body("price.makingCharges")
    .optional()
    .isNumeric()
    .withMessage("Making charges must be a number."),
  body("price.gst").optional().isNumeric().withMessage("GST must be a number."),
  body("price.final")
    .optional()
    .isNumeric()
    .withMessage("Final price must be a number."),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),
  body("weight").optional().isNumeric().withMessage("Weight must be a number."),
  body("metal")
    .optional()
    .isString()
    .trim()
    .withMessage("Metal must be a string."),
  body("purity")
    .optional()
    .isString()
    .trim()
    .withMessage("Purity must be a string."),
  body("gender")
    .optional()
    .isString()
    .trim()
    .withMessage("Gender must be a string."),
  body("category").optional().isMongoId().withMessage("Invalid category ID."),
  body("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subCategory ID."),

  body("variants")
    .optional()
    .isArray()
    .withMessage("Variants must be an array."),
  body("variants.*.variantId")
    .optional()
    .isString()
    .withMessage("Variant ID must be a string."),
  body("variants.*.priceAdjustment")
    .optional()
    .isNumeric()
    .withMessage("Price adjustment must be a number."),
  body("variants.*.stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Variant stock must be a non-negative integer."),

  body("collections")
    .optional()
    .isArray()
    .withMessage("Collections must be an array."),
  body("collections.*")
    .optional()
    .isMongoId()
    .withMessage("Invalid collection ID."),

  body("occasion")
    .optional()
    .isArray()
    .withMessage("Occasion must be an array."),
  body("occasion.*")
    .optional()
    .isString()
    .withMessage("Occasion must be a string."),

  validate,
];

// --- Category Validations ---

const createCategoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isString()
    .withMessage("Category name must be a string.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters."),

  body("slug")
    .trim()
    .notEmpty()
    .withMessage("Slug is required.")
    .isString()
    .withMessage("Slug must be a string.")
    .isLowercase()
    .withMessage("Slug must be lowercase.")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers, and hyphens."
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isString()
    .withMessage("Description must be a string."),

  body("parent")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category ID."),

  body("icon").optional().isString().withMessage("Icon URL must be a string."),
  validate,
];

const updateCategoryValidation = [
  param("id").isMongoId().withMessage("Invalid category ID in parameters."),
  body("name")
    .optional()
    .isString()
    .trim()
    .withMessage("Category name must be a string."),
  body("description")
    .optional()
    .isString()
    .trim()
    .withMessage("Description must be a string."),
  body("parent")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent category ID."),
  validate,
];

// --- Collection Validations ---

const createCollectionValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Collection name is required.")
    .isString()
    .withMessage("Collection name must be a string.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Collection name must be between 2 and 100 characters."),

  body("description")
    .trim()
    .isString()
    .withMessage("Description must be a string.")
    .optional(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean."),
  validate,
];

const updateCollectionValidation = [
  param("id").isMongoId().withMessage("Invalid collection ID in parameters."),
  body("name")
    .optional()
    .isString()
    .trim()
    .withMessage("Collection name must be a string."),
  body("description")
    .optional()
    .isString()
    .trim()
    .withMessage("Description must be a string."),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean."),
  validate,
];

// --- Order Validations ---

const createOrderValidation = [
  body("addressId")
    .notEmpty()
    .withMessage("Shipping address ID is required.")
    .isMongoId()
    .withMessage("Invalid shipping address ID."),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required.")
    .isString()
    .withMessage("Payment method must be a string.")
    .isIn(["COD", "Online", "UPI"])
    .withMessage("Payment method must be COD, Online, or UPI."),

  body("transactionId")
    .optional()
    .isString()
    .withMessage("Transaction ID must be a string."),
  validate,
];

// --- Review Validations ---
const reviewValidation = [
  body("rating")
    .notEmpty()
    .withMessage("Rating is required.")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5."),
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment cannot be empty.")
    .isString()
    .withMessage("Comment must be a string.")
    .isLength({ max: 500 })
    .withMessage("Comment cannot exceed 500 characters."),
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
  createProductValidation,
  updateProductValidation,
  createCategoryValidation,
  updateCategoryValidation,
  createCollectionValidation,
  updateCollectionValidation,
  createOrderValidation,
  reviewValidation,
};
