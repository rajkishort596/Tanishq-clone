import { Router } from "express";
import {
  getProductById,
  getProducts,
} from "../controllers/public/product.public.controller.js";

const router = Router();

/**
 * @ProductRoutes
 */
router.route("/products").get(getProducts);

router.route("/products/:productId").get(getProductById);

export default router;
