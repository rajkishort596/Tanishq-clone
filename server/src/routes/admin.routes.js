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
import { get } from "mongoose";
import {
  deleteOrderAdmin,
  getAllOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatus,
} from "../controllers/admin/order.controller.js";
import {
  deleteReviewAdmin,
  getAllReviewsAdmin,
  getReviewByIdAdmin,
  updateReviewApprovalStatus,
} from "../controllers/admin/review.controller.js";
import {
  createBanner,
  deleteBanner,
  getAllBannersAdmin,
  getBannerByIdAdmin,
  updateBanner,
} from "../controllers/admin/banner.controller.js";
import { getDashboardStats } from "../controllers/admin/dashboard.controller.js";
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
 * @StatRoute
 */
router.route("/stats").get(getDashboardStats);
/**
 * @CategoryRoutes
 */
router
  .route("/categories")
  .get(verifyAdminJWT, getAllCategoriesAdmin)
  .post(
    verifyAdminJWT,
    upload.single("icon"),
    createCategoryValidation,
    createCategory
  );

router
  .route("/categories/:categoryId")
  .get(verifyAdminJWT, getCategoryByIdAdmin)
  .patch(
    verifyAdminJWT,
    upload.single("icon"),
    updateCategoryValidation,
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

    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "bannerImage", maxCount: 1 },
    ]),
    createCollectionValidation,
    createCollection
  );

router
  .route("/collections/:collectionId")
  .get(verifyAdminJWT, getCollectionByIdAdmin)
  .patch(
    verifyAdminJWT,

    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "bannerImage", maxCount: 1 },
    ]),
    updateCollectionValidation,
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
    upload.fields([{ name: "images", maxCount: 10 }]),
    createProductValidation,
    createProduct
  );

router
  .route("/products/:productId")
  .get(verifyAdminJWT, getProductByIdAdmin)
  .put(
    verifyAdminJWT,
    upload.fields([{ name: "images", maxCount: 10 }]),
    updateProductValidation,
    updateProduct
  )
  .delete(verifyAdminJWT, deleteProduct);

/**
 * @OrderRoutes
 */
router.route("/orders").get(verifyAdminJWT, getAllOrdersAdmin);
router
  .route("/orders/:orderId")
  .get(verifyAdminJWT, getOrderByIdAdmin)
  .delete(verifyAdminJWT, deleteOrderAdmin);
router.route("/orders/:orderId/status").put(verifyAdminJWT, updateOrderStatus);

/**
 * @ReviewsRoutes
 */
router.route("/reviews").get(verifyAdminJWT, getAllReviewsAdmin);
router
  .route("/reviews/:reviewId")
  .get(verifyAdminJWT, getReviewByIdAdmin)
  .delete(verifyAdminJWT, deleteReviewAdmin);
router
  .route("/reviews/:reviewId/status")
  .put(verifyAdminJWT, updateReviewApprovalStatus);

/**
 * @BannerRoutes
 */
router
  .route("/banners")
  .get(verifyAdminJWT, getAllBannersAdmin)
  .post(verifyAdminJWT, upload.single("image"), createBanner);
router
  .route("/banners/:bannerId")
  .get(verifyAdminJWT, getBannerByIdAdmin)
  .put(verifyAdminJWT, upload.single("image"), updateBanner)
  .delete(verifyAdminJWT, deleteBanner);

export default router;
