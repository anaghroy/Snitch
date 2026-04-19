import express from "express";
import { protect, isSeller } from "../middleware/auth.middleware.js";
import { createProduct, getSellerProducts, getAllProducts, getProductById, addProductVariant } from "../controllers/product.controller.js";
import multer from "multer";
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * @route POST /api/products
 * @description Create a new product
 * @access Private (Seller only)
 */
router.post("/create", protect, isSeller, upload.array("images", 7), createProduct);

/**
 * @route GET /api/products/seller
 * @description Get all products of the authenticated seller
 * @access Private (Seller only)
 */
router.get("/seller", protect, isSeller, getSellerProducts);

/**
 * @route GET /api/products
 * @description Get all products
 * @access Public
 */
router.get("/", getAllProducts)

/**
 * @route GET /api/products/:id
 * @description Get single product by id
 * @access Public
 */
router.get("/:id", getProductById);

/**
 * @route post /api/products/:productId/variants
 * @description Add a new variant to a product
 * @access Private (Seller only)
 */
router.post("/:productId/variants", protect, isSeller, upload.array('images', 7), addProductVariant)

export default router;
