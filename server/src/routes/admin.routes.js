import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  loginAdmin,
  logoutAdmin,
  resetPassword,
} from "../controllers/admin/auth.controller.js";
import { verifyAdminJWT } from "../middlewares/auth.middleware.js";
import { refreshUserAccessToken } from "../utils/refreshToken.js";
import { changeUserPasswordValidation } from "../middlewares/validationMiddleware.js";
const router = Router();

/**
 * @AuthRoutes
 */

router.route("/login").post(loginAdmin);
router.route("/logout").post(verifyAdminJWT, logoutAdmin);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router
  .route("/change-password")
  .post(verifyAdminJWT, changeUserPasswordValidation, changePassword);
router.route("/refresh-token").post(refreshUserAccessToken);

export default router;
