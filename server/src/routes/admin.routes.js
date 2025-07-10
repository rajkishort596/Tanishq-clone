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
import { upload } from "../middlewares/multer.middleware.js";
import {
  createCollection,
  deleteCollection,
  getAllCollectionsAdmin,
  getCollectionByIdAdmin,
  updateCollection,
} from "../controllers/admin/collection.controller.js";
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
router
  .route("/categories/:categoryId")
  .put(verifyAdminJWT, upload.single("icon"), updateCategory);
router
  .route("/categories")
  .post(verifyAdminJWT, upload.single("icon"), createCategory);
router.route("/categories/:categoryId").delete(verifyAdminJWT, deleteCategory);

/**
 * @CollectionRoutes
 */
router.route("/collections").get(verifyAdminJWT, getAllCollectionsAdmin);
router
  .route("/collections/:collectionId")
  .get(verifyAdminJWT, getCollectionByIdAdmin);
router.route("/collections/:collectionId").put(
  verifyAdminJWT,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  updateCollection
);
router.route("/collections").post(
  verifyAdminJWT,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  createCollection
);
router
  .route("/collections/:collectionId")
  .delete(verifyAdminJWT, deleteCollection);

/**
 * @ProductRoutes
 */

router.route("/products").get(verifyAdminJWT, getAllProductsAdmin);
router.route("/products/:productId").get(verifyAdminJWT, getProductByIdAdmin);
router
  .route("/products")
  .post(
    verifyAdminJWT,
    upload.fields([{ name: "images", maxCount: 10 }]),
    createProduct
  );
router
  .route("/products/:productId")
  .put(
    verifyAdminJWT,
    upload.fields([{ name: "images", maxCount: 10 }]),
    updateProduct
  );
router.route("/products/:productId").delete(verifyAdminJWT, deleteProduct);

export default router;
