import { Router } from "express";
import {
  changePassword,
  forgotPassword,
  loginAdmin,
  logoutAdmin,
  resetPassword,
} from "../controllers/admin/auth.controller.js";
import { verifyAdminJWT } from "../middlewares/auth.middleware.js";
import { refreshAdminAccessToken } from "../utils/refreshToken.js";
import { changeUserPasswordValidation } from "../middlewares/validationMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProductsAdmin,
  getProductByIdAdmin,
  updateProduct,
} from "../controllers/admin/product.controller.js";
import {
  createCategory,
  deleteCategory,
  getAllCategoriesAdmin,
  getCategoryByIdAdmin,
  updateCategory,
} from "../controllers/admin/category.controller.js";
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
router.route("/refresh-token").post(refreshAdminAccessToken);

/**
 * @CategoryRoutes
 */
router.route("/categories").get(verifyAdminJWT, getAllCategoriesAdmin);
router
  .route("/categories/:categoryId")
  .get(verifyAdminJWT, getCategoryByIdAdmin);
router.route("/categories/:categoryId").put(verifyAdminJWT, updateCategory);
router.route("/categories").post(verifyAdminJWT, createCategory);
router.route("/categories").delete(verifyAdminJWT, deleteCategory);

/**
 * @ProductRoutes
 */

router.route("/products").get(verifyAdminJWT, getAllProductsAdmin);
router.route("/products/:productId").get(verifyAdminJWT, getProductByIdAdmin);
router.route("/products").post(verifyAdminJWT, createProduct);
router.route("/products/:productId").put(verifyAdminJWT, updateProduct);
router.route("/products/:productId").delete(verifyAdminJWT, deleteProduct);

export default router;
