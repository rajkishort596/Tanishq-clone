import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  changePassword,
  completeUserRegistration,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyUserOTP,
} from "../controllers/user/auth.controller.js";
import {
  changeUserPasswordValidation,
  completeUserRegistrationValidation,
  createOrderValidation,
  registerUserValidation,
  reviewValidation,
  updateUserProfileValidation,
  userAddressValidation,
  verifyUserOTPValidation,
} from "../middlewares/validationMiddleware.js";
import { verifyUserJWT } from "../middlewares/auth.middleware.js";
import { refreshUserAccessToken } from "../utils/refreshToken.js";
import {
  deleteUserProfile,
  getUserProfile,
  updateUserAvatar,
  updateUserProfile,
} from "../controllers/user/profile.controller.js";
import {
  addAddress,
  deleteAddress,
  getAddressById,
  getAddresses,
  updateAddress,
} from "../controllers/user/address.controller.js";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItemQuantity,
} from "../controllers/user/cart.controller.js";
import {
  createOrder,
  getUserOrderById,
  getUserOrders,
} from "../controllers/user/order.controller.js";
import {
  addProductToWishlist,
  getUserWishlist,
  removeProductFromWishlist,
} from "../controllers/user/wishlist.controller.js";
import {
  deleteReview,
  getProductReviews,
  submitReview,
  updateReview,
} from "../controllers/user/review.controller.js";
const router = Router();

/**
 * @AuthRoutes
 */
router.route("/register").post(registerUserValidation, registerUser);

router
  .route("/register/verify-otp")
  .post(verifyUserOTPValidation, verifyUserOTP);
router
  .route("/register/complete")
  .post(
    upload.single("avatar"),
    completeUserRegistrationValidation,
    completeUserRegistration
  );
router.route("/login").post(loginUser);
router.route("/logout").post(verifyUserJWT, logoutUser); //? Secured route
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router
  .route("/change-password")
  .post(verifyUserJWT, changeUserPasswordValidation, changePassword); //? Secured route
router.route("/refresh-token").post(refreshUserAccessToken);

/**
 * @ProfileRoutes
 */

router
  .route("/me")
  .get(verifyUserJWT, getUserProfile)
  .put(verifyUserJWT, updateUserProfileValidation, updateUserProfile)
  .delete(verifyUserJWT, deleteUserProfile);
router
  .route("/me/avatar")
  .put(verifyUserJWT, upload.single("avatar"), updateUserAvatar);

/**
 * @AddressRoutes
 */

router
  .route("/me/addresses")
  .get(verifyUserJWT, getAddresses)
  .post(verifyUserJWT, userAddressValidation, addAddress);
router
  .route("/me/addresses/:addressId")
  .get(verifyUserJWT, getAddressById)
  .put(verifyUserJWT, userAddressValidation, updateAddress)
  .delete(verifyUserJWT, deleteAddress);

/**
 * @CartRoutes
 */

router
  .route("/me/cart")
  .get(verifyUserJWT, getCart)
  .post(verifyUserJWT, addToCart)
  .delete(verifyUserJWT, clearCart);
router
  .route("/me/cart/:productId")
  .put(verifyUserJWT, updateCartItemQuantity)
  .delete(verifyUserJWT, removeCartItem);

/**
 * @OrderRoutes
 */

router
  .route("/me/orders")
  .get(verifyUserJWT, getUserOrders)
  .post(verifyUserJWT, createOrderValidation, createOrder);
router.route("/me/orders/:orderId").get(verifyUserJWT, getUserOrderById);

/**
 * @WishlistRoutes
 */

router.route("/me/wishlist").get(verifyUserJWT, getUserWishlist);
router
  .route("/me/wishlist/:productId")
  .post(verifyUserJWT, addProductToWishlist)
  .delete(verifyUserJWT, removeProductFromWishlist);

/**
 * @ReviewRoutes
 */

router
  .route("/products/:productId/reviews")
  .get(getProductReviews)
  .post(verifyUserJWT, reviewValidation, submitReview);

router
  .route("/reviews/:reviewId")
  .put(verifyUserJWT, reviewValidation, updateReview)
  .delete(verifyUserJWT, deleteReview);

export default router;
