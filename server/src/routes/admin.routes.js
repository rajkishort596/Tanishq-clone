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
import {
  changeUserPasswordValidation,
  createCategoryValidation,
  createCollectionValidation,
  createProductValidation,
  updateCategoryValidation,
  updateCollectionValidation,
  updateProductValidation,
} from "../middlewares/validationMiddleware.js";
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
router
  .route("/categories")
  .get(verifyAdminJWT, getAllCategoriesAdmin)
  .post(
    verifyAdminJWT,
    createCategoryValidation,
    upload.single("icon"),
    createCategory
  );

router
  .route("/categories/:categoryId")
  .get(verifyAdminJWT, getCategoryByIdAdmin)
  .put(
    verifyAdminJWT,
    updateCategoryValidation,
    upload.single("icon"),
    updateCategory
  )
  .delete(verifyAdminJWT, deleteCategory);

/**
 * @CollectionRoutes
 */
router
  .route("/collections")
  .get(verifyAdminJWT, getAllCollectionsAdmin)
  .post(
    verifyAdminJWT,
    createCollectionValidation,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "bannerImage", maxCount: 1 },
    ]),
    createCollection
  );

router
  .route("/collections/:collectionId")
  .get(verifyAdminJWT, getCollectionByIdAdmin)
  .put(
    verifyAdminJWT,
    updateCollectionValidation,
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "bannerImage", maxCount: 1 },
    ]),
    updateCollection
  )
  .delete(verifyAdminJWT, deleteCollection);

/**
 * @ProductRoutes
 */

router
  .route("/products")
  .get(verifyAdminJWT, getAllProductsAdmin)
  .post(
    verifyAdminJWT,
    createProductValidation,
    upload.fields([{ name: "images", maxCount: 10 }]),
    createProduct
  );

router
  .route("/products/:productId")
  .get(verifyAdminJWT, getProductByIdAdmin)
  .put(
    verifyAdminJWT,
    updateProductValidation,
    upload.fields([{ name: "images", maxCount: 10 }]),
    updateProduct
  )
  .delete(verifyAdminJWT, deleteProduct);

export default router;
