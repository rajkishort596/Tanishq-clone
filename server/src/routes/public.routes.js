import { Router } from "express";
import {
  getProductById,
  getProducts,
} from "../controllers/public/product.public.controller.js";
import {
  getAllCategories,
  getCategoryByIdOrSlug,
  getSubCategoriesOfParent,
} from "../controllers/public/category.public.controller.js";
import {
  getAllCollections,
  getCollectionById,
} from "../controllers/public/collection.public.controller.js";
import { getActiveBanners } from "../controllers/public/banner.public.controller.js";
import { getLatestIndianGoldRate } from "../controllers/public/goldRate.public.controller.js";

const router = Router();

/**
 * @ProductRoutes
 */
router.route("/products").get(getProducts);

router.route("/products/:productId").get(getProductById);

/**
 * @CategoryRoutes
 */

router.route("/categories").get(getAllCategories);

router.route("/categories/:identifier").get(getCategoryByIdOrSlug);

router
  .route("/categories/:categoryId/subcategories")
  .get(getSubCategoriesOfParent);

/**
 * @CollectionRoutes
 */
router.route("/collections").get(getAllCollections);

router.route("/collections/:collectionId").get(getCollectionById);

/**
 * @BannerRoutes
 */
router.route("/banners").get(getActiveBanners);

/**
 * @GoldRateRoute
 */
router.route("/gold-rate").get(getLatestIndianGoldRate);

export default router;
