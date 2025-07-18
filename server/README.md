# 🪙Tanishq Clone Backend

This repository contains the backend API for a Tanishq-inspired e-commerce platform. It's built with **Node.js**, **Express**, and **MongoDB**, focusing on robust features, maintainability, and performance for a modern jewelry retail application.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [API Structure](#api-structure)
- [Key Architectural Decisions & Code Snippets](#key-architectural-decisions--code-snippets)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints-full-list--explanation)

---

## Features

- **User Authentication:** OTP-based registration, email verification, login, logout, password reset (via email link), password change, JWT-based authentication.
- **User Profile Management:** View, update, and delete user profiles, including avatar uploads.
- **Address Management:** Add, view, update, and delete multiple shipping/billing addresses.
- **Product Catalog:**
  - **Admin:** CRUD operations for products.
  - **Public:** Browse, search, filter, sort, and view products.
- **Category Management:** Hierarchical categories (parent/child), CRUD for admin, browse for public.
- **Collection Management:** CRUD for themed product collections.
- **Cart Management:** Add, remove, update quantity of items.
- **Order Management:** Create orders, view history, admin controls for status and deletion.
- **Wishlist:** Add/remove products.
- **Product Reviews:** Submit, update, delete reviews; admin moderation.
- **Banner Management:** CRUD for promotional banners.
- **Live Gold Rate Integration:** Fetches real-time Indian gold rates.
- **Automated Product Pricing:** Scheduled background job updates prices.
- **Performance & Scalability:** Pagination, aggregation, bulk write operations.

---

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT)
- **File Uploads:** Multer
- **Cloud Storage:** Cloudinary
- **Validation:** Express-Validator
- **Scheduled Jobs:** node-cron
- **HTTP Client:** Axios
- **Pagination:** mongoose-paginate-v2, mongoose-aggregate-paginate-v2
- **Utilities:** Custom ApiError, ApiResponse, asyncHandler

---

## API Structure

Endpoints are organized into logical groups:

- `/api/v1/users`: User-specific authenticated routes (auth, profile, addresses, cart, orders, wishlist, reviews).
- `/api/v1/admin`: Admin-specific authenticated routes (product, category, collection, order, review, banner management).
- `/api/v1/public`: Public-facing routes (browse products, categories, collections, gold rate, reviews).

---

## Key Architectural Decisions & Code Snippets

### Error Handling & Response Standardization

Custom classes ensure consistent JSON responses.

```js
// src/utils/ApiError.js
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// src/utils/ApiResponse.js
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}
```

### Asynchronous Route Handling

Simplifies error handling for async Express routes.

```js
// src/utils/asyncHandler.js
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
```

### Input Validation

Uses `express-validator` with custom middleware.

```js
// src/middlewares/validationMiddleware.js
import { body, validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const validate = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  throw new ApiError(400, "Validation failed", extractedErrors);
});

// Example Validation Array:
const createProductValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required."),
  body("price.final")
    .notEmpty()
    .isNumeric()
    .withMessage("Final price must be a number."),
  body("stock")
    .notEmpty()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer."),
  validate,
];
```

### File Uploads

Handles multiple file inputs with Multer.

```js
router.post(
  "/collections",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  createCollection
);
```

### Database Models & Denormalization

Critical models use denormalization for integrity and historical accuracy.

#### Order Model

```js
// src/models/order.model.js
const orderItemSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: { type: String, trim: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    totalItemPrice: { type: Number, required: true },
    image: { type: String, trim: true },
    size: { type: String, trim: true },
    metalColor: { type: String, trim: true },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    paymentDetails: {
      /* ... */
    },
    shippingAddress: {
      pincode: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      addressLine: { type: String, required: true },
      landmark: { type: String, trim: true },
      type: { type: String, enum: ["home", "work", "other"], required: true },
    },
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
```

#### Product Model (Variants)

```js
// src/models/product.model.js
const productSchema = new Schema({
  // ... other fields ...
  variants: [
    {
      size: { type: String, trim: true },
      metalColor: { type: String, trim: true },
      priceAdjustment: { type: Number, default: 0 },
      stock: { type: Number, default: 0 },
      variantId: { type: String, unique: true, default: () => uuidv4() },
    },
  ],
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});
```

### Product Price Automation

#### 1. priceCalculator.js Utility

Calculates final price based on live gold rates.

```js
// src/utils/priceCalculator.js
const calculateFinalPrice = async (productData) => {
  const {
    weight,
    purity,
    price: { makingCharges, gst },
  } = productData;
  const ratePerGram = await getGoldRateInGrams();
  const purityInKarat = parseFloat(purity.replace("K", ""));
  const purityFactor = purityInKarat / 24;
  const basePrice = ratePerGram * weight * purityFactor;
  const gstRate = gst / 100 || 0.03;
  const taxableValue = basePrice + (makingCharges || 0);
  const gstAmount = taxableValue * gstRate;
  const finalPrice = basePrice + (makingCharges || 0) + gstAmount;
  return {
    base: parseFloat(basePrice.toFixed(2)),
    makingCharges: parseFloat((makingCharges || 0).toFixed(2)),
    gst: parseFloat(gstAmount.toFixed(2)),
    final: parseFloat(finalPrice.toFixed(2)),
  };
};
```

#### 2. goldRate.public.controller.js

Centralizes fetching and caching of the live gold rate.

```js
// src/controllers/public/goldRate.public.controller.js
let goldRateCache = { pricePerGram: null, timestamp: null };
const CACHE_LIFETIME_SECONDS = 600;

const fetchAndCacheGoldRate = async () => {
  const currentTime = Date.now();
  if (
    goldRateCache.pricePerGram &&
    currentTime - goldRateCache.timestamp < CACHE_LIFETIME_SECONDS * 1000
  ) {
    return goldRateCache.pricePerGram;
  }
  // ... API call logic ...
  const pricePerOunce = rates.INRXAU;
  const pricePerGram = pricePerOunce / 31.1035;
  goldRateCache.pricePerGram = pricePerGram;
  goldRateCache.timestamp = currentTime;
  return pricePerGram;
};
```

### Background Jobs & Efficiency

Scheduled job updates all product prices using `Product.bulkWrite()`.

```js
// src/workers/priceUpdater.js
import cron from "node-cron";
import { Product } from "../models/product.model.js";
import { calculateFinalPrice } from "../utils/priceCalculator.js";

const updateAllProductPrices = async () => {
  // ... logic ...
};

const startPriceUpdater = () => {
  cron.schedule("*/10 * * * *", updateAllProductPrices);
  updateAllProductPrices();
};
```

### Data Aggregation & Pagination

Used for efficient data retrieval.

```js
// Example from src/controllers/admin/product.controller.js
const aggregatePipeline = [
  { $match: matchQuery },
  {
    $lookup: {
      from: "categories",
      localField: "category",
      foreignField: "_id",
      as: "categoryDetails",
    },
  },
  { $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true } },
  // ... more $lookup and $unwind ...
  { $sort: sortStage },
  {
    $project: {
      name: 1,
      "category.name": "$categoryDetails.name",
      collections: {
        $map: {
          input: "$collectionDetails",
          as: "coll",
          in: { _id: "$$coll._id", name: "$$coll.name" },
        },
      },
    },
  },
];
const products = await Product.aggregatePaginate(
  Product.aggregate(aggregatePipeline),
  options
);
```

---

## Setup & Installation

1. **Clone the repository:**

   ```sh
   git clone <https://github.com/rajkishort596/Tanishq-clone.git>
   cd server
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Create a `.env` file** in the root directory and add your environment variables:

   ```env
   PORT=8000
   NODE_ENV=dev
   MONGODB_URI="mongodb://localhost:27017/tanishqclone"
   ACCESS_TOKEN_SECRET="your_access_token_secret"
   REFRESH_TOKEN_SECRET="your_refresh_token_secret"
   RESET_PASSWORD_SECRET="your_reset_password_secret"
   FRONTEND_URL="http://localhost:5173"

   CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
   CLOUDINARY_API_KEY="your_cloudinary_api_key"
   CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

   EMAIL_HOST="smtp.example.com"
   EMAIL_USER="your_email_user"
   EMAIL_PASS="your_email_password"
   EMAIL_FROM="your_email_user"

   GOLD_API_URL="https://api.metals-api.com/v1/latest"
   GOLD_API_KEY="your_metals_api_key"
   ```

4. **Start the server:**
   ```sh
   npm start
   # or
   yarn start
   ```

---

## API Endpoints (Full List & Explanation)

### 1. Authentication & Authorization Routes

#### User Authentication (`/api/v1/users`)

- `POST /register` - Register new user
- `POST /register/verify-otp` - Verify OTP
- `POST /register/complete` - Complete registration (avatar upload)
- `POST /login` - Login user
- `POST /logout` - Logout user
- `POST /refresh-token` - Refresh access token
- `POST /forgot-password` - Initiate password reset
- `POST /reset-password` - Reset password
- `POST /resend-otp` - Resend OTP
- `PATCH /change-password` - Change password

#### Admin Authentication (`/api/v1/admin`)

- `POST /login` - Login admin
- `POST /logout` - Logout admin
- `POST /refresh-token` - Refresh admin token
- `POST /forgot-password` - Admin password reset request
- `POST /reset-password` - Reset admin password

---

### 2. User-Specific Routes (`/api/v1/users`)

**Profile**

- `GET /me` - Get profile
- `PUT /me` - Update profile
- `DELETE /me` - Delete account

**Addresses**

- `GET /me/addresses` - List addresses
- `POST /me/addresses` - Add address
- `GET /me/addresses/:addressId` - Get address
- `PUT /me/addresses/:addressId` - Update address
- `DELETE /me/addresses/:addressId` - Delete address

**Wishlist**

- `GET /me/wishlist` - List wishlist
- `POST /me/wishlist/:productId` - Add to wishlist
- `DELETE /me/wishlist/:productId` - Remove from wishlist

**Cart**

- `GET /me/cart` - Get cart
- `POST /me/cart` - Add item
- `PUT /me/cart/:productId` - Update item
- `DELETE /me/cart/:productId` - Remove item
- `DELETE /me/cart` - Clear cart

**Orders**

- `POST /me/orders` - Create order
- `GET /me/orders` - List orders
- `GET /me/orders/:orderId` - Get order details

**Reviews**

- `POST /products/:productId/reviews` - Submit review
- `PUT /reviews/:reviewId` - Update review
- `DELETE /reviews/:reviewId` - Delete review

---

### 3. Public Product Catalog & Information Routes (`/api/v1/public`)

**Products**

- `GET /products` - List products (filter, search, sort, paginate)
- `GET /products/:productId` - Product details

**Categories**

- `GET /categories` - List categories
- `GET /categories/:categoryId` - Category details
- `GET /categories/:categoryId/subcategories` - Subcategories

**Collections**

- `GET /collections` - List collections
- `GET /collections/:collectionId` - Collection details

**Banners**

- `GET /banners` - List banners

**Gold/Metal Rates**

- `GET /gold-rate` - Current gold rate

---

### 4. Admin-Specific Routes (`/api/v1/admin`)

**Product Management**

- `POST /products` - Create product
- `GET /products` - List products
- `PUT /products/:productId` - Update product
- `DELETE /products/:productId` - Delete product

**Category Management**

- `POST /categories` - Create category
- `GET /categories` - List categories
- `GET /categories/:categoryId` - Category details
- `PUT /categories/:categoryId` - Update category
- `DELETE /categories/:categoryId` - Delete category

**Collection Management**

- `POST /collections` - Create collection
- `GET /collections` - List collections
- `GET /collections/:collectionId` - Collection details
- `PUT /collections/:collectionId` - Update collection
- `DELETE /collections/:collectionId` - Delete collection

**Order Management**

- `GET /orders` - List orders
- `GET /orders/:orderId` - Order details
- `PATCH /orders/:orderId/status` - Update order status
- `PATCH /orders/:orderId/payment-status` - Update payment status
- `DELETE /orders/:orderId` - Delete order

**Review Management**

- `GET /reviews` - List reviews
- `GET /reviews/:reviewId` - Review details
- `PUT /reviews/:reviewId/status` - Approve/reject review
- `DELETE /reviews/:reviewId` - Delete review

**Banner Management**

- `POST /banners` - Create banner
- `GET /banners` - List banners
- `GET /banners/:bannerId` - Banner details
- `PUT /banners/:bannerId` - Update banner
- `DELETE /banners/:bannerId` - Delete banner

---

# Owner: **@Rajkishor Thakur**

- Description: This README serves as comprehensive documentation for the Tanishq clone backend, offering essential guidance for understanding and working with the project.
