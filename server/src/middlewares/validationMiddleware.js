import { body, validationResult, param } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
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

// Helper function to parse JSON strings from form-data
const parseJsonBodyField = (field) =>
  body(field).customSanitizer((value, { req }) => {
    try {
      // If value is empty or null, treat as null
      if (value === "" || value === undefined || value === null) {
        req.body[field] = null;
        return null;
      }

      // If it's a string, parse it
      if (typeof value === "string") {
        const parsed = JSON.parse(value);
        req.body[field] = parsed;
        return parsed;
      }

      // Already object/array
      return value;
    } catch (e) {
      throw new Error(`Invalid JSON format for ${field}.`);
    }
  });

const createProductValidation = [
  // First, parse the JSON string fields
  parseJsonBodyField("price"),
  parseJsonBodyField("variants"),
  parseJsonBodyField("collections"),
  parseJsonBodyField("occasion"),

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

  // Now validate the parsed 'price' object
  body("price.base")
    .notEmpty()
    .withMessage("Base price is required.")
    .isFloat({ min: 0 }) // Use isFloat for numbers with decimals
    .withMessage("Base price must be a non-negative number."),

  body("price.makingCharges")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Making charges must be a non-negative number."),

  body("price.gst")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("GST must be a non-negative number."),

  // Note: price.final is calculated on backend or derived, so often not directly validated from input.
  // If you send it from frontend, ensure it's calculated correctly.
  // body("price.final")
  //   .notEmpty()
  //   .withMessage("Final price is required.")
  //   .isFloat({ min: 0 })
  //   .withMessage("Final price must be a non-negative number."),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),

  body("weight")
    .notEmpty()
    .withMessage("Weight is required.")
    .isFloat({ min: 0 })
    .withMessage("Weight must be a non-negative number."),

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
    .notEmpty() // Made required based on product model
    .isIn(["men", "women", "kids", "unisex"]) // Add enum validation
    .withMessage("Gender must be one of 'men', 'women', 'kids', 'unisex'."),

  body("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isMongoId()
    .withMessage("Invalid category ID."),

  body("subCategory")
    .optional({ checkFalsy: true }) // Allow empty string or null
    .isMongoId()
    .withMessage("Invalid subCategory ID."),

  // Now validate the parsed 'variants' array
  body("variants")
    .isArray()
    .withMessage("Variants must be an array.")
    .custom((value) => {
      // Custom validation to ensure each variant object is valid
      if (!Array.isArray(value)) return false;
      for (const variant of value) {
        if (typeof variant !== "object" || variant === null) {
          throw new Error("Each variant must be an object.");
        }
        if (
          !variant.size ||
          typeof variant.size !== "string" ||
          variant.size.trim() === ""
        ) {
          throw new Error("Variant size is required and must be a string.");
        }
        if (
          !variant.metalColor ||
          typeof variant.metalColor !== "string" ||
          variant.metalColor.trim() === ""
        ) {
          throw new Error(
            "Variant metal color is required and must be a string."
          );
        }
        if (
          typeof variant.priceAdjustment === "undefined" ||
          typeof variant.priceAdjustment !== "number" ||
          variant.priceAdjustment < 0
        ) {
          throw new Error(
            "Variant price adjustment is required and must be a non-negative number."
          );
        }
        if (
          typeof variant.stock === "undefined" ||
          typeof variant.stock !== "number" ||
          variant.stock < 0 ||
          !Number.isInteger(variant.stock)
        ) {
          throw new Error(
            "Variant stock is required and must be a non-negative integer."
          );
        }
      }
      return true;
    }),

  // Now validate the parsed 'collections' array
  body("collections")
    .optional({ checkFalsy: true }) // Collections are optional
    .isArray()
    .withMessage("Collections must be an array.")
    .custom((value) => {
      if (!Array.isArray(value)) return false;
      for (const id of value) {
        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
          throw new Error("Invalid collection ID in collections array.");
        }
      }
      return true;
    }),

  // Now validate the parsed 'occasion' array
  body("occasion")
    .isArray()
    .withMessage("Occasion must be an array.")
    .custom((value) => {
      if (!Array.isArray(value)) return false;
      for (const item of value) {
        if (typeof item !== "string" || item.trim() === "") {
          throw new Error("Each occasion must be a non-empty string.");
        }
      }
      return true;
    })
    .optional(), // Occasion is optional based on your schema

  validate,
];

const updateProductValidation = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid product ID in parameters."),

  // First, parse the JSON string fields if they exist
  body("price")
    .optional()
    .customSanitizer((value, { req }) => {
      if (typeof value === "string") {
        try {
          req.body.price = JSON.parse(value);
          return req.body.price;
        } catch (e) {
          throw new Error("Invalid JSON format for price.");
        }
      }
      return value;
    }),
  body("variants")
    .optional()
    .customSanitizer((value, { req }) => {
      if (typeof value === "string") {
        try {
          req.body.variants = JSON.parse(value);
          return req.body.variants;
        } catch (e) {
          throw new Error("Invalid JSON format for variants.");
        }
      }
      return value;
    }),
  body("collections")
    .optional()
    .customSanitizer((value, { req }) => {
      if (typeof value === "string") {
        try {
          req.body.collections = JSON.parse(value);
          return req.body.collections;
        } catch (e) {
          throw new Error("Invalid JSON format for collections.");
        }
      }
      return value;
    }),
  body("occasion")
    .optional()
    .customSanitizer((value, { req }) => {
      if (typeof value === "string") {
        try {
          req.body.occasion = JSON.parse(value);
          return req.body.occasion;
        } catch (e) {
          throw new Error("Invalid JSON format for occasion.");
        }
      }
      return value;
    }),

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
    .isFloat({ min: 0 })
    .withMessage("Base price must be a non-negative number."),
  body("price.makingCharges")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Making charges must be a non-negative number."),
  body("price.gst")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("GST must be a non-negative number."),
  // body("price.final").optional().isFloat({ min: 0 }).withMessage("Final price must be a non-negative number."),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),
  body("weight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Weight must be a non-negative number."),
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
    .isIn(["men", "women", "kids", "unisex"])
    .withMessage("Gender must be one of 'men', 'women', 'kids', 'unisex'."),
  body("category").optional().isMongoId().withMessage("Invalid category ID."),
  body("subCategory")
    .optional({ checkFalsy: true })
    .isMongoId()
    .withMessage("Invalid subCategory ID."),

  body("variants")
    .optional()
    .isArray()
    .withMessage("Variants must be an array.")
    .custom((value) => {
      if (!Array.isArray(value)) return false; // Already handled by isArray, but good for safety
      for (const variant of value) {
        if (typeof variant !== "object" || variant === null) {
          throw new Error("Each variant must be an object.");
        }
        // For update, fields can be optional, but if present, they must be valid
        if (
          variant.size !== undefined &&
          (typeof variant.size !== "string" || variant.size.trim() === "")
        ) {
          throw new Error(
            "Variant size must be a non-empty string if provided."
          );
        }
        if (
          variant.metalColor !== undefined &&
          (typeof variant.metalColor !== "string" ||
            variant.metalColor.trim() === "")
        ) {
          throw new Error(
            "Variant metal color must be a non-empty string if provided."
          );
        }
        if (
          variant.priceAdjustment !== undefined &&
          (typeof variant.priceAdjustment !== "number" ||
            variant.priceAdjustment < 0)
        ) {
          throw new Error(
            "Variant price adjustment must be a non-negative number if provided."
          );
        }
        if (
          variant.stock !== undefined &&
          (typeof variant.stock !== "number" ||
            variant.stock < 0 ||
            !Number.isInteger(variant.stock))
        ) {
          throw new Error(
            "Variant stock must be a non-negative integer if provided."
          );
        }
      }
      return true;
    }),

  body("collections")
    .optional()
    .isArray()
    .withMessage("Collections must be an array.")
    .custom((value) => {
      if (!Array.isArray(value)) return false;
      for (const id of value) {
        if (!/^[a-fA-F0-9]{24}$/.test(id)) {
          throw new Error("Invalid collection ID in collections array.");
        }
      }
      return true;
    }),

  body("occasion")
    .optional()
    .isArray()
    .withMessage("Occasion must be an array.")
    .custom((value) => {
      if (!Array.isArray(value)) return false;
      for (const item of value) {
        if (typeof item !== "string" || item.trim() === "") {
          throw new Error("Each occasion must be a non-empty string.");
        }
      }
      return true;
    }),

  validate,
];

// Custom validator to handle either a single string or an array of ObjectIds
const validateParentIds = (value, { req }) => {
  let parentIds = Array.isArray(value) ? value : [value];

  // The custom validation now iterates over the normalized array
  for (const id of parentIds) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error(`Invalid parent category ID: ${id}`);
    }
  }

  // Update the request body to always have an array for consistency
  req.body.parent = parentIds;

  return true;
};

// --- Category Validations ---

const createCategoryValidation = [
  body("name")
    .customSanitizer((value) => value?.toString().trim())
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters."),

  body("description")
    .customSanitizer((value) => value?.toString().trim())
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 2 })
    .withMessage("Description must be at least 2 characters long."),

  body("parent").optional().custom(validateParentIds),

  validate,
];

const updateCategoryValidation = [
  param("categoryId")
    .isMongoId()
    .withMessage("Invalid category ID in parameters."),

  body("name")
    .customSanitizer((value) => value?.toString().trim())
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters."),

  body("description")
    .customSanitizer((value) => value?.toString().trim())
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 2 })
    .withMessage("Description must be at least 2 characters long."),

  body("parent").optional().custom(validateParentIds),

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
  param("collectionId")
    .isMongoId()
    .withMessage("Invalid collection ID in parameters."),
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

// --- Settings Validations ---
const updateSettingsValidation = [
  // Parse and validate storeInfo
  parseJsonBodyField("storeInfo"),
  body("storeInfo.name")
    .notEmpty()
    .withMessage("Store name is required.")
    .bail()
    .isString()
    .withMessage("Store name must be a string."),
  body("storeInfo.description")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("Description must be a string."),

  // Parse and validate contactInfo
  parseJsonBodyField("contactInfo"),
  body("contactInfo.emails")
    .notEmpty()
    .withMessage("At least one email is required.")
    .bail()
    .isArray()
    .withMessage("Emails must be an array.")
    .bail()
    .custom((emails) =>
      emails.every((email) => typeof email === "string" && email.trim() !== "")
    )
    .withMessage("Emails cannot be empty strings.")
    .bail()
    .custom((emails) => emails.every((email) => /\S+@\S+\.\S+/.test(email)))
    .withMessage("All emails must be valid email addresses."),

  body("contactInfo.phones")
    .notEmpty()
    .withMessage("At least one phone number is required.")
    .bail()
    .isArray()
    .withMessage("Phones must be an array.")
    .bail()
    .custom((phones) =>
      phones.every((phone) => typeof phone === "string" && phone.trim() !== "")
    )
    .withMessage("Phone numbers cannot be empty strings.")
    .bail()
    .custom(
      (phones) => phones.every((phone) => /^[0-9]{10}$/.test(phone)) // 10-digit numeric
    )
    .withMessage("All phone numbers must be valid 10-digit numbers."),

  body("contactInfo.whatsapp")
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^[0-9]{10}$/)
    .withMessage("WhatsApp must be a valid 10-digit number."),
  body("contactInfo.address")
    .optional({ nullable: true, checkFalsy: true })
    .isString()
    .withMessage("Address must be a string."),

  // Parse and validate socialLinks
  parseJsonBodyField("socialLinks"),
  body("socialLinks.facebook")
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage("Facebook must be a valid URL."),
  body("socialLinks.instagram")
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage("Instagram must be a valid URL."),
  body("socialLinks.twitter")
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage("Twitter must be a valid URL."),
  body("socialLinks.youtube")
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage("YouTube must be a valid URL."),

  // Parse and validate paymentSettings
  parseJsonBodyField("paymentSettings"),
  body("paymentSettings.currency")
    .notEmpty()
    .withMessage("Currency is required.")
    .bail()
    .isIn(["INR", "USD", "EUR"])
    .withMessage("Invalid currency."),
  body("paymentSettings.codEnabled")
    .not()
    .isEmpty()
    .withMessage("codEnabled is required.")
    .bail()
    .isBoolean()
    .withMessage("codEnabled must be a boolean."),
  body("paymentSettings.methods")
    .optional({ nullable: true, checkFalsy: true })
    .isArray()
    .withMessage("Methods must be an array."),

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
  updateSettingsValidation,
};
