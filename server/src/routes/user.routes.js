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
  registerUserValidation,
  updateUserProfileValidation,
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

router.route("/me").get(verifyUserJWT, getUserProfile);
router
  .route("/me")
  .put(verifyUserJWT, updateUserProfileValidation, updateUserProfile);
router
  .route("/me/avatar")
  .put(verifyUserJWT, upload.single("avatar"), updateUserAvatar);
router.route("/me").delete(verifyUserJWT, deleteUserProfile);

/**
 * @AddressRoutes
 */

router.route("/me/addresses").get(verifyUserJWT, getAddresses);
router.route("/me/addresses").post(verifyUserJWT, addAddress);
router.route("/me/addresses/:addressId").get(verifyUserJWT, getAddressById);
router.route("/me/addresses/:addressId").put(verifyUserJWT, updateAddress);
router.route("/me/addresses/:addressId").delete(verifyUserJWT, deleteAddress);

/**
 * @CartRoutes
 */

router.route("/me/cart").get(verifyUserJWT, getCart);
router.route("/me/cart").post(verifyUserJWT, addToCart);
router.route("/me/cart/:productId").put(verifyUserJWT, updateCartItemQuantity);
router.route("/me/cart/:productId").delete(verifyUserJWT, removeCartItem);
router.route("/me/cart").delete(verifyUserJWT, clearCart);

export default router;
