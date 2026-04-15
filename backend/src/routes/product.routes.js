import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createProduct, getSellerProducts } from "../controllers/product.controller.js";
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
router.post("/create", protect, upload.array("images", 7), createProduct);

/**
 * @route GET /api/products/seller
 * @description Get all products of the authenticated seller
 * @access Private (Seller only)
 */
router.get("/seller", protect, getSellerProducts);

export default router;
